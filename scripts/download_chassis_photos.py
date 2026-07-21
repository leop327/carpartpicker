#!/usr/bin/env python3
"""Download chassis-accurate BMW photos from Wikimedia Commons."""
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("/Users/charliebrown/Projects/carpartpicker/public/cars")
UA = "CarPartPickerBot/1.0 (local catalog; attribution in CREDITS.md; github.com/leop327/carpartpicker)"

# Preferred Commons file titles per local filename
TARGETS: list[tuple[str, str]] = [
    ("bmw-e46-m3.jpg", "File:BMW M3 (E46) yellow.jpg"),
    ("bmw-e60-5series.jpg", "File:BMW 5 Series (E60) black.jpg"),
    ("bmw-e60-m5.jpg", "File:BMW M5 (E60) silver.jpg"),
    ("bmw-e70-x5.jpg", "File:BMW X5 (E70) black.jpg"),
    ("bmw-e71-x6.jpg", "File:BMW X6 (E71).jpg"),
    ("bmw-e85-z4.jpg", "File:BMW Z4 (E85) silver.jpg"),
    ("bmw-e87-1series.jpg", "File:BMW 1 Series (E87) front.jpg"),
    ("bmw-e89-z4.jpg", "File:BMW Z4 (E89) white.jpg"),
    ("bmw-e90-3series.jpg", "File:BMW 3 Series (E90) sedan.jpg"),
    ("bmw-e93-335i.jpg", "File:BMW 335i Convertible (E93).jpg"),
    ("bmw-f06-6series.jpg", "File:BMW 6 Series Gran Coupe (F06).jpg"),
    ("bmw-f12-6series.jpg", "File:BMW 6 Series (F12) convertible.jpg"),
    ("bmw-f15-x5.jpg", "File:BMW X5 (F15).jpg"),
    ("bmw-f25-x3.jpg", "File:BMW X3 (F25).jpg"),
    ("bmw-f26-x4.jpg", "File:BMW X4 (F26).jpg"),
    ("bmw-f90-m5.jpg", "File:BMW M5 (F90).jpg"),
    ("bmw-g02-x4.jpg", "File:BMW X4 (G02).jpg"),
    ("bmw-g05-x5.jpg", "File:BMW X5 (G05).jpg"),
    ("bmw-g06-x6.jpg", "File:BMW X6 (G06).jpg"),
    ("bmw-g11-7series.jpg", "File:BMW 7 Series (G11).jpg"),
    ("bmw-g15-8series.jpg", "File:BMW 8 Series (G15).jpg"),
    ("bmw-g22-4series.jpg", "File:BMW 4 Series (G22).jpg"),
    ("bmw-g32-6gt.jpg", "File:BMW 6 Series GT (G32).jpg"),
    ("bmw-g80-m3.jpg", "File:BMW M3 (G80).jpg"),
    ("bmw-g82-m4.jpg", "File:BMW M4 (G82).jpg"),
    ("bmw-g87-m2.jpg", "File:BMW M2 (G87).jpg"),
    ("bmw-e63-6series.jpg", "File:BMW 6 Series (E63).jpg"),
    ("bmw-f13-m6.jpg", "File:BMW M6 (F13).jpg"),
]

