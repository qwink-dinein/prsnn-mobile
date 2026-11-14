"""Generates preview/landing-{a,b,c}.html: three landing-page directions for prsnn. in the
approved palette (porcelain, midnight, champagne), Urbanist + the Outfit logo, and the Wallet
cards. Copy uses only real product facts (no invented reviews, counts or ratings).
Run: python3 scripts/design/landing.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import base64
import wallet_variants as wv

ROOT = wv.ROOT
P, W, M, MUT, C, CD, CM, LINE, DEEP, STEEL = wv.P, wv.W, wv.M, wv.MUT, wv.C, wv.CD, wv.CM, wv.LINE, wv.DEEP, wv.STEEL
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()
PH = {k: img(k) for k in ('coffee', 'evening', 'walks', 'together', 'park', 'cozy', 'events', 'study')}
logo = wv.logo
CATS = wv.CATS
PKG = [(1, 399, None), (2, 699, None), (4, 1299, 'Popular'), (6, 1899, None), (12, 3599, 'Best value')]
MATS = {1: 'pearl', 2: 'mist', 4: 'black', 6: 'steel', 12: 'gold'}
inr = lambda n: f'₹{n:,}'

def ic(d, c=M, w=20, sw=1.7):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
I = dict(id='M3 6h18v12H3zM8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 3a3 3 0 0 1 6 0M14 10h4m-4 3h3', pin='M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
         refund='M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4', alert='M12 3 2 20h20L12 3zm0 6v5m0 3h.01', chat='M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
         photo='M4 7h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', arrow='M5 12h14M13 6l6 6-6 6', check='M5 12.5 10 17l9-10')

TRUST = [('id', 'ID-verified companions', 'Every companion’s ID and photo are checked by our team before they can meet anyone.'),
         ('pin', 'Public places only', 'Cafés, galleries, parks and events. You choose the place when you book.'),
         ('refund', 'Full refund if nobody accepts', 'You pay up front; if no companion confirms in time, every rupee comes back.'),
         ('alert', 'A panic button that reaches us', 'Hold for three seconds during a session and our team is alerted at once, again every five minutes until it is resolved.'),
         ('chat', 'Your number stays private', 'Chat opens once a booking is confirmed, and phone numbers are hidden automatically.'),
         ('photo', 'Photos reviewed by people', 'A real person approves every profile photo before it is shown.')]
STEPS = [('Choose the kind of company', 'New in town, a plan you don’t want to do alone, or an afternoon of focus.'),
         ('Pick a time and a public place', 'Any length from 1 to 12 hours, between 7 AM and 10 PM.'),
         ('Pay, and we confirm a verified companion', 'If nobody accepts in time, you get a full refund automatically.'),
         ('Chat, meet and enjoy', 'Say hello in the app, then meet at the place you chose.')]
FAQ = [('Is this a dating app?', 'No. prsnn is for company: coffee, walks, events, study sessions and plans. Every meeting is in a public place, and conversations stay about the plan.'),
       ('How much does it cost?', 'From ₹399 for one hour, and less per hour for longer bookings. There is no booking fee.'),
       ('What if I need to cancel?', 'Cancel 15 minutes or more before the start and 85% comes back to you. If your companion cancels, you get everything back.'),
       ('Can I book for someone else?', 'Yes. Book company for a parent, a friend or anyone you care about, and add their details at checkout.')]

def btn(label, kind='dark', arrow=True):
    st = {'dark': f'background:{M};color:{P}', 'champ': f'background:{C};color:{M}', 'ghost': f'background:transparent;color:{M};box-shadow:inset 0 0 0 1.5px {M}',
          'ghostlight': f'background:transparent;color:{P};box-shadow:inset 0 0 0 1.5px rgba(241,241,244,.5)'}[kind]
    return f'<a class="btn" style="{st}">{label}{ic(I["arrow"], "currentColor", 18, 2) if arrow else ""}</a>'

def nav(dark=False):
    ink = P if dark else M
    links = ''.join(f'<span>{t}</span>' for t in ['How it works', 'Safety', 'Prices', 'Become a companion'])
    return (f'<nav style="color:{ink}">{logo(26, ink, C if dark else CD)}<div class="links">{links}</div>'
            f'{btn("Get the app", "champ" if dark else "dark", False)}</nav>')

def pkg_card(h, p, tag, w=200, hgt=138):
    _, bg, fg, acc, pat = wv.MAT[MATS[h]]
    pc = C if MATS[h] in ('black', 'steel') else fg
    sub = f'₹{round(p / h)} an hour' + (f' · Save ₹{399 * h - p:,}' if h > 1 else '')
    tg = (f'<span style="font:600 11px Urbanist;padding:4px 10px;border-radius:99px;background:{C if MATS[h] != "gold" else M};color:{M if MATS[h] != "gold" else P}">{tag}</span>' if tag else '')
    return (f'<div style="position:relative;width:{w}px;height:{hgt}px;border-radius:20px;background:{bg};padding:16px 18px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 14px 30px rgba(24,27,52,.14)">'
            f'{wv.guilloche(pat)}<div style="position:relative;display:flex;justify-content:space-between;align-items:center">{logo(13, fg, acc)}{tg}</div>'
            f'<div style="position:relative;margin-top:auto;font:500 13px Urbanist;color:{fg};opacity:.8">{h} {"hour" if h == 1 else "hours"}</div>'
            f'<div style="position:relative;font:700 34px/1 Outfit;letter-spacing:-1px;color:{pc};margin-top:2px">{inr(p)}</div>'
            f'<div style="position:relative;font:500 11.5px Urbanist;color:{fg};opacity:.8;margin-top:6px">{sub}</div></div>')

def cat_card(c, mat, w=250, h=158):
    return f'<div style="width:{w}px">{wv.card(c, mat, h)}</div>'

def phone_home():
    return f'<div class="ph">{wv.v_lifted()}</div>'

# ── shared sections ──
def trust_grid(dark=False):
    fg, sub, bg = (P, '#B9BBCB', 'rgba(241,241,244,.06)') if dark else (M, MUT, W)
    cells = ''.join(f'<div class="tc" style="background:{bg};color:{fg}"><span class="tci" style="background:{"rgba(201,182,142,.16)" if dark else CM}">{ic(I[k], C if dark else CD, 22)}</span>'
                    f'<h4>{t}</h4><p style="color:{sub}">{d}</p></div>' for k, t, d in TRUST)
    return f'<div class="tgrid">{cells}</div>'

def steps():
    return '<ol class="steps">' + ''.join(f'<li><span class="num">{i + 1}</span><h4>{t}</h4><p>{d}</p></li>' for i, (t, d) in enumerate(STEPS)) + '</ol>'

def prices(center=True):
    cards = ''.join(pkg_card(h, p, t) for h, p, t in PKG)
    return (f'<div class="prices">{cards}</div><p class="small" style="text-align:{"center" if center else "left"};margin-top:22px">Any length from 1 to 12 hours. No booking fee. 85% back if you cancel 15 minutes or more before the start, and a full refund if nobody accepts.</p>')

def faq():
    return '<div class="faq">' + ''.join(f'<details open><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ) + '</div>'

def companion_band():
    return (f'<section class="band" style="background:{M};color:{P}"><div class="wrap two">'
            f'<div><h2 style="color:{P}">Earn as a companion, on your terms</h2><p class="lead" style="color:#C9CBD8">Choose the lengths you offer and the hours you are free. You receive 80% of every booking, the same fair price for everyone, and you only meet in public places.</p>'
            f'<div style="display:flex;gap:12px;margin-top:26px">{btn("Become a companion", "champ")}</div></div>'
            f'<div class="earn">' + ''.join(f'<div class="er"><span>{h} {"hour" if h == 1 else "hours"}</span><b>You get {inr(p * 8 // 10)}</b></div>' for h, p, _ in PKG) + '</div></div></section>')

def final_cta(photo='together'):
    return (f'<section class="final" style="background:linear-gradient(90deg,rgba(24,27,52,.92),rgba(24,27,52,.55)),url({PH[photo]}) center/cover"><div class="wrap">'
            f'<h2 style="color:{P};max-width:16ch">Your next plan doesn’t have to be a solo one.</h2>'
            f'<p class="lead" style="color:#D4D5E0">Book a verified companion in a minute, from ₹399.</p><div style="display:flex;gap:12px;margin-top:28px">{btn("Book your first hour", "champ")}{btn("Become a companion", "ghostlight", False)}</div></div></section>')

def footer():
    return (f'<footer><div class="wrap fgrid"><div>{logo(24)}<p class="small" style="margin-top:12px;max-width:34ch">Good company, on your terms. Verified people for coffee, walks, events and plans.</p></div>'
            + ''.join(f'<div><h5>{h}</h5>' + ''.join(f'<span>{l}</span>' for l in ls) + '</div>' for h, ls in [('Product', ['How it works', 'Prices', 'Safety']), ('Companions', ['Become a companion', 'Earnings', 'Guidelines']), ('Company', ['Help', 'Terms', 'Privacy'])])
            + '</div></footer>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:{P};color:{M};font-family:Urbanist,sans-serif;-webkit-font-smoothing:antialiased}}*{{font-variant-numeric:lining-nums}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 40px}}
nav{{max-width:1180px;margin:0 auto;padding:26px 40px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:3}}
nav .links{{display:flex;gap:30px;font:500 15px Urbanist;opacity:.85}}
.btn{{display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 24px;border-radius:16px;font:600 16px Urbanist;text-decoration:none;cursor:pointer}}
h1{{font:600 76px/1.0 Urbanist;letter-spacing:-3px;margin:0}}h2{{font:600 46px/1.05 Urbanist;letter-spacing:-1.6px;margin:0}}
h4{{font:600 18px/1.25 Urbanist;margin:14px 0 6px}}.lead{{font:400 19px/1.55 Urbanist;color:{MUT};max-width:52ch;margin:18px 0 0}}.small{{font:400 14px/1.55 Urbanist;color:{MUT}}}
section{{padding:110px 0}}.sec-head{{max-width:640px;margin-bottom:46px}}.center{{text-align:center;margin-left:auto;margin-right:auto}}
.tgrid{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}}.tc{{border-radius:22px;padding:24px 24px 26px}}header .ph{{transform:translateY(0)}}.tc p{{margin:0;font:400 15px/1.55 Urbanist}}
.tci{{width:46px;height:46px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center}}
.steps{{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}}.steps li{{background:{W};border-radius:22px;padding:24px}}
.steps .num{{font:700 30px Outfit;color:{CD}}}.steps p{{margin:0;color:{MUT};font:400 15px/1.55 Urbanist}}
.prices{{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}}
.faq{{display:grid;grid-template-columns:1fr 1fr;gap:16px}}.faq details{{background:{W};border-radius:20px;padding:22px 24px}}.faq summary{{font:600 18px Urbanist;list-style:none}}.faq p{{margin:10px 0 0;color:{MUT};font:400 15px/1.6 Urbanist}}
.two{{display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:center}}
.earn{{display:flex;flex-direction:column;gap:10px}}.er{{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-radius:16px;background:rgba(241,241,244,.06);font:500 16px Urbanist}}.er b{{font:700 18px Outfit;color:{C}}}
.final{{padding:120px 0}}
footer{{padding:56px 0 64px;border-top:1px solid {LINE}}}.fgrid{{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px}}footer h5{{font:600 14px Urbanist;margin:4px 0 12px}}footer span{{display:block;color:{MUT};font:400 14px/2 Urbanist}}
.ph{{width:300px;height:640px;border-radius:44px;border:10px solid #0A0A0A;position:relative;overflow:hidden;background:{P};box-shadow:0 40px 80px rgba(24,27,52,.30);font-size:13px;flex:none}}
.ph .tabs{{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;justify-content:space-around;align-items:center;font:10px Urbanist;padding-bottom:6px;background:{W};border-top:1px solid {LINE};z-index:5}}
.chips{{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}}.chip{{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:99px;background:{W};font:500 14px Urbanist;box-shadow:inset 0 0 0 1px {LINE}}}
'''
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
def page(title, body):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title>{FONTS}<style>{CSS}</style></head><body>{body}</body></html>'

chip = lambda k, t: f'<span class="chip">{ic(I[k], CD, 16)}{t}</span>'

# ═════ A · The Wallet (product-led: the cards are the hero) ═════
def landing_a():
    stack = ''.join(f'<div style="position:absolute;left:{x}px;top:{y}px;transform:rotate({r}deg)">{cat_card(c, m, 300, 186)}</div>'
                    for (c, m), (x, y, r) in zip([(CATS[2], 'pearl'), (CATS[1], 'gold'), (CATS[0], 'black')], [(150, 0, 7), (70, 120, -4), (0, 250, 3)]))
    hero = (f'<header style="padding:40px 0 100px"><div class="wrap two"><div><h1>Never go<br>alone.</h1>'
            f'<p class="lead">Book a verified companion for coffee, walks, dinners and the plans you’d rather not do solo. Met in public places, confirmed in minutes, from ₹399.</p>'
            f'<div style="display:flex;gap:12px;margin-top:32px">{btn("Book your first hour")}{btn("Become a companion", "ghost", False)}</div>'
            f'<div class="chips">{chip("id", "ID-verified")}{chip("pin", "Public places only")}{chip("refund", "Full refund if nobody accepts")}</div></div>'
            f'<div style="position:relative;height:470px">{stack}</div></div></header>')
    cats = (f'<section style="background:{W}"><div class="wrap"><div class="sec-head"><h2>Five kinds of company</h2><p class="lead">Pick the card that fits your day. Each one opens a list of verified people who enjoy exactly that.</p></div>'
            f'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px">' + ''.join(f'<div>{wv.card(c, m, 210)}</div>' for c, m in zip(CATS, wv.ORDER)) + '</div></div></section>')
    body = (nav() + hero + cats
            + f'<section><div class="wrap"><div class="sec-head"><h2>Booked in four steps</h2></div>{steps()}</div></section>'
            + f'<section style="background:{W}"><div class="wrap"><div class="sec-head center"><h2>One fair price, for everyone</h2><p class="lead center">Longer bookings cost less per hour. What you see is what you pay.</p></div>{prices()}</div></section>'
            + f'<section><div class="wrap"><div class="sec-head"><h2>Safety is the product</h2><p class="lead">Meeting someone new should feel easy. These are built in, not optional.</p></div>{trust_grid()}</div></section>'
            + companion_band() + f'<section><div class="wrap"><div class="sec-head"><h2>Questions</h2></div>{faq()}</div></section>' + final_cta() + footer())
    return page('prsnn · A', body)

# ═════ B · Cinematic (photo-led, like the best travel and hospitality apps) ═════
def landing_b():
    hero = (f'<header style="position:relative;min-height:760px;background:linear-gradient(180deg,rgba(24,27,52,.45),rgba(24,27,52,.15) 40%,rgba(24,27,52,.85)),url({PH["evening"]}) center 35%/cover;color:{P}">'
            f'{nav(True)}<div class="wrap" style="position:absolute;left:0;right:0;bottom:80px"><h1 style="color:{P};font-size:88px;max-width:12ch">Good company, on your terms.</h1>'
            f'<p class="lead" style="color:#E2E3EC">Verified people for the coffee, the gallery, the dinner or the walk you’ve been putting off. From ₹399, met in public places.</p>'
            f'<div style="display:flex;gap:12px;margin-top:30px">{btn("Book your first hour", "champ")}{btn("How it works", "ghostlight", False)}</div></div></header>')
    strip = (f'<div style="background:{M};color:{P}"><div class="wrap" style="display:flex;justify-content:space-between;padding:22px 40px;font:500 15px Urbanist">'
             + ''.join(f'<span style="display:inline-flex;gap:10px;align-items:center">{ic(I[k], C, 18)}{t}</span>' for k, t in [('id', 'ID-verified companions'), ('pin', 'Public places only'), ('refund', 'Full refund if nobody accepts'), ('alert', 'Panic button')]) + '</div></div>')
    manifesto = (f'<section><div class="wrap two"><div><h2>An hour with the right person can change the whole day.</h2></div>'
                 f'<div><p class="lead" style="margin:0">New in a city. A concert you don’t want to miss. A parent who would love an afternoon out. prsnn finds you warm, verified company for exactly that, and keeps it simple, safe and fairly priced.</p></div></div></section>')
    mosaic = (f'<section style="padding-top:0"><div class="wrap" style="display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-template-rows:260px 260px;gap:16px">'
              + ''.join(f'<div style="{span};border-radius:24px;background:url({PH[c[2]]}) center/cover;position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(24,27,52,.8))"></div>'
                        f'<div style="position:absolute;left:22px;bottom:20px;color:{P}"><div style="font:600 24px Urbanist">{c[0]}</div><div style="font:400 14px Urbanist;opacity:.85">{c[1]}</div></div></div>'
                        for c, span in zip(CATS, ['grid-row:span 2', '', '', '', ''])) + '</div></section>')
    body = (hero + strip + manifesto + mosaic
            + f'<section><div class="wrap"><div class="sec-head"><h2>How it works</h2></div>{steps()}</div></section>'
            + f'<section style="background:{W}"><div class="wrap"><div class="sec-head center"><h2>Simple, honest prices</h2><p class="lead center">No booking fee. Longer bookings cost less per hour.</p></div>{prices()}</div></section>'
            + f'<section style="background:{M};color:{P}"><div class="wrap"><div class="sec-head"><h2 style="color:{P}">Built to keep you safe</h2><p class="lead" style="color:#C9CBD8">Every part of prsnn is designed around meeting new people safely.</p></div>{trust_grid(True)}</div></section>'
            + f'<section><div class="wrap"><div class="sec-head"><h2>Questions</h2></div>{faq()}</div></section>' + companion_band() + final_cta('coffee') + footer())
    return page('prsnn · B', body)

# ═════ C · The App (phone-first, like the best fintech and product sites) ═════
def landing_c():
    hero = (f'<header style="padding:30px 0 90px"><div class="wrap two" style="grid-template-columns:1.1fr .9fr"><div>'
            f'<span class="chip" style="margin-bottom:22px">{ic(I["check"], CD, 16, 2.2)}Every companion ID-verified</span>'
            f'<h1 style="margin-top:20px">Book an hour of good company.</h1>'
            f'<p class="lead">Coffee, walks, events, study sessions or plans for someone you love. Choose, pay and chat in one app. If nobody accepts in time, you get a full refund.</p>'
            f'<div style="display:flex;gap:12px;margin-top:32px">{btn("Download for iPhone")}{btn("Get it on Android", "ghost", False)}</div>'
            f'<div style="display:flex;gap:40px;margin-top:44px">' + ''.join(f'<div><div style="font:700 34px Outfit;letter-spacing:-1px">{a}</div><div class="small" style="margin-top:2px">{b}</div></div>'
                                                                         for a, b in [('₹399', 'for your first hour'), ('1–12 h', 'any length you like'), ('₹0', 'booking fee')]) + '</div></div>'
            f'<div style="display:flex;justify-content:center;position:relative">{phone_home()}'
            f'<div style="position:absolute;left:-70px;bottom:-30px;transform:rotate(-4deg)">{pkg_card(4, 1299, "Popular", 210, 130)}</div></div></div></header>')
    feat = lambda title, text, visual, flip=False: (f'<div class="two" style="margin-top:80px">{"" if flip else f"<div>{visual}</div>"}<div><h2 style="font-size:40px">{title}</h2><p class="lead">{text}</p></div>{f"<div>{visual}</div>" if flip else ""}</div>')
    v_cards = f'<div style="display:flex;gap:14px;flex-wrap:wrap">' + ''.join(cat_card(c, m, 260, 150) for c, m in zip(CATS[:4], wv.ORDER[:4])) + '</div>'
    v_prices = f'<div style="display:flex;gap:14px;flex-wrap:wrap">' + ''.join(pkg_card(h, p, t, 236, 136) for h, p, t in PKG[1:]) + '</div>'
    v_safe = f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' + ''.join(f'<div class="tc" style="background:{P}"><span class="tci" style="background:{CM}">{ic(I[k], CD, 22)}</span><h4>{t}</h4></div>' for k, t, _ in TRUST[:4]) + '</div>'
    body = (nav() + hero
            + f'<section style="background:{W}"><div class="wrap">'
            + feat('Pick the kind of company you want', 'Five cards, one for each kind of plan: settling into a new city, an event you’d rather not go to alone, exploring, company for a loved one, or focus time.', v_cards)
            + feat('Know the price before you start', 'One fair price list for everyone, from ₹399 an hour and less per hour for longer bookings. No booking fee, and clear refunds.', v_prices, True)
            + feat('Safety you can see', 'ID checks, public places, a panic button that reaches our team, and chat that hides phone numbers.', v_safe) + '</div></section>'
            + f'<section><div class="wrap"><div class="sec-head"><h2>From “maybe” to meeting in four steps</h2></div>{steps()}</div></section>'
            + companion_band() + f'<section><div class="wrap"><div class="sec-head"><h2>Questions</h2></div>{faq()}</div></section>' + final_cta() + footer())
    return page('prsnn · C', body)

for k, fn in (('a', landing_a), ('b', landing_b), ('c', landing_c)):
    (ROOT / f'preview/landing-{k}.html').write_text(fn())
print('wrote preview/landing-a.html, landing-b.html, landing-c.html')
