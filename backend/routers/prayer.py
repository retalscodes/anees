from fastapi import APIRouter, HTTPException
import httpx
from datetime import datetime

router = APIRouter()


@router.get("/times")
async def get_prayer_times(lat: float, lng: float, method: int = 3):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.aladhan.com/v1/timings",
                params={"latitude": lat, "longitude": lng, "method": method}
            )
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/hijri")
async def get_hijri_date():
    try:
        today = datetime.now().strftime("%d-%m-%Y")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"https://api.aladhan.com/v1/gToH/{today}")
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
