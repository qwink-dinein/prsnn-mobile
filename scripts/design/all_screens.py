"""Generates preview/all-screens.html: every screen of the app in the approved new look
(porcelain / midnight / champagne, Urbanist + Outfit logo, Wallet cards), with sharper,
honest copy. UI only: every screen keeps the features it has today.
Run: python3 scripts/design/all_screens.py"""
import base64, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import wallet_variants as wv

ROOT = wv.ROOT
P, W, M, MUT, C, CD, CM, LINE, DEEP, STEEL = wv.P, wv.W, wv.M, wv.MUT, wv.C, wv.CD, wv.CM, wv.LINE, wv.DEEP, wv.STEEL
RED, REDS, GREEN = '#B3261E', '#F9E3E1', '#2E7D4F'
IMGS = ('coffee', 'evening', 'walks', 'together', 'park', 'cozy', 'events', 'study')
DATA = {k: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{k}.jpg').read_bytes()).decode() for k in IMGS}
for k in IMGS:  # wallet_variants inlines photos; point it at CSS variables instead (one copy of each photo)
    wv.PH[k] = f'IMG_{k}'
img = lambda k: f'var(--{k})'
logo = wv.logo
inr = lambda n: f'₹{n:,}'
PRICES = {1: 399, 2: 699, 3: 999, 4: 1299, 5: 1599, 6: 1899, 7: 2199, 8: 2499, 9: 2799, 10: 3099, 11: 3349, 12: 3599}

PATHS = dict(
  back='M15 5l-7 7 7 7', bell='M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4', chev='M9 5l7 7-7 7', search='M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4',
  shield='M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3zM9 12l2 2 4-4', pin='M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2', check='M5 12.5 10 17l9-10', heart='M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  send='M4 12 20 4l-6 16-3-7-7-1z', down='M6 9l6 6 6-6', user='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0', lock='M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  cam='M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', id='M3 6h18v12H3zM8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 3a3 3 0 0 1 6 0M14 10h4m-4 3h3',
  wallet='M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4V7zm0 0V6a1 1 0 0 1 1-1h11M16 13h.01', chart='M4 20V10m6 10V4m6 16v-7m4 7H3', help='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-2.5-11.5a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 4m0 2.7v.1',
  doc='M7 3h7l5 5v13H7zM14 3v5h5', logout='M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10', trash='M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13', flag='M5 21V4m0 0h11l-2 4 2 4H5',
  alert='M12 3 2 20h20L12 3zm0 6v5m0 3h.01', refund='M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4', chat='M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  phone='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2', users='M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a5 5 0 0 0-3-4.6',
  edit='M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4', rupee='M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7', megaphone='M4 10v4h3l7 4V6L7 10H4zm14-1a4 4 0 0 1 0 6',
  list='M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', plus='M12 5v14M5 12h14', star='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  mail='M4 6h16v12H4zM4 7l8 6 8-6', globe='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  cal='M5 6h14v14H5zM5 10h14M9 4v4m6-4v4', map='M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zm0 0v14m6-12v14', x='M6 6l12 12M18 6 6 18', filter='M4 6h16M7 12h10M10 18h4')
def ic(n, c=M, w=18, sw=1.8):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="{PATHS[n]}"/></svg>'

# ───────── building blocks ─────────
def top(bell=True, dark=False):
    ink = P if dark else M
    return f'<div class="top">{logo(21, ink, C if dark else CD)}' + (f'<span class="ibtn">{ic("bell", ink, 19)}<i class="dot"></i></span>' if bell else '') + '</div>'
def bar(title='', right=''):
    return f'<div class="bar"><span class="circ">{ic("back", M, 16, 2)}</span><span class="bt">{title}</span><span class="br">{right}</span></div>'
def h(title, sub=None, size=24, pad='12px 18px 0'):
    return f'<div style="padding:{pad}"><div class="h" style="font-size:{size}px">{title}</div>' + (f'<div class="sub">{sub}</div>' if sub else '') + '</div>'
def btn(label, kind='dark', ic_=None, full=True, small=False):
    cls = {'dark': 'b-dark', 'champ': 'b-champ', 'ghost': 'b-ghost', 'danger': 'b-danger', 'soft': 'b-soft', 'red': 'b-red'}[kind]
    return f'<div class="btn {cls}{" sm" if small else ""}" style="{"" if full else "display:inline-flex;width:auto;padding:0 16px"}">{ic(ic_, "currentColor", 17, 2) if ic_ else ""}{label}</div>'
def foot(*btns):
    return '<div class="foot">' + ''.join(btns) + '</div>'
def body(html, pad='0 18px'):
    return f'<div style="padding:{pad}">{html}</div>'
def card(html, bg=W, pad='14px 16px', mt=10, extra=''):
    return f'<div class="card" style="background:{bg};padding:{pad};margin-top:{mt}px;{extra}">{html}</div>'
def row(icon, label, value='', danger=False, last=False, chevron=True):
    col = RED if danger else M
    return (f'<div class="row{" last" if last else ""}"><span class="rico" style="background:{REDS if danger else CM}">{ic(icon, RED if danger else CD, 16)}</span>'
            f'<span style="flex:1;color:{col};font-weight:500">{label}</span>' + (f'<span class="rv">{value}</span>' if value else '') + (ic('chev', MUT, 14) if chevron else '') + '</div>')
def group(*rows_):
    return f'<div class="group">{"".join(rows_)}</div>'
def label(t, mt=14):
    return f'<div class="lab" style="margin-top:{mt}px">{t}</div>'
def field(lab, val='', hint=None, ph=False, on=False, mt=12, tall=False):
    return (f'<div style="margin-top:{mt}px"><div class="flab">{lab}</div><div class="field{" on" if on else ""}" style="{"height:84px;align-items:flex-start;padding-top:12px" if tall else ""}">'
            f'<span style="{"color:" + MUT if ph else ""}">{val}</span></div>' + (f'<div class="hint">{hint}</div>' if hint else '') + '</div>')
def chips(items, on=(), mt=10, wrap=True):
    return f'<div class="chips" style="margin-top:{mt}px;{"flex-wrap:wrap" if wrap else "flex-wrap:nowrap;overflow:hidden"}">' + ''.join(f'<span class="chip{" on" if i in on or t in on else ""}">{t}</span>' for i, t in enumerate(items)) + '</div>'
def pill(t, tone='champ'):
    st = {'champ': f'background:{CM};color:{CD}', 'dark': f'background:{M};color:{P}', 'green': 'background:#E3F1E8;color:#2E7D4F', 'red': f'background:{REDS};color:{RED}', 'grey': f'background:{DEEP};color:{MUT}', 'gold': f'background:{C};color:{M}'}[tone]
    return f'<span class="pill" style="{st}">{t}</span>'
def notice(t, tone='champ', icon='shield'):
    bg, fg = {'champ': (CM, CD), 'red': (REDS, RED), 'dark': (M, P), 'grey': (DEEP, MUT)}[tone]
    return f'<div class="notice" style="background:{bg};color:{fg if tone != "grey" else M}">{ic(icon, fg, 16)}<span>{t}</span></div>'
def seg(items, on=0):
    return '<div class="seg">' + ''.join(f'<span class="{"on" if i == on else ""}">{t}</span>' for i, t in enumerate(items)) + '</div>'
def tabs(active=0, companion=False):
    names = ['Dashboard', 'Search', 'Requests', 'Messages', 'Profile'] if companion else ['Home', 'Search', 'Bookings', 'Messages', 'Profile']
    icons = ['chart' if companion else 'map', 'search', 'cal', 'chat', 'user']
    return '<div class="tabs">' + ''.join(f'<span style="color:{M if i == active else MUT};font-weight:{600 if i == active else 500}">{ic(icons[i], M if i == active else MUT, 19)}{n}</span>' for i, n in enumerate(names)) + '</div>'
def avatar(k, s=44, ring=False):
    return f'<span class="av" style="width:{s}px;height:{s}px;background:{img(k)} center/cover;{"box-shadow:0 0 0 2px " + W + ",0 0 0 3.5px " + C if ring else ""}"></span>'
def photo(k, hgt, radius=20, extra='', inner=''):
    return f'<div style="height:{hgt}px;border-radius:{radius}px;background:{img(k)} center/cover;position:relative;overflow:hidden;{extra}">{inner}</div>'
def shade(op=.75):
    return f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(24,27,52,{op}))"></div>'
def checkbox(on=True, txt=''):
    return f'<div style="display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-size:12.5px;line-height:1.45"><span class="cb{" on" if on else ""}">{ic("check", P, 13, 2.6) if on else ""}</span><span>{txt}</span></div>'
def stat(v, l, tone=None):
    return f'<div class="stat"><div class="sv" style="{"color:" + tone if tone else ""}">{v}</div><div class="sl">{l}</div></div>'
def keypad():
    keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']
    return '<div class="keys">' + ''.join(f'<span class="{"k" if k else "kx"}">{k}</span>' for k in keys) + '</div>'
def timeline(steps):
    return '<div class="tl">' + ''.join(f'<div class="ts"><span class="tdot{" done" if d else (" now" if d is None else "")}">{ic("check", P, 12, 2.8) if d else ""}</span><div><div class="tt">{a}</div><div class="td">{b}</div></div></div>' for a, b, d in steps) + '</div>'

# Price card (lifted) and tabs, matching the approved Wallet style
MATS = {1: 'pearl', 2: 'mist', 3: 'pearl', 4: 'black', 5: 'mist', 6: 'steel', 7: 'pearl', 8: 'mist', 9: 'pearl', 10: 'mist', 11: 'pearl', 12: 'gold'}
TAG = {4: 'Popular', 12: 'Best value'}
def price_card(h_, hgt=168, companion=False):
    p = PRICES[h_]; _, bg, fg, acc, pat = wv.MAT[MATS[h_]]; dark = MATS[h_] in ('black', 'steel')
    sub = f'You get {inr(p * 8 // 10)}' if companion else f'{inr(round(p / h_))} an hour' + (f' &nbsp;·&nbsp; Save {inr(399 * h_ - p)}' if h_ > 1 else '')
    tag = f'<span class="pill" style="background:{C if MATS[h_] != "gold" else M};color:{M if MATS[h_] != "gold" else P}">{TAG[h_]}</span>' if h_ in TAG else '<span></span>'
    return (f'<div class="wcard" style="height:{hgt}px;background:{bg}">{wv.guilloche(pat)}<div class="wr">{logo(12, fg, acc)}{tag}</div>'
            f'<div class="wr" style="margin-top:auto;display:block;color:{fg}"><div style="font:500 12.5px Urbanist;opacity:.8">{h_} {"hour" if h_ == 1 else "hours"}</div>'
            f'<div style="font:700 38px/1 Outfit;letter-spacing:-1.4px;color:{C if dark else fg};margin-top:2px">{inr(p)}</div><div style="font:500 12px Urbanist;opacity:.85;margin-top:6px">{sub}</div></div></div>')