# Fallback search queries if exact title fails
SEARCH_FALLBACK: dict[str, str] = {
    "bmw-e46-m3.jpg": "BMW M3 E46",
    "bmw-e60-5series.jpg": "BMW 5 Series E60",
    "bmw-e60-m5.jpg": "BMW M5 E60",
    "bmw-e70-x5.jpg": "BMW X5 E70",
    "bmw-e71-x6.jpg": "BMW X6 E71",
    "bmw-e85-z4.jpg": "BMW Z4 E85",
    "bmw-e87-1series.jpg": "BMW 1 Series E87",
    "bmw-e89-z4.jpg": "BMW Z4 E89",
    "bmw-e90-3series.jpg": "BMW 3 Series E90",
    "bmw-e93-335i.jpg": "BMW 335i E93",
    "bmw-f06-6series.jpg": "BMW 6 Series Gran Coupe F06",
    "bmw-f12-6series.jpg": "BMW 6 Series F12",
    "bmw-f15-x5.jpg": "BMW X5 F15",
    "bmw-f25-x3.jpg": "BMW X3 F25",
    "bmw-f26-x4.jpg": "BMW X4 F26",
    "bmw-f90-m5.jpg": "BMW M5 F90",
    "bmw-g02-x4.jpg": "BMW X4 G02",
    "bmw-g05-x5.jpg": "BMW X5 G05",
    "bmw-g06-x6.jpg": "BMW X6 G06",
    "bmw-g11-7series.jpg": "BMW 7 Series G11",
    "bmw-g15-8series.jpg": "BMW 8 Series G15",
    "bmw-g22-4series.jpg": "BMW 4 Series G22 Coupe",
    "bmw-g32-6gt.jpg": "BMW 6 Series GT G32",
    "bmw-g80-m3.jpg": "BMW M3 G80",
    "bmw-g82-m4.jpg": "BMW M4 G82",
    "bmw-g87-m2.jpg": "BMW M2 G87",
    "bmw-e63-6series.jpg": "BMW 6 Series E63",
    "bmw-f13-m6.jpg": "BMW M6 F13",
}


def api(params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(
        "https://commons.wikimedia.org/w/api.php?" + q,
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def search_title(query: str) -> str | None:
    d = api(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srnamespace": "6",
            "srlimit": "8",
        }
    )
    hits = d.get("query", {}).get("search", [])
    for h in hits:
        title = h["title"]
        # Prefer jpgs of the right car, skip logos/interiors when possible
        low = title.lower()
        if "interior" in low or "logo" in low or "badge" in low:
            continue
        if title.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            return title
    return hits[0]["title"] if hits else None


def download_title(title: str, out: Path) -> dict:
    d = api(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size",
            "iiurlwidth": "1600",
        }
    )
    page = next(iter(d["query"]["pages"].values()))
    if "imageinfo" not in page:
        raise RuntimeError(f"no imageinfo for {title}: {page}")
    ii = page["imageinfo"][0]
    img = ii.get("thumburl") or ii["url"]
    meta = ii.get("extmetadata", {})
    req = urllib.request.Request(img, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    if data[:100].lstrip().startswith(b"<!DOCTYPE") or data[:20].startswith(b"<html"):
        raise RuntimeError(f"got HTML for {title}")
    out.write_bytes(data)
    return {
        "file": out.name,
        "commons": title,
        "license": (meta.get("LicenseShortName") or {}).get("value", ""),
        "license_url": (meta.get("LicenseUrl") or {}).get("value", ""),
        "artist_html": (meta.get("Artist") or {}).get("value", "see Commons"),
        "source_page": "https://commons.wikimedia.org/wiki/"
        + urllib.parse.quote(title.replace(" ", "_")),
        "bytes": len(data),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    for i, (filename, preferred) in enumerate(TARGETS):
        out = OUT / filename
        if out.exists() and out.stat().st_size > 50000:
            # still verify it's jpeg
            head = out.read_bytes()[:20]
            if head.startswith(b"\xff\xd8") or b"JFIF" in head or b"Exif" in head:
                print(f"skip existing {filename}")
                continue
        title = preferred
        try:
            info = download_title(title, out)
            print(f"OK preferred {filename} ← {title} ({info['bytes']})")
            results.append(info)
        except Exception as e:
            print(f"prefer fail {filename}: {e}")
            time.sleep(8)
            q = SEARCH_FALLBACK.get(filename, filename)
            try:
                found = search_title(q)
                if not found:
                    print(f"NO HIT {filename} query={q}")
                    continue
                time.sleep(3)
                info = download_title(found, out)
                print(f"OK search {filename} ← {found} ({info['bytes']})")
                results.append(info)
            except Exception as e2:
                print(f"FAIL {filename}: {e2}")
        time.sleep(6 if i % 3 else 10)

    meta_path = OUT / "_new_attribution.json"
    meta_path.write_text(json.dumps(results, indent=2))
    print(f"wrote {meta_path} ({len(results)} entries)")


if __name__ == "__main__":
    main()
