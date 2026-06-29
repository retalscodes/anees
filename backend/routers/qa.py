from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.islamqa_service import get_context
from services.gemini_service import ask_deen_question
from collections import defaultdict
import time

router = APIRouter()

# In-memory sliding-window rate limiter (resets on server restart — acceptable for now)
_rate_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 15          # questions per window
RATE_WINDOW = 3600       # 1 hour


def _check_rate(ip: str) -> tuple[bool, int, int]:
    """Returns (allowed, remaining, retry_after_seconds)"""
    now = time.time()
    window_start = now - RATE_WINDOW
    # Trim old timestamps
    _rate_store[ip] = [t for t in _rate_store[ip] if t > window_start]
    count = len(_rate_store[ip])
    if count >= RATE_LIMIT:
        oldest = _rate_store[ip][0]
        retry_after = int(oldest + RATE_WINDOW - now) + 1
        return False, 0, retry_after
    _rate_store[ip].append(now)
    return True, RATE_LIMIT - count - 1, 0


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask(body: Question, request: Request):
    # Rate limit by IP (falls back to 'unknown' for proxied requests without forwarded header)
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    ip = ip.split(",")[0].strip()

    allowed, remaining, retry_after = _check_rate(ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "ar": f"وصلت إلى الحد الأقصى ({RATE_LIMIT} أسئلة في الساعة). حاول بعد {retry_after // 60} دقيقة.",
                "en": f"Rate limit reached ({RATE_LIMIT} questions/hour). Try again in {retry_after // 60} minutes.",
                "retry_after": retry_after
            },
            headers={"Retry-After": str(retry_after)}
        )

    q = body.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question is empty")
    if len(q) > 1000:
        raise HTTPException(status_code=400, detail="Question too long")

    context = await get_context(q)
    result = await ask_deen_question(q, context)
    result["questions_remaining"] = remaining
    return result