def price_tab(h_, right=None):
    p = PRICES[h_]; _, bg, fg, acc, pat = wv.MAT[MATS[h_]]
    return (f'<div class="wtab" style="background:{bg};color:{fg}">{wv.guilloche(pat)}<div class="wr"><span style="font:600 14px Urbanist">{h_} {"hour" if h_ == 1 else "hours"}'
            + (f'<span style="font:500 10.5px Urbanist;opacity:.7;margin-left:7px">{TAG[h_]}</span>' if h_ in TAG else '') + f'</span><span style="font:700 14.5px Outfit">{right or inr(p)}</span></div></div>')
def stack(items, step=-16):
    return ''.join(f'<div style="position:relative;margin-top:{8 if i == 0 else step}px">{t}</div>' for i, t in enumerate(items))

# ═════════════ GET STARTED ═════════════
def s_splash():
    return (f'<div style="position:absolute;inset:0;background:{M}"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">'
            f'{logo(46, P, C)}<div style="font:500 14px Urbanist;color:#B9BBCB">Good company, on your terms.</div></div>')
def s_welcome():
    return (f'<div style="position:absolute;inset:0;background:{img("together")} center/cover"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,52,.35),rgba(24,27,52,0) 30%,rgba(24,27,52,.92) 70%)"></div>'
            f'<div style="position:absolute;top:46px;left:20px">{logo(24, P, C)}</div>'
            f'<div style="position:absolute;left:20px;right:20px;bottom:24px;color:{P}"><div style="font:600 36px/1.02 Urbanist;letter-spacing:-1.2px">Never go<br>alone.</div>'
            f'<div style="font:400 13.5px/1.5 Urbanist;opacity:.9;margin:10px 0 14px">Meet ID-verified people for coffee, walks, events and plans. Always in public places, from ₹399.</div>'
            f'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">' + ''.join(f'<span class="glass">{ic(i, C, 13)}{t}</span>' for i, t in [('shield', 'ID-verified'), ('pin', 'Public places'), ('refund', 'Full refund if nobody accepts')]) + '</div>'
            f'{btn("Get started", "champ")}<div class="btn" style="color:{P};margin-top:4px">I already have an account</div></div>')
def s_role():
    tile = lambda k, t, s, on: (f'<div style="margin-top:12px;border-radius:22px;overflow:hidden;position:relative;height:178px;background:{img(k)} center/cover;{"box-shadow:0 0 0 3px " + C if on else ""}">{shade(.85)}'
                                f'<div style="position:absolute;left:16px;right:16px;bottom:14px;color:{P}"><div style="font:600 19px Urbanist">{t}</div><div style="font:400 12px/1.4 Urbanist;opacity:.88;margin-top:3px">{s}</div></div>'
                                + (f'<span style="position:absolute;top:12px;right:12px" class="cb on">{ic("check", M, 13, 2.6)}</span>' if on else '') + '</div>')
    return (top(False) + h('I’m here to…', 'Tap one to continue. You can switch later.') + body(tile('coffee', 'Find a companion', 'Book ID-verified people for coffee, walks, events and plans.', True)
            + tile('evening', 'Earn as a companion', 'Spend time with people, choose your hours and keep 80% of every booking.', False)))
def s_login():
    return (f'<div style="height:210px;background:{img("park")} center/cover;position:relative">{shade(.7)}<div style="position:absolute;top:44px;left:18px">{logo(22, P, C)}</div>'
            f'<div style="position:absolute;left:18px;bottom:30px;color:{P}"><div style="font:600 22px Urbanist">Welcome to prsnn.</div><div style="font:400 12.5px Urbanist;opacity:.9">Log in or sign up in seconds.</div></div></div>'
            f'<div class="sheet">' + field('Mobile number', '🇮🇳 +91 &nbsp;98765 43210', 'Your number is never shown to anyone. We’ll send a 6-digit code on WhatsApp.', on=True, mt=0)
            + f'<div style="margin-top:14px">{btn("Send code")}</div><div style="margin-top:8px">{btn("Log in with PIN · +91 98765 43210", "ghost", "lock")}</div>'
            + f'<div class="or">or</div>{btn("Not in India? Continue with email", "soft", "mail")}'
            + f'<div class="fine">By continuing you agree to the <u>Terms</u> and <u>Privacy Policy</u>.</div></div>')
def s_otp():
    boxes = ''.join(f'<span class="ob{" f" if d else ""}">{d}</span>' for d in ['4', '8', '2', '6', '', ''])
    return (bar() + h('Enter the code', 'Sent on WhatsApp to +91 98765 43210') + body(f'<div class="obs">{boxes}</div><div class="sub" style="margin-top:14px">Resend on WhatsApp in 0:24</div>'
            f'<div style="margin-top:6px;font:600 13px Urbanist;color:{CD}">Send by SMS instead</div>') + foot(btn('Verify')))
def s_email():
    return (bar() + h('Visiting India?', 'Sign up with your email. We’ll email you a 6-digit code; no password needed.') + body(field('Email', 'name@example.com', ph=True, on=True)
            + notice('You’ll add a mobile number with your country code after this, so companions can reach you safely.', 'grey', 'phone')) + foot(btn('Email me a code')))
def s_pin_set():
    boxes = ''.join(f'<span class="pb{" f" if i < 2 else ""}">{"•" if i < 2 else ""}</span>' for i in range(4))
    return (bar('', '<span style="font:600 13px Urbanist;color:' + MUT + '">Skip</span>') + f'<div style="text-align:center;padding-top:10px"><span class="lockb">{ic("lock", P, 24)}</span>'
            f'<div class="h" style="font-size:22px;margin-top:12px">Choose a 4-digit PIN</div><div class="sub" style="padding:0 30px">Next time, open prsnn with your PIN instead of waiting for a code.</div><div class="pbs">{boxes}</div></div>{keypad()}')
def s_pin_login():
    boxes = ''.join('<span class="pb"></span>' for _ in range(4))
    return (f'<div style="text-align:center;padding-top:62px">{logo(24)}<div class="h" style="font-size:22px;margin-top:18px">Welcome back</div><div class="sub">+91 98765 43210</div><div class="pbs">{boxes}</div></div>{keypad()}'
            f'<div style="text-align:center;margin-top:10px;font:600 13px Urbanist;color:{CD}">Forgot PIN? Reset it with a code</div><div style="text-align:center;margin-top:8px;font:500 12px Urbanist;color:{MUT}">Not you? Log in with another number</div>')
def setup_head(step, total=7):
    return (bar() + f'<div style="padding:4px 18px 0;display:flex;gap:4px">' + ''.join(f'<i style="flex:1;height:4px;border-radius:2px;background:{M if i < step else "#D5D6DF"}"></i>' for i in range(total)) + '</div>'
            f'<div style="padding:10px 18px 0;font:600 11.5px Urbanist;color:{CD}">Step {step} of {total}</div>')
def s_setup_name():
    return (setup_head(1) + h('What should we call you?', 'Companions only see your first name.', pad='4px 18px 0') + body(field('Full name', 'Sam Rivera', on=True)) + foot(btn('Next')))
def s_setup_help():
    cats = [(c[0], c[1], c[2]) for c in wv.CATS]
    tiles = ''.join(f'<div class="ctile{" on" if i in (0, 1) else ""}"><span class="av" style="width:40px;height:40px;border-radius:12px;background:{img(k)} center/cover"></span><div style="flex:1"><div style="font:600 14px Urbanist">{t}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div><span class="cb{" on" if i in (0, 1) else ""}">{ic("check", P, 12, 2.6) if i in (0, 1) else ""}</span></div>' for i, (t, s, k) in enumerate(cats))
    return setup_head(2) + h('What can we help you with?', 'Tap all that fit. Home opens on them.', pad='4px 18px 0') + body(tiles) + foot(btn('Next'))
def s_setup_meet():
    opts = [('Women companions', True), ('Men companions', False), ('Non-binary companions', False)]
    rows_ = ''.join(f'<div class="opt{" on" if on else ""}"><span>{t}</span><span class="rd{" on" if on else ""}"></span></div>' for t, on in opts)
    return (setup_head(4) + h('Who would you like to meet?', 'Only these companions are shown to you. Change it any time in Privacy.', pad='4px 18px 0') + body(rows_)
            + body(notice('Choosing is instant: tap one and we move on.', 'grey', 'check')))
def s_setup_photo():
    tips = ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:7px;font-size:12.5px">{ic("check", CD, 14, 2.4)}{t}</div>' for t in ['Your face clearly visible, no sunglasses or filters', 'Just you in the photo', 'Good light: daylight or a bright room'])
    return (setup_head(6) + h('Add a clear photo of you', 'Our team approves every photo. You can keep using prsnn while it’s reviewed.', pad='4px 18px 0')
            + body(f'<div style="margin:18px auto 0;width:132px;height:132px;border-radius:50%;border:2px dashed {C};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:{CD};font:600 13px Urbanist;background:{CM}">{ic("cam", CD, 26)}Add photo</div>{tips}')
            + foot(btn('Continue')))
def s_setup_where():
    return (setup_head(7) + h('Where are you?', 'We show companions and popular plans near you.', pad='4px 18px 0')
            + body(field('State', 'Telangana') + field('City', 'Hyderabad') + field('Area', 'Search by area or PIN code', ph=True, on=True)
                   + card(''.join(f'<div class="lrow">{ic("pin", CD, 15)}<span>{a}</span><span class="rv">{b}</span></div>' for a, b in [('Gachibowli', '500032'), ('Banjara Hills', '500034'), ('Jubilee Hills', '500033')]), mt=8, pad='4px 14px')))

# ═════════════ MEMBER ═════════════
def s_home():
    big = wv.CATS[1]
    hero = (f'<div style="position:relative;height:214px;border-radius:24px;overflow:hidden;background:{img(big[2])} center/cover;box-shadow:0 16px 34px rgba(24,27,52,.28)">'
            f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,52,.05) 30%,rgba(24,27,52,.92))"></div>'
            f'<div style="position:absolute;top:14px;left:16px;right:16px;display:flex;justify-content:space-between">{logo(12, P, C)}<span style="font:500 11px Urbanist;color:{P};opacity:.85">2 of 5</span></div>'
            f'<div style="position:absolute;left:16px;right:16px;bottom:14px;color:{P}"><div style="font:600 23px/1.05 Urbanist">{big[0]}</div><div style="font:400 12px Urbanist;opacity:.85;margin-top:3px">{big[1]}</div>'
            f'<div style="margin-top:12px;height:40px;border-radius:14px;background:{C};color:{M};display:flex;align-items:center;justify-content:center;font:600 13.5px Urbanist">Find company →</div></div></div>')
    rest = ''.join(f'<div style="margin-top:{10 if i == 0 else -16}px;position:relative">{wv.card(c, m, 52, False).replace("padding:14px 16px", "padding:9px 16px")}</div>'
                   for i, (c, m) in enumerate(zip([wv.CATS[0]] + wv.CATS[2:], ['black', 'pearl', 'steel', 'mist'])))
    return (top() + h('Good evening, Sam', None, 13, '12px 18px 0').replace('class="h"', 'class="sub" style="margin:0"') + h('Who would you like to meet?', None, 23, '2px 18px 0')
            + body(hero + rest, '12px 18px 0') + body(notice('Every companion is ID-checked. Meet in public places, with a panic button on during every session.', 'champ', 'shield'), '12px 18px 0') + tabs(0))
