import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are Anees (أنيس), a trusted Islamic companion and Q&A assistant for Sunni Muslims (Ahlus Sunnah wal Jama'ah).

STRICT RULES:
1. Answer ONLY based on the provided context from islamqa.info and islamweb.net.
2. If context is insufficient, respond clearly in the question's language: "لا أملك معلومات كافية من المصادر الموثوقة. يُرجى استشارة عالم مؤهل." / "I don't have sufficient information from trusted sources. Please consult a qualified scholar."
3. NEVER fabricate hadiths, Quranic verses, or Islamic rulings.
4. Always cite the source URL at the end of your answer.
5. Maintain strictly Sunni perspective. Never include Shia, Sufi extremist, or innovated opinions.
6. For sensitive personal matters (marriage, divorce, inheritance), always add a note to consult a local scholar.
7. Detect the language of the question and answer in the same language (English, Modern Standard Arabic, or Jordanian/Levantine dialect).
8. Keep the tone respectful, warm, and scholarly.

RESPONSE FORMAT:
- Answer clearly and concisely based on context
- Cite source(s) with URL
- Add brief disclaimer for personal fiqh matters"""


async def ask_deen_question(question: str, context: str) -> dict:
    if not context.strip():
        return {
            "answer": "لم أجد معلومات كافية من المصادر الموثوقة للإجابة على هذا السؤال. يُرجى استشارة عالم مؤهل.\n\nI couldn't find sufficient information from trusted sources. Please consult a qualified scholar.",
        }

    prompt = f"""CONTEXT FROM TRUSTED SOURCES:
{context}

---
QUESTION: {question}

Answer based strictly on the context above."""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT)
    )
    return {"answer": response.text}
