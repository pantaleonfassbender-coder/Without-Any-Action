"""Screenshots for itch.io (1280 x 800) over the demo hook. Needs the preview server "waa-game" (port 8785).  python itch/make-shots.py"""
import subprocess, tempfile
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
B = "http://localhost:8785/"
SHOTS = [("screenshot-1-amagansett.png", "play.html#demo=ama"), ("screenshot-2-ponte-vedra.png", "play.html#demo=pv"), ("screenshot-3-call.png", "play.html#demo=call"),
         ("screenshot-4-reckoning.png", "play.html#demo=reck"), ("screenshot-5-plates.png", "plates.html"), ("screenshot-6-title.png", "index.html")]
for name, url in SHOTS:
    out = ROOT / "itch" / name
    with tempfile.TemporaryDirectory() as prof:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1280,800", f"--user-data-dir={prof}",
                        "--virtual-time-budget=12000", f"--screenshot={out}", B + url], capture_output=True, timeout=120)
    print(name, out.exists())