def s_home_more():
    plans = ''.join(f'<div style="flex:none;width:150px">{photo(k, 92, 16)}<div style="font:600 13px Urbanist;margin-top:6px">{t}</div><div style="font:400 11px Urbanist;color:{MUT}">{s}</div></div>'
                    for k, t, s in [('walks', 'Heritage walk', '4 hours · from ₹1,299'), ('events', 'Live music night', '3 hours · from ₹999')])
    near = ''.join(f'<div style="flex:none;width:118px">{photo(k, 120, 16, inner=shade(.6) + f"<span style=&quot;position:absolute;left:8px;bottom:6px;color:#fff;font:600 13px Urbanist&quot;>{n}</span>")}<div style="font:400 11px Urbanist;color:{MUT};margin-top:5px">{a}</div></div>'
                   for k, n, a in [('evening', 'Maya', 'Banjara Hills'), ('walks', 'Daniel', 'Gachibowli'), ('cozy', 'Leila', 'Jubilee Hills')])
    how = ''.join(f'<div style="display:flex;gap:10px;align-items:flex-start;margin-top:9px;font-size:12.5px;line-height:1.4"><span class="num">{i + 1}</span><span>{t}</span></div>'
                  for i, t in enumerate(['Pick what you’d like to do, a time and a companion', 'Pay securely with UPI, cards or net banking', 'They confirm and chat opens. Numbers stay hidden', 'Meet in a public place. Panic button on during the session']))
    return (top() + body(f'<div class="lab" style="margin-top:12px">Popular in Hyderabad</div><div class="hscroll">{plans}</div>'
                         f'<div class="lab" style="margin-top:16px">Near you</div><div class="hscroll">{near}</div>'
                         + card(f'<div style="font:600 15px Urbanist">Can’t be there for mum or dad?</div><div class="sub" style="margin-top:3px">Book warm, verified company for someone you love. You add their details; only our team sees their number.</div><div style="margin-top:10px">{btn("Book for a loved one", "dark", None, False, True)}</div>', CM, mt=14)
                         + card(f'<div style="font:600 15px Urbanist">How prsnn works</div>{how}', mt=10), '0 18px') + tabs(0))
def s_category():
    people = ''.join(f'<div class="crow">{avatar(k, 54)}<div style="flex:1"><div style="display:flex;gap:6px;align-items:center"><span style="font:600 14.5px Urbanist">{n}</span>{ic("shield", CD, 13)}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{a}</div><div style="font:600 12px Urbanist;margin-top:3px">from ₹399</div></div>{ic("heart", MUT, 18)}</div>'
                     for k, n, a in [('evening', 'Maya', 'Banjara Hills · Concerts, food'), ('walks', 'Daniel', 'Gachibowli · Gigs, cricket'), ('cozy', 'Leila', 'Jubilee Hills · Dinners, theatre')])
    return (f'<div style="position:relative">{photo("events", 210, 0, inner=shade(.85))}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:16px;color:{P}"><div style="font:600 24px Urbanist">Don’t Go Alone</div><div style="font:400 12.5px Urbanist;opacity:.9">Concerts, dinners, weddings and plans you’d rather share.</div></div></div>'
            + body(f'<div class="lab" style="margin-top:14px">Suggested · 3 hours</div><div class="sub" style="margin:2px 0 0">Long enough for the event and a coffee after.</div>'
                   f'<div class="lab" style="margin-top:14px">People who offer this</div>{people}'
                   f'<div class="fine" style="text-align:left;margin-top:8px">Tickets, food and travel are paid by you on the day. The price is the companion’s time.</div>'))
def s_search():
    res = ''.join(f'<div class="crow">{avatar(k, 52)}<div style="flex:1"><div style="display:flex;gap:6px;align-items:center"><span style="font:600 14.5px Urbanist">{n}</span>{ic("shield", CD, 13) if v else pill("New on prsnn", "grey")}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{a}</div></div><div style="text-align:right"><div style="font:700 14px Outfit">₹399</div><div style="font:400 10.5px Urbanist;color:{MUT}">from / hour</div></div></div>'
                  for k, n, a, v in [('evening', 'Maya', 'Banjara Hills · Coffee, galleries', True), ('walks', 'Daniel', 'Gachibowli · Walks, cricket', True), ('cozy', 'Leila', 'Jubilee Hills · Books, theatre', False), ('study', 'Arjun', 'Madhapur · Study, coding', True)])
    return (top(False) + h('Find company', None, 24) + body(f'<div class="field on" style="margin-top:10px">{ic("search", MUT, 17)}<span style="color:{MUT}">Try a name, an area or ‘coffee’</span></div>'
                                                       + chips(['All areas', 'Banjara Hills', 'Gachibowli'], (0,), 10, False) + chips(['All', 'Coffee', 'Walks', 'Events', 'Study'], (0,), 8, False)
                                                       + f'<div class="sub" style="margin-top:10px">Showing women companions near you · <u>Change</u></div>{res}') + tabs(1))
def s_search_empty():
    return (top(False) + h('Find company', None, 24) + body(f'<div class="field on" style="margin-top:10px">{ic("search", MUT, 17)}<span>pottery</span><span style="margin-left:auto">{ic("x", MUT, 15)}</span></div>'
            f'<div class="empty"><span class="ebig">{ic("search", CD, 28)}</span><div style="font:600 16px Urbanist;margin-top:12px">No one matches “pottery” yet</div><div class="sub" style="text-align:center">You’re only seeing women companions. Try a wider search, or change who you’d like to meet.</div>'
            f'<div style="display:flex;gap:8px;margin-top:14px">{btn("Clear search", "dark", None, False, True)}{btn("Change who I meet", "ghost", None, False, True)}</div></div>') + tabs(1))
def s_companion():
    durs = ''.join(f'<span class="dchip{" on" if h_ == 4 else ""}"><b>{h_}h</b>{inr(PRICES[h_])}</span>' for h_ in (1, 2, 4, 6))
    days = ''.join(f'<span class="day{" on" if on else ""}">{d}</span>' for d, on in zip('MTWTFSS', [1, 1, 0, 1, 1, 1, 1]))
    return (f'<div style="position:relative">{photo("evening", 260, 0)}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<span class="circ" style="position:absolute;top:42px;right:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("heart", "#fff", 16, 2)}</span></div>'
            f'<div class="sheet" style="margin-top:-22px;padding-top:16px"><div style="display:flex;align-items:center;gap:8px"><span class="h" style="font-size:24px">Maya</span>{pill("ID verified by prsnn.", "champ")}</div>'
            f'<div class="sub" style="margin-top:2px">{ic("pin", MUT, 12)} Banjara Hills, Hyderabad · Coffee, galleries, walks</div>'
            f'<div class="lab" style="margin-top:12px">About me</div><div style="font:400 13px/1.5 Urbanist">Gallery openings, long coffees and city walks. Calm, curious and a good listener.</div>'
            f'<div class="lab" style="margin-top:12px">Durations and prices</div><div style="display:flex;gap:6px;margin-top:6px">{durs}</div>'
            f'<div class="lab" style="margin-top:12px">Available · 10 AM to 8 PM</div><div style="display:flex;gap:5px;margin-top:6px">{days}</div></div>'
            + foot(btn('Book Maya')))
def s_book_time():
    cal = ''.join(f'<span class="cd{" on" if d == 22 else (" off" if d < 16 else "")}">{d}</span>' for d in range(14, 28))
    times = ''.join(f'<span class="chip{" on" if t == "4:00 PM" else ""}">{t}</span>' for t in ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '5:30 PM'])
    return (bar('Book a time') + h('When would you like to meet?', 'Only days and times Maya is free. Sessions run 7 AM to 10 PM.', 21)
            + body(f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><b>November 2026</b><span style="display:flex;gap:8px">{ic("back", MUT, 16)}{ic("chev", M, 16)}</span></div>'
                   f'<div class="cal">{cal}</div><div class="lab">Start time</div><div class="chips" style="margin-top:8px;flex-wrap:wrap">{times}</div>'
                   + notice('Book at least 90 minutes ahead so a companion can be confirmed.', 'grey', 'clock')) + foot(btn('Choose how long')))
def s_book_length():
    rest = [price_tab(x) for x in (1, 2, 6, 12)]
    return (bar('Choose how long') + body(f'{price_card(4, 196)}{stack(rest, -18)}<div class="fine" style="text-align:left;margin-top:12px">Tap a card to choose it. No booking fee. Full refund if nobody accepts.</div>', '6px 18px 0')
            + foot(btn('Continue with 4 hours')))
def s_review():
    rows_ = ''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{M};font-weight:600">{b}</span></div>' for a, b in [('With', 'Maya'), ('When', 'Sat 22 Nov · 4–8 PM'), ('What for', 'Don’t Go Alone'), ('Who for', 'Me')])
    return (bar('Review and pay') + body(field('Where will you meet?', 'Blue Tokai, Banjara Hills', 'Public places only: cafés, malls, parks. You can fine-tune it in chat.', mt=4)
                                         + card(rows_ + f'<div class="lrow"><span style="color:{MUT}">4 hours</span><span class="rv" style="color:{M}">₹1,299</span></div><div class="lrow"><span style="color:{MUT}">You save vs. hourly</span><span class="rv" style="color:{CD}">₹297</span></div><div class="lrow"><span style="color:{MUT}">Booking fee</span><span class="rv" style="color:{M}">₹0</span></div>'
                                                f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:10px"><b>Total you pay now</b><span style="font:700 26px Outfit">₹1,299</span></div>', pad='4px 14px 12px')
                                         + f'<div class="sub" style="margin-top:10px"><b style="color:{M}">If nobody accepts</b>, you get a full refund. <b style="color:{M}">Cancel 15 min+ before</b> and 85% comes back.</div>'
                                         + checkbox(True, 'I agree to the booking and refund terms and will meet in a public place.')) + foot(btn('Pay ₹1,299 securely', 'dark', 'lock')))
def s_review_other():
    return (bar('Review and pay') + body(label('Who is this for?', 4) + seg(['Me', 'Parent', 'Friend', 'Other'], 1)
                                         + field('Their name', 'Fatima Khan') + field('Their mobile', '+91 90000 11111', 'Kept private: only our team sees it, for safety. The companion never does.')
                                         + field('Their city (if not the same)', 'Hyderabad', ph=True) + field('Anything else? (optional)', 'She loves old Hindi music and the Charminar area.', tall=True)) + foot(btn('Continue')))
def s_pay():
    opts = ''.join(f'<div class="opt{" on" if i == 0 else ""}"><span style="display:flex;gap:10px;align-items:center">{ic(k, CD, 18)}{t}</span><span class="rd{" on" if i == 0 else ""}"></span></div>' for i, (k, t) in enumerate([('phone', 'UPI'), ('wallet', 'Card'), ('globe', 'Net banking')]))
    return (bar('Payment') + body(card(f'<div class="sub" style="margin:0">Booking #A6582F · Maya · Sat 4 PM</div><div style="font:700 34px Outfit;margin-top:4px">₹1,299</div><div class="sub" style="margin:2px 0 0">4 hours, no booking fee</div>', mt=4)
                                  + label('Pay with') + opts + f'<div class="fine" style="margin-top:12px">{ic("lock", MUT, 12)} Secure checkout, verified by Razorpay. We never see your card.</div>') + foot(btn('Pay ₹1,299')))
def s_confirmed():
    return (f'<div style="text-align:center;padding:66px 24px 0"><span class="okb">{ic("check", C, 36, 2.4)}</span><div class="h" style="font-size:26px;margin-top:16px">You’re booked</div>'
            f'<div class="sub">Payment received. We’re confirming Maya now; you’ll get a WhatsApp message the moment she accepts.</div></div>'
            + body(card(timeline([('Payment received', '₹1,299 paid', True), ('Maya confirms', 'Usually within the hour', None), ('Saturday, 4:00 PM', 'Blue Tokai, Banjara Hills', False)]), mt=18)
                   + notice('If nobody accepts by 1 hour before, every rupee comes back automatically.', 'champ', 'refund'))
            + foot(btn('View booking'), btn('Back to home', 'ghost')))
def s_bookings():
    tick = (f'<div class="ticket"><div style="padding:14px 16px 12px"><div style="display:flex;justify-content:space-between">{logo(12, P, C)}<span style="font:500 10.5px Urbanist;opacity:.7">#A6582F</span></div>'
            f'<div style="font:700 30px/1 Outfit;color:{C};margin-top:12px">4:00 PM</div><div style="font:500 12px Urbanist;opacity:.85;margin-top:3px">Saturday, 22 November · in 2 days</div></div>'
            f'<div class="tear"></div><div style="padding:10px 16px 14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font:400 10.5px Urbanist">'
            + ''.join(f'<div><div style="opacity:.6">{a}</div><div style="font:600 13px Urbanist;margin-top:1px">{b}</div></div>' for a, b in [('With', 'Maya'), ('Where', 'Blue Tokai'), ('Length', '4 hours'), ('Status', 'Confirmed')]) + '</div></div>')
    small = lambda k, t, s, p_: f'<div class="crow">{avatar(k, 46)}<div style="flex:1"><div style="font:600 14px Urbanist">{t}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div>{p_}</div>'
    return (top(False) + h('Your bookings', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 0) + f'<div style="margin-top:12px">{tick}</div>'
                                                          + small('walks', 'Daniel · Old town walk', 'Fri 28 Nov · 10 AM', pill('Paid · awaiting', 'champ'))) + tabs(2))
