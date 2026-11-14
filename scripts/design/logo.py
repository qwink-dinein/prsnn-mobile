"""Generates preview/logo-designs.html: 'prsnn.' wordmark explorations in a heavy,
rounded, geometric lowercase style (drawn here as monoline strokes; not a copy of
any existing logo). For owner review. Run: python3 scripts/design/logo.py"""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

INK, MIST, PAPER, MOSS, MOSS_SOFT, CLAY, SIGNAL = '#0E110D', '#F3F1EB', '#FAF9F6', '#2F4A34', '#D7E3D4', '#C45C2A', '#C8F03C'

# Letters on a 100-unit x-height (y=0 top of x-height, y=100 baseline), drawn as
# centre-line paths with round caps. `w` = stroke width; outer edges reach 0..100.
def letters(w):
    h = w / 2           # cap overhang
    R = 50 - h          # bowl/arch radius (centre line)
    top, base = h, 100 - h
    L = {}
    # p: stem to the descender + full bowl
    L['p'] = (100, None, f'M{h},{top} V{150 - h} M{h},50 A{R},{R} 0 1 1 {h + 2 * R},50 A{R},{R} 0 1 1 {h},50')
    # r: stem + quarter arc ending in a short flat terminal
    L['r'] = (72, None, f'M{h},{base} V50 A{R},{R} 0 0 1 {h + R},{top} H{72 - h}')
    # s: drawn a little thinner than the other letters (sw) so both counters stay open at heavy weights
    sx = 84
    sw = w * 0.78
    t, b = sw / 2, 100 - sw / 2
    L['s'] = (sx, sw, f'M{sx - t - 4},{t + 9} C{sx * .74},{t} {sx * .6},{t} {sx * .48},{t} C{t + 8},{t} {t},{t + 8} {t},{t + 17}'
                  f' C{t},{50 - 6} {sx * .3},{50} {sx * .5},{50} C{sx * .7},{50} {sx - t},{50 + 6} {sx - t},{b - 17}'
                  f' C{sx - t},{b - 8} {sx - t - 8},{b} {sx * .52},{b} C{sx * .4},{b} {sx * .26},{b} {t + 4},{b - 9}')
    # n: stem + arch
    L['n'] = (100, None, f'M{h},{top} V{base} M{h},{base} V50 A{R},{R} 0 0 1 {h + 2 * R},50 V{base}')
    return L

def wordmark(color, dot, w=30, gap=12, ligature=False, dot_r=None, scale=1.0, word='prsnn'):
    """SVG for the word, returns (svg, width, height). Units: x-height 100."""
    L = letters(w)
    x, parts = 0, []
    for i, ch in enumerate(word):
        adv, own, d = L[ch]
        if ligature and ch == 'n' and i > 0 and word[i - 1] == 'n':
            # second n shares the first n's right leg: start the arch from it
            x -= gap + w
            h = w / 2; R = 50 - h
            d = f'M{h},50 A{R},{R} 0 0 1 {h + 2 * R},50 V{100 - h}'
        parts.append(f'<path transform="translate({x},0)" d="{d}"' + (f' stroke-width="{own}"' if own else '') + '/>')
        x += adv + gap
    r = dot_r or w * 0.62
    cx = x + r - gap * 0.2
    parts.append(f'<circle cx="{cx}" cy="{100 - r}" r="{r}" fill="{dot}" stroke="none"/>')
    W = cx + r + 4
    vb = f'-4 -6 {W + 4} 162'
    return (f'<svg viewBox="{vb}" style="width:{W * scale}px;height:{162 * scale}px;display:block;overflow:visible">'
            f'<g fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{"".join(parts)}</g></svg>')

def monogram(color, dot, w=30, scale=1.0):
    L = letters(w)
    r = w * 0.62
    return (f'<svg viewBox="-4 -6 {100 + 2 * r + 16} 162" style="width:{(120 + 2 * r) * scale}px;height:{162 * scale}px;display:block">'
            f'<g fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"><path d="{L["p"][2]}"/></g>'
            f'<circle cx="{100 + 8 + r}" cy="{100 - r}" r="{r}" fill="{dot}"/></svg>')

