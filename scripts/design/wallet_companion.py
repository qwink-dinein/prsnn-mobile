"""Generates preview/wallet-companion.html: the approved companion "lengths you offer" screen
with all twelve lengths (1-12 h), each showing the member price and the companion's 80%.
Prices are src/domain/pricing.ts DEFAULT_PACKAGE_PRICES. Run: python3 scripts/design/wallet_companion.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import wallet_variants as wv

ROOT = wv.ROOT
P, W, M, MUT, C, LINE = wv.P, wv.W, wv.M, wv.MUT, wv.C, wv.LINE
PRICES = {1: 399, 2: 699, 3: 999, 4: 1299, 5: 1599, 6: 1899, 7: 2199, 8: 2499, 9: 2799, 10: 3099, 11: 3349, 12: 3599}
earn = lambda p: p * 8 // 10
inr = lambda n: f'₹{n:,}'
# Headline lengths keep their card; the others alternate pearl and mist so the list stays calm.
MAT = {1: 'pearl', 2: 'mist', 3: 'pearl', 4: 'black', 5: 'mist', 6: 'steel', 7: 'pearl', 8: 'mist', 9: 'pearl', 10: 'mist', 11: 'pearl', 12: 'gold'}
TAG = {4: 'Popular', 12: 'Best value'}
OFFERED = {1, 2, 4, 6}
CHECK = 'M5 12.5 10 17l9-10'

def row(h):
    _, bg, fg, acc, pat = wv.MAT[MAT[h]]
    on = h in OFFERED
    dark = MAT[h] in ('black', 'steel')
    tick_bg = C if dark else M
    box = (f'<span style="flex:none;width:22px;height:22px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;'
           + (f'background:{tick_bg}">' + f'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="{M if dark else P}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="{CHECK}"/></svg>'
              if on else f'box-shadow:inset 0 0 0 1.6px {fg};opacity:.75">') + '</span>')
    tag = f'<span style="font:500 10.5px Urbanist;opacity:.7;margin-left:6px">{TAG[h]}</span>' if h in TAG else ''
    return (f'<div style="position:relative;height:62px;border-radius:18px;background:{bg};overflow:hidden;padding:0 16px;display:flex;align-items:center;gap:12px;'
            f'box-shadow:0 4px 14px rgba(24,27,52,.08)">{wv.guilloche(pat)}'
            f'<div style="position:relative;display:flex;align-items:center;gap:12px;flex:1;color:{fg}">{box}'
            f'<div><div style="font:600 15px Urbanist">{h} {"hour" if h == 1 else "hours"}{tag}</div><div style="font:400 11.5px Urbanist;opacity:.72;margin-top:1px;white-space:nowrap">Members pay {inr(PRICES[h])}</div></div>'
            f'<span style="margin-left:auto;text-align:right"><span style="display:block;font:500 10.5px Urbanist;opacity:.72">You get</span><span style="font:700 17px Outfit;letter-spacing:-.3px">{inr(earn(PRICES[h]))}</span></span></div></div>')

def screen(tall):
    rows = ''.join(f'<div style="margin-top:{0 if i == 0 else 8}px">{row(h)}</div>' for i, h in enumerate(range(1, 13)))
    return (f'<div style="padding:44px 18px 0;display:flex;align-items:center;gap:10px">'
            f'<span style="width:34px;height:34px;border-radius:17px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;justify-content:center">'
            f'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{M}" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></span>'
            f'<span style="width:34px;height:34px;border-radius:17px;background:url({wv.PH["walks"]}) center/cover"></span>'
            f'<div><div style="font:600 15px Urbanist">Your profile</div><div style="font:400 11.5px Urbanist;color:{MUT}">Companion</div></div></div>'
            f'<div style="padding:16px 18px 0;font:600 24px/1.12 Urbanist;letter-spacing:-.5px">The lengths you offer</div>'
            f'<div style="padding:6px 18px 0;font:400 12.5px/1.45 Urbanist;color:{MUT}">Same prices for everyone. You receive 80% of each booking. Longer bookings cost members less per hour.</div>'
            f'<div style="padding:14px 18px {110 if tall else 0}px">{rows}</div>'
            f'<div class="cta" style="{"position:absolute" if True else ""}">Save {len(OFFERED)} lengths</div>'
            + ('<div class="fade"></div>' if not tall else ''))

CSS = wv.CSS + f'''.cta{{position:absolute;left:18px;right:18px;bottom:20px;height:48px;border-radius:16px;background:{M};color:{P};display:flex;align-items:center;justify-content:center;font:600 14px Urbanist;z-index:6;box-shadow:0 8px 20px rgba(24,27,52,.25)}}
.fade{{position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(180deg,rgba(241,241,244,0),{P} 55%);z-index:5}}
.tall{{height:1250px!important}}.cell.wide{{width:auto}}.cell p{{max-width:286px}}'''
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn companion lengths</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="intro"><h1>The lengths you offer (companions)</h1>'
        '<p>All twelve lengths, each showing what members pay and what the companion receives (80%, rounded down, exactly as the server pays it). Headline lengths keep their card colour (4 hours midnight, 6 hours steel, 12 hours champagne); the rest alternate pearl and mist.</p></div>'
        '<div class="row"><div class="strip">'
        f'<div class="cell"><div class="ph"><div class="notch"></div>{screen(False)}</div><h2>On the phone</h2><p>The first lengths on screen; the list scrolls and the save button stays in reach.</p></div>'
        f'<div class="cell"><div class="ph tall"><div class="notch"></div>{screen(True)}</div><h2>The whole list</h2><p>Scrolled out to show all twelve lengths at once.</p></div>'
        '</div></div></body></html>')
(ROOT / 'preview/wallet-companion.html').write_text(html)
print('wrote preview/wallet-companion.html')
