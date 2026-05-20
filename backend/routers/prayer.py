from fastapi import APIRouter, HTTPException
import httpx
from datetime import datetime

router = APIRouter()


@router.get("/times")
async def get_prayer_times(lat: float, lng: float, method: int = 3):
    try:
        today = datetime.now().strftime("%d-%m-%Y")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://api.aladhan.com/v1/timings/{today}",
                params={"latitude": lat, "longitude": lng, "method": method}
            )
            data = resp.json()
            if not data.get("data", {}).get("timings"):
                raise HTTPException(status_code=502, detail=f"Aladhan API error: {data.get('status', 'unknown')}")
            return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/times-by-city")
async def get_prayer_times_by_city(city: str, country: str = "", method: int = 3):
    try:
        today = datetime.now().strftime("%d-%m-%Y")
        params = {"city": city, "method": method}
        if country:
            params["country"] = country
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://api.aladhan.com/v1/timingsByCity/{today}",
                params=params
            )
            data = resp.json()
            if not data.get("data", {}).get("timings"):
                raise HTTPException(status_code=404, detail=f"City not found: {city}")
            return data
    except HTTPException:
        raise
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
