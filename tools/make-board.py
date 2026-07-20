#!/usr/bin/env python3
"""
Builds a single self-contained HTML page holding every QR code in
qr-board/links.json — one file with the images and fonts embedded, so it
works from a USB stick, an email attachment, or a laptop with no network.

    python3 tools/make-board.py

Reads  : qr-board/links.json
Writes : qr-board/index.html  and  qr-board/qr-*.png

Codes are produced by tools/make-qr.swift (system CoreImage) and then read
back with tools/read-qr.swift, so the page cannot ship a code that encodes
something other than what the config says.
"""

import base64
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BOARD = ROOT / "qr-board"
CONFIG = BOARD / "links.json"

STATUS_TEXT = {
    "ready": "",
    "pending-deploy": "Not live yet — deploy first",
    "needs-url": "No link yet — set it in links.json",
}


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def make_qr(url, out_path):
    subprocess.run(
        ["swift", str(ROOT / "tools" / "make-qr.swift"), url, str(out_path), "760"],
        check=True,
        capture_output=True,
    )


def read_qr(path):
    result = subprocess.run(
        ["swift", str(ROOT / "tools" / "read-qr.swift"), str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    parts = result.stdout.strip().split("\t")
    return parts[2] if len(parts) > 2 else ""


def main():
    config = json.loads(CONFIG.read_text())
    cards = []

    for item in config["links"]:
        url = item["url"]
        status = item.get("status", "ready")
        placeholder = url == "REPLACE_ME" or status == "needs-url"

        img = ""
        if not placeholder:
            png = BOARD / f"qr-{slug(item['title'])}.png"
            make_qr(url, png)

            # Never ship a code without confirming what is inside it.
            decoded = read_qr(png)
            if decoded != url:
                sys.exit(f"QR mismatch for {item['title']}:\n  wanted {url}\n  got    {decoded}")
            # Payload length drives the module count, and a dense code is
            # measurably harder to scan printed, at an angle, or from across
            # a room — which is the whole situation these are for.
            warn = "  ⚠ long payload — code will be dense" if len(url) > 160 else ""
            print(f"  ✓ {item['title']}  ->  {url}  ({len(url)} chars){warn}")
            img = f'<img src="{data_uri(png, "image/png")}" alt="QR code for {item["title"]}" />'
        else:
            print(f"  · {item['title']}  ->  no link set, placeholder rendered")
            img = '<div class="card__placeholder" aria-hidden="true"><span>?</span></div>'

        # mailto: is unreadable printed out; show the address instead.
        shown = url
        if url.startswith("mailto:"):
            shown = url[len("mailto:"):].split("?")[0]
        elif placeholder:
            shown = "—"
        else:
            shown = re.sub(r"^https?://", "", url).rstrip("/")

        note = STATUS_TEXT.get(status, "")
        cards.append(f"""
      <article class="card{' is-pending' if placeholder or status != 'ready' else ''}">
        <p class="card__label">{item['label']}</p>
        <h2 class="card__title">{item['title']}</h2>
        <div class="card__code">{img}</div>
        <p class="card__hint">{item['hint']}</p>
        <p class="card__url">{shown}</p>
        {f'<p class="card__status">{note}</p>' if note else ''}
      </article>""")

    fonts = ""
    sans = ROOT / "src/styles/fonts/hanken.woff2"
    serif = ROOT / "src/styles/fonts/newsreader-italic.woff2"
    if sans.exists():
        fonts += f"""@font-face{{font-family:'Hanken Grotesk';font-weight:400 700;font-display:swap;src:url('{data_uri(sans, "font/woff2")}') format('woff2')}}"""
    if serif.exists():
        fonts += f"""@font-face{{font-family:'Newsreader';font-style:italic;font-weight:200 800;font-display:swap;src:url('{data_uri(serif, "font/woff2")}') format('woff2')}}"""

    html = TEMPLATE.format(
        fonts=fonts,
        title=config["title"],
        subtitle=config["subtitle"],
        note=config["note"],
        cards="".join(cards),
    )

    out = BOARD / "index.html"
    out.write_text(html)
    print(f"\nwrote {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB, self-contained)")

    # Ship it with the site too, so the board has a public address instead of
    # living only on whichever laptop generated it. Vite copies public/ to the
    # build root untouched, so this lands at <site>/links/.
    hosted = ROOT / "public" / "links" / "index.html"
    hosted.parent.mkdir(parents=True, exist_ok=True)
    hosted.write_text(html)
    print(f"wrote {hosted.relative_to(ROOT)}  -> published at <site>/links/")


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Trevio — links</title>
<style>
{fonts}
*,*::before,*::after{{box-sizing:border-box}}
:root{{
  --paper:#faf9f6; --ink:#14141a; --muted:#5c5c66; --faint:#6b6b75;
  --line:rgba(20,20,26,.14); --accent:#8f5e1a;
  --sans:'Hanken Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --serif:'Newsreader',ui-serif,Georgia,serif;
}}
html,body{{margin:0}}
body{{
  background:var(--paper); color:var(--ink); font-family:var(--sans);
  -webkit-font-smoothing:antialiased; padding:clamp(24px,5vw,56px);
}}
.sheet{{max-width:1080px;margin-inline:auto}}
header{{
  display:flex;align-items:baseline;justify-content:space-between;gap:24px;
  padding-bottom:20px;margin-bottom:clamp(28px,4vw,44px);border-bottom:1px solid var(--line);
}}
h1{{margin:0;font-size:clamp(28px,4vw,40px);letter-spacing:-.03em;font-weight:600}}
h1 em{{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--accent)}}
.sub{{margin:6px 0 0;font-size:14px;color:var(--faint)}}
.note{{margin:0;font-size:13px;color:var(--faint);text-align:right;max-width:26ch}}
/* Auto-fit rather than a fixed column count, so adding or removing a link
   in links.json does not leave a hole in the layout. */
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(20px,3vw,32px)}}
.card{{
  display:flex;flex-direction:column;align-items:flex-start;gap:10px;
  padding:clamp(20px,2.6vw,28px);background:#fff;
  border:1px solid var(--line);border-radius:16px;
  box-shadow:0 1px 2px rgba(20,20,26,.04),0 10px 28px rgba(20,20,26,.06);
  break-inside:avoid;
}}
.card.is-pending{{background:#fbfaf7;box-shadow:none;border-style:dashed}}
.card__label{{
  margin:0;font-size:11px;font-weight:600;letter-spacing:.13em;
  text-transform:uppercase;color:var(--accent);
}}
.card__title{{margin:0;font-size:clamp(18px,2vw,22px);letter-spacing:-.015em;font-weight:600}}
.card__code{{
  align-self:center;width:clamp(150px,20vw,196px);aspect-ratio:1;
  margin:6px 0 4px;display:grid;place-items:center;
}}
.card__code img{{width:100%;height:100%;display:block;image-rendering:pixelated}}
.card__placeholder{{
  width:100%;height:100%;display:grid;place-items:center;
  border:2px dashed var(--line);border-radius:10px;
  color:var(--line);font-size:52px;font-weight:600;
}}
.card__hint{{margin:0;font-size:14px;line-height:1.5;color:var(--muted);max-width:38ch}}
.card__url{{
  margin:2px 0 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;
  font-size:12px;color:var(--faint);word-break:break-all;
}}
.card__status{{
  margin:2px 0 0;font-size:11px;font-weight:600;letter-spacing:.08em;
  text-transform:uppercase;color:#a8562e;
}}
footer{{
  margin-top:clamp(28px,4vw,40px);padding-top:18px;border-top:1px solid var(--line);
  font-size:12px;color:var(--faint);
}}
@media (max-width:720px){{.grid{{grid-template-columns:1fr}}header{{flex-direction:column;gap:8px}}.note{{text-align:left}}}}
/* One A4 sheet, white, no shadows — printed codes scan better flat, and two
   columns keeps each code large enough to read from across a room. */
@media print{{
  @page{{size:A4 portrait;margin:12mm}}
  body{{padding:0;background:#fff}}
  .grid{{grid-template-columns:repeat(2,1fr);gap:16px}}
  .card{{box-shadow:none;border-color:#ccc}}
  .card__code{{width:168px}}
  footer{{margin-top:16px}}
}}
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div>
        <h1>{title} <em>links</em></h1>
        <p class="sub">{subtitle}</p>
      </div>
      <p class="note">{note}</p>
    </header>
    <div class="grid">{cards}
    </div>
    <footer>
      Codes generated offline and verified by decoding them back. If a scan fails, the address under each code can be typed by hand.
    </footer>
  </div>
</body>
</html>
"""


if __name__ == "__main__":
    main()
