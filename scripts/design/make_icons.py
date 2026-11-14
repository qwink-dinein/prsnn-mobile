"""Draws the app icons and splash from the approved logo (design.md): "p." / "prsnn." in
Outfit Bold, white/porcelain on midnight, round champagne dot.
Run: python3 scripts/design/make_icons.py"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONT = str(ROOT / 'node_modules/@expo-google-fonts/outfit/700Bold/Outfit_700Bold.ttf')
MID, PORC, CHAMP = (24, 27, 52), (241, 241, 244), (201, 182, 142)

def mark(canvas, text, font_px, ink, dot, center=(0.5, 0.5), tracking=-0.045):
    """Draw text + round dot centred on the canvas as one optical unit."""
    w, h = canvas.size
    f = ImageFont.truetype(FONT, font_px)
    d = ImageDraw.Draw(canvas)
    # measure glyph by glyph to apply tracking
    widths = [d.textlength(ch, font=f) for ch in text]
    track = tracking * font_px
    text_w = sum(widths) + track * (len(text) - 1)
    dot_r = font_px * 0.1
    gap = font_px * 0.05
    total = text_w + gap + 2 * dot_r
    asc, desc = f.getmetrics()
    # x-height block of "p": centre on the bowl (baseline − x-height/2) so it looks centred
    bbox_o = f.getbbox('o')
    x_top, baseline = bbox_o[1], asc
    x0 = w * center[0] - total / 2
    y_base = h * center[1] + (baseline - x_top) / 2  # baseline position so the x-height is centred
    x = x0
    for ch, cw in zip(text, widths):
        d.text((x, y_base - baseline), ch, font=f, fill=ink)
        x += cw + track
    x += gap - track
    cy = y_base - dot_r
    d.ellipse([x, cy - dot_r, x + 2 * dot_r, cy + dot_r], fill=dot)

def icon(size=1024, bg=MID, ink=PORC, dot=CHAMP, scale=0.62, transparent=False):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0) if transparent else bg + (255,))
    mark(im, 'p', int(size * scale), ink, dot, center=(0.5, 0.47))
    return im

out = ROOT / 'assets'
icon().convert('RGB').save(out / 'icon.png')                                  # iOS + store, no transparency
icon(transparent=True, scale=0.42).save(out / 'adaptive-icon.png')          # Android foreground inside the safe zone
mono = icon(transparent=True, scale=0.42, ink=(255, 255, 255), dot=(255, 255, 255))
mono.save(out / 'adaptive-icon-monochrome.png')                             # Android 13 themed icon
icon(96, transparent=True, scale=0.62, ink=(255, 255, 255), dot=(255, 255, 255)).save(out / 'notification-icon.png')
icon(196, scale=0.62).convert('RGB').save(out / 'favicon.png')
# Splash: the full wordmark, porcelain with champagne dot, on midnight (background colour from app.json)
sp = Image.new('RGBA', (1284, 1284), (0, 0, 0, 0))
mark(sp, 'prsnn', 230, PORC, CHAMP, center=(0.5, 0.5))
sp.save(out / 'splash-icon.png')
print('icons written')
