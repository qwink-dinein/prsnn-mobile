"""Generates preview/wallet-variants.html: five ways to show the categories as Wallet-style
cards on Home, plus close-ups of the card designs. Approved palette and Outfit logo.
Run: python3 scripts/design/wallet_variants.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()
PH = {k: img(k) for k in ('walks', 'events', 'park', 'together', 'study')}
P, W, M, MUT, C, CD, CM, LINE, DEEP = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6', 'rgba(24,27,52,.08)', '#E6E6EC'
STEEL = '#3A3F5C'

CATS = [('New in Town', 'Find your feet with a local', 'walks'), ('Don’t Go Alone', 'Events, dinners and plans', 'events'),
        ('Explore & Discover', 'Galleries, markets and trails', 'park'), ('For a Loved One', 'Company for someone you love', 'together'),
        ('Work & Study', 'Focus together, anywhere', 'study')]
# Card "materials": (name, background, text, accent, pattern stroke)
MAT = {'black': ('Midnight', M, P, C, 'rgba(201,182,142,.22)'), 'gold': ('Champagne', C, M, M, 'rgba(24,27,52,.10)'),
       'pearl': ('Pearl', W, M, CD, 'rgba(142,118,70,.16)'), 'steel': ('Steel', STEEL, P, C, 'rgba(241,241,244,.12)'), 'mist': ('Mist', DEEP, M, CD, 'rgba(24,27,52,.08)')}
ORDER = ['black', 'gold', 'pearl', 'steel', 'mist']
_id = [0]

def logo(s=20, ink=M, dot=CD):
    d = s * .2
    return (f'<span style="display:inline-flex;align-items:baseline;font:700 {s}px/1 Outfit;letter-spacing:-.045em;color:{ink}">prsnn'
            f'<i style="display:inline-block;width:{d}px;height:{d}px;border-radius:50%;background:{dot};margin-left:{s * .045}px"></i></span>')

def guilloche(stroke, w=300, h=190):
    """Fine engraved wave lines, like a banknote or a premium card."""
    _id[0] += 1
    paths = ''.join(f'<path d="M-20,{y} C{w * .25},{y - 26} {w * .5},{y + 26} {w * .75},{y} S{w + 40},{y - 26} {w + 40},{y}" fill="none" stroke="{stroke}" stroke-width=".7"/>'
                    for y in range(-10, h + 30, 9))
    rings = ''.join(f'<circle cx="{w * .86}" cy="{h * .2}" r="{r}" fill="none" stroke="{stroke}" stroke-width=".7"/>' for r in range(18, 120, 12))
    return f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">{paths}{rings}</svg>'

def bell(c=M):
    return f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="1.7" stroke-linecap="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4"/></svg>'
ARROW = lambda c: f'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

def head(title):
    return (f'<div style="padding:44px 18px 0;display:flex;justify-content:space-between;align-items:center">{logo()}{bell()}</div>'
            f'<div style="padding:14px 18px 0"><div style="font:400 12.5px Urbanist;color:{MUT}">Good evening, Sam</div><div style="font:600 24px/1.12 Urbanist;letter-spacing:-.5px;margin-top:4px">{title}</div></div>')

def tabs():
    return ('<div class="tabs">' + ''.join(f'<span style="color:{M if i == 0 else MUT};font-weight:{600 if i == 0 else 400}">{t}</span>' for i, t in enumerate(['Home', 'Search', 'Bookings', 'Messages', 'Profile'])) + '</div>')

def card(cat, mat, h=168, full=True, photo='circle'):
    """One category card in a material. photo: 'circle' | 'window' | 'band' | None."""
    _, bg, fg, acc, pat = MAT[mat]
    name, line, ph = cat
    pic = ''
    if photo == 'circle':
        pic = f'<span style="width:30px;height:30px;border-radius:50%;background:url({PH[ph]}) center/cover;box-shadow:0 0 0 2px {bg},0 0 0 3px {acc}"></span>'
    body = (f'<div style="position:relative;display:flex;justify-content:space-between;align-items:center"><span style="font:600 15px Urbanist;color:{fg}">{name}</span>{pic}</div>')
    if full:
        body += (f'<div style="position:relative;margin-top:auto;font:400 12px Urbanist;color:{fg};opacity:.78">{line}</div>'
                 f'<div style="position:relative;display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px">'
                 f'<span style="display:inline-flex;align-items:center;gap:6px;font:600 12.5px Urbanist;color:{fg}">Find company {ARROW(acc)}</span>{logo(13, fg, acc)}</div>')
    window = (f'<span style="position:absolute;right:14px;top:50%;transform:translateY(-50%);width:{h * .5}px;height:{h * .5}px;border-radius:50%;background:url({PH[ph]}) center/cover;'
              f'box-shadow:0 0 0 3px {bg},0 0 0 4px {acc}"></span>') if photo == 'window' else ''
    band = (f'<span style="position:absolute;right:0;top:0;bottom:0;width:42%;background:url({PH[ph]}) center/cover;'
            f'-webkit-mask-image:linear-gradient(90deg,transparent,#000 40%);mask-image:linear-gradient(90deg,transparent,#000 40%)"></span>') if photo == 'band' else ''
    return (f'<div style="position:relative;height:{h}px;border-radius:20px;background:{bg};padding:14px 16px;display:flex;flex-direction:column;overflow:hidden;'
            f'box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 -4px 16px rgba(24,27,52,.10)">{guilloche(pat)}{band}{window}{body}</div>')

# ── Variant A · Classic stack, with engraved card faces ──
def v_stack():
    out = ''
    for i, (c, m) in enumerate(zip(CATS, ORDER)):
        last = i == len(CATS) - 1
        out += f'<div style="margin-top:{0 if i == 0 else -110}px;position:relative">{card(c, m, 172, last)}</div>'
    return head('Pick a kind of company') + f'<div style="padding:16px 18px 0">{out}</div>' + tabs()

# ── Variant B · Selected card lifts out of the stack ──
def v_lifted():
    sel = CATS[1]
    big = (f'<div style="position:relative;height:222px;border-radius:24px;overflow:hidden;background:url({PH[sel[2]]}) center/cover;box-shadow:0 16px 34px rgba(24,27,52,.28)">'
           f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,52,.05) 30%,rgba(24,27,52,.92))"></div>'
           f'<div style="position:absolute;top:14px;left:16px;right:16px;display:flex;justify-content:space-between">{logo(13, P, C)}<span style="font:500 11px Urbanist;color:{P};opacity:.85">2 of 5</span></div>'
           f'<div style="position:absolute;left:16px;right:16px;bottom:16px;color:{P}"><div style="font:600 24px/1.05 Urbanist">{sel[0]}</div><div style="font:400 12.5px Urbanist;opacity:.85;margin-top:4px">{sel[1]}</div>'
           f'<div style="margin-top:14px;height:42px;border-radius:14px;background:{C};color:{M};display:flex;align-items:center;justify-content:center;gap:6px;font:600 13.5px Urbanist">Find company {ARROW(M)}</div></div></div>')
    rest = ''.join(f'<div style="margin-top:{10 if i == 0 else -18}px;position:relative">{card(c, m, 54, False).replace("padding:14px 16px", "padding:10px 16px")}</div>' for i, (c, m) in enumerate(zip([CATS[0]] + CATS[2:], ['black', 'pearl', 'steel', 'mist'])))
    return head('Pick a kind of company') + f'<div style="padding:16px 18px 0">{big}{rest}</div>' + tabs()

# ── Variant C · Swipeable passes (portrait cards in a carousel) ──
def v_passes():
    def pas(c, m, w, h, z):
        _, bg, fg, acc, pat = MAT[m]
        return (f'<div style="flex:none;width:{w}px;height:{h}px;border-radius:22px;background:{bg};overflow:hidden;position:relative;box-shadow:0 14px 30px rgba(24,27,52,{.25 if z else .10})">'
                f'<div style="height:52%;background:url({PH[c[2]]}) center/cover"></div>'
                f'<div style="position:absolute;left:0;right:0;top:52%;bottom:0">{guilloche(pat)}</div>'
                f'<div style="position:relative;padding:12px 14px"><div style="font:600 16px/1.15 Urbanist;color:{fg}">{c[0]}</div><div style="font:400 11.5px Urbanist;color:{fg};opacity:.75;margin-top:4px">{c[1]}</div>'
                f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px"><span style="font:600 12px Urbanist;color:{fg};display:inline-flex;gap:5px;align-items:center">Find company {ARROW(acc)}</span>{logo(11, fg, acc)}</div></div></div>')
    row = f'<div style="display:flex;gap:12px;align-items:center;margin:18px 0 0 -154px">{pas(CATS[0], "pearl", 176, 260, 0)}{pas(CATS[1], "black", 200, 300, 1)}{pas(CATS[2], "gold", 176, 260, 0)}</div>'
    dots = '<div style="display:flex;gap:5px;justify-content:center;margin-top:14px">' + ''.join(f'<i style="width:{16 if i == 1 else 6}px;height:6px;border-radius:3px;background:{M if i == 1 else "#C9CAD6"}"></i>' for i in range(5)) + '</div>'
    return head('Pick a kind of company') + row + dots + tabs()

# ── Variant D · Photo-window cards, half overlapping ──
def v_window():
    out = ''.join(f'<div style="margin-top:{0 if i == 0 else -36}px;position:relative">{card(c, m, 108, False, "window").replace("display:flex;justify-content:space-between;align-items:center", "display:flex;flex-direction:column;align-items:flex-start;gap:4px;max-width:62%", 1).replace("</span></div></div>", f"</span><span style='font:400 11.5px Urbanist;color:{MAT[m][2]};opacity:.75;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:block'>{c[1]}</span></div></div>", 1)}</div>'
                  for i, (c, m) in enumerate(zip(CATS, ORDER)))
    return head('Pick a kind of company') + f'<div style="padding:16px 18px 0">{out}</div>' + tabs()

# ── Variant E · Two-column wallet grid with photo bands ──
def v_grid():
    big = card(CATS[0], 'black', 150, True, 'band').replace('<span style="width:30px', '<span style="display:none;width:30px')
    small = lambda c, m: card(c, m, 112, False, 'band').replace('width:42%', 'width:34%').replace('<span style="width:30px', '<span style="display:none;width:30px').replace('font:600 15px Urbanist', 'font:600 13px/1.2 Urbanist;max-width:72%')
    return (head('Pick a kind of company') + f'<div style="padding:16px 18px 0">{big}</div>'
            f'<div style="padding:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">{small(CATS[1], "gold")}{small(CATS[2], "pearl")}{small(CATS[3], "steel")}{small(CATS[4], "mist")}</div>' + tabs())

VARIANTS = [('A · Engraved stack', 'The Wallet stack you liked, with each card given a real face: fine engraved lines like a banknote, a ringed seal, a small photo, and the logo on the front card.', v_stack),
            ('B · Lift to choose', 'Tap a card and it lifts out of the stack as a large photo card with one button; the others wait below as slim tabs, like choosing a card in a wallet.', v_lifted),
            ('C · Swipe the passes', 'Tall passes you swipe sideways: photo on top, engraved face below. The middle one is raised. Best for discovery.', v_passes),
            ('D · Window cards', 'Each card has a round photo window, like a passport, and overlaps the next. Compact, so all five fit without scrolling.', v_window),
            ('E · Wallet grid', 'One feature card and four smaller cards, each with a photo fading into the card. Everything visible at once.', v_grid)]

def phone(fn):
    return f'<div class="ph"><div class="notch"></div>{fn()}</div>'

closeups = ''.join(f'<div class="cu"><div style="width:288px">{card(c, m, 190)}</div><span><b>{MAT[m][0]}</b> card</span></div>' for c, m in zip(CATS, ORDER))

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:#E4E4EA;font-family:Urbanist,sans-serif;color:{M}}}*{{font-variant-numeric:lining-nums}}
.intro{{padding:36px 40px 6px}}.intro h1{{font:600 36px Urbanist;letter-spacing:-1px;margin:0 0 8px}}.intro p{{margin:0;max-width:84ch;line-height:1.6;color:{MUT};font-size:16px}}
.row{{padding:22px 40px 30px}}.strip{{display:flex;gap:24px;align-items:flex-start;flex-wrap:nowrap}}
.cell{{width:286px;flex:none}}.cell h2{{font:600 16px Urbanist;margin:12px 0 4px}}.cell p{{margin:0;color:{MUT};font-size:13px;line-height:1.45}}
.ph{{width:286px;height:610px;border-radius:40px;border:9px solid #0A0A0A;position:relative;overflow:hidden;background:{P};box-shadow:0 18px 40px rgba(0,0,0,.22);font-size:13px}}
.notch{{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:80px;height:22px;background:#0A0A0A;border-radius:18px;z-index:9}}
.tabs{{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;justify-content:space-around;align-items:center;font:10px Urbanist;padding-bottom:6px;background:{W};border-top:1px solid {LINE};z-index:5}}
h3{{font:600 22px Urbanist;margin:0 0 4px}}.sub{{color:{MUT};margin:0 0 16px;font-size:14.5px}}
.cus{{display:flex;gap:16px}}.cu{{display:flex;flex-direction:column;gap:10px}}.cu span{{font-size:13px;color:{MUT}}}.cu b{{color:{M}}}
'''
link = 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn wallet cards</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body><div class="intro"><h1>Wallet, five more ways</h1>'
        '<p>Five ways to show the categories as cards on Home, then the card faces up close. Every card is a “material” from the approved palette (midnight, champagne, pearl, steel and mist) with fine engraved lines, so it feels like something precious you hold.</p></div>'
        '<div class="row"><div class="strip">' + ''.join(f'<div class="cell">{phone(fn)}<h2>{t}</h2><p>{d}</p></div>' for t, d, fn in VARIANTS) + '</div></div>'
        f'<div class="row"><h3>The card faces</h3><p class="sub">One material per category, so each kind of company has its own card people learn to recognise.</p><div class="cus">{closeups}</div></div>'
        '</body></html>')
(ROOT / 'preview/wallet-variants.html').write_text(html)
print('wrote preview/wallet-variants.html')
