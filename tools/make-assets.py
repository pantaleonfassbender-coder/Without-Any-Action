"""Board and plates for Without Any Action. Run from game/: python tools/make-assets.py
Board: USGS East Hampton, N.Y., 1:24,000 (1947), crop around Amagansett. Plates: US government works (public domain)."""
from pathlib import Path
import glob, io
from PIL import Image
import pymupdf

Image.MAX_IMAGE_PIXELS = None
G = Path(__file__).resolve().parents[1]
Q = G.parent / "quellen"
A = G / "assets"; P = A / "plates"; P.mkdir(parents=True, exist_ok=True)


def pdf_crop(pdf, fx0, fy0, fx1, fy1, dpi):
    pg = pymupdf.open(pdf)[0]; r = pg.rect
    clip = pymupdf.Rect(r.width * fx0, r.height * fy0, r.width * fx1, r.height * fy1)
    return Image.open(io.BytesIO(pg.get_pixmap(dpi=dpi, clip=clip).tobytes("png"))).convert("RGB")


def save(im, path, side=1400, q=84):
    im.thumbnail((side, side), Image.LANCZOS); im.save(path, quality=q); print(path.name, im.size)


# board: Amagansett and its beach
save(pdf_crop(Q / "karten" / "USGS_East-Hampton_NY_1947_24000.pdf", 0.50, 0.17, 0.90, 0.31, 220), A / "board-amagansett.jpg", 1800, 82)
# plates
save(pdf_crop(Q / "karten" / "USGS_Mickler-Landing_FL_1952_24000.pdf", 0.04, 0.10, 0.30, 0.62, 200), P / "mickler1952.jpg")
B = Q / "bilder"
for pat, name in [("01_*Cullen*", "cullen1942.jpg"), ("02_*Legion*", "cullen1943.jpg"), ("04_*Militaer*", "commission1942.jpg"),
                  ("05_*USCG*", "circular1942.jpg"), ("06_*Truman*", "truman1948.jpg")]:
    save(Image.open(glob.glob(str(B / pat))[0]).convert("RGB"), P / name)
N = B / "nara"
memo = Image.open(N / "memo-mcwhorter_XVI-0011.jpg").convert("L"); save(memo.crop((0, 0, memo.width, int(memo.height * 0.78))), P / "memo1942.jpg")
for f, name in [("mayport-1942-06-17_0722.jpg", "mayport17.jpg"), ("mayport-1942-06-26_0733.jpg", "mayport26.jpg")]:
    im = Image.open(N / f).convert("L"); save(im.crop((0, int(im.height * 0.04), im.width, int(im.height * 0.86))), P / name)
bp = pymupdf.open(Q / "cg-at-war" / "USCGATWAR-BEACHPATROL.pdf")
for pno, name in [(5, "station1945.jpg"), (3, "mounted1945.jpg"), (7, "dog1945.jpg")]:
    im = Image.open(io.BytesIO(bp[pno - 1].get_pixmap(dpi=150).tobytes("png"))).convert("L")
    if name == "station1945.jpg": im = im.rotate(-90, expand=True)   # the photograph is printed sideways
    save(im, P / name)