def s_booking():
    return (bar('Booking #A6582F', ic('flag', MUT, 16)) + body(card(f'<div style="display:flex;gap:12px;align-items:center">{avatar("evening", 48, True)}<div><div style="font:600 16px Urbanist">Maya</div><div class="sub" style="margin:0">Don’t Go Alone · 4 hours</div></div></div>'
                                                                    + ''.join(f'<div class="lrow">{ic(i, CD, 15)}<span>{t}</span></div>' for i, t in [('cal', 'Saturday, 22 November · 4:00–8:00 PM'), ('pin', 'Blue Tokai, Banjara Hills'), ('rupee', '₹1,299 paid · no booking fee')]), mt=4)
                                                               + label('Status') + card(timeline([('Paid', '14 Nov, 6:12 PM', True), ('Maya confirmed', 'Chat is open', True), ('Session', 'Saturday, 4:00 PM', False), ('Completed', '', False)]), mt=6)
                                                               + f'<div style="display:flex;gap:8px;margin-top:12px">{btn("Message", "dark", "chat")}{btn("Report a problem", "ghost", "flag")}</div>'
                                                               + f'<div style="text-align:center;margin-top:12px;font:600 13px Urbanist;color:{RED}">Cancel booking · 85% refund (₹1,104)</div>'))
def s_chat():
    msgs = [('them', 'Hi Sam! Looking forward to Saturday 😊', '10:02'), ('me', 'Same here. Blue Tokai at 4?', '10:04'), ('them', 'Perfect, I’ll grab a table by the window.', '10:05')]
    b = ''.join(f'<div class="bub {w}">{t}<div class="bt2">{tm}</div></div>' for w, t, tm in msgs)
    return (f'<div class="bar" style="justify-content:flex-start;gap:10px"><span class="circ">{ic("back", M, 16, 2)}</span>{avatar("evening", 34)}<div style="flex:1"><div style="font:600 14px Urbanist">Maya</div><div style="font:400 10.5px Urbanist;color:{MUT}">Sat 4:00 PM · online</div></div>{ic("alert", RED, 18)}</div>'
            f'<div style="display:flex;justify-content:center;padding-top:8px"><span class="pill" style="background:{CM};color:{CD};padding:5px 10px">{ic("shield", CD, 12)} Keep it safe · public places only ›</span></div>'
            f'<div class="msgs">{b}</div><div class="comp"><span class="hidek">{ic("down", M, 18)}</span><div class="cin">See you at 4! I’ll message when I’m<i class="cur"></i></div><span class="sendb">{ic("send", P, 16)}</span></div><div class="kb"></div>')
def s_panic():
    return (bar('Safety') + f'<div style="text-align:center;padding:10px 24px 0"><div style="margin:8px auto 0;width:150px;height:150px;border-radius:50%;background:{REDS};display:flex;align-items:center;justify-content:center">'
            f'<div style="width:112px;height:112px;border-radius:50%;background:{RED};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font:700 15px Urbanist">{ic("alert", "#fff", 30)}HOLD 3s</div></div>'
            f'<div class="h" style="font-size:21px;margin-top:16px">Feel unsafe? Hold the button</div><div class="sub">Every prsnn admin is alerted at once with your booking, place and both numbers, and again every 5 minutes until you’re safe.</div></div>'
            + body(btn('Call 112 (police, ambulance)', 'red', 'phone') + f'<div style="margin-top:8px">{btn("Back to the booking", "ghost")}</div>', '16px 18px 0'))
def s_panic_sent():
    return (f'<div style="position:absolute;inset:0;background:{RED}"></div><div style="position:relative;text-align:center;padding:70px 24px 0;color:#fff"><span class="okb" style="background:rgba(255,255,255,.18)">{ic("alert", "#fff", 34)}</span>'
            f'<div style="font:600 26px Urbanist;margin-top:16px">Alert sent</div><div style="font:400 13.5px/1.5 Urbanist;opacity:.92;margin-top:6px">Shared with every prsnn admin. They’re calling you now.</div>'
            f'<div style="margin-top:18px;font:500 12px Urbanist;opacity:.85">Next alert in</div><div style="font:700 40px Outfit">4:52</div></div>'
            f'<div class="foot" style="background:transparent">{btn("Call 112", "soft", "phone")}<div class="btn" style="color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6)">I’m safe · stop alerts (PIN)</div></div>')
def s_report():
    return (bar('Report a problem') + body(h('What happened?', 'Our team reads every report and replies within a day.', 21, '4px 0 0') + chips(['Late or no-show', 'Felt unsafe', 'Payment', 'Other'], (0,), 12)
                                           + field('Details', 'What happened, and what would you like us to do?', ph=True, tall=True) + notice('For an emergency during a session, use the panic button or call 112.', 'red', 'alert')) + foot(btn('Send report')))
def s_messages():
    rows_ = ''.join(f'<div class="crow">{avatar(k, 48)}<div style="flex:1"><div style="display:flex;justify-content:space-between"><span style="font:600 14.5px Urbanist">{n}</span><span style="font:400 11px Urbanist;color:{MUT}">{t}</span></div><div style="font:400 12.5px Urbanist;color:{MUT};margin-top:2px">{m}</div></div>' + (f'<i class="unread"></i>' if u else '') + '</div>'
                    for k, n, t, m, u in [('evening', 'Maya', '10:05', 'Perfect, I’ll grab a table by the window.', True), ('walks', 'Daniel', 'Mon', 'See you at the Charminar gate.', False)])
    return (top(False) + h('Messages', 'Chats open once a booking is confirmed. Numbers stay hidden.', 24) + body(rows_) + tabs(3))
def s_notifs():
    n = lambda i, t, s, a, act=None, unread=False: (f'<div class="crow" style="{"background:" + CM + ";margin:0 -18px;padding:12px 18px" if unread else ""}"><span class="rico" style="background:{W if unread else CM}">{ic(i, CD, 16)}</span><div style="flex:1"><div style="font:600 13.5px Urbanist">{t}</div><div style="font:400 12px/1.4 Urbanist;color:{MUT}">{s}</div>'
                                                    + (f'<div style="margin-top:8px">{btn(act, "dark", None, False, True)}</div>' if act else '') + f'</div><span style="font:400 11px Urbanist;color:{MUT}">{a}</span></div>')
    return (bar('Notifications', f'<span style="font:600 13px Urbanist;color:{MUT}">Clear</span>') + body(
        n('check', 'Maya confirmed your booking', 'Chat is open. Say hello and agree the details.', '2m', 'Open chat', True)
        + n('cam', 'Action needed: a new photo', 'Our team asked for a clearer photo. Fix it in a minute.', '1h', 'Fix and resubmit')
        + n('clock', 'Your session is today', 'Coffee with Maya at 4:00 PM, Blue Tokai. Please be there on time.', '5 AM')
        + n('refund', 'Refund started', '₹699 is on its way back to your original payment method.', 'Mon')))

# ═════════════ PROFILE ═════════════
def s_profile():
    return (top(False) + body(f'<div style="display:flex;gap:14px;align-items:center;margin-top:10px">{avatar("cozy", 64, True)}<div><div class="h" style="font-size:22px">Sam Rivera</div><div class="sub" style="margin:0">+91 98765 43210 · Hyderabad</div>'
                              f'<div style="margin-top:6px">{pill("Photo approved", "green")}</div></div></div>'
                              + card(f'<div style="display:flex;gap:12px;align-items:center"><span class="rico" style="background:{W}">{ic("star", CD, 16)}</span><div style="flex:1"><div style="font:600 14px Urbanist">Become a companion</div><div style="font:400 11.5px Urbanist;color:{MUT}">Earn doing what you love, on your hours</div></div>{ic("chev", MUT, 14)}</div>', CM)
                              + group(row('user', 'Personal information'), row('lock', 'Privacy & preferences', 'Showing women'), row('heart', 'Saved companions', '3 saved'), row('bell', 'Notifications'), row('lock', 'Change PIN', last=True))
                              + group(row('help', 'Help & support'), row('shield', 'Code of conduct'), row('doc', 'Terms & privacy', last=True))
                              + group(row('logout', 'Log out', chevron=False), row('trash', 'Delete account', danger=True, last=True))) + tabs(4))
def s_profile_more():
    return (top(False) + body(group(row('help', 'Help & support'), row('shield', 'Code of conduct'), row('doc', 'Terms & privacy', last=True))
                              + group(row('logout', 'Log out', 'PIN to come back', chevron=False), row('trash', 'Delete account', danger=True, last=True))
                              + '<div class="fine">prsnn. · version 1.0</div>') + tabs(4))
def s_edit():
    return (bar('Personal information', f'<span style="font:600 13px Urbanist;color:{CD}">Save</span>') + body(f'<div style="text-align:center;margin-top:6px">{avatar("cozy", 84, True)}<div style="font:600 12.5px Urbanist;color:{CD};margin-top:8px">Change photo</div></div>'
                                                                                                         + field('Full name', 'Sam Rivera') + field('About you', 'Product designer, new to Hyderabad. Love long walks and live music.', tall=True)
                                                                                                         + field('Mobile number', '+91 98765 43210', 'Your number is never shown to other members.') + notice('A new photo is reviewed by our team before others see it.', 'grey', 'cam')))
