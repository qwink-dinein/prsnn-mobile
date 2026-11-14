"""Generates preview/blend-screens.html: Two's light screens (porcelain + midnight) with
Hour's logo (italic Bodoni + champagne diamond) and champagne details.
Two title options: A with Urbanist titles, B with Bodoni titles.
Run: python3 scripts/design/blend_screens.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import brand_screens as bs

ROOT = bs.ROOT
PORCELAIN, WHITE, MIDNIGHT, MUTED = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85'
CHAMP, CHAMP_DEEP, CHAMP_SOFT = '#C9B68E', '#8E7646', '#F6F1E6'
DIA = lambda s: f'<i style="display:inline-block;width:{s}px;height:{s}px;background:linear-gradient(135deg,#F3EBD9,{CHAMP} 55%,#8C7A55);transform:rotate(45deg);margin-left:{s * .7}px"></i>'

def mark(color):
    return lambda s: f'<span style="font:italic 400 {s * 1.05}px/1 Bodoni Moda;color:{color}">prsnn</span>{DIA(round(s * .28))}'

BASE = dict(bg=PORCELAIN, surface=WHITE, fg=MIDNIGHT, muted=MUTED, accent=MIDNIGHT, on=PORCELAIN, line='rgba(24,27,52,.08)',
            sel=CHAMP_SOFT, selb=CHAMP, save=CHAMP_DEEP, ui='Urbanist', r=16, mark=mark(MIDNIGHT))
A = dict(BASE, name='A · Urbanist titles', disp='600 {s}px/1.12 Urbanist')
B = dict(BASE, name='B · Bodoni titles', disp="italic 400 {s}px/1.12 'Bodoni Moda'")

def welcome(t):
    return bs.welcome(dict(t, accent=CHAMP, on=MIDNIGHT, mark=mark('#FAF9F6')))

def profile(t):
    # Champagne "Popular" pill with midnight text instead of a midnight pill.
    return bs.profile(t).replace(f'class="pop" style="background:{MIDNIGHT};color:{PORCELAIN}"', f'class="pop" style="background:{CHAMP};color:{MIDNIGHT}"')

def confirmed(t):
    # Champagne tick inside the midnight circle.
    return bs.confirmed(t).replace(f'stroke="{PORCELAIN}" stroke-width="2.2"', f'stroke="{CHAMP}" stroke-width="2.2"', 1)

SCREENS = [('Welcome', welcome), ('Home', bs.home), ('Companion and prices', profile), ('Review and pay', bs.checkout), ('Chat', bs.chat), ('Booking confirmed', confirmed)]

def row(t, note):
    return (f'<div class="row"><h2>{t["name"]}</h2><p>{note}</p><div class="strip">'
            + ''.join(f'<div class="cell">{bs.phone(t, fn)}<span class="l">{lab}</span></div>' for lab, fn in SCREENS) + '</div></div>')

TICKS = ''.join(f'<line x1="50" y1="{4 if k % 3 == 0 else 7}" x2="50" y2="11" stroke="{CHAMP}" stroke-width="{1.6 if k % 3 == 0 else .8}" transform="rotate({k * 30} 50 50)"/>' for k in range(12))
def icon(bg, fg, size=120):
    return (f'<div style="width:{size}px;height:{size}px;border-radius:{size * .225}px;background:{bg};position:relative;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(24,27,52,.18)">'
            f'<svg viewBox="0 0 100 100" style="position:absolute;inset:10%"><circle cx="50" cy="50" r="46" fill="none" stroke="{CHAMP}" stroke-width="1"/>{TICKS}</svg>'
            f'<span style="position:relative;font:italic 400 {size * .5}px/1 Bodoni Moda;color:{fg};margin-top:-{size * .05}px">p</span></div>')

SW = [('Porcelain', PORCELAIN, 'Background'), ('White', WHITE, 'Cards and sheets'), ('Midnight', MIDNIGHT, 'Text, buttons, chat'),
      ('Champagne', CHAMP, 'Logo diamond, Popular, selected border'), ('Deep champagne', CHAMP_DEEP, 'Savings text'), ('Champagne mist', CHAMP_SOFT, 'Selected card, safety tip')]
sw = ''.join(f'<div class="sw"><i style="background:{h}"></i><b>{n}</b><span>{h}</span><span>{r}</span></div>' for n, h, r in SW)

CSS = bs.CSS + '''
body{background:#E4E4E9}*{font-variant-numeric:lining-nums}.kit{padding:36px 40px 10px;display:flex;gap:56px;align-items:center;flex-wrap:wrap}
.kit h1{font:italic 400 40px Bodoni Moda;margin:0 0 8px;color:#181B34}.kit p{margin:0;max-width:64ch;line-height:1.55;color:#4C4F66;font-family:Urbanist;font-size:16px}
.lock{display:flex;align-items:center}.icons{display:flex;gap:16px}
.sws{display:grid;grid-template-columns:repeat(6,120px);gap:12px;padding:6px 40px 6px;font-family:Urbanist}.sw i{display:block;height:58px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(24,27,52,.12)}
.sw b{display:block;font-size:12.5px;margin-top:6px;color:#181B34}.sw span{display:block;font-size:11px;color:#6B6E85;line-height:1.35}
.row h2{font-family:Urbanist}.row p{font-family:Urbanist}
'''
link = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Urbanist:wght@400;500;600;700&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn blend</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body>'
        f'<div class="kit"><div><h1>Two’s light screens with Hour’s logo</h1><p>Porcelain and midnight keep every screen bright and easy to use. The italic Bodoni logo, the champagne diamond and champagne touches (Popular, the selected price, savings, the dial icon) make it feel premium.</p></div>'
        f'<div class="lock">{mark(MIDNIGHT)(62)}</div><div class="icons">{icon(MIDNIGHT, PORCELAIN)}{icon(WHITE, MIDNIGHT)}</div></div>'
        f'<div class="sws">{sw}</div>'
        + row(A, 'Clean sans titles: modern and easy to read. The logo stays the one serif moment.')
        + row(B, 'Italic Bodoni titles too: more editorial and luxurious, closer to Hour.')
        + '</body></html>')
(ROOT / 'preview/blend-screens.html').write_text(html)
print('wrote preview/blend-screens.html')
