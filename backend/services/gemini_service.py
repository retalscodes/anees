import os
import asyncio
from google import genai
from google.genai import types
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


def _sync_generate(api_key: str, prompt: str) -> str:
    client = genai.Client(api_key=api_key)
    for model in ["gemini-2.0-flash", "gemini-1.5-flash"]:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT)
            )
            return response.text
        except Exception as e:
            if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
                continue
            raise
    raise Exception("All models quota exhausted. Please try again later.")


async def ask_deen_question(question: str, context: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "answer": "خدمة الذكاء الاصطناعي غير مفعلة حاليًا.\n\nAI service is not configured. Please contact the developer."
        }

    if context.strip():
        prompt = f"""CONTEXT FROM TRUSTED SOURCES (islamqa.info / islamweb.net):
{context}

---
QUESTION: {question}

Answer based on the context above. Cite the source URLs."""
    else:
        prompt = f"""No specific context was retrieved from trusted sources this time.
Answer the following Islamic question from your training knowledge. Clearly note that this is general Islamic guidance and recommend the user verify with a qualified scholar for personal matters.

QUESTION: {question}"""

    try:
        text = await asyncio.to_thread(_sync_generate, api_key, prompt)
        return {"answer": text}
    except Exception as e:
        err = str(e)
        if "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err or "429" in err:
            return {
                "answer": "عذرًا، وصل أنيس إلى حد الاستخدام اليومي للذكاء الاصطناعي. يرجى المحاولة مجددًا غدًا أو بعد بضع ساعات.\n\nSorry, Anees has reached the daily AI usage limit. Please try again in a few hours."
            }
        return {
            "answer": "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.\n\nSorry, an error occurred. Please try again."
        }