cards = [
  ('A · Heavy wordmark on black', 'Closest to the reference: thick, even strokes, round ends, the clay full stop.',
   f'<div class="tile" style="background:{INK}">{wordmark(PAPER, CLAY, scale=.62)}</div>'),
  ('B · Moss on mist (everyday)', 'For the app, website and documents. Moss is the one brand colour; the full stop stays clay.',
   f'<div class="tile" style="background:{MIST}">{wordmark(MOSS, CLAY, scale=.62)}</div>'),
  ('C · With the line', 'The wordmark with “Good company, on your terms.” in DM Sans, for the website header, store page and posters.',
   f'<div class="tile" style="background:{PAPER};flex-direction:column;gap:6px">{wordmark(INK, CLAY, scale=.5)}<div style="font:500 15px DM Sans,sans-serif;color:#6A665C;letter-spacing:.2px">Good company, on your terms.</div></div>'),
  ('D · Lighter weight', 'Same shapes with thinner strokes: calmer, more premium, closer to today’s italic Lora mark.',
   f'<div class="tile" style="background:{MIST}">{wordmark(MOSS, CLAY, w=20, gap=14, scale=.62)}</div>'),
  ('E · Cream on moss', 'Reversed, for the splash screen, store banners and merchandise.',
   f'<div class="tile" style="background:{MOSS}">{wordmark(PAPER, CLAY, scale=.62)}</div>'),
  ('F · Signal full stop', 'A brighter accent dot for social and events only (signal is never used as text).',
   f'<div class="tile" style="background:{INK}">{wordmark(PAPER, SIGNAL, scale=.62)}</div>'),
]
icons = ''.join(
  f'<div class="ic" style="background:{bg}">{monogram(fg, CLAY, scale=.42)}</div>' for bg, fg in [(MOSS, PAPER), (INK, PAPER), (MIST, MOSS), (PAPER, INK)])

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:#E3E0D6;font-family:'DM Sans',system-ui,sans-serif;color:{INK}}}
.top{{max-width:1300px;margin:0 auto;padding:28px 16px 6px}}.top h1{{font:600 28px Lora,serif;margin:0 0 6px}}.top p{{margin:0;color:#6A665C;max-width:860px;line-height:1.5}}
.grid{{max-width:1300px;margin:0 auto;padding:18px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:22px}}
.card{{background:{PAPER};border:1px solid rgba(14,17,13,.08);border-radius:20px;overflow:hidden}}
.tile{{height:200px;display:flex;align-items:center;justify-content:center}}
.cap{{padding:14px 16px 16px;font-size:13px;color:#6A665C;line-height:1.45}}.cap b{{display:block;color:{INK};font-size:15px;margin-bottom:2px}}
.row{{max-width:1300px;margin:0 auto;padding:6px 16px 30px}}.row h2{{font:600 20px Lora,serif;margin:10px 0 4px}}.row p{{margin:0 0 14px;color:#6A665C;font-size:14px}}
.icons{{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-end}}.ic{{width:120px;height:120px;border-radius:27px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(14,17,13,.15)}}
.sizes{{display:flex;gap:28px;align-items:flex-end;background:{PAPER};border-radius:20px;padding:22px;margin-top:6px;flex-wrap:wrap}}'''

sizes = ''.join(f'<div>{wordmark(MOSS, CLAY, scale=s)}</div>' for s in (.5, .32, .2, .13))
html = (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn logo ideas</title>'
        '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Lora:wght@600&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="top"><h1>prsnn. — logo ideas</h1><p>Heavy, rounded, geometric lowercase in the spirit of the reference, '
        'drawn from scratch for prsnn (not traced from any existing logo). Brand colours only: ink, mist, moss, clay; the full stop stays the brand signature.</p></div>'
        + '<div class="grid">' + ''.join(f'<div class="card">{t}<div class="cap"><b>{a}</b>{b}</div></div>' for a, b, t in cards) + '</div>'
        f'<div class="row"><h2>App icon: “p.”</h2><p>The same p and full stop, for the home screen, favicon and WhatsApp profile photo.</p><div class="icons">{icons}</div>'
        f'<h2>Small sizes</h2><p>Strokes stay open and readable down to tab-bar and favicon sizes.</p><div class="sizes">{sizes}</div></div></body></html>')
(ROOT / 'preview/logo-designs.html').write_text(html)
print('wrote preview/logo-designs.html')