def s_privacy():
    opts = lambda items, on: ''.join(f'<div class="opt{" on" if t == on else ""}" style="padding:10px 12px"><span>{t}</span><span class="rd{" on" if t == on else ""}"></span></div>' for t in items)
    return (bar('Privacy & preferences', f'<span style="font:600 13px Urbanist;color:{CD}">Save</span>') + body(label('I am', 4) + seg(['Woman', 'Man', 'Non-binary'], 1)
                                                                                                           + label('Who would you like to meet?') + opts(['Women', 'Men', 'Non-binary people', 'Everyone'], 'Women')
                                                                                                           + label('Your photo') + seg(['Open', 'Locked'], 0) + f'<div class="hint">Locked shows a blurred placeholder until someone has a paid booking with you.</div>'
                                                                                                           + field('City and area', 'Hyderabad · Gachibowli', 'Companions are shown from your city first.')))
def s_saved():
    rows_ = ''.join(f'<div class="crow">{avatar(k, 52)}<div style="flex:1"><div style="font:600 14.5px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{a}</div></div>{ic("heart", C, 20, 2.2)}</div>' for k, n, a in [('evening', 'Maya', 'Banjara Hills'), ('walks', 'Daniel', 'Gachibowli'), ('cozy', 'Leila', 'Jubilee Hills')])
    return bar('Saved companions') + body(rows_)
def s_delete():
    return (bar('Delete account') + body(h('Delete your account?', 'This can’t be undone.', 22, '4px 0 0') + card(''.join(f'<div class="lrow">{ic("check", CD, 14)}<span style="font-size:12.5px">{t}</span></div>' for t in ['Your profile and photos are removed', 'Chats and saved companions are deleted', 'Records we must keep by law are kept privately', 'You can’t delete while a paid booking is still open']), mt=12, pad='4px 14px')
                                         + field('Type DELETE to confirm', 'DELETE', on=True)) + foot(btn('Delete my account', 'red')))
def s_fix():
    return (bar('Changes requested') + body(notice('Our team asked for: a clearer photo (face visible, no sunglasses).', 'champ', 'cam') + label('New photo')
                                            + f'<div style="display:flex;gap:12px;align-items:center;margin-top:8px">{avatar("cozy", 64)}<span style="font:600 13px Urbanist;color:{CD}">Choose a new photo</span></div>'
                                            + field('About you (optional; leave empty to keep it)', 'What do you enjoy? What kind of company are you?', ph=True, tall=True)
                                            + '<div class="sub" style="margin-top:10px">It goes straight to the top of our review list.</div>') + foot(btn('Send again for review')))

# ═════════════ COMPANION ═════════════
def s_apply():
    pts = ''.join(f'<div class="lrow" style="border:none;padding:6px 0">{ic(i, CD, 16)}<span style="font-size:13px">{t}</span></div>' for i, t in [('rupee', 'Keep 80% of every booking, paid to your bank'), ('clock', 'Choose your own days, hours and lengths'), ('pin', 'Public places only, panic button on every session'), ('shield', 'ID check at your first booking, not before')])
    return (f'<div style="position:relative">{photo("evening", 250, 0, inner=shade(.9))}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:20px;color:{P}"><div style="font:600 26px/1.05 Urbanist">Earn doing what you love</div><div style="font:400 13px Urbanist;opacity:.9;margin-top:5px">Be good company for people who could use some, on your terms.</div></div></div>'
            + body(card(pts, mt=14) + card(f'<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="sub" style="margin:0">A 4-hour booking pays you</span><span style="font:700 24px Outfit;color:{CD}">₹1,039</span></div>', CM)) + foot(btn('Apply now')))
def s_onb_photo():
    return (setup_head(1, 5) + h('Add a clear photo of you', 'Members see this first. Smile: friendly photos get more bookings.', pad='4px 18px 0')
            + body(f'<div style="margin:12px auto 0;width:112px;height:112px;border-radius:50%;background:{img("evening")} center/cover;box-shadow:0 0 0 4px {W},0 0 0 5.5px {C}"></div><div style="text-align:center;font:600 12.5px Urbanist;color:{CD};margin-top:8px">Tap to change</div>'
                   + label('Who can see your photo?') + f'<div class="opt on"><span><b>Open</b> · everyone browsing</span><span class="rd on"></span></div><div class="opt"><span><b>Locked</b> · only after a paid booking</span><span class="rd"></span></div><div class="hint">Tapping is your consent. Change it any time.</div>') + foot(btn('Next')))
def s_onb_offers():
    tiles = ''.join(f'<div class="ctile{" on" if i in (1, 2) else ""}" style="padding:7px 12px;margin-top:6px"><span class="av" style="width:34px;height:34px;border-radius:10px;background:{img(k)} center/cover"></span><div style="flex:1;font:600 13.5px Urbanist">{t}</div><span class="cb{" on" if i in (1, 2) else ""}">{ic("check", P, 12, 2.6) if i in (1, 2) else ""}</span></div>' for i, (t, s, k) in enumerate(wv.CATS))
    return (setup_head(3, 5) + h('What would you enjoy doing?', 'You’ll show up in these categories. Pick everything you’d enjoy.', pad='4px 18px 0') + body(tiles + label('Interests and languages') + chips(['Coffee', 'Walks', 'Food', 'Music', 'English', 'Hindi', 'Telugu'], (0, 1, 4, 5))) + foot(btn('Next')))
def s_onb_send():
    return (setup_head(5, 5) + h('When are you free?', 'Evenings and weekends get the most requests.', pad='4px 18px 0')
            + body(f'<div style="display:flex;gap:5px;margin-top:12px">' + ''.join(f'<span class="day{" on" if on else ""}">{d}</span>' for d, on in zip('MTWTFSS', [1, 1, 0, 1, 1, 1, 1])) + '</div>'
                   + f'<div style="display:flex;gap:10px">{field("From", "10:00 AM")}{field("Until", "8:00 PM")}</div>'
                   + notice('One thing before your first booking: a quick ID check. Nothing needed now.', 'grey', 'id') + checkbox(True, 'I agree to the prsnn Code of Conduct.')) + foot(btn('Send for approval')))
def s_verification():
    return (bar('My status') + body(f'<div style="text-align:center;margin-top:8px"><span class="okb" style="background:{CM}">{ic("clock", CD, 32)}</span><div class="h" style="font-size:22px;margin-top:14px">Your profile is with our team</div>'
                                    f'<div class="sub">Most profiles are reviewed within a day. We’ll message you on WhatsApp when you’re live.</div></div>'
                                    + card(timeline([('Profile sent', 'Today, 6:12 PM', True), ('Team review', 'Photo and profile', None), ('You’re live', 'Members can book you', False), ('ID check', 'At your first booking', False)]), mt=16)
                                    + card(f'<div style="font:600 13.5px Urbanist">Tip: get booked sooner</div><div class="sub" style="margin-top:2px">Offer 2 and 4 hours, and keep evenings free. They get the most requests.</div>', CM)) + foot(btn('Go to my dashboard')))
def s_dashboard():
    offer = (f'<div class="ticket" style="margin-top:12px"><div style="padding:14px 16px"><div style="display:flex;justify-content:space-between;align-items:center">{pill("New paid booking", "gold")}<span style="font:500 11px Urbanist;opacity:.75">Accept in 0:42:10</span></div>'
             f'<div style="font:600 17px Urbanist;margin-top:10px">Sam · Don’t Go Alone</div><div style="font:400 12px Urbanist;opacity:.8;margin-top:2px">Sat 22 Nov · 4:00–8:00 PM · Blue Tokai</div>'
             f'<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:10px"><span style="font:500 12px Urbanist;opacity:.8">You earn</span><span style="font:700 26px Outfit;color:{C}">₹1,039</span></div>'
             f'<div style="display:flex;gap:8px;margin-top:10px"><div class="btn b-champ sm" style="flex:1">Accept</div><div class="btn sm" style="flex:1;color:{P};box-shadow:inset 0 0 0 1.5px rgba(241,241,244,.35)">Decline</div></div></div></div>')
    return (top() + h('Good evening, Maya', 'You’re live. Members can book you.', 22) + body(offer + f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px">{stat("₹6,231", "This month", CD)}{stat("6", "Sessions")}{stat("₹1,039", "Avg")}</div>'
                                                                                        + group(row('cal', 'Packages & availability', '1, 2, 4, 6 h'), row('wallet', 'Earnings'), row('id', 'ID check', 'Verified', last=True))) + tabs(0, True))
def s_requests():
    r = lambda t, s, e, st: f'<div class="crow">{avatar("cozy", 46)}<div style="flex:1"><div style="font:600 14px Urbanist">{t}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div><div style="text-align:right"><div style="font:700 14px Outfit">{e}</div>{st}</div></div>'
    return (top(False) + h('Requests', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 0) + r('Sam · 4 hours', 'Sat 22 Nov · 4 PM', '₹1,039', pill('Confirmed', 'green'))
                                                     + r('Priya · 2 hours', 'Sun 23 Nov · 11 AM', '₹559', pill('Offer · 3h left', 'champ')) + r('Rahul · 1 hour', 'Tue 25 Nov · 6 PM', '₹319', pill('Confirmed', 'green'))) + tabs(2, True))
