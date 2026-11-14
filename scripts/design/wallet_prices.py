"""Generates preview/wallet-prices.html: the package (price per hour) cards in the approved
Wallet style, matching Home "B · Lift to choose". Four member options plus the companion view.
Prices: the fixed list (1 h ₹399 … 12 h ₹3,599); companions get 80% rounded down.
Run: python3 scripts/design/wallet_prices.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import wallet_variants as wv

ROOT = wv.ROOT
P, W, M, MUT, C, CD, CM, LINE, DEEP, STEEL = wv.P, wv.W, wv.M, wv.MUT, wv.C, wv.CD, wv.CM, wv.LINE, wv.DEEP, wv.STEEL
PKG = [(1, 399), (2, 699), (4, 1299), (6, 1899), (12, 3599)]
per = lambda h, p: round(p / h)
save = lambda h, p: 399 * h - p
earn = lambda p: p * 8 // 10
hrs = lambda h: f'{h} {"hour" if h == 1 else "hours"}'
MATS = {1: 'pearl', 2: 'mist', 4: 'black', 6: 'steel', 12: 'gold'}
TAG = {4: 'Popular', 12: 'Best value'}  # 12 h has the lowest price per hour
inr = lambda n: f'₹{n:,}'
CHECK = 'M5 12.5 10 17l9-10'
def ic(d, c, w=14, sw=2.4):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'

def header(sub='Choose how long'):
    return (f'<div style="padding:44px 18px 0;display:flex;align-items:center;gap:10px">'
            f'<span style="width:34px;height:34px;border-radius:17px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;justify-content:center">'
            f'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{M}" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></span>'
            f'<span style="width:34px;height:34px;border-radius:17px;background:url({wv.PH["walks"]}) center/cover"></span>'
            f'<div><div style="font:600 15px Urbanist">Maya</div><div style="font:400 11.5px Urbanist;color:{MUT}">ID verified</div></div></div>'
            f'<div style="padding:16px 18px 0;font:600 24px/1.12 Urbanist;letter-spacing:-.5px">{sub}</div>')

def cta(label):
    return f'<div class="cta">{label}</div>'

def big_card(h, p, height=212, companion=False):
    """The lifted package card: a membership card in its material."""
    _, bg, fg, acc, pat = wv.MAT[MATS[h]]
    tag = TAG.get(h)
    price_col = C if MATS[h] in ('black', 'steel') else fg
    sub = f'You get {inr(earn(p))}' if companion else (f'{inr(per(h, p))} an hour' + (f'  ·  Save {inr(save(h, p))}' if save(h, p) else ''))
    return (f'<div style="position:relative;height:{height}px;border-radius:24px;background:{bg};overflow:hidden;padding:16px 18px;display:flex;flex-direction:column;'
            f'box-shadow:0 18px 36px rgba(24,27,52,.28)">{wv.guilloche(pat)}'
            f'<div style="position:relative;display:flex;justify-content:space-between;align-items:center">{wv.logo(13, fg, acc)}'
            + (f'<span style="font:600 10.5px Urbanist;padding:4px 9px;border-radius:99px;background:{C if MATS[h] != "gold" else M};color:{M if MATS[h] != "gold" else P}">{tag}</span>' if tag else '<span></span>') + '</div>'
            f'<div style="position:relative;margin-top:auto;font:500 13px Urbanist;color:{fg};opacity:.8">{hrs(h)}</div>'
            f'<div style="position:relative;font:700 44px/1 Outfit;letter-spacing:-1.6px;color:{price_col};margin-top:4px">{inr(p)}</div>'
            f'<div style="position:relative;font:500 12.5px Urbanist;color:{fg};opacity:.85;margin-top:8px">{sub.replace("  ·  ", " &nbsp;·&nbsp; ")}</div></div>')

def tab(h, p, right=None, companion=False, on=False):
    """A slim package tab peeking out under the lifted card."""
    _, bg, fg, acc, pat = wv.MAT[MATS[h]]
    r = right if right is not None else inr(p)
    box = ''
    if companion:
        box = (f'<span style="width:20px;height:20px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;margin-right:10px;'
               f'{"background:" + (C if MATS[h] in ("black", "steel") else M) if on else "box-shadow:inset 0 0 0 1.5px " + (P if MATS[h] in ("black", "steel") else M) + ";opacity:.7"}">'
               f'{ic(CHECK, M if MATS[h] in ("black", "steel") else P) if on else ""}</span>')
    return (f'<div style="position:relative;height:58px;border-radius:18px;background:{bg};overflow:hidden;padding:11px 16px;box-shadow:0 -4px 14px rgba(24,27,52,.10)">{wv.guilloche(pat)}'
            f'<div style="position:relative;display:flex;align-items:center;justify-content:space-between;color:{fg}"><span style="display:inline-flex;align-items:center;font:600 14.5px Urbanist">{box}{hrs(h)}'
            + (f'<span style="font:500 10.5px Urbanist;opacity:.7;margin-left:8px">{TAG[h]}</span>' if h in TAG and not companion else '') + f'</span>'
            f'<span style="font:700 15px Outfit;letter-spacing:-.3px">{r}</span></div></div>')

def tabs_stack(items, step=-20):
    return ''.join(f'<div style="position:relative;margin-top:{10 if i == 0 else step}px">{t}</div>' for i, t in enumerate(items))

# ── P1 · Lift to choose (matches Home B) ──
def p_lift():
    rest = [tab(h, p) for h, p in PKG if h != 4]
    return (header() + f'<div style="padding:14px 18px 0">{big_card(4, 1299)}{tabs_stack(rest)}</div>'
            f'<div style="padding:12px 18px 0;font:400 11.5px/1.45 Urbanist;color:{MUT}">Full refund if nobody accepts. No booking fee.</div>' + cta('Continue with 4 hours'))

# ── P2 · Swipe the cards ──
def p_swipe():
    def mini(h, p, w):
        return f'<div style="flex:none;width:{w}px">{big_card(h, p, 150 if w < 200 else 196)}</div>'
    row = f'<div style="display:flex;gap:12px;align-items:center;margin:16px 0 0 -154px">{mini(2, 699, 170)}{mini(4, 1299, 212)}{mini(6, 1899, 170)}</div>'
    dots = '<div style="display:flex;gap:5px;justify-content:center;margin-top:14px">' + ''.join(f'<i style="width:{16 if i == 2 else 6}px;height:6px;border-radius:3px;background:{M if i == 2 else "#C9CAD6"}"></i>' for i in range(5)) + '</div>'
    lines = ''.join(f'<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid {LINE};font:400 12.5px Urbanist"><span style="color:{MUT}">{a}</span><span style="font-weight:600">{b}</span></div>'
                    for a, b in [('Per hour', '₹325'), ('You save', '₹297'), ('If nobody accepts', 'Full refund')])
    return header('Swipe to choose how long') + row + dots + f'<div style="margin:14px 18px 0">{lines}</div>' + cta('Continue with 4 hours')

# ── P3 · All five as a stack, chosen one opens ──
def p_stack():
    items = []
    for h, p in PKG:
        items.append(big_card(h, p, 168) if h == 4 else tab(h, p))
    out = ''.join(f'<div style="position:relative;margin-top:{0 if i == 0 else (-14 if items[i - 1].startswith("<div style=\"position:relative;height:58px") else 10)}px">{t}</div>'
                  for i, t in enumerate(items))
    return header() + f'<div style="padding:14px 18px 0">{out}</div>' + cta('Continue with 4 hours')

# ── P4 · Duration switch + one card ──
def p_switch():
    seg = ''.join(f'<span style="flex:1;text-align:center;padding:9px 0;border-radius:12px;font:600 13px Urbanist;{"background:" + M + ";color:" + P if h == 4 else "color:" + MUT}">{h}h</span>' for h, _ in PKG)
    incl = ''.join(f'<div style="display:flex;gap:10px;align-items:center;padding:7px 0;font:400 12.5px Urbanist">{ic(CHECK, CD, 14)}<span>{t}</span></div>'
                   for t in ['ID-verified companion', 'Meet in a public place you choose', 'Full refund if nobody accepts'])
    return (header() + f'<div style="margin:14px 18px 0;padding:4px;border-radius:16px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex">{seg}</div>'
            f'<div style="padding:12px 18px 0">{big_card(4, 1299, 196)}</div><div style="padding:10px 18px 0">{incl}</div>' + cta('Continue with 4 hours'))

# ── Companion · choose the durations you offer ──
def p_companion():
    offered = {1, 2, 4, 6}
    rows = ''.join(f'<div style="position:relative;margin-top:{0 if i == 0 else 8}px">{tab(h, p, "You get " + inr(earn(p)), True, h in offered)}</div>' for i, (h, p) in enumerate(PKG))
    return (header('The lengths you offer').replace('Maya</div><div style="font:400 11.5px Urbanist;color:' + MUT + '">ID verified', 'Your profile</div><div style="font:400 11.5px Urbanist;color:' + MUT + '">Companion')
            + f'<div style="padding:6px 18px 0;font:400 12.5px/1.45 Urbanist;color:{MUT}">Same prices for everyone. You receive 80% of each booking.</div>'
            f'<div style="padding:14px 18px 0">{rows}</div>' + cta('Save 4 lengths'))

SCREENS = [('P1 · Lift to choose', 'Matches Home: the chosen length is a large membership card; the others wait below as card tabs showing their price. Tap a tab to lift it.', p_lift),
           ('P2 · Swipe the cards', 'Each length is a card you swipe through, with the details listed below. The most playful.', p_swipe),
           ('P3 · Open in the stack', 'All five lengths stay in order (1 to 12 hours); the chosen one opens in place. Easiest to compare.', p_stack),
           ('P4 · Switch and card', 'A simple 1h to 12h switch above one card, with what is included. The clearest for first-time members.', p_switch),
           ('Companion view', 'Companions tick the lengths they offer on the same cards, and see what they get (80%).', p_companion)]

CSS = wv.CSS + f'''.cta{{position:absolute;left:18px;right:18px;bottom:20px;height:48px;border-radius:16px;background:{M};color:{P};display:flex;align-items:center;justify-content:center;font:600 14px Urbanist;z-index:6}}
.ph{{overflow:hidden}}'''
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn price cards</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="intro"><h1>Choosing how long, as Wallet cards</h1>'
        '<p>The package cards in the approved Wallet style. Each length has its own card material, the same way each category does: 1 hour pearl, 2 hours mist, 4 hours midnight (Popular), 6 hours steel and 12 hours champagne (Best value, the lowest price per hour).</p></div>'
        '<div class="row"><div class="strip">' + ''.join(f'<div class="cell"><div class="ph"><div class="notch"></div>{fn()}</div><h2>{t}</h2><p>{d}</p></div>' for t, d, fn in SCREENS) + '</div></div></body></html>')
(ROOT / 'preview/wallet-prices.html').write_text(html)
print('wrote preview/wallet-prices.html')
