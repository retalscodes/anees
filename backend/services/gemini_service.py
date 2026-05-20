import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are Anees (أنيس), a trusted Islamic companion and Q&A assistant for Sunni Muslims (Ahlus Sunnah wal Jama'ah).

STRICT RULES:
1. Answer based on the provided context from islamqa.info and islamweb.net when available. If no context was retrieved, answer from your training knowledge while noting this is general Islamic guidance.
2. NEVER fabricate hadiths, Quranic verses, or Islamic rulings.
3. Cite source URLs when context was provided.
4. Maintain strictly Sunni (Ahlus Sunnah) perspective. Never include Shia, Sufi extremist, or innovated opinions.
5. For personal matters (marriage, divorce, inheritance), always recommend consulting a local qualified scholar.
6. Detect the language of the question and answer in the same language: English, Modern Standard Arabic, or Jordanian/Levantine dialect.
7. Keep the tone respectful, warm, and scholarly.

RESPONSE FORMAT:
- Answer clearly and concisely
- Cite source(s) with URL when available
- Add brief disclaimer for personal fiqh matters"""

# v1beta supports all current flash models including lite variants
MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash-8b"]


async def ask_deen_question(question: str, context: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "answer": "مفتاح API غير مضبوط. أضف GEMINI_API_KEY في Environment Variables في Render.\n\nAPI key not configured. Add GEMINI_API_KEY to Render environment variables."
        }

    if context.strip():
        user_text = (
            f"CONTEXT FROM TRUSTED SOURCES (islamqa.info / islamweb.net):\n{context}\n\n"
            f"---\nQUESTION: {question}\n\nAnswer based on the context above. Cite source URLs."
        )
    else:
        user_text = (
            f"No specific context was retrieved from trusted sources.\n"
            f"Answer this Islamic question from your training knowledge. "
            f"Note this is general guidance and recommend consulting a scholar for personal matters.\n\n"
            f"QUESTION: {question}"
        )

    body = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": user_text}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024}
    }

    async with httpx.AsyncClient(timeout=30) as client:
        for model in MODELS:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{model}:generateContent?key={api_key}"
            )
            try:
                resp = await client.post(url, json=body)
                data = resp.json()

                if resp.status_code == 429:
                    continue  # quota on this model, try next

                if resp.status_code in (401, 403):
                    return {
                        "answer": (
                            "مفتاح API غير صحيح أو غير مُفعَّل.\n"
                            "افتح Render → Environment → تأكد أن GEMINI_API_KEY مضبوط بشكل صحيح.\n\n"
                            "Invalid API key. In Render, go to Environment and verify GEMINI_API_KEY is set correctly."
                        )
                    }

                if resp.status_code != 200:
                    err = data.get("error", {}).get("message", f"HTTP {resp.status_code}")
                    return {"answer": f"خطأ من Gemini: {err}"}

                candidates = data.get("candidates", [])
                if not candidates:
                    finish = data.get("promptFeedback", {}).get("blockReason", "unknown")
                    return {"answer": f"لم يُرجع النموذج إجابة (blockReason: {finish}). حاول صياغة السؤال بشكل مختلف."}

                text = candidates[0]["content"]["parts"][0]["text"]
                return {"answer": text}

            except httpx.TimeoutException:
                return {
                    "answer": "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.\n\nRequest timed out. Please try again."
                }
            except Exception as e:
                return {"answer": f"خطأ غير متوقع: {str(e)[:200]}"}

    return {
        "answer": (
            "وصل أنيس إلى حد الاستخدام اليومي لكلا النموذجين. يرجى المحاولة لاحقًا.\n\n"
            "Daily quota exceeded for all models. Please try again later."
        )
    }
