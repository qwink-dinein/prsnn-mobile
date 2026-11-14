"""Generates preview/brand-screens.html: the same six app screens in each of the four
brand directions (Hour, Pearl, Two, Club), so the colours can be compared like for like.
Run: python3 scripts/design/brand_screens.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()
PH = {k: img(k) for k in ('coffee', 'evening', 'walks', 'together', 'park', 'cozy')}

FONTS = ('Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400', 'Hanken+Grotesk:wght@400;500;600',
         'Fraunces:opsz,wght,SOFT,WONK@9..144,300,100,1;9..144,400,100,1', 'Schibsted+Grotesk:wght@400;500;600',
         'Urbanist:wght@400;500;600;700', 'Gilda+Display', 'Manrope:wght@400;500;600;700')

PEARL = 'radial-gradient(circle at 34% 30%,#FFFFFF 0%,#F4EEF0 22%,#DCCFD6 55%,#B9A9B7 80%,#9C8E9F 100%)'
def two_dots(size):
    r = size / 2
    return (f'<svg width="{size * 1.6}" height="{size}" viewBox="0 0 {size * 1.6} {size}" style="display:inline-block;overflow:visible"><defs><clipPath id="c{size}"><circle cx="{r}" cy="{r}" r="{r}"/></clipPath></defs>'
            f'<circle cx="{r}" cy="{r}" r="{r}" fill="#A9A2E8"/><circle cx="{size * 1.1}" cy="{r}" r="{r}" fill="#F2BDB6"/><circle cx="{size * 1.1}" cy="{r}" r="{r}" fill="#B98BB8" clip-path="url(#c{size})"/></svg>')

T = {
 'hour': dict(name='Hour', bg='#202328', surface='#2A2D33', fg='#E8E6E1', muted='#8D9097', accent='#C9B68E', on='#202328', line='rgba(201,182,142,.18)',
              sel='rgba(201,182,142,.12)', selb='#C9B68E', save='#C9B68E', disp="italic 400 {s}px/1.12 'Bodoni Moda'", ui="'Hanken Grotesk'", r=14,
              mark=lambda s: f'<span style="font:italic 400 {s}px Bodoni Moda">prsnn</span><i style="display:inline-block;width:{s * .3}px;height:{s * .3}px;background:linear-gradient(135deg,#F3EBD9,#C9B68E 55%,#8C7A55);transform:rotate(45deg);margin-left:{s * .2}px"></i>'),
 'pearl': dict(name='Pearl', bg='#ECE7E4', surface='#F7F3F2', fg='#2A1C2C', muted='#776A73', accent='#4A2E4C', on='#F6F2F1', line='rgba(42,28,44,.1)',
               sel='#E6DBE2', selb='#4A2E4C', save='#4A2E4C', disp="300 {s}px/1.12 Fraunces", ui="'Schibsted Grotesk'", r=16,
               mark=lambda s: f'<span style="font:300 {s}px Fraunces">prsnn</span><i style="display:inline-block;width:{s * .34}px;height:{s * .34}px;border-radius:50%;background:{PEARL};box-shadow:0 2px 5px rgba(42,28,44,.25);margin-left:{s * .1}px"></i>'),
 'two': dict(name='Two', bg='#F1F1F4', surface='#FFFFFF', fg='#181B34', muted='#6B6E85', accent='#181B34', on='#F1F1F4', line='rgba(24,27,52,.08)',
             sel='#EEECFB', selb='#7B72D9', save='#6D63CF', disp="600 {s}px/1.12 Urbanist", ui="Urbanist", r=16,
             mark=lambda s: f'<span style="font:600 {s}px Urbanist;letter-spacing:-.6px">prsnn</span><span style="margin-left:{s * .15}px">{two_dots(round(s * .36))}</span>'),
 'club': dict(name='Club', bg='#E9E6DD', surface='#F4F2EC', fg='#203528', muted='#5D6B60', accent='#203528', on='#EEEAE0', line='rgba(32,53,40,.12)',
              sel='#E0E4DA', selb='#B6935C', save='#8A6A35', disp="400 {s}px/1.12 'Gilda Display'", ui='Manrope', r=12,
              mark=lambda s: f'<span style="font:400 {s}px Gilda Display">prsnn</span><span style="font:400 {s}px Gilda Display;color:#B6935C">.</span>'),
}

def ic(d, c, w=18, sw=1.7):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
BELL = 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4'; BACK = 'M15 5l-7 7 7 7'; CHECK = 'M5 12.5 10 17l9-10'
SHIELD = 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3zM9 12l2 2 4-4'; SEND = 'M4 12 20 4l-6 16-3-7-7-1z'; HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'

def tabs(t, active=0):
    items = ['Home', 'Search', 'Bookings', 'Messages', 'Profile']
    return (f'<div class="tabs" style="border-top:1px solid {t["line"]};background:{t["surface"] if t["bg"] != "#202328" else t["bg"]}">'
            + ''.join(f'<span style="color:{t["fg"] if i == active else t["muted"]};font-weight:{600 if i == active else 400}">{x}</span>' for i, x in enumerate(items)) + '</div>')

def btn(t, label, ghost=False):
    if ghost:
        return f'<div class="btn" style="border-radius:{t["r"]}px;color:{t["fg"]};border:1px solid {t["line"]}">{label}</div>'
    return f'<div class="btn" style="border-radius:{t["r"]}px;background:{t["accent"]};color:{t["on"]}">{label}</div>'

def header(t, title):
    return f'<div class="hdr" style="border-bottom:1px solid {t["line"]}">{ic(BACK, t["fg"], 22)}<span style="font-weight:600;font-size:15px">{title}</span><span style="width:22px"></span></div>'

# ── the six screens ──
def welcome(t):
    return (f'<div style="position:absolute;inset:0;background:url({PH["together"]}) center/cover"></div>'
            '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 30%,rgba(0,0,0,.78) 72%)"></div>'
            f'<div style="position:absolute;top:46px;left:22px;color:#FAF9F6">{t["mark"](24)}</div>'
            f'<div style="position:absolute;left:22px;right:22px;bottom:28px;color:#FAF9F6"><div style="font:{t["disp"].format(s=34)}">Never go alone.</div>'
            f'<div style="font-size:13.5px;opacity:.9;margin:8px 0 18px;line-height:1.45">Book verified people for coffee, walks and evenings out.</div>'
            f'{btn(t, "Get started")}<div class="btn" style="color:#FAF9F6;margin-top:6px">I already have an account</div></div>')

def home(t):
    chips = ['Coffee', 'Walks', 'Events', 'Study']
    ch = ''.join(f'<span class="chip" style="{"background:" + t["accent"] + ";color:" + t["on"] if i == 0 else "border:1px solid " + t["line"] + ";color:" + t["fg"]}">{c}</span>' for i, c in enumerate(chips))
    card = lambda ph, n, s: (f'<div style="flex:1;min-width:0"><div style="height:150px;border-radius:{t["r"]}px;background:url({PH[ph]}) center/cover;position:relative">'
                             f'<span style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:14px;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">{ic(HEART, "#fff", 15)}</span></div>'
                             f'<div style="font-weight:600;font-size:14px;margin-top:7px">{n}</div><div style="font-size:11.5px;color:{t["muted"]}">{s}</div></div>')
    return (f'<div class="top"><span style="display:inline-flex;align-items:center">{t["mark"](21)}</span>{ic(BELL, t["fg"], 20)}</div>'
            f'<div style="padding:16px 18px 0"><div style="font-size:12.5px;color:{t["muted"]}">Good evening, Sam</div><div style="font:{t["disp"].format(s=25)};margin-top:5px">Who would you like to meet this weekend?</div></div>'
            f'<div style="display:flex;gap:7px;padding:14px 18px 0">{ch}</div>'
            f'<div style="margin:14px 18px 0;height:170px;border-radius:{t["r"]}px;background:url({PH["coffee"]}) center/cover;position:relative;overflow:hidden">'
            '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.7))"></div>'
            f'<div style="position:absolute;left:14px;bottom:12px;color:#fff"><div style="font:{t["disp"].format(s=20)}">Maya</div><div style="font-size:11.5px;opacity:.9">Coffee and gallery visits, from ₹399</div></div></div>'
            f'<div style="display:flex;gap:10px;padding:14px 18px 0">{card("walks", "Daniel", "Walks and runs")}{card("cozy", "Leila", "Books and coffee")}</div>{tabs(t)}')

def profile(t):
    pk = [(1, 399, None, None), (2, 699, 350, 99), (4, 1299, 325, 297), (6, 1899, 317, 495)]
    cells = ''
    for h, p, ph, sv in pk:
        on = h == 4
        cells += (f'<div class="pk" style="border-radius:{t["r"]}px;background:{t["sel"] if on else t["surface"]};border:{"1.5px solid " + t["selb"] if on else "1px solid " + t["line"]}">'
                  + (f'<span class="pop" style="background:{t["accent"]};color:{t["on"]}">Popular</span>' if on else '') +
                  f'<div style="font-size:11px;color:{t["muted"]}">{h} {"hour" if h == 1 else "hours"}</div><div style="font-size:19px;font-weight:600;margin-top:2px">₹{p:,}</div>'
                  f'<div style="font-size:10.5px;color:{t["muted"]}">{"₹399 an hour" if not ph else f"₹{ph} an hour"}</div>'
                  + (f'<div style="font-size:10.5px;font-weight:600;color:{t["save"]};margin-top:2px">Save ₹{sv}</div>' if sv else '') + '</div>')
    return (f'<div style="height:196px;background:url({PH["evening"]}) center 30%/cover;position:relative"><span style="position:absolute;top:44px;left:14px;width:34px;height:34px;border-radius:17px;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">{ic(BACK, "#fff", 18)}</span></div>'
            f'<div style="padding:14px 18px 0"><div style="display:flex;align-items:center;gap:8px"><span style="font:{t["disp"].format(s=26)}">Maya</span>'
            f'<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:{t["sel"]};color:{t["fg"]}">{ic(SHIELD, t["fg"], 12)} ID verified</span></div>'
            f'<div style="font-size:12.5px;color:{t["muted"]};margin-top:4px;line-height:1.45">Gallery openings, long coffees and city walks.</div></div>'
            f'<div style="padding:12px 18px 0;font-weight:600;font-size:13.5px">Choose how long</div><div class="grid2">{cells}</div>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:20px">{btn(t, "Continue with 4 hours")}</div>')

def checkout(t):
    rows = [('Companion', 'Maya'), ('Date', 'Saturday, 22 November'), ('Time', '4:00 PM to 8:00 PM'), ('Meeting place', 'Blue Tokai, Banjara Hills'), ('Package', '4 hours')]
    rr = ''.join(f'<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid {t["line"]};font-size:12.5px"><span style="color:{t["muted"]}">{a}</span><span style="font-weight:500;text-align:right">{b}</span></div>' for a, b in rows)
    return (header(t, 'Review and pay') +
            f'<div style="margin:14px 18px 0;padding:4px 14px 10px;border-radius:{t["r"]}px;background:{t["surface"]};border:1px solid {t["line"]}">{rr}'
            f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:12px"><span style="font-weight:600">Total</span><span style="font:{t["disp"].format(s=26)}">₹1,299</span></div>'
            f'<div style="font-size:11px;color:{t["muted"]};margin-top:2px">No booking fee</div></div>'
            f'<div style="margin:12px 18px 0;font-size:12px;color:{t["muted"]};line-height:1.5"><b style="color:{t["fg"]}">Cancellation.</b> 85% back if you cancel 15 minutes or more before the start. A full refund if nobody accepts.</div>'
            f'<div style="margin:14px 18px 0;display:flex;gap:10px;align-items:flex-start;font-size:12px;line-height:1.45"><span style="flex:none;width:20px;height:20px;border-radius:6px;background:{t["accent"]};display:flex;align-items:center;justify-content:center">{ic(CHECK, t["on"], 14, 2.4)}</span>I agree to the booking and refund terms and will meet in a public place.</div>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:20px">{btn(t, "Pay ₹1,299")}</div>')

def chat(t):
    msgs = [('them', 'Hi Sam, looking forward to Saturday!', '10:02'), ('me', 'Same here. Blue Tokai at 4?', '10:04'), ('them', 'Perfect, I’ll grab a table by the window.', '10:05'), ('me', 'Great, see you then.', '10:06')]
    b = ''.join(f'<div class="bub" style="align-self:{"flex-end" if w == "me" else "flex-start"};background:{t["accent"] if w == "me" else t["surface"]};color:{t["on"] if w == "me" else t["fg"]};'
                f'{"" if w == "me" else "border:1px solid " + t["line"] + ";"}border-radius:{t["r"]}px;{"border-bottom-right-radius:4px" if w == "me" else "border-bottom-left-radius:4px"}">{m}<div style="font-size:9.5px;opacity:.6;text-align:right;margin-top:2px">{tm}</div></div>' for w, m, tm in msgs)
    return (f'<div class="hdr" style="border-bottom:1px solid {t["line"]};justify-content:flex-start;gap:10px">{ic(BACK, t["fg"], 22)}<span style="width:32px;height:32px;border-radius:16px;background:url({PH["evening"]}) center/cover"></span>'
            f'<div><div style="font-weight:600;font-size:14px">Maya</div><div style="font-size:10.5px;color:{t["muted"]}">Saturday, 4:00 PM</div></div></div>'
            f'<div style="display:flex;justify-content:center;padding-top:10px"><span style="display:inline-flex;gap:5px;align-items:center;font-size:11px;font-weight:600;padding:5px 10px;border-radius:999px;background:{t["sel"]}">{ic(SHIELD, t["fg"], 12)} Keep it safe, public places only</span></div>'
            f'<div style="display:flex;flex-direction:column;gap:8px;padding:16px 16px 0">{b}</div>'
            f'<div style="position:absolute;left:0;right:0;bottom:0;padding:10px 12px 22px;display:flex;gap:8px;align-items:center;border-top:1px solid {t["line"]};background:{t["surface"] if t["bg"] != "#202328" else t["bg"]}">'
            f'<div style="flex:1;height:40px;border-radius:20px;background:{t["bg"] if t["bg"] != "#202328" else t["surface"]};display:flex;align-items:center;padding:0 14px;font-size:12.5px;color:{t["muted"]}">Type a message</div>'
            f'<span style="width:40px;height:40px;border-radius:20px;background:{t["accent"]};display:flex;align-items:center;justify-content:center">{ic(SEND, t["on"], 17)}</span></div>')

def confirmed(t):
    steps = [('Payment received', '₹1,299 paid', True), ('Maya accepted', 'Chat is open', True), ('Saturday, 4:00 PM', 'Blue Tokai, Banjara Hills', False)]
    st = ''.join(f'<div style="display:flex;gap:12px;align-items:flex-start;padding-bottom:12px"><span style="flex:none;width:22px;height:22px;border-radius:11px;'
                 f'{"background:" + t["accent"] if done else "border:1.5px solid " + t["line"]};display:flex;align-items:center;justify-content:center">{ic(CHECK, t["on"], 13, 2.6) if done else ""}</span>'
                 f'<div><div style="font-weight:600;font-size:13px">{a}</div><div style="font-size:11.5px;color:{t["muted"]}">{b}</div></div></div>' for a, b, done in steps)
    return (f'<div style="padding:62px 24px 0;text-align:center"><div style="width:76px;height:76px;border-radius:38px;margin:0 auto;background:{t["accent"]};display:flex;align-items:center;justify-content:center">{ic(CHECK, t["on"], 38, 2.2)}</div>'
            f'<div style="font:{t["disp"].format(s=27)};margin-top:16px;white-space:nowrap">Booking confirmed</div><div style="font-size:13px;color:{t["muted"]};margin-top:8px;line-height:1.5">Maya will meet you on Saturday. We’ll remind you both at 5 AM that day.</div></div>'
            f'<div style="margin:20px 22px 0;padding:14px 16px 0;border-radius:{t["r"]}px;background:{t["surface"]};border:1px solid {t["line"]}">{st}</div>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:20px;display:flex;flex-direction:column;gap:8px">{btn(t, "Message Maya")}{btn(t, "View booking", ghost=True)}</div>')

SCREENS = [('Welcome', welcome), ('Home', home), ('Companion and prices', profile), ('Review and pay', checkout), ('Chat', chat), ('Booking confirmed', confirmed)]

def phone(t, fn):
    return f'<div class="ph" style="background:{t["bg"]};color:{t["fg"]};font-family:{t["ui"]}"><div class="notch"></div>{fn(t)}</div>'

CSS = '''*{box-sizing:border-box}body{margin:0;background:#CFCDC8;font-family:"Hanken Grotesk",sans-serif;color:#22251F}
.intro{padding:36px 40px 10px}.intro h1{font:italic 400 40px "Bodoni Moda";margin:0 0 8px}.intro p{margin:0;max-width:80ch;line-height:1.55;color:#41463F}
.row{padding:26px 40px 34px}.row h2{font:600 18px "Hanken Grotesk";margin:0 0 4px}.row p{margin:0 0 16px;color:#4A4E47;font-size:14px}
.strip{display:flex;gap:22px}.cell{display:flex;flex-direction:column;gap:8px;align-items:center}.cell span.l{font-size:12.5px;color:#4A4E47}
.ph{width:286px;height:610px;border-radius:40px;border:9px solid #0A0A0A;position:relative;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.28);font-size:13px}
.notch{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:80px;height:22px;background:#0A0A0A;border-radius:18px;z-index:9}
.top{padding:44px 18px 0;display:flex;justify-content:space-between;align-items:center}
.hdr{padding:42px 14px 10px;display:flex;align-items:center;justify-content:space-between}
.btn{height:46px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px}
.chip{font-size:12px;font-weight:500;padding:6px 12px;border-radius:999px}
.tabs{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;justify-content:space-around;align-items:center;font-size:10px;padding-bottom:6px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:9px 18px 0}.pk{padding:10px 11px;position:relative}
.pop{position:absolute;top:-8px;right:8px;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:999px}
.bub{max-width:78%;padding:8px 11px;font-size:12.5px;line-height:1.35}
'''
if __name__ == '__main__':
    NOTE = {'hour': 'Dark graphite with champagne. The most premium; the whole app is in dark mode.',
            'pearl': 'Soft pearl and aubergine. Light, warm and calm.',
            'two': 'Porcelain and midnight with lilac and blush. Light, modern and friendly.',
            'club': 'Linen and racing green with brass. Light and classic; the closest to today.'}
    rows = ''.join(f'<div class="row" style="background:{"#2B2E33" if k == "hour" else "transparent"};{"color:#E8E6E1" if k == "hour" else ""}"><h2>{t["name"]}</h2>'
                   f'<p style="{"color:#A9ACB2" if k == "hour" else ""}">{NOTE[k]}</p><div class="strip">'
                   + ''.join(f'<div class="cell">{phone(t, fn)}<span class="l" style="{"color:#A9ACB2" if k == "hour" else ""}">{lab}</span></div>' for lab, fn in SCREENS) + '</div></div>'
                   for k, t in T.items())
    link = 'https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in FONTS) + '&display=swap'
    html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn screens by colour</title>'
            f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body><div class="intro"><h1>The same six screens in each colour direction</h1>'
            '<p>Welcome, home, a companion with prices, checkout, chat and the confirmation, so you can compare Hour, Pearl, Two and Club on the screens people use every day.</p></div>'
            f'{rows}</body></html>')
    (ROOT / 'preview/brand-screens.html').write_text(html)
    print('wrote preview/brand-screens.html')
