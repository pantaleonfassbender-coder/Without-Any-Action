"""itch/cover-630x500.png: the FBI memo of 14 June 1942 (NARA, public domain) with the title."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
ROOT = Path(__file__).resolve().parent.parent
im = ImageOps.fit(Image.open(ROOT / "assets" / "plates" / "memo1942.jpg").convert("L").convert("RGB"), (630, 500), Image.LANCZOS, centering=(0.5, 0.42))
d = ImageDraw.Draw(im, "RGBA")
d.rectangle((0, 300, 630, 500), fill=(22, 34, 52, 240)); d.rectangle((0, 300, 630, 304), fill=(200, 160, 70, 255))
serif = lambda s, i=False: ImageFont.truetype("C:/Windows/Fonts/" + ("georgiai.ttf" if i else "georgia.ttf"), s)
d.text((24, 318), "Without Any Action", font=serif(44), fill=(244, 240, 230))
d.text((26, 378), "Operation Pastorius, Long Island and Florida, June 1942", font=serif(16, True), fill=(220, 196, 140))
d.text((26, 408), "Eight saboteurs, two beaches, one telephone call –", font=serif(15), fill=(214, 214, 210))
d.text((26, 430), "and four versions of how they were caught.", font=serif(15), fill=(214, 214, 210))
d.text((26, 466), "Three scenarios · FBI and Coast Guard · free · English", font=serif(13), fill=(176, 180, 186))
im.save(ROOT / "itch" / "cover-630x500.png"); print("cover")
