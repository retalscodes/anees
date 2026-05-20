from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()


@router.get("/surah/{number}")
async def get_surah(number: int):
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"https://api.alquran.cloud/v1/surah/{number}/editions/quran-simple,en.asad"
            )
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/ayah/{ref}")
async def get_ayah(ref: str):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://api.alquran.cloud/v1/ayah/{ref}/editions/quran-simple,en.asad"
            )
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
