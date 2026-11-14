"""Generates preview/card-systems.html: four card + typography systems for prsnn., in the
approved palette (porcelain, midnight, champagne) with the approved Outfit logo.
Each system shows Home (category cards), Prices (package cards), Bookings (booking card)
and a type specimen. Run: python3 scripts/design/card_systems.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()
PH = {k: img(k) for k in ('walks', 'events', 'park', 'together', 'study', 'evening', 'coffee', 'cozy')}
P, W, M, MUT, C, CD, CM, LINE = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6', 'rgba(24,27,52,.08)'
DEEP = '#E6E6EC'

CATS = [('New in Town', 'Find your feet with a local', 'walks'), ('Don’t Go Alone', 'Events, dinners and plans', 'events'),
        ('Explore & Discover', 'Galleries, markets, trails', 'park'), ('For a Loved One', 'Company for someone you love', 'together'),
        ('Work & Study', 'Focus together, anywhere', 'study')]
PKG = [(1, 399, None), (2, 699, 99), (4, 1299, 297), (6, 1899, 495), (12, 3599, 1189)]
per = lambda h, p: round(p / h)

def logo(s=20, ink=M, dot=CD):
    d = s * .2
    return (f'<span style="display:inline-flex;align-items:baseline;font:700 {s}px/1 Outfit;letter-spacing:-.045em;color:{ink}">prsnn'
            f'<i style="display:inline-block;width:{d}px;height:{d}px;border-radius:50%;background:{dot};margin-left:{s * .045}px"></i></span>')

def ic(d, c, w=18, sw=1.7):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
BELL = 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4'; CHEV = 'M9 5l7 7-7 7'; BACK = 'M15 5l-7 7 7 7'
PIN = 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'; CLOCK = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2'
CHECK = 'M5 12.5 10 17l9-10'

def top(title_html, ui):
    return (f'<div style="padding:44px 18px 0;display:flex;justify-content:space-between;align-items:center">{logo()}{ic(BELL, M, 20)}</div>'
            f'<div style="padding:14px 18px 0">{title_html}</div>')

def tabs():
    return (f'<div class="tabs">' + ''.join(f'<span style="color:{M if i == 0 else MUT};font-weight:{600 if i == 0 else 400}">{t}</span>' for i, t in enumerate(['Home', 'Search', 'Bookings', 'Messages', 'Profile'])) + '</div>')

def prices_head(name_html):
    return (f'<div style="height:150px;background:url({PH["evening"]}) center 30%/cover;position:relative"><span class="circ">{ic(BACK, "#fff", 16)}</span></div>'
            f'<div style="padding:14px 18px 0">{name_html}</div>')

# ═════ 1. Gallery (photo-first, like the best travel and photo apps) ═════
def g_home():
    big = CATS[0]
    tile = lambda c, h: (f'<div style="height:{h}px;border-radius:22px;background:url({PH[c[2]]}) center/cover;position:relative;overflow:hidden">'
                         '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(10,12,24,.72))"></div>'
                         f'<div style="position:absolute;left:12px;right:12px;bottom:10px;color:#fff"><div style="font:600 14.5px/1.15 Urbanist">{c[0]}</div></div></div>')
    return (top(f'<div style="font:400 12.5px Urbanist;color:{MUT}">Good evening, Sam</div><div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px;margin-top:4px">What are you in the mood for?</div>', 'g')
            + (f'<div style="padding:14px 18px 0"><div style="height:176px;border-radius:22px;background:url({PH[big[2]]}) center/cover;position:relative;overflow:hidden">'
               '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(10,12,24,.72))"></div>'
               f'<div style="position:absolute;left:14px;right:14px;bottom:12px;color:#fff"><div style="font:600 20px/1.1 Urbanist">{big[0]}</div><div style="font:400 12px Urbanist;opacity:.88;margin-top:3px">{big[1]}</div></div></div></div>')
            + f'<div style="padding:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">{tile(CATS[1], 128)}{tile(CATS[2], 128)}</div>{tabs()}')

def g_prices():
    cells = ''
    for h, p, sv in PKG[:4]:
        on = h == 4
        cells += (f'<div style="border-radius:20px;padding:14px 14px 12px;background:{M if on else W};color:{P if on else M};{"" if on else "box-shadow:0 1px 2px rgba(24,27,52,.06),0 6px 18px rgba(24,27,52,.05);"}position:relative">'
                  f'<div style="font:600 34px/1 Outfit;letter-spacing:-1px">{h}<span style="font:500 13px Urbanist;letter-spacing:0;margin-left:4px;opacity:.75">{"hour" if h == 1 else "hours"}</span></div>'
                  f'<div style="font:600 16px Urbanist;margin-top:10px">₹{p:,}</div><div style="font:400 11px Urbanist;opacity:.65">₹{per(h, p)} an hour</div>'
                  + (f'<div style="font:600 11px Urbanist;color:{C if on else CD};margin-top:5px">Save ₹{sv}</div>' if sv else '<div style="height:18px"></div>')
                  + (f'<span style="position:absolute;top:12px;right:12px;font:600 10px Urbanist;padding:3px 8px;border-radius:99px;background:{C};color:{M}">Popular</span>' if on else '') + '</div>')
    return (prices_head(f'<div style="font:600 24px Urbanist;letter-spacing:-.4px">Maya</div><div style="font:400 12.5px Urbanist;color:{MUT}">Galleries, long coffees and city walks</div>')
            + f'<div style="padding:12px 18px 0;font:600 14px Urbanist">Choose how long</div><div style="padding:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">{cells}</div>'
            + f'<div class="cta">Continue with 4 hours</div>')

def g_booking():
    return (top(f'<div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px">Your bookings</div>', 'g')
            + f'<div style="margin:14px 18px 0;border-radius:24px;background:{W};overflow:hidden;box-shadow:0 1px 2px rgba(24,27,52,.06),0 10px 26px rgba(24,27,52,.07)">'
            f'<div style="height:150px;background:url({PH["coffee"]}) center/cover;position:relative"><span style="position:absolute;top:12px;left:12px;font:600 11px Urbanist;padding:5px 10px;border-radius:99px;background:rgba(255,255,255,.92)">In 2 days</span></div>'
            f'<div style="padding:14px 16px 16px"><div style="font:600 18px Urbanist">Coffee with Maya</div>'
            f'<div style="display:flex;gap:14px;margin-top:8px;font:400 12.5px Urbanist;color:{MUT}"><span style="display:flex;gap:5px;align-items:center">{ic(CLOCK, MUT, 14)}Sat, 4:00 PM</span><span style="display:flex;gap:5px;align-items:center">{ic(PIN, MUT, 14)}Blue Tokai</span></div>'
            f'<div style="display:flex;gap:8px;margin-top:14px"><span class="pillbtn dark">Message</span><span class="pillbtn">Details</span></div></div></div>'
            + f'<div style="margin:12px 18px 0;padding:14px 16px;border-radius:20px;background:{W};display:flex;align-items:center;gap:12px;box-shadow:0 1px 2px rgba(24,27,52,.05)"><span style="width:44px;height:44px;border-radius:14px;background:url({PH["walks"]}) center/cover"></span><div style="flex:1"><div style="font:600 14px Urbanist">Old town walk with Daniel</div><div style="font:400 11.5px Urbanist;color:{MUT}">Next Friday, 10:00 AM</div></div>{ic(CHEV, MUT, 16)}</div>{tabs()}')

# ═════ 2. Wallet (membership cards, like the best wallet and banking apps) ═════
def w_home():
    tones = [(M, P, C), (C, M, M), (W, M, CD), (DEEP, M, CD), (M, P, C)]
    stack = ''
    for i, (c, (bg, fg, acc)) in enumerate(zip(CATS, tones)):
        last = i == len(CATS) - 1
        stack += (f'<div style="position:relative;margin-top:{0 if i == 0 else -96}px;height:{170}px;border-radius:20px;background:{bg};color:{fg};padding:14px 16px;'
                  f'box-shadow:0 -1px 0 rgba(255,255,255,.4) inset,0 -6px 18px rgba(24,27,52,.10);display:flex;flex-direction:column">'
                  f'<div style="display:flex;justify-content:space-between;align-items:center"><span style="font:600 15px Urbanist">{c[0]}</span><span style="width:26px;height:26px;border-radius:50%;background:url({PH[c[2]]}) center/cover;box-shadow:0 0 0 2px {bg}"></span></div>'
                  + (f'<div style="margin-top:auto;font:400 12px Urbanist;opacity:.8">{c[1]}</div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:6px"><span style="font:600 22px Outfit;letter-spacing:-.5px">24 nearby</span>{logo(14, fg, acc)}</div>' if last else '') + '</div>')
    return (top(f'<div style="font:400 12.5px Urbanist;color:{MUT}">Good evening, Sam</div><div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px;margin-top:4px">Pick a kind of company</div>', 'w')
            + f'<div style="padding:16px 18px 0">{stack}</div>{tabs()}')

def w_prices():
    def card(h, p, sv, on, scale=1):
        bg, fg = (M, P) if on else (W, M)
        return (f'<div style="flex:none;width:{196 * scale}px;height:{124 * scale}px;border-radius:16px;background:{bg};color:{fg};padding:13px 14px;display:flex;flex-direction:column;'
                f'box-shadow:0 10px 24px rgba(24,27,52,{.22 if on else .08});position:relative;overflow:hidden">'
                + (f'<div style="position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;border:1px solid rgba(201,182,142,.35)"></div><div style="position:absolute;right:-6px;top:-6px;width:72px;height:72px;border-radius:50%;border:1px solid rgba(201,182,142,.25)"></div>' if on else '')
                + f'<div style="display:flex;justify-content:space-between;align-items:center">{logo(12, fg, C if on else CD)}<span style="font:500 10.5px Urbanist;opacity:.7">{"Popular" if on else ""}</span></div>'
                f'<div style="margin-top:auto;font:600 30px/1 Outfit;letter-spacing:-1px;color:{C if on else fg}">₹{p:,}</div>'
                f'<div style="display:flex;justify-content:space-between;font:500 11px Urbanist;opacity:.8;margin-top:5px"><span>{h} {"hour" if h == 1 else "hours"}</span><span>{f"Save ₹{sv}" if sv else f"₹{per(h, p)} an hour"}</span></div></div>')
    row = (f'<div style="display:flex;gap:10px;padding:14px 0 0;margin-left:-112px;overflow:visible;align-items:center">{card(2, 699, 99, False, .86)}{card(4, 1299, 297, True)}{card(6, 1899, 495, False, .86)}</div>')
    dots = f'<div style="display:flex;gap:5px;justify-content:center;margin-top:12px">' + ''.join(f'<i style="width:{16 if i == 2 else 6}px;height:6px;border-radius:3px;background:{M if i == 2 else "#C9CAD6"}"></i>' for i in range(5)) + '</div>'
    lines = ''.join(f'<div style="display:flex;justify-content:space-between;padding:9px 0;border-top:1px solid {LINE};font:400 12.5px Urbanist"><span style="color:{MUT}">{a}</span><span style="font-weight:600">{b}</span></div>' for a, b in [('Per hour', '₹325'), ('You save', '₹297 vs hourly'), ('Refund if nobody accepts', 'In full')])
    return (prices_head(f'<div style="font:600 24px Urbanist;letter-spacing:-.4px">Maya</div><div style="font:400 12.5px Urbanist;color:{MUT}">Swipe to choose how long</div>')
            + row + dots + f'<div style="margin:14px 18px 0">{lines}</div><div class="cta">Continue with 4 hours</div>')

def w_booking():
    notch = f'<i style="position:absolute;top:118px;width:18px;height:18px;border-radius:50%;background:{P}"></i>'
    return (top(f'<div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px">Your bookings</div>', 'w')
            + f'<div style="margin:14px 18px 0;border-radius:22px;background:{M};color:{P};position:relative;box-shadow:0 14px 30px rgba(24,27,52,.25)">'
            f'<div style="padding:16px 18px 18px;height:127px"><div style="display:flex;justify-content:space-between;align-items:center">{logo(14, P, C)}<span style="font:500 11px Urbanist;opacity:.7">Booking A6582F</span></div>'
            f'<div style="font:600 34px/1 Outfit;letter-spacing:-1px;margin-top:16px;color:{C}">4:00 PM</div><div style="font:500 12.5px Urbanist;opacity:.85;margin-top:4px">Saturday, 22 November</div></div>'
            f'{notch.replace("position:absolute;", "position:absolute;left:-9px;")}{notch.replace("position:absolute;", "position:absolute;right:-9px;")}'
            f'<div style="border-top:1.5px dashed rgba(241,241,244,.25);margin:0 16px"></div>'
            f'<div style="padding:14px 18px 18px;display:grid;grid-template-columns:1fr 1fr;gap:10px;font:400 11px Urbanist"><div><div style="opacity:.6">With</div><div style="font:600 14px Urbanist;margin-top:2px">Maya</div></div>'
            f'<div><div style="opacity:.6">Where</div><div style="font:600 14px Urbanist;margin-top:2px">Blue Tokai</div></div><div><div style="opacity:.6">Length</div><div style="font:600 14px Urbanist;margin-top:2px">4 hours</div></div>'
            f'<div><div style="opacity:.6">Paid</div><div style="font:600 14px Urbanist;margin-top:2px">₹1,299</div></div></div></div>'
            + f'<div style="margin:12px 18px 0;display:flex;gap:8px"><span class="pillbtn dark" style="flex:1;justify-content:center">Message Maya</span><span class="pillbtn" style="flex:1;justify-content:center">Directions</span></div>{tabs()}')

# ═════ 3. Editorial (quiet lists and hairlines, like the best magazine and menu apps) ═════
SERIF = "'Instrument Serif'"
def e_home():
    rows = ''.join(f'<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid {LINE}"><span style="width:56px;height:56px;border-radius:12px;background:url({PH[c[2]]}) center/cover;flex:none"></span>'
                   f'<div style="flex:1"><div style="font:400 22px/1.05 {SERIF};letter-spacing:-.2px">{c[0]}</div><div style="font:400 12px Urbanist;color:{MUT};margin-top:3px">{c[1]}</div></div>{ic(CHEV, MUT, 15)}</div>' for c in CATS)
    return (top(f'<div style="font:400 36px/1.02 {SERIF};letter-spacing:-.5px">Good company,<br><i>on your terms.</i></div>', 'e')
            + f'<div style="padding:14px 18px 0">{rows}</div>{tabs()}')

def e_prices():
    rows = ''
    for h, p, sv in PKG:
        on = h == 4
        rows += (f'<div style="display:flex;align-items:baseline;gap:8px;padding:12px {12 if on else 0}px;{"background:" + CM + ";border-radius:12px;box-shadow:inset 3px 0 0 " + C + ";" if on else "border-top:1px solid " + LINE + ";"}">'
                 f'<span style="font:400 21px {SERIF}">{h} {"hour" if h == 1 else "hours"}</span>' + (f'<i style="font:italic 400 13px {SERIF};color:{CD}">most chosen</i>' if on else '')
                 + f'<span style="flex:1;border-bottom:1px dotted #C3C4D0;transform:translateY(-4px)"></span><span style="font:600 15px Urbanist">₹{p:,}</span></div>'
                 + (f'<div style="font:400 11px Urbanist;color:{CD};text-align:right;margin:-6px 0 2px">Save ₹{sv}, ₹{per(h, p)} an hour</div>' if sv and on else ''))
    return (prices_head(f'<div style="font:400 30px/1 {SERIF}">Maya</div><div style="font:400 12.5px Urbanist;color:{MUT};margin-top:4px">Galleries, long coffees and city walks</div>')
            + f'<div style="padding:10px 18px 0">{rows}</div><div class="cta">Continue with 4 hours</div>')

def e_booking():
    return (top(f'<div style="font:400 36px/1.02 {SERIF};letter-spacing:-.5px">Coming up</div>', 'e')
            + f'<div style="margin:16px 18px 0;padding:16px 0;border-top:1px solid {M};border-bottom:1px solid {LINE};display:flex;gap:16px">'
            f'<div style="text-align:center;flex:none;width:58px"><div style="font:400 50px/0.9 {SERIF}">22</div><div style="font:500 11px Urbanist;color:{MUT};margin-top:4px">Nov, Sat</div></div>'
            f'<div style="flex:1;border-left:1px solid {LINE};padding-left:16px"><div style="font:400 22px/1.1 {SERIF}">Coffee with Maya</div><div style="font:400 12.5px Urbanist;color:{MUT};margin-top:6px;line-height:1.5">4:00 to 8:00 PM<br>Blue Tokai, Banjara Hills</div>'
            f'<div style="display:flex;gap:16px;margin-top:10px;font:600 12.5px Urbanist"><span style="border-bottom:1px solid {M}">Message</span><span style="border-bottom:1px solid {LINE};color:{MUT}">Details</span></div></div></div>'
            f'<div style="margin:0 18px;padding:14px 0;border-bottom:1px solid {LINE};display:flex;gap:16px;align-items:center"><div style="text-align:center;width:58px"><div style="font:400 34px/0.9 {SERIF};color:{MUT}">28</div><div style="font:500 11px Urbanist;color:{MUT}">Nov, Fri</div></div>'
            f'<div style="flex:1;padding-left:16px;font:400 18px {SERIF};color:{MUT}">Old town walk with Daniel</div></div>{tabs()}')

# ═════ 4. Soft depth (layered tiles, like the best widget and wellbeing apps) ═════
def s_home():
    big = CATS[0]
    small = lambda c, bg, fg: (f'<div style="border-radius:26px;background:{bg};color:{fg};padding:12px;display:flex;flex-direction:column;justify-content:space-between;height:128px">'
                               f'<span style="width:40px;height:40px;border-radius:14px;background:url({PH[c[2]]}) center/cover"></span><div style="font:600 13px/1.15 Urbanist">{c[0]}</div></div>')
    return (top(f'<div style="font:400 12.5px Urbanist;color:{MUT}">Good evening, Sam</div><div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px;margin-top:4px">Who would you like to meet?</div>', 's')
            + f'<div style="padding:14px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">'
            f'<div style="grid-row:span 2;border-radius:26px;background:url({PH[big[2]]}) center/cover;position:relative;overflow:hidden;height:266px"><div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(10,12,24,.7))"></div>'
            f'<div style="position:absolute;left:14px;right:14px;bottom:14px;color:#fff"><div style="font:600 18px/1.1 Urbanist">{big[0]}</div><div style="font:400 11.5px Urbanist;opacity:.85;margin-top:3px">{big[1]}</div></div></div>'
            f'{small(CATS[1], CM, M)}{small(CATS[2], M, P)}</div>'
            f'<div style="padding:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">{small(CATS[3], W, M).replace("height:128px", "height:74px;flex-direction:row;align-items:center;gap:9px;justify-content:flex-start;font-size:12px")}{small(CATS[4], DEEP, M).replace("height:128px", "height:74px;flex-direction:row;align-items:center;gap:9px;justify-content:flex-start;font-size:12px")}</div>{tabs()}')

def s_prices():
    seg = ''.join(f'<span style="flex:1;text-align:center;padding:8px 0;border-radius:12px;font:600 13px Urbanist;{"background:" + W + ";box-shadow:0 2px 8px rgba(24,27,52,.10);color:" + M if h == 4 else "color:" + MUT}">{h}h</span>' for h, _, _ in PKG)
    return (prices_head(f'<div style="font:600 24px Urbanist;letter-spacing:-.4px">Maya</div><div style="font:400 12.5px Urbanist;color:{MUT}">Choose how long</div>')
            + f'<div style="margin:12px 18px 0;padding:4px;border-radius:16px;background:{DEEP};display:flex">{seg}</div>'
            f'<div style="margin:12px 18px 0;border-radius:28px;background:{CM};padding:18px;position:relative">'
            f'<span style="position:absolute;top:16px;right:16px;font:600 10.5px Urbanist;padding:4px 9px;border-radius:99px;background:{C};color:{M}">Popular</span>'
            f'<div style="font:500 13px Urbanist;color:{CD}">4 hours</div><div style="font:600 46px/1 Outfit;letter-spacing:-1.6px;margin-top:6px">₹1,299</div>'
            f'<div style="display:flex;gap:8px;margin-top:12px"><span style="font:600 11.5px Urbanist;padding:6px 10px;border-radius:99px;background:{W}">₹325 an hour</span><span style="font:600 11.5px Urbanist;padding:6px 10px;border-radius:99px;background:{W};color:{CD}">Save ₹297</span></div></div>'
            f'<div style="margin:10px 18px 0;padding:12px 14px;border-radius:20px;background:{W};font:400 12px/1.5 Urbanist;color:{MUT};display:flex;gap:10px;align-items:flex-start">{ic(CHECK, CD, 16, 2.2)}<span>Full refund if nobody accepts. 85% back if you cancel 15 minutes or more before.</span></div>'
            f'<div class="cta">Continue with 4 hours</div>')

def s_booking():
    return (top(f'<div style="font:600 25px/1.12 Urbanist;letter-spacing:-.5px">Your bookings</div>', 's')
            + f'<div style="margin:14px 18px 0;border-radius:28px;background:{M};color:{P};padding:18px">'
            f'<div style="display:flex;align-items:center;gap:10px"><span style="width:42px;height:42px;border-radius:50%;background:url({PH["evening"]}) center/cover;box-shadow:0 0 0 2px {C}"></span><div><div style="font:600 15px Urbanist">Maya</div><div style="font:400 11.5px Urbanist;opacity:.7">Coffee and a gallery</div></div></div>'
            f'<div style="font:500 12px Urbanist;opacity:.7;margin-top:18px">Saturday, 22 November</div><div style="font:600 38px/1 Outfit;letter-spacing:-1.2px;color:{C};margin-top:4px">4:00 PM</div>'
            f'<div style="display:flex;gap:8px;margin-top:16px"><span style="flex:1;text-align:center;padding:11px 0;border-radius:16px;background:{C};color:{M};font:600 13px Urbanist">Message</span><span style="flex:1;text-align:center;padding:11px 0;border-radius:16px;background:rgba(241,241,244,.12);font:600 13px Urbanist">Directions</span></div></div>'
            f'<div style="margin:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px"><div style="border-radius:22px;background:{W};padding:14px"><div style="font:500 11px Urbanist;color:{MUT}">Where</div><div style="font:600 14px Urbanist;margin-top:4px">Blue Tokai</div><div style="font:400 11px Urbanist;color:{MUT}">Banjara Hills</div></div>'
            f'<div style="border-radius:22px;background:{CM};padding:14px"><div style="font:500 11px Urbanist;color:{CD}">Starts in</div><div style="font:600 24px/1 Outfit;margin-top:4px">2 days</div></div></div>{tabs()}')

SYSTEMS = [
  dict(name='Gallery', insp='The best travel and photo apps', note='Photo-first. Categories are big, edge-to-edge photos with the name on the image; prices are bold numeral cards where the chosen one turns midnight; bookings lead with the place.',
       screens=[g_home, g_prices, g_booking], type=('Urbanist', 'Urbanist', 'Outfit numerals')),
  dict(name='Wallet', insp='The best wallet and banking apps', note='Everything is a card you hold. Categories stack like cards in a wallet, each package is a membership card you swipe through, and a booking is a ticket with a tear line.',
       screens=[w_home, w_prices, w_booking], type=('Urbanist', 'Urbanist', 'Outfit numerals')),
  dict(name='Editorial', insp='The best magazine and restaurant apps', note='Quiet and confident: hairlines instead of boxes, an elegant serif for names, prices set like a menu with dotted leaders, and dates as large numerals.',
       screens=[e_home, e_prices, e_booking], type=('Instrument Serif', 'Urbanist', 'Urbanist numerals')),
  dict(name='Soft depth', insp='The best widget and wellbeing apps', note='Soft layered tiles with generous rounding. Categories form a bento of photo and tinted tiles, prices are one large hero card with a duration switch, and the booking is a widget with a countdown.',
       screens=[s_home, s_prices, s_booking], type=('Urbanist', 'Urbanist', 'Outfit numerals')), ]

def phone(fn):
    return f'<div class="ph"><div class="notch"></div>{fn()}</div>'

def specimen(sys_):
    d, t, n = sys_['type']
    disp = f"font:400 30px/1.05 'Instrument Serif'" if d == 'Instrument Serif' else 'font:600 26px/1.1 Urbanist;letter-spacing:-.5px'
    num = 'font:600 32px/1 Outfit;letter-spacing:-1px' if 'Outfit' in n else 'font:600 28px/1 Urbanist;letter-spacing:-.6px'
    return (f'<div class="spec"><div style="{disp}">Never go alone.</div><div style="font:600 16px Urbanist;margin-top:10px">Choose how long</div>'
            f'<div style="font:400 13.5px/1.55 Urbanist;color:{MUT};margin-top:4px;max-width:30ch">Verified people for coffee, walks and evenings out, met in public places.</div>'
            f'<div style="{num};margin-top:12px">₹1,299</div><div class="fn">{(d + " for titles, " + t + " for text") if d != t else (d + " for titles and text")}, {n} for prices and times.</div></div>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:#E4E4EA;font-family:Urbanist,sans-serif;color:{M}}}*{{font-variant-numeric:lining-nums}}
.intro{{padding:36px 40px 6px}}.intro h1{{font:600 36px Urbanist;letter-spacing:-1px;margin:0 0 8px}}.intro p{{margin:0;max-width:80ch;line-height:1.6;color:{MUT};font-size:16px}}
.row{{padding:24px 40px 30px}}.row h2{{font:600 22px Urbanist;margin:0}}.row h2 small{{font:500 14px Urbanist;color:{MUT};margin-left:10px}}.row p.n{{margin:6px 0 16px;color:#4C4F66;font-size:14.5px;max-width:90ch;line-height:1.5}}
.strip{{display:flex;gap:22px;align-items:flex-start}}
.ph{{width:286px;height:610px;border-radius:40px;border:9px solid #0A0A0A;position:relative;overflow:hidden;background:{P};box-shadow:0 18px 40px rgba(0,0,0,.22);font-size:13px;flex:none}}
.notch{{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:80px;height:22px;background:#0A0A0A;border-radius:18px;z-index:9}}
.tabs{{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;justify-content:space-around;align-items:center;font:10px Urbanist;padding-bottom:6px;background:{W};border-top:1px solid {LINE}}}
.circ{{position:absolute;top:42px;left:14px;width:32px;height:32px;border-radius:16px;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center}}
.cta{{position:absolute;left:18px;right:18px;bottom:20px;height:48px;border-radius:16px;background:{M};color:{P};display:flex;align-items:center;justify-content:center;font:600 14px Urbanist}}
.pillbtn{{display:inline-flex;align-items:center;padding:9px 14px;border-radius:99px;font:600 12.5px Urbanist;background:{W};color:{M};white-space:nowrap;box-shadow:inset 0 0 0 1px {LINE}}}.pillbtn.dark{{background:{M};color:{P}}}
.spec{{width:300px;flex:none;background:{W};border-radius:24px;padding:22px}}.fn{{font-size:12px;color:{MUT};margin-top:12px;line-height:1.45}}
'''
link = 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@600;700&family=Instrument+Serif:ital@0;1&display=swap'
rows = ''.join(f'<div class="row"><h2>{s["name"]}<small>inspired by {s["insp"].lower()}</small></h2><p class="n">{s["note"]}</p><div class="strip">'
               + ''.join(phone(fn) for fn in s['screens']) + specimen(s) + '</div></div>' for s in SYSTEMS)
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn card systems</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body><div class="intro"><h1>Cards and type, four ways</h1>'
        '<p>The same three screens (Home with categories, choosing a package, and a booking) designed four ways, in the approved palette with the approved logo. Each is inspired by a family of the world’s best-designed apps.</p></div>'
        f'{rows}</body></html>')
(ROOT / 'preview/card-systems.html').write_text(html)
print('wrote preview/card-systems.html')
