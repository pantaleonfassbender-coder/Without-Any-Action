"""Builds the itch.io package: itch/without-any-action-itch.zip (game, guide, plates, board, licence).  python itch/build-itch.py"""
import re, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "itch" / "without-any-action-itch.zip"
PAGES = ["index.html", "play.html", "guide.html", "plates.html"]
FILES = PAGES + ["style.css", "game.css", "data-wa.js", "engine.js", "plates.js", "reckoning.js", "game.js", "assets/board-amagansett.jpg"]
FILES += sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / "assets" / "plates").glob("*.jpg"))
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for f in FILES: z.write(ROOT / f, f)
    z.write(ROOT / "LICENSE", "LICENSE.txt")
with zipfile.ZipFile(OUT) as z:
    names = set(z.namelist())
    for page in PAGES:
        txt = z.read(page).decode("utf-8")
        assert "prototyp" not in txt.lower(), page
        for ref in re.findall(r'(?:src|href)="([^"#?:]+\.(?:js|css|html|jpg|json))"', txt):
            assert ref in names, (page, ref)
print(f"{OUT.name}: {len(names)} files, {OUT.stat().st_size // 1024} KB")
