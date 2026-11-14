"""Generates preview/cocoa-screens.html: prsnn in cream, chocolate brown and burnt orange
(owner's palette), light as the main look plus a chocolate dark mode.
Run: python3 scripts/design/cocoa_screens.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import brand_screens as bs

ROOT = bs.ROOT
CREAM, CHOC, ORANGE = '#F8F4E7', '#4E342E', '#CC5500'
DISP = "600 {s}px/1.1 'Cormorant Garamond'"

def mark(color_word, dot=ORANGE):
    return lambda s: (f'<span style="font:italic 600 {s * 1.15}px/1 Cormorant Garamond;letter-spacing:-.3px;color:{color_word}">prsnn</span>'
                      f'<i style="display:inline-block;width:{s * .26}px;height:{s * .26}px;border-radius:50%;background:{dot};margin-left:{s * .08}px;align-self:flex-end;margin-bottom:{s * .16}px"></i>')

DAY = dict(name='Cocoa (light)', bg=CREAM, surface='#FFFCF5', fg='#2E201C', muted='#7B675F', accent=CHOC, on=CREAM, line='rgba(78,52,46,.13)',
           sel='#F5E4D2', selb=ORANGE, save='#B04A00', disp=DISP, ui='Manrope', r=14, mark=mark('#2E201C'))
NIGHT = dict(name='Cocoa (dark mode)', bg='#2A1C19', surface='#3B2A25', fg=CREAM, muted='#C2B3A8', accent=ORANGE, on=CREAM, line='rgba(248,244,231,.12)',
             sel='rgba(204,85,0,.18)', selb=ORANGE, save='#EE9152', disp=DISP, ui='Manrope', r=14, mark=mark(CREAM))

def welcome_day(t):
    # On a photo, the orange button carries better than chocolate.
    return bs.welcome(dict(t, accent=ORANGE, on=CREAM, mark=mark(CREAM)))

SCREENS = [('Welcome', welcome_day), ('Home', bs.home), ('Companion and prices', bs.profile), ('Review and pay', bs.checkout), ('Chat', bs.chat), ('Booking confirmed', bs.confirmed)]

def row(t, bg, fg, sub, note):
    return (f'<div class="row" style="background:{bg};color:{fg}"><h2>{t["name"]}</h2><p style="color:{sub}">{note}</p><div class="strip">'
            + ''.join(f'<div class="cell">{bs.phone(t, fn)}<span class="l" style="color:{sub}">{lab}</span></div>' for lab, fn in SCREENS) + '</div></div>')

def icon(bg, word, dot, size=120):
    return (f'<div style="width:{size}px;height:{size}px;border-radius:{size * .225}px;background:{bg};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(46,32,28,.22)">'
            f'<span style="font:italic 600 {size * .62}px/1 Cormorant Garamond;color:{word};margin-top:-{size * .12}px">p</span>'
            f'<i style="width:{size * .11}px;height:{size * .11}px;border-radius:50%;background:{dot};margin:{size * .3}px 0 0 {size * .03}px"></i></div>')

SW = [('Cream', CREAM, 'Background'), ('Shell', '#FFFCF5', 'Cards and sheets'), ('Chocolate', CHOC, 'Buttons, chat, selected'), ('Espresso', '#2E201C', 'Text'),
      ('Burnt orange', ORANGE, 'Full stop, Popular, savings'), ('Apricot', '#F5E4D2', 'Selected card')]
sw = ''.join(f'<div class="sw"><i style="background:{h}"></i><b>{n}</b><span>{h}</span><span>{r}</span></div>' for n, h, r in SW)

CSS = bs.CSS + '''
body{background:#E7E1D3}*{font-variant-numeric:lining-nums}.kit{padding:36px 40px 10px;display:flex;gap:56px;align-items:center;flex-wrap:wrap}
.kit h1{font:italic 600 44px Cormorant Garamond;margin:0 0 6px;color:#2E201C}.kit p{margin:0;max-width:62ch;line-height:1.55;color:#5E4D46}
.lock{display:flex;align-items:flex-end}.icons{display:flex;gap:16px}
.sws{display:grid;grid-template-columns:repeat(6,110px);gap:12px;padding:6px 40px 6px}.sw i{display:block;height:58px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(78,52,46,.15)}
.sw b{display:block;font-size:12.5px;margin-top:6px;color:#2E201C}.sw span{display:block;font-size:11px;color:#7B675F;line-height:1.35}
'''
link = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn in cocoa</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body>'
        f'<div class="kit"><div><h1>prsnn. in cream, chocolate and burnt orange</h1><p>Cream is the page, chocolate does the work (text, buttons, your chat bubbles) and burnt orange is used sparingly: the full stop, the Popular badge and savings. Cormorant Garamond for the logo and titles, Manrope for everything else.</p></div>'
        f'<div class="lock">{mark("#2E201C")(64)}</div><div class="icons">{icon(CHOC, CREAM, ORANGE)}{icon(CREAM, CHOC, ORANGE)}{icon(ORANGE, CREAM, CHOC)}</div></div>'
        f'<div class="sws">{sw}</div>'
        + row(DAY, 'transparent', '#2E201C', '#5E4D46', 'The main look. Warm, light and calm, with chocolate for every action.')
        + row(NIGHT, '#211613', CREAM, '#C2B3A8', 'Dark mode for evenings: deep chocolate, cream text and burnt-orange buttons.')
        + '</body></html>')
(ROOT / 'preview/cocoa-screens.html').write_text(html)
print('wrote preview/cocoa-screens.html')