def s_verify_id():
    ids = ''.join(f'<div class="opt{" on" if i == 0 else ""}" style="padding:10px 12px"><span>{t}</span><span class="rd{" on" if i == 0 else ""}"></span></div>' for i, t in enumerate(['Aadhaar', 'PAN', 'Driving licence', 'Passport', 'Voter ID']))
    return (bar('Verify your ID') + body(card(f'<div style="display:flex;justify-content:space-between"><span class="sub" style="margin:0">Paid booking · Sat 4 PM</span><span style="font:700 18px Outfit;color:{CD}">You earn ₹1,039</span></div>', CM, mt=4)
                                         + h('Quick ID check, then it’s yours', 'Which ID will you use? Any one of these.', 19, '12px 0 0') + ids
                                         + f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px">' + ''.join(f'<div class="up">{ic("cam", CD, 18)}<span>{t}</span></div>' for t in ['Front', 'Back', 'Selfie']) + '</div>')
            + foot(btn('Verify ID and accept')))
def s_availability():
    rows_ = ''.join(f'<div style="margin-top:{0 if i == 0 else 7}px">{price_tab(h_, "You get " + inr(PRICES[h_] * 8 // 10))}</div>' for i, h_ in enumerate(range(1, 13)))
    return (bar('Packages & availability') + body(h('The lengths you offer', 'Same prices for everyone. You receive 80% of each booking.', 19, '4px 0 10px') + rows_
                                                  + label('Days and hours') + f'<div style="display:flex;gap:5px;margin-top:6px">' + ''.join(f'<span class="day{" on" if on else ""}">{d}</span>' for d, on in zip('MTWTFSS', [1, 1, 0, 1, 1, 1, 1])) + '</div>')
            + foot(btn('Save availability')))
def s_earnings():
    bars = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px"><div style="width:100%;height:{h_}px;border-radius:8px;background:{M if i == 2 else DEEP}"></div><span style="font:500 10.5px Urbanist;color:{MUT}">W{i + 1}</span></div>' for i, h_ in enumerate([40, 70, 96, 30]))
    return (bar('Earnings') + body(card(f'<div style="display:flex;justify-content:space-between;align-items:center"><span style="display:flex;gap:10px">{ic("back", MUT, 16)}<b>November</b>{ic("chev", M, 16)}</span>{pill("80% of each booking", "champ")}</div>'
                                        f'<div style="font:700 40px Outfit;margin-top:12px">₹6,231</div><div class="sub" style="margin:2px 0 0">Your earnings after prsnn’s 20%</div>', mt=4)
                                   + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">{stat("6", "Paid sessions")}{stat("₹1,039", "Avg per session")}</div>'
                                   + label('By week') + f'<div style="display:flex;gap:10px;align-items:flex-end;height:120px;margin-top:8px">{bars}</div>'
                                   + f'<div class="fine" style="text-align:left;margin-top:12px">Payouts go to your bank account as set up with the prsnn team.</div>'))

# ═════════════ ADMIN ═════════════
def s_admin():
    tile = lambda v, t, tone=None: f'<div class="stat" style="text-align:left"><div class="sv" style="{"color:" + tone if tone else ""}">{v}</div><div class="sl">{t}</div></div>'
    return (top(False) + h('Admin', 'Superadmin', 24) + body(notice('1 open panic alert · tap to respond', 'red', 'alert')
                                                         + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">{tile("4", "Profiles to approve")}{tile("2", "Photos to approve")}{tile("3", "ID checks")}{tile("12", "Live bookings")}</div>'
                                                         + label('Money (all time)') + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">{tile("₹84,210", "Collected")}{tile("₹6,980", "Refunded")}{tile("₹61,784", "Companion payouts")}{tile("₹15,446", "prsnn net", CD)}</div>'
                                                         + group(row('check', 'Approvals', '6'), row('alert', 'Panic alerts', '1'), row('map', 'City plans'), row('list', 'Bookings'), row('flag', 'Disputes', '2'), row('users', 'Users'),
                                                                 row('shield', 'Sub-admins'), row('rupee', 'Prices'), row('megaphone', 'Broadcast'), row('doc', 'Activity log', last=True))))
def s_approvals():
    item = lambda k, n, s: f'<div class="crow">{avatar(k, 52)}<div style="flex:1"><div style="font:600 14px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div>{ic("chev", MUT, 14)}</div>'
    return (bar('Approvals') + body(seg(['Companions · 4', 'Photos · 2'], 0) + item('evening', 'Maya Iyer', 'Banjara Hills · sent 2h ago') + item('walks', 'Daniel Rao', 'Gachibowli · sent 5h ago')
                                    + card(f'<div style="display:flex;gap:12px;align-items:center">{avatar("cozy", 56)}<div style="flex:1"><div style="font:600 14px Urbanist">Leila · new photo</div><div style="font:400 11.5px Urbanist;color:{MUT}">Member</div></div></div><div style="display:flex;gap:8px;margin-top:10px">{btn("Approve", "dark", None, True, True)}{btn("Ask for a new photo", "ghost", None, True, True)}</div>', mt=12)))
def s_review_profile():
    return (bar('Review profile', f'<span style="font:600 12px Urbanist;color:{MUT}">Next ›</span>') + body(f'<div style="display:flex;gap:12px;align-items:center;margin-top:4px">{avatar("evening", 72)}<div><div class="h" style="font-size:20px">Maya Iyer</div><div class="sub" style="margin:0">Woman · Banjara Hills · photo open</div></div></div>'
                                                                                                             + label('About') + '<div style="font-size:13px;line-height:1.5">Gallery openings, long coffees and city walks.</div>'
                                                                                                             + label('Offers') + chips(['Don’t Go Alone', 'Explore & Discover', '1h', '2h', '4h', '6h'], ()) )
            + foot(btn('Approve · go live', 'dark', 'check'), f'<div style="display:flex;gap:8px">{btn("Ask for changes", "ghost", None, True)}{btn("Reject", "danger", None, True)}</div>'))
def s_verify_ids():
    docs = ''.join(f'<div style="flex:1"><div style="height:66px;border-radius:12px;background:{img(k)} center/cover"></div><div style="font:500 10.5px Urbanist;color:{MUT};margin-top:4px;text-align:center">{t}</div></div>' for k, t in [('study', 'ID front'), ('park', 'ID back'), ('evening', 'Selfie')])
    return (bar('Verify companions') + body(card(f'<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font:600 14.5px Urbanist">Maya Iyer · Aadhaar</div><div style="font:400 11.5px Urbanist;color:{MUT}">Holding 1 booking · deadline Sat 3 PM</div></div>{pill("Urgent", "red")}</div>'
                                                 f'<div style="display:flex;gap:8px;margin-top:10px">{docs}</div><div style="display:flex;gap:8px;margin-top:10px">{btn("Verify", "dark", None, True, True)}{btn("Reject", "danger", None, True, True)}</div>', mt=4)))
def s_admin_bookings():
    r = lambda ref, s, st: f'<div class="crow"><div style="flex:1"><div style="font:600 14px Urbanist">#{ref} · {s}</div><div style="font:400 11.5px Urbanist;color:{MUT}">Sat 22 Nov · 4 PM · ₹1,299</div></div>{st}</div>'
    return (bar('Bookings') + body(seg(['Live', 'Refunds', 'Done'], 0) + f'<div class="field" style="margin-top:10px">{ic("search", MUT, 16)}<span style="color:{MUT}">Ref, name or phone</span></div>'
                                   + r('A6582F', 'Sam → Maya', pill('Confirmed', 'green')) + r('B1C04D', 'Priya → Daniel', pill('Offering', 'champ')) + r('C9F11A', 'Rahul → Leila', pill('ID check', 'grey'))))
def s_admin_booking():
    acts = ['Change date or time', 'Reassign companion', 'Mark completed', 'Cancel booking', 'Retry failed refund', 'Set cancellation fee', 'Mark paid (simulated)']
    return (bar('Booking #A6582F') + body(card(''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{M};font-weight:600">{b}</span></div>' for a, b in [('Member', 'Sam · +91 98765 43210'), ('Companion', 'Maya · +91 90000 11111'), ('When', 'Sat 22 Nov · 4–8 PM'), ('Paid', '₹1,299 · simulated')]), mt=4, pad='4px 14px')
                                          + label('Actions') + group(*[row('edit', a, last=(i == len(acts) - 1)) for i, a in enumerate(acts)]) + f'<div class="hint">Refunds and fees are handled by a superadmin.</div>'))
def s_disputes():
    return (bar('Disputes') + body(seg(['Open', 'Closed'], 0) + card(f'<div style="display:flex;justify-content:space-between"><b>#A6582F · Late start</b>{pill("Open", "red")}</div><div class="sub" style="margin-top:4px">“Companion was 30 minutes late.” · Sam</div>'
                                                                  f'<div style="display:flex;gap:8px;margin-top:10px">{btn("Reply", "dark", None, True, True)}{btn("Read chat", "ghost", None, True, True)}{btn("Close", "soft", None, True, True)}</div>', mt=12)))
def s_panics():
    return (bar('Panic alerts') + body(seg(['Open', 'All'], 0) + card(f'<div style="display:flex;justify-content:space-between;align-items:center"><b style="color:{RED}">#A6582F · Alert 2</b>{pill("Open", "red")}</div>'
                                                                      f'<div style="font:400 12.5px/1.5 Urbanist;margin-top:6px">Sam (member) pressed the panic button · Blue Tokai, Banjara Hills · 4 hours, Don’t Go Alone</div>'
                                                                      f'<div style="font:400 12px Urbanist;color:{MUT};margin-top:4px">First pressed 4:35 PM · next repeat 4:45 PM</div>', REDS, mt=12)))
def s_panic_detail():
    return (bar('Panic alert') + body(card(''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{M};font-weight:600">{b}</span></div>' for a, b in [('Pressed by', 'Sam (member)'), ('Member', '+91 98765 43210'), ('Companion', 'Maya · +91 90000 11111'), ('Where', 'Blue Tokai, Banjara Hills'), ('Session', 'Sat 4–8 PM · 4 hours')]), mt=4, pad='4px 14px')
                                      + f'<div style="display:flex;gap:8px;margin-top:12px">{btn("Call member", "red", "phone", True, True)}{btn("Call companion", "ghost", "phone", True, True)}</div>')
            + foot(btn('Mark resolved · stop alerts', 'dark', 'check'), btn('Open the booking', 'ghost')))
def s_users():
    r = lambda k, n, s, st: f'<div class="crow">{avatar(k, 46)}<div style="flex:1"><div style="font:600 14px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div>{st}</div>'
    return (bar('Users') + body(f'<div class="field" style="margin-top:4px">{ic("search", MUT, 16)}<span style="color:{MUT}">Name, phone or city</span></div>' + chips(['All', 'Members', 'Companions', 'Staff'], (0,), 10, False)
                                + r('cozy', 'Sam Rivera', 'Member · Hyderabad', '') + r('evening', 'Maya Iyer', 'Companion · Verified', pill('Live', 'green')) + r('walks', 'Kiran P', 'Member · Suspended', pill('Suspended', 'red'))))
def s_user():
    return (bar('User') + body(f'<div style="display:flex;gap:12px;align-items:center;margin-top:4px">{avatar("evening", 60)}<div><div class="h" style="font-size:20px">Maya Iyer</div><div class="sub" style="margin:0">Companion · +91 90000 11111</div></div></div>'
                               + field('Full name', 'Maya Iyer') + f'<div style="display:flex;gap:10px">{field("City", "Hyderabad")}{field("Area", "Banjara Hills")}</div>'
                               + label('Account') + group(row('check', 'Save changes'), row('lock', 'Suspend account'), row('shield', 'Make sub-admin'), row('trash', 'Delete account', danger=True, last=True))))
def s_admins():
    return (bar('Sub-admins') + body(field('Add sub-admin by phone', '98765 00000', 'If nobody has this number yet, an account is made for it. They log in with OTP as usual.', on=True, mt=4) + f'<div style="margin-top:10px">{btn("Add sub-admin", "dark", "plus")}</div>'
                                     + label('Staff') + f'<div class="crow">{avatar("study", 44)}<div style="flex:1"><div style="font:600 14px Urbanist">Arjun Mehta</div><div style="font:400 11.5px Urbanist;color:{MUT}">Sub-admin</div></div><span style="font:600 12px Urbanist;color:{RED}">Remove</span></div>'))
def s_prices():
    rows_ = ''.join(f'<div class="lrow"><span>{h_} {"hour" if h_ == 1 else "hours"}</span><span class="pfield">₹{PRICES[h_]:,}</span></div>' for h_ in (1, 2, 4, 6, 12))
    return (bar('Prices', f'<span style="font:600 13px Urbanist;color:{CD}">Save</span>') + body(label('Packages', 4) + card(rows_ + f'<div class="hint">+ 3, 5, 7–11 hours</div>', mt=6, pad='4px 14px 10px')
                                                                                                 + label('Split and cancellation') + card(''.join(f'<div class="lrow"><span>{a}</span><span class="pfield">{b}</span></div>' for a, b in [('prsnn share', '20%'), ('Cancellation fee', '15%'), ('Free-cancel cutoff', '15 min')]), mt=6, pad='4px 14px')
                                                                                                 + checkbox(False, 'Re-price unpaid bookings. Paid bookings never change.')))
def s_plans():
    return (bar('City plans', ic('plus', M, 18)) + body(field('City', 'Hyderabad', mt=4) + card(f'<div style="display:flex;gap:12px">{photo("walks", 64, 14, "width:64px;flex:none")}<div><div style="font:600 14px Urbanist">Fort and heritage walk</div><div style="font:400 11.5px Urbanist;color:{MUT}">Explore & Discover · 4 hours</div><div style="font:600 12px Urbanist;color:{CD};margin-top:4px">Edit</div></div></div>')
                                                        + card(f'<div style="display:flex;gap:12px">{photo("events", 64, 14, "width:64px;flex:none")}<div><div style="font:600 14px Urbanist">Live music night</div><div style="font:400 11.5px Urbanist;color:{MUT}">Don’t Go Alone · 3 hours</div><div style="font:600 12px Urbanist;color:{CD};margin-top:4px">Edit</div></div></div>')))
def s_broadcast():
    return (bar('Broadcast') + body(label('Send to', 4) + seg(['Everyone', 'Members', 'Companions'], 1) + field('Title', 'Weekend slots are filling up') + field('Message', 'Book before Friday to get your favourite companion.', tall=True)
                                    + label('Preview') + card(f'<div style="display:flex;gap:10px"><span class="rico" style="background:{M}">{logo(8, P, C)}</span><div><div style="font:600 13px Urbanist">Weekend slots are filling up</div><div style="font:400 12px Urbanist;color:{MUT}">Book before Friday to get your favourite companion.</div></div></div>', mt=6)
                                    + '<div class="hint">Goes to 1 device with notifications on.</div>') + foot(btn('Send to members', 'dark', 'send')))
def s_activity():
    r = lambda a, t, w: f'<div class="crow"><span class="rico" style="background:{CM}">{ic("doc", CD, 15)}</span><div style="flex:1"><div style="font:600 13px Urbanist">{a}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{t}</div></div><span style="font:400 11px Urbanist;color:{MUT}">{w}</span></div>'
    return (bar('Activity') + body(r('Approved profile · Maya Iyer', 'by Arjun (sub-admin)', '2m') + r('Refund ₹200 · #A6582F', 'by Owner (superadmin)', '1h') + r('Panic resolved · #A6582F', 'by Arjun · “Spoke to both, all fine”', '3h') + r('Price change · 4 h ₹1,299', 'by Owner', 'Mon')
                                   + f'<div style="margin-top:12px">{btn("Load more", "ghost")}</div>'))

GROUPS = [
 ('Get started', 'From first open to a ready account. Phone first, PIN next time, tap-to-advance setup.', [
   ('Splash', s_splash), ('Welcome', s_welcome), ('I’m here to…', s_role), ('Log in', s_login), ('Enter the code', s_otp), ('Email (abroad)', s_email),
   ('Choose a PIN', s_pin_set), ('Log in with PIN', s_pin_login), ('Setup · name', s_setup_name), ('Setup · what for', s_setup_help), ('Setup · who to meet', s_setup_meet),
   ('Setup · photo', s_setup_photo), ('Setup · where', s_setup_where)]),
 ('Member', 'Find, book, pay, chat and stay safe.', [
   ('Home', s_home), ('Home · scrolled', s_home_more), ('Category', s_category), ('Search', s_search), ('Search · no results', s_search_empty), ('Companion profile', s_companion),
   ('Book a time', s_book_time), ('Choose how long', s_book_length), ('Review and pay', s_review), ('Booking for someone else', s_review_other), ('Payment', s_pay), ('Booked', s_confirmed),
   ('Bookings', s_bookings), ('Booking details', s_booking), ('Chat', s_chat), ('Panic', s_panic), ('Alert sent', s_panic_sent), ('Report a problem', s_report), ('Messages', s_messages), ('Notifications', s_notifs)]),
 ('Profile', 'Account, privacy and the rare hard things, made calm.', [
   ('Profile', s_profile), ('Profile · scrolled', s_profile_more), ('Personal information', s_edit), ('Privacy & preferences', s_privacy), ('Saved', s_saved), ('Delete account', s_delete), ('Fix and resubmit', s_fix)]),
 ('Companion', 'Apply, get approved, accept bookings and get paid.', [
   ('Become a companion', s_apply), ('Onboarding · photo', s_onb_photo), ('Onboarding · offers', s_onb_offers), ('Onboarding · hours', s_onb_send), ('My status', s_verification),
   ('Dashboard', s_dashboard), ('Requests', s_requests), ('Verify ID and accept', s_verify_id), ('Packages & availability', s_availability), ('Earnings', s_earnings)]),
 ('Admin', 'Every staff tool, same look.', [
   ('Overview', s_admin), ('Approvals', s_approvals), ('Review profile', s_review_profile), ('Verify IDs', s_verify_ids), ('Bookings', s_admin_bookings), ('Booking actions', s_admin_booking),
   ('Disputes', s_disputes), ('Panic alerts', s_panics), ('Panic alert', s_panic_detail), ('Users', s_users), ('User', s_user), ('Sub-admins', s_admins), ('Prices', s_prices), ('City plans', s_plans),
   ('Broadcast', s_broadcast), ('Activity', s_activity)]),
]

COPY = [('Welcome', 'Find ID-checked companions near you for walks, coffee, events and more.', 'Meet ID-verified people for coffee, walks, events and plans. Always in public places, from ₹399. (+ three trust chips)'),
        ('Log in', 'We’ll send a 6-digit code on WhatsApp.', 'Your number is never shown to anyone. We’ll send a 6-digit code on WhatsApp.'),
        ('Log in button', 'Send OTP', 'Send code'),
        ('PIN', '(title only)', 'Next time, open prsnn with your PIN instead of waiting for a code.'),
        ('Home', 'Who would you like to meet? + tiles', 'Wallet cards + “Every companion is ID-checked. Meet in public places, with a panic button on during every session.”'),
        ('Search empty', 'No results', 'No one matches “…” yet. You’re only seeing women companions. Try a wider search, or change who you’d like to meet. (open item now done)'),
        ('Review and pay', 'Pay', 'Pay ₹1,299 securely, with refund terms written in plain words above the button'),
        ('Booked', 'Payment received', 'You’re booked. We’re confirming Maya now; you’ll get a WhatsApp message the moment she accepts.'),
        ('Panic', 'Hold for 3 seconds', 'Feel unsafe? Hold the button. Every prsnn admin is alerted at once, and again every 5 minutes until you’re safe.'),
        ('Become a companion', 'Earn doing what you love', '+ four reasons (80%, your hours, public places, ID at first booking) and “A 4-hour booking pays you ₹1,039”'),
        ('My status', 'Status text', 'Your profile is with our team. Most profiles are reviewed within a day. We’ll message you on WhatsApp when you’re live.')]

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:#E4E4EA;font-family:Urbanist,sans-serif;color:{M};-webkit-font-smoothing:antialiased}}*{{font-variant-numeric:lining-nums}}
:root{{{''.join(f"--{k}:url({v});" for k, v in DATA.items())}}}
.intro{{max-width:1500px;margin:0 auto;padding:36px 32px 6px}}.intro h1{{font:600 36px Urbanist;letter-spacing:-1px;margin:0 0 8px}}.intro p{{margin:0 0 6px;max-width:92ch;line-height:1.6;color:{MUT};font-size:15.5px}}
.toc{{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}}.toc a{{font:600 13px Urbanist;color:{M};text-decoration:none;background:{W};padding:7px 13px;border-radius:99px;box-shadow:inset 0 0 0 1px {LINE}}}
.grp{{max-width:1500px;margin:0 auto;padding:26px 32px 10px}}.grp h2{{font:600 26px Urbanist;margin:0}}.grp>p{{margin:4px 0 16px;color:{MUT}}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:28px 22px}}.cell{{display:flex;flex-direction:column;align-items:center;gap:8px}}.cap{{font:600 13px Urbanist;color:#4C4F66}}
.ph{{width:300px;height:640px;border-radius:42px;border:9px solid #0A0A0A;position:relative;overflow:hidden;background:{P};box-shadow:0 18px 40px rgba(0,0,0,.20);font-size:13px}}
.notch{{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:84px;height:23px;background:#0A0A0A;border-radius:18px;z-index:20}}
.top{{padding:44px 18px 0;display:flex;justify-content:space-between;align-items:center}}.ibtn{{position:relative;display:inline-flex}}.dot{{position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:{C};box-shadow:0 0 0 2px {P}}}
.bar{{padding:42px 14px 6px;display:flex;align-items:center;justify-content:space-between;gap:8px}}.bt{{font:600 15px Urbanist;flex:1;text-align:center}}.br{{min-width:34px;display:flex;justify-content:flex-end}}
.circ{{width:34px;height:34px;border-radius:17px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:inline-flex;align-items:center;justify-content:center;flex:none}}
.h{{font:600 24px/1.12 Urbanist;letter-spacing:-.5px}}.sub{{font:400 12.5px/1.45 Urbanist;color:{MUT};margin-top:4px}}.lab{{font:600 13px Urbanist}}
.btn{{height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:8px;font:600 14px Urbanist;width:100%;white-space:nowrap}}.btn.sm{{height:38px;border-radius:12px;font-size:12.5px;padding:0 12px}}
.b-dark{{background:{M};color:{P}}}.b-champ{{background:{C};color:{M}}}.b-ghost{{background:{W};color:{M};box-shadow:inset 0 0 0 1px {LINE}}}.b-soft{{background:{DEEP};color:{M}}}.b-danger{{background:{W};color:{RED};box-shadow:inset 0 0 0 1px rgba(179,38,30,.25)}}.b-red{{background:{RED};color:#fff}}
.foot{{position:absolute;left:0;right:0;bottom:0;padding:12px 18px 20px;display:flex;flex-direction:column;gap:8px;background:linear-gradient(180deg,rgba(241,241,244,0),{P} 30%);z-index:8}}
.card{{border-radius:20px;box-shadow:0 1px 2px rgba(24,27,52,.05),0 6px 18px rgba(24,27,52,.05)}}
.group{{margin-top:12px;background:{W};border-radius:18px;padding:0 14px}}.row{{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid {LINE};font-size:13.5px}}.row.last{{border-bottom:none}}
.rico{{width:30px;height:30px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex:none}}.rv{{color:{MUT};font-size:12px;margin-left:auto;text-align:right}}
.lrow{{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid {LINE};font-size:12.5px}}.lrow:last-child{{border-bottom:none}}
.flab{{font:500 12px Urbanist;color:#4C4F66;margin-bottom:5px}}.field{{min-height:46px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;gap:9px;padding:0 13px;font-size:13.5px;flex:1}}
.field.on{{box-shadow:inset 0 0 0 1.5px {M}}}.hint{{font:400 11.5px/1.4 Urbanist;color:{MUT};margin-top:5px}}
.chips{{display:flex;gap:6px}}.chip{{flex:none;font:500 12px Urbanist;padding:7px 12px;border-radius:99px;background:{W};box-shadow:inset 0 0 0 1px {LINE}}}.chip.on{{background:{M};color:{P};box-shadow:none}}
.pill{{display:inline-flex;align-items:center;gap:4px;font:600 10.5px Urbanist;padding:3px 8px;border-radius:99px;white-space:nowrap}}
.notice{{display:flex;gap:9px;align-items:flex-start;border-radius:14px;padding:11px 12px;font:500 12px/1.45 Urbanist;margin-top:10px}}
.seg{{display:flex;padding:4px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE};margin-top:6px}}.seg span{{flex:1;text-align:center;padding:8px 0;border-radius:10px;font:600 12.5px Urbanist;color:{MUT}}}.seg span.on{{background:{M};color:{P}}}
.tabs{{position:absolute;left:0;right:0;bottom:0;height:64px;display:flex;justify-content:space-around;align-items:center;background:{W};border-top:1px solid {LINE};z-index:9;padding-bottom:8px}}
.tabs span{{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:9.5px}}
.av{{display:inline-block;border-radius:50%;flex:none}}
.crow{{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid {LINE}}}
.sheet{{background:{P};border-radius:24px 24px 0 0;padding:18px 18px 0;position:relative;margin-top:-20px}}
.or{{text-align:center;font:500 12px Urbanist;color:{MUT};margin:12px 0}}.fine{{font:400 11px/1.45 Urbanist;color:{MUT};text-align:center;margin-top:12px}}
.glass{{display:inline-flex;gap:5px;align-items:center;font:500 11px Urbanist;padding:5px 9px;border-radius:99px;background:rgba(241,241,244,.14);backdrop-filter:blur(6px)}}
.obs{{display:flex;gap:7px;margin-top:16px}}.ob{{flex:1;height:52px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;justify-content:center;font:700 22px Outfit}}.ob.f{{box-shadow:inset 0 0 0 1.5px {M}}}
.lockb{{display:inline-flex;width:58px;height:58px;border-radius:29px;background:{M};align-items:center;justify-content:center}}
.pbs{{display:flex;gap:12px;justify-content:center;margin-top:16px}}.pb{{width:48px;height:56px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;justify-content:center;font:700 26px Outfit}}.pb.f{{box-shadow:inset 0 0 0 1.5px {M}}}
.keys{{display:grid;grid-template-columns:repeat(3,64px);gap:10px 22px;justify-content:center;margin-top:16px}}.keys .k{{width:64px;height:64px;border-radius:50%;background:{W};box-shadow:0 1px 2px rgba(24,27,52,.08);display:flex;align-items:center;justify-content:center;font:600 22px Outfit}}
.ctile{{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;background:{W};margin-top:8px;box-shadow:inset 0 0 0 1px {LINE}}}.ctile.on{{box-shadow:inset 0 0 0 1.5px {C};background:{CM}}}
.cb{{width:22px;height:22px;border-radius:7px;flex:none;display:inline-flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px #C2C3CF;background:{W}}}.cb.on{{background:{M};box-shadow:none}}
.opt{{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:14px;background:{W};margin-top:8px;box-shadow:inset 0 0 0 1px {LINE};font-size:13px}}.opt.on{{box-shadow:inset 0 0 0 1.5px {C};background:{CM}}}
.rd{{width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 2px #C2C3CF;flex:none}}.rd.on{{box-shadow:inset 0 0 0 6px {M}}}
.hscroll{{display:flex;gap:10px;margin-top:8px;overflow:hidden}}.num{{width:22px;height:22px;border-radius:50%;background:{M};color:{P};font:700 11px Outfit;display:inline-flex;align-items:center;justify-content:center;flex:none}}
.dchip{{flex:1;display:flex;flex-direction:column;align-items:center;padding:8px 0;border-radius:12px;background:{W};box-shadow:inset 0 0 0 1px {LINE};font:500 11px Urbanist}}.dchip b{{font:700 14px Outfit}}.dchip.on{{background:{M};color:{P};box-shadow:none}}
.day{{flex:1;height:34px;border-radius:10px;background:{W};box-shadow:inset 0 0 0 1px {LINE};display:flex;align-items:center;justify-content:center;font:600 12px Urbanist;color:{MUT}}}.day.on{{background:{M};color:{P};box-shadow:none}}
.cal{{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin:8px 0 12px}}.cd{{height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font:600 12.5px Urbanist;background:{W}}}.cd.on{{background:{M};color:{P}}}.cd.off{{background:transparent;color:#B8B9C6}}
.wcard{{position:relative;border-radius:24px;overflow:hidden;padding:16px 18px;display:flex;flex-direction:column;box-shadow:0 16px 32px rgba(24,27,52,.25)}}.wr{{position:relative;display:flex;justify-content:space-between;align-items:center}}
.wtab{{position:relative;height:56px;border-radius:18px;overflow:hidden;padding:0 16px;display:flex;align-items:center;box-shadow:0 -4px 14px rgba(24,27,52,.10)}}.wtab .wr{{width:100%}}
.okb{{display:inline-flex;width:76px;height:76px;border-radius:38px;background:{M};align-items:center;justify-content:center}}
.tl{{display:flex;flex-direction:column}}.ts{{display:flex;gap:12px;padding-bottom:12px;position:relative}}.ts:not(:last-child)::before{{content:"";position:absolute;left:10.5px;top:24px;bottom:2px;width:1.5px;background:#D5D6DF}}
.tdot{{width:22px;height:22px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px #C2C3CF;background:{W};position:relative;z-index:1}}.tdot.done{{background:{M};box-shadow:none}}.tdot.now{{box-shadow:inset 0 0 0 6px {C}}}
.tt{{font:600 13px Urbanist}}.td{{font:400 11.5px Urbanist;color:{MUT}}}
.ticket{{border-radius:22px;background:{M};color:{P};position:relative;box-shadow:0 14px 30px rgba(24,27,52,.25)}}.tear{{border-top:1.5px dashed rgba(241,241,244,.25);margin:0 14px;position:relative}}
.tear::before,.tear::after{{content:"";position:absolute;top:-9px;width:18px;height:18px;border-radius:50%;background:{P}}}.tear::before{{left:-23px}}.tear::after{{right:-23px}}
.msgs{{display:flex;flex-direction:column;gap:8px;padding:12px 14px 0}}.bub{{max-width:78%;padding:8px 11px;border-radius:16px;font-size:12.5px;line-height:1.35}}.bub.me{{align-self:flex-end;background:{M};color:{P};border-bottom-right-radius:4px}}
.bub.them{{align-self:flex-start;background:{W};box-shadow:inset 0 0 0 1px {LINE};border-bottom-left-radius:4px}}.bt2{{font-size:9.5px;opacity:.6;text-align:right;margin-top:2px}}
.comp{{position:absolute;left:0;right:0;bottom:226px;padding:8px 10px;display:flex;gap:7px;align-items:center;background:{W};border-top:1px solid {LINE}}}.cin{{flex:1;background:{P};border-radius:20px;padding:10px 13px;font-size:12.5px}}
.hidek{{width:38px;height:38px;border-radius:19px;background:{P};box-shadow:inset 0 0 0 1px {LINE};display:inline-flex;align-items:center;justify-content:center}}.sendb{{width:38px;height:38px;border-radius:19px;background:{M};display:inline-flex;align-items:center;justify-content:center}}
.cur{{display:inline-block;width:1.5px;height:14px;background:{M};vertical-align:-2px;margin-left:1px}}
.scr{{position:absolute;inset:0;overflow-y:auto;scrollbar-width:none}}.scr::-webkit-scrollbar{{display:none}}.scr.pad{{padding-bottom:110px}}.kb{{position:absolute;left:0;right:0;bottom:0;height:226px;background:#D1D3D9}}
.unread{{width:9px;height:9px;border-radius:50%;background:{C};flex:none}}
.empty{{display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 10px 0}}.ebig{{width:64px;height:64px;border-radius:20px;background:{CM};display:inline-flex;align-items:center;justify-content:center}}
.stat{{background:{W};border-radius:16px;padding:12px;text-align:center;box-shadow:0 1px 2px rgba(24,27,52,.05)}}.sv{{font:700 19px Outfit}}.sl{{font:500 11px Urbanist;color:{MUT};margin-top:2px}}
.up{{height:76px;border-radius:14px;border:1.5px dashed {C};background:{CM};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font:600 11.5px Urbanist;color:{CD}}}
.pfield{{margin-left:auto;background:{P};border-radius:10px;padding:6px 10px;font:700 13px Outfit}}
.copy{{max-width:1500px;margin:0 auto;padding:10px 32px 50px}}.copy table{{width:100%;border-collapse:collapse;background:{W};border-radius:18px;overflow:hidden;font-size:13.5px}}
.copy td,.copy th{{text-align:left;padding:11px 14px;border-bottom:1px solid {LINE};vertical-align:top}}.copy th{{font-weight:600;background:{CM}}}
'''

def phone(fn):
    html = fn()
    cut = max(html.rfind('<div class="tabs">'), html.rfind('<div class="foot"'))
    content, fixed = (html[:cut], html[cut:]) if cut > 0 else (html, '')
    return f'<div class="ph"><div class="notch"></div><div class="scr{" pad" if fixed else ""}">{content}</div>{fixed}</div>'
if __name__ == '__main__':
    count = sum(len(s) for _, _, s in GROUPS)
    toc = ''.join(f'<a href="#g{i}">{g} · {len(s)}</a>' for i, (g, _, s) in enumerate(GROUPS))
    groups_html = ''.join(f'<section class="grp" id="g{i}"><h2>{g}</h2><p>{d}</p><div class="grid">' + ''.join(f'<div class="cell">{phone(fn)}<span class="cap">{t}</span></div>' for t, fn in s) + '</div></section>'
                          for i, (g, d, s) in enumerate(GROUPS))
    copy_html = '<section class="copy"><h2 style="font:600 26px Urbanist;margin:10px 0 12px">Copy changes</h2><table><tr><th>Screen</th><th>Today</th><th>New</th></tr>' + ''.join(f'<tr><td><b>{a}</b></td><td style="color:{MUT}">{b}</td><td>{c}</td></tr>' for a, b, c in COPY) + '</table></section>'
    html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn screens</title>'
            '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
            f'<style>{CSS}</style></head><body><div class="intro"><h1>prsnn. · every screen in the new look</h1>'
            f'<p>{count} screens: the approved palette, Urbanist, the Outfit logo with the champagne dot, Wallet cards on Home and price cards in the same style. UI and copy only; every screen keeps the features it has today. Copy is sharper but every claim is true (no invented reviews, ratings or counts).</p>'
            f'<div class="toc">{toc}<a href="#copy">Copy changes</a></div></div>{groups_html}<div id="copy"></div>{copy_html}</body></html>')
    html = re.sub(r'url\(IMG_(\w+)\)', r'var(--\1)', html)
    (ROOT / 'preview/all-screens.html').write_text(html)
    print('wrote preview/all-screens.html', count, 'screens', len(html) // 1024, 'KB')
