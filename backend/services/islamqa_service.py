import httpx
from bs4 import BeautifulSoup
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
}

def is_arabic(text: str) -> bool:
    arabic_chars = len(re.findall(r'[؀-ۿ]', text))
    return arabic_chars > len(text) * 0.2


async def fetch_islamqa(query: str) -> str:
    lang = "ar" if is_arabic(query) else "en"
    results = []

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=15, follow_redirects=True) as client:
            search_url = f"https://islamqa.info/{lang}/search?q={query}"
            resp = await client.get(search_url)
            soup = BeautifulSoup(resp.text, "html.parser")

            links = []
            for a in soup.select("a[href]"):
                href = a.get("href", "")
                if f"/{lang}/" in href and href.count("/") >= 3:
                    full_url = href if href.startswith("http") else f"https://islamqa.info{href}"
                    if full_url not in links:
                        links.append(full_url)
                if len(links) >= 3:
                    break

            for url in links:
                try:
                    article_resp = await client.get(url)
                    article_soup = BeautifulSoup(article_resp.text, "html.parser")
                    content_el = (
                        article_soup.select_one(".question-answer")
                        or article_soup.select_one(".fatwa-content")
                        or article_soup.select_one("article")
                        or article_soup.select_one("main")
                    )
                    if content_el:
                        text = content_el.get_text(separator="\n", strip=True)[:2000]
                        results.append(f"[Source: {url}]\n{text}")
                except Exception:
                    continue
    except Exception:
        pass

    return "\n\n---\n\n".join(results)


async def fetch_islamweb(query: str) -> str:
    results = []
    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=15, follow_redirects=True) as client:
            search_url = f"https://www.islamweb.net/ar/fatwalist/?searchfield={query}"
            resp = await client.get(search_url)
            soup = BeautifulSoup(resp.text, "html.parser")

            links = []
            for a in soup.select("a[href]"):
                href = a.get("href", "")
                if "fatwa" in href.lower():
                    full_url = href if href.startswith("http") else f"https://www.islamweb.net{href}"
                    if full_url not in links:
                        links.append(full_url)
                if len(links) >= 2:
                    break

            for url in links:
                try:
                    article_resp = await client.get(url)
                    article_soup = BeautifulSoup(article_resp.text, "html.parser")
                    content_el = (
                        article_soup.select_one(".fatwa-text")
                        or article_soup.select_one(".content")
                        or article_soup.select_one("article")
                    )
                    if content_el:
                        text = content_el.get_text(separator="\n", strip=True)[:1500]
                        results.append(f"[Source: {url}]\n{text}")
                except Exception:
                    continue
    except Exception:
        pass

    return "\n\n---\n\n".join(results)


async def get_context(query: str) -> str:
    islamqa_ctx, islamweb_ctx = "", ""
    try:
        islamqa_ctx = await fetch_islamqa(query)
    except Exception:
        pass
    try:
        islamweb_ctx = await fetch_islamweb(query)
    except Exception:
        pass

    parts = [p for p in [islamqa_ctx, islamweb_ctx] if p.strip()]
    return "\n\n===\n\n".join(parts)
