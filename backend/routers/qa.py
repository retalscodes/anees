from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.islamqa_service import get_context
from services.gemini_service import ask_deen_question

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask(body: Question):
    q = body.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question is empty")
    if len(q) > 1000:
        raise HTTPException(status_code=400, detail="Question too long")

    context = await get_context(q)
    result = await ask_deen_question(q, context)
    return result
