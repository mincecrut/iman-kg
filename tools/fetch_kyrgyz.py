#!/usr/bin/env python3
"""Кыргызча котормону (QuranEnc, kyrgyz_hakimov) data/ky/ папкасына жүктөйт.
Иштетиш: python3 tools/fetch_kyrgyz.py
Файлдар өзгөртүлбөйт (QuranEnc лицензиясы). Сайт адегенде data/ky/{n}.json окуйт.
Сыноо үчүн: QURANENC_BASE=http://localhost:8000/ ортосун коюуга болот."""
import json, os, sys, time, urllib.request

BASE = os.environ.get("QURANENC_BASE", "https://quranenc.com/api/v1/translation/sura/kyrgyz_hakimov/")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "ky")
os.makedirs(OUT, exist_ok=True)
total = 0
for n in range(1, 115):
    for attempt in range(3):
        try:
            req = urllib.request.Request(BASE + str(n), headers={"User-Agent": "iman-site-fetch"})
            raw = urllib.request.urlopen(req, timeout=30).read()
            data = json.loads(raw)
            rows = data if isinstance(data, list) else (data.get("result") or data.get("data") or [])
            if not rows:
                raise ValueError("бош жооп")
            open(os.path.join(OUT, f"{n}.json"), "wb").write(raw)
            total += len(rows)
            break
        except Exception as e:
            print(f"сүрө {n}: {e} (аракет {attempt + 1})", file=sys.stderr)
            time.sleep(2)
    else:
        sys.exit(f"сүрө {n} жүктөлгөн жок")
    print(f"{n}/114", end="\r")
meta = {"key": "kyrgyz_hakimov", "source": "https://quranenc.com/ky", "ayahs": total,
        "fetched": time.strftime("%Y-%m-%d")}
json.dump(meta, open(os.path.join(OUT, "_meta.json"), "w", encoding="utf-8"), ensure_ascii=False)
print(f"\nДаяр: {total} аят (6236 болушу керек)")
