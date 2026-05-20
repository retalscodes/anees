from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import prayer, hadith, qa, quran
import os

app = FastAPI(title="Anees API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prayer.router, prefix="/api/prayer")
app.include_router(hadith.router, prefix="/api/hadith")
app.include_router(qa.router, prefix="/api/qa")
app.include_router(quran.router, prefix="/api/quran")

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
