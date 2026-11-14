"""Generates preview/all-screens-v2.html: every screen and state of the app in the approved
new look, checked against preview/screens-gap-audit.md (nothing from the current app left
out). Adds one approved feature: the panic button in chat. UI and copy only.
Run: python3 scripts/design/screens_v2.py"""
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import all_screens as A
from all_screens import (top, bar, h, btn, foot, body, card, row, group, label, field, chips, pill, notice, seg, tabs, avatar, photo, shade,
                         checkbox, stat, keypad, price_card, price_tab, stack, ic, img, logo, inr, PRICES, wv)

P, W, M, MUT, C, CD, CM, LINE, DEEP, STEEL = A.P, A.W, A.M, A.MUT, A.C, A.CD, A.CM, A.LINE, A.DEEP, A.STEEL
RED, REDS = A.RED, A.REDS
CATS = wv.CATS
earn = lambda h_: PRICES[h_] * 8 // 10

# ───────── extra building blocks ─────────
def tl(steps):
    """Timeline; state: done | now | todo | stop."""
    out = ''
    for a, b, st in steps:
        dot = {'done': f'<span class="tdot done">{ic("check", P, 12, 2.8)}</span>', 'now': '<span class="tdot now"></span>',
               'todo': '<span class="tdot"></span>', 'stop': f'<span class="tdot" style="background:{RED};box-shadow:none">{ic("x", "#fff", 11, 2.8)}</span>'}[st]
        out += f'<div class="ts">{dot}<div><div class="tt" style="{"color:" + MUT if st == "todo" else ""}">{a}</div>' + (f'<div class="td">{b}</div>' if b else '') + '</div></div>'
    return f'<div class="tl">{out}</div>'
def opt(title, sub=None, on=False, icon=None, extra=''):
    return (f'<div class="opt{" on" if on else ""}" style="align-items:center;gap:10px;{extra}">' + (f'<span class="rico" style="background:{W if on else CM}">{ic(icon, CD, 16)}</span>' if icon else '')
            + f'<div style="flex:1"><div style="font:600 13.5px Urbanist">{title}</div>' + (f'<div style="font:400 11.5px/1.35 Urbanist;color:{MUT};margin-top:1px">{sub}</div>' if sub else '') + f'</div><span class="rd{" on" if on else ""}"></span></div>')
def sheet(inner, dim=True):
    return (f'<div class="dim"></div>' if dim else '') + f'<div class="bsheet"><div class="grab"></div>{inner}</div>'
def sos(size=112, label='hold 3 s', pulse=True):
    return (f'<div style="margin:0 auto;width:{size + 38}px;height:{size + 38}px;border-radius:50%;background:{REDS};display:flex;align-items:center;justify-content:center">'
            f'<div style="width:{size}px;height:{size}px;border-radius:50%;background:{RED};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;box-shadow:0 10px 24px rgba(179,38,30,.35)">'
            f'<span style="font:700 {size * .22:.0f}px Outfit;letter-spacing:1px">SOS</span><span style="font:500 11px Urbanist;opacity:.9">{label}</span></div></div>')
def setup_head(step, total, tag=None):
    return (bar() + f'<div style="padding:4px 18px 0;display:flex;gap:4px">' + ''.join(f'<i style="flex:1;height:4px;border-radius:2px;background:{M if i < step else "#D5D6DF"}"></i>' for i in range(total)) + '</div>'
            f'<div style="padding:10px 18px 0;font:600 11.5px Urbanist;color:{CD}">Step {step} of {total}{" · " + tag if tag else ""}</div>')
def q(title, sub=None):
    return h(title, sub, 23, '4px 18px 0')
def bc(k, name, place, price='from ₹399', badge='ok', locked=False):
    """Companion row as on Search / Category."""
    av = (f'<span class="av" style="width:54px;height:54px;background:{DEEP};display:inline-flex;align-items:center;justify-content:center;position:relative;overflow:hidden">'
          f'<span style="position:absolute;inset:0;background:{img(k)} center/cover;filter:blur(7px);transform:scale(1.2);opacity:.7"></span><span style="position:relative">{ic("lock", M, 18)}</span></span>') if locked else avatar(k, 54)
    b = pill(f'{ic("shield", CD, 10)} ID verified', 'champ') if badge == 'ok' else pill('New on prsnn', 'grey')
    return (f'<div class="crow">{av}<div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:center"><span style="font:600 14.5px Urbanist">{name}</span>{b}</div>'
            f'<div style="font:400 11.5px Urbanist;color:{MUT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{place}</div><div style="font:600 12px Urbanist;color:{CD};margin-top:2px">{price}</div></div>{ic("heart", MUT, 18)}</div>')
def bk_card(k, name, stg, tone, when, length, pay=None, extra='', act='view'):
    acts = {'view': btn('View details', 'ghost', None, True, True), 'chat': f'<div style="display:flex;gap:8px">{btn("View", "ghost", None, True, True)}{btn("Chat", "dark", "chat", True, True)}</div>',
            'pay': btn(pay or 'Pay ₹1,299', 'dark', 'lock', True, True)}[act]
    return card(f'<div style="display:flex;gap:12px;align-items:center">{avatar(k, 46)}<div style="flex:1"><div style="font:600 14.5px Urbanist">{name}</div><div style="margin-top:3px">{pill(stg, tone)}</div></div><b style="font:700 15px Outfit">₹1,299</b></div>'
                f'<div class="lrow" style="border:none;padding:8px 0 2px">{ic("cal", CD, 14)}<span>{when}</span></div><div class="lrow" style="border:none;padding:2px 0">{ic("clock", CD, 14)}<span>{length}</span></div>{extra}<div style="margin-top:8px">{acts}</div>', mt=10)
def banner(title, sub, tone='champ', icon='clock', cta=None):
    bg = {'champ': CM, 'red': REDS, 'dark': M, 'grey': DEEP}[tone]; fg = P if tone == 'dark' else M
    return (f'<div class="card" style="background:{bg};padding:12px 14px;margin-top:10px;display:flex;gap:10px;align-items:flex-start"><span class="rico" style="background:{W if tone != "dark" else "rgba(241,241,244,.12)"}">{ic(icon, C if tone == "dark" else (RED if tone == "red" else CD), 16)}</span>'
            f'<div style="flex:1;color:{fg}"><div style="font:600 13.5px Urbanist">{title}</div><div style="font:400 11.5px/1.4 Urbanist;opacity:.8;margin-top:2px">{sub}</div>' + (f'<div style="margin-top:8px">{cta}</div>' if cta else '') + '</div></div>')
def offline():
    return f'<div style="margin:6px 18px 0;padding:8px 12px;border-radius:12px;background:{M};color:{P};display:flex;gap:8px;align-items:center;font:500 12px Urbanist">{ic("globe", C, 14)}You’re offline. Showing what you saw last; we’ll refresh when you’re back.</div>'
def skel(hgt, w='100%', mt=10, r=16):
    return f'<div class="sk" style="height:{hgt}px;width:{w};margin-top:{mt}px;border-radius:{r}px"></div>'

# ═══════════════ GET STARTED ═══════════════
def g_splash():
    tile = lambda k, w, hh, rot, x, y: f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{hh}px;border-radius:18px;background:{img(k)} center/cover;transform:rotate({rot}deg);box-shadow:0 10px 24px rgba(24,27,52,.18)"></div>'
    return (tile('coffee', 120, 96, -6, 18, 70) + tile('together', 104, 128, 5, 160, 96) + tile('walks', 110, 90, 4, 22, 450) + tile('study', 120, 96, -5, 150, 430)
            + f'<div style="position:absolute;left:0;right:0;top:270px;display:flex;flex-direction:column;align-items:center;gap:10px">{logo(44)}<div class="sub" style="margin:0">Good company, on your terms.</div></div>'
            + f'<div style="position:absolute;left:0;right:0;bottom:28px;text-align:center;font:500 12px Urbanist;color:{MUT}">Real people. Real moments.</div>')
def g_welcome():
    return A.s_welcome()
def g_role():
    return A.s_role().replace('I’m here to…', 'I’m here as a…').replace('Tap one to continue. You can switch later.', 'Tap one to continue.')
def g_login(mode='normal'):
    reset = mode == 'reset'
    head = (f'<div style="height:200px;background:{img("park")} center/cover;position:relative">{shade(.7)}<div style="position:absolute;top:44px;left:18px">{logo(22, P, C)}</div>'
            f'<div style="position:absolute;left:18px;bottom:30px;color:{P}"><div style="font:600 22px Urbanist">{"Reset your PIN" if reset else "Welcome to prsnn."}</div>'
            f'<div style="font:400 12.5px Urbanist;opacity:.9">{"We’ll send a code, then you choose a new PIN." if reset else "Continue with your mobile number."}</div></div></div>')
    note = notice('For your safety, please confirm it’s you with a code this once. Anything you were filling in is saved on this phone.', 'champ', 'lock') if mode == 'expired' else ''
    err = mode == 'error'
    return (head + '<div class="sheet">' + note
            + field('Mobile number', '🇮🇳 +91 &nbsp;98765 432' if err else '🇮🇳 +91 &nbsp;98765 43210', None, on=True, mt=8 if note else 0)
            + (f'<div class="hint" style="color:{RED}">Enter a 10-digit Indian mobile number.</div>' if err else '<div class="hint">Your number is never shown to anyone. We’ll send a 6-digit code on WhatsApp.</div>')
            + f'<div style="margin-top:12px">{btn("Send code")}</div>'
            + ('' if reset else f'<div style="margin-top:8px">{btn("Log in with PIN · +91 98765 43210", "ghost", "lock")}</div><div class="or">Not in India?</div>{btn("Continue with email", "soft", "mail")}'
               f'<div class="fine">By continuing, you agree to get login codes and booking updates on WhatsApp, and to our <u>Terms of Service</u> and <u>Privacy Policy</u>.</div>') + '</div>')
def g_otp(mode='wa'):
    boxes = ''.join(f'<span class="ob{" f" if d else ""}">{d}</span>' for d in (['4', '8', '2', '6', '', ''] if mode != 'resend' else [''] * 6))
    sub = 'We sent a 6-digit code to sam@example.com. Check spam if you don’t see it.' if mode == 'email' else 'We sent a 6-digit code to +91 98765 43210 on WhatsApp.'
    tail = (f'<div class="sub" style="text-align:center;margin-top:18px">Resend code in 24s</div>' if mode in ('wa', 'email') else
            f'<div style="text-align:center;margin-top:12px;font:500 12.5px Urbanist;color:{CD}">We sent a new code on WhatsApp.</div><div style="margin-top:12px">{btn("Resend on WhatsApp", "ghost")}</div><div style="margin-top:8px">{btn("Send by SMS instead", "ghost")}</div>')
    return bar() + q('Enter the code', sub) + body(f'<div class="obs">{boxes}</div>{tail}') + foot(btn('Verify'))
def g_email():
    return (bar() + q('Not in India?', 'Sign up with your email. We’ll send you a code.')
            + body(field('Email', 'name@example.com', None, ph=True, on=True)) + foot(btn('Email me a code')))
def pin_screen(title, sub, filled=0, err=None, skip=False, login=False):
    boxes = ''.join(f'<span class="pb{" f" if i < filled else ""}">{"•" if i < filled else ""}</span>' for i in range(4))
    return ((bar('', f'<span style="font:600 13px Urbanist;color:{MUT}">Skip</span>' if skip else '') if not login else '<div style="height:52px"></div>')
            + f'<div style="text-align:center;padding-top:{4 if not login else 6}px">' + (logo(24) if login else f'<span class="lockb">{ic("lock", P, 24)}</span>')
            + f'<div class="h" style="font-size:22px;margin-top:12px">{title}</div><div class="sub" style="padding:0 28px">{sub}</div><div class="pbs">{boxes}</div>'
            + f'<div style="height:18px;margin-top:6px;font:500 12px Urbanist;color:{RED}">{err or ""}</div></div>{keypad()}'
            + (f'<div style="text-align:center;margin-top:10px;font:600 13px Urbanist;color:{CD}">Forgot PIN? Reset it with a code</div><div style="text-align:center;margin-top:8px;font:500 12px Urbanist;color:{MUT}">Not you? Log in with another number</div>' if login else ''))
def g_pin_set(): return pin_screen('Set a 4-digit PIN', 'You’re verified. Next time, open prsnn with this PIN, no code needed.', 2, skip=True)
def g_pin_confirm(): return pin_screen('Confirm your PIN', 'Enter the same 4 digits again.', 0, 'That PIN is too easy to guess. Try another.')
def g_pin_login(): return pin_screen('Enter your PIN', 'For +91 98765 43210', 0, 'Incorrect PIN.', login=True)
N = 8
def s1(): return setup_head(1, N) + q('What’s your name?', 'Companions see only your first name.') + body(notice('Your answers are saved.', 'champ', 'check') + field('Full name', 'Sam Rivera', on=True)) + foot(btn('Next →'))
def s2(): return (setup_head(2, N) + q('Your mobile number', 'We never show it to anyone.')
                  + body(label('Your country', 8) + chips(['United Kingdom', 'United States', 'United Arab Emirates', 'Canada', 'Australia', 'Singapore', 'Germany', 'France', 'Saudi Arabia', 'Qatar', 'Other'], (0,), 8)
                         + field('Mobile with country code', '+44 7700 900123', None, on=True)) + foot(btn('Next →')) + '<div class="tagnote">Email sign-ups only</div>')
def s3(): return A.s_setup_where().replace('Step 7 of 7', 'Step 3 of 8').replace('<i style="flex:1;height:4px;border-radius:2px;background:#181B34"></i>' * 7, '') if False else (setup_head(3, N) + q('Where are you based?', 'We’ll show people near you.')
                  + body(field('State', 'Telangana') + field('City', 'Hyderabad') + field('Area', 'Search by area or PIN code', ph=True, on=True)
                         + card(''.join(f'<div class="lrow">{ic("pin", CD, 15)}<span>{a}</span><span class="rv">{b}</span></div>' for a, b in [('Gachibowli', '500032'), ('Banjara Hills', '500034'), ('Jubilee Hills', '500033')]), mt=8, pad='4px 14px'))
                  + foot(btn('Next →')))
def s4():
    tiles = ''.join(f'<div class="ctile{" on" if i in (0, 1) else ""}"><span class="av" style="width:40px;height:40px;border-radius:12px;background:{img(k)} center/cover"></span><div style="flex:1"><div style="font:600 14px Urbanist">{t}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div><span class="cb{" on" if i in (0, 1) else ""}">{ic("check", P, 12, 2.6) if i in (0, 1) else ""}</span></div>' for i, (t, s, k) in enumerate(CATS))
    return setup_head(4, N) + q('What would you like to do?', 'Pick one or more.') + body(tiles) + foot(btn('Next · 2 chosen →'))
def s5(): return setup_head(5, N) + q('I am') + body(''.join(opt(t, None, False, 'user') for t in ['Woman', 'Man', 'Non-binary']) )
def s6(): return (setup_head(6, N) + q('Who would you like to meet?', 'You can change this later.')
                  + body(opt('Women', None, True, 'users') + opt('Men', None, False, 'users')
                         + opt('Non-binary', None, False, 'users') + opt('Anyone', None, False, 'users')))
def s7():
    tips = ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:7px;font-size:12.5px">{ic("shield", CD, 14)}{t}</div>' for t in ['Face clearly visible', 'Just you', 'Good light'])
    return (setup_head(7, N) + q('Add your photo', 'Our team checks every photo.')
            + body(f'<div style="margin:14px auto 0;width:124px;height:124px;border-radius:50%;border:2px dashed {C};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:{CD};font:600 13px Urbanist;background:{CM}">{ic("cam", CD, 26)}Add photo</div>{tips}')
            + foot(btn('Next →')))
def s8(): return (setup_head(8, N) + q('Who can see your photo?', 'You can change this later.')
                  + body(opt('Locked', 'Only people you’ve booked with', True, 'lock')
                         + opt('Open', 'Everyone', False, 'globe')))

# ═══════════════ MEMBER ═══════════════
def home_head(unread=True):
    return (f'<div class="top">{logo(21)}<span style="display:flex;gap:10px;align-items:center"><span class="chip" style="display:inline-flex;gap:5px;align-items:center;padding:6px 10px">{ic("pin", CD, 13)}Gachibowli{ic("down", MUT, 12)}</span>'
            f'<span class="ibtn">{ic("bell", M, 19)}' + (f'<i class="dot" style="width:15px;height:15px;top:-6px;right:-7px;font:700 9px Outfit;color:{M};display:flex;align-items:center;justify-content:center">2</i>' if unread else '') + '</span></span></div>')
def wallet_home(sel=1):
    big = CATS[sel]
    hero = (f'<div style="position:relative;height:200px;border-radius:24px;overflow:hidden;background:{img(big[2])} center/cover;box-shadow:0 16px 34px rgba(24,27,52,.28)">'
            f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,52,.05) 30%,rgba(24,27,52,.92))"></div>'
            f'<div style="position:absolute;top:14px;left:16px;right:16px;display:flex;justify-content:space-between">{logo(12, P, C)}<span style="font:500 11px Urbanist;color:{P};opacity:.85">{sel + 1} of 5</span></div>'
            f'<div style="position:absolute;left:16px;right:16px;bottom:14px;color:{P}"><div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="font:600 22px/1.05 Urbanist">{big[0]}</div><div style="font:400 11.5px Urbanist;opacity:.85;margin-top:3px">{big[1]}</div></div>'
            f'<span style="font:600 11.5px Urbanist;color:{C}">from ₹999</span></div>'
            f'<div style="margin-top:10px;height:38px;border-radius:13px;background:{C};color:{M};display:flex;align-items:center;justify-content:center;font:600 13px Urbanist">Find company →</div></div></div>')
    others = [c for i, c in enumerate(CATS) if i != sel]
    mats = ['black', 'pearl', 'steel', 'mist']
    rest = ''.join(f'<div style="margin-top:{10 if i == 0 else -16}px;position:relative">{wv.card(c, m, 52, False).replace("padding:14px 16px", "padding:9px 16px")}</div>' for i, (c, m) in enumerate(zip(others, mats)))
    return hero + rest
def m_home():
    return (home_head() + f'<div style="padding:10px 18px 0"><div class="sub" style="margin:0">Good evening, Sam</div><div class="h" style="font-size:22px;margin-top:2px">Who would you like to meet?</div></div>'
            + body(notice('Your photo is being reviewed. You can book meanwhile.', 'champ', 'cam') + f'<div style="margin-top:10px">{wallet_home()}</div>', '0 18px') + tabs(0))
def m_home2():
    plans = ''.join(f'<div style="flex:none;width:150px">{photo(k, 88, 16)}<div style="font:600 13px Urbanist;margin-top:6px">{t}</div><div style="font:400 11px Urbanist;color:{MUT}">{d}</div><div style="font:600 11.5px Urbanist;color:{CD}">{hh} hrs · {inr(PRICES[hh])}</div></div>'
                    for k, t, d, hh in [('walks', 'Fort and heritage walk', 'Golconda, tea after', 4), ('events', 'Live music night', 'Gig + dinner', 3)])
    near = ''.join(f'<div style="flex:none;width:116px;position:relative">{photo(k, 120, 16, inner=shade(.6) + f"<span style=&quot;position:absolute;left:8px;bottom:6px;color:#fff;font:600 13px Urbanist&quot;>{n}</span><span style=&quot;position:absolute;top:6px;right:6px&quot;>{ic("heart", "#fff", 15)}</span>")}<div style="font:400 11px Urbanist;color:{MUT};margin-top:5px">{a} · from ₹399</div></div>'
                   for k, n, a in [('evening', 'Maya', 'Banjara Hills'), ('walks', 'Daniel', 'Gachibowli'), ('cozy', 'Leila', 'Jubilee Hills')])
    return (home_head(False) + body(f'<div class="lab" style="margin-top:12px">Popular in Hyderabad</div><div class="hscroll">{plans}</div><div class="lab" style="margin-top:14px">Near you</div><div class="hscroll">{near}</div>'
                                    + card(f'<div style="display:flex;gap:12px;align-items:center"><span class="rico" style="background:{W}">{ic("heart", CD, 16)}</span><div style="flex:1"><div style="font:600 14px Urbanist">Can’t be there for mum or dad?</div><div style="font:400 11.5px/1.4 Urbanist;color:{MUT}">Warm company for someone you love, booked and paid from anywhere.</div></div>{ic("chev", MUT, 14)}</div>', CM, mt=14)
                                    + card(f'<div style="display:flex;gap:8px;align-items:center">{ic("shield", CD, 18)}<b>Safety, built in</b></div><div class="sub" style="margin-top:4px">Every companion is approved by our team and ID-checked before you meet. Public places only, numbers hidden in chat, a panic button in every session, and full refunds if nobody can make it.</div>')) + tabs(0))
def m_home3():
    return (home_head(False) + h('Good company, from ₹399', 'People near you · pay safely · public places only', 21, '10px 18px 0') + offline()
            + body(notice('Our team asked for a new photo.', 'champ', 'cam').replace('</span></div>', f'</span><span style="margin-left:auto;font:600 12px Urbanist;text-decoration:underline">Fix</span></div>', 1)
                   + f'<div class="empty" style="padding-top:22px"><span class="ebig">{ic("users", CD, 28)}</span><div style="font:600 16px Urbanist;margin-top:12px">Companions are joining your city</div><div class="sub" style="text-align:center">We’re approving new companions every day. Meanwhile, book for a loved one in another city, or turn on notifications to hear first.</div>'
                   f'<div style="margin-top:12px">{btn("Turn on notifications", "dark", "bell", False, True)}</div></div>') + tabs(0))
def m_category():
    bullets = ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:6px;font-size:13px">{ic("check", CD, 15, 2.4)}{t}</div>' for t in ['Concerts, weddings, dinners and launches', 'Someone to go with, not a date', 'Meet at the venue, a public place'])
    return (f'<div style="position:relative">{photo("events", 196, 0, inner=shade(.85))}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:16px;color:{P}"><div style="font:600 24px Urbanist">Don’t Go Alone</div><div style="font:400 12.5px Urbanist;opacity:.9">Events, dinners and plans you’d rather share.</div></div></div>'
            + body(bullets + card(f'<div style="font:600 11px Urbanist;color:{CD}">Suggested</div><div style="font:600 17px Urbanist;margin-top:2px">3 hours · ₹999</div><div class="sub" style="margin-top:1px">₹333/hr · save ₹198 (17%) · long enough for the event and a coffee</div>', CM)
                   + label('Popular in Hyderabad') + card(f'<div style="display:flex;justify-content:space-between"><b style="font-size:13.5px">Live music night</b><span style="font:600 12px Urbanist;color:{CD}">3 hrs · ₹999</span></div><div class="sub" style="margin-top:2px">Gig at Hard Rock, dinner after</div>', mt=6)
                   + f'<div class="fine" style="text-align:left;margin-top:6px">Tickets, food and travel are paid by you on the day. The price is the companion’s time.</div>'
                   + label('People in Hyderabad who offer this') + bc('evening', 'Maya', 'Banjara Hills, Hyderabad') + bc('walks', 'Daniel', 'Gachibowli, Hyderabad', badge='new')))
def m_category_empty():
    others = ''.join(f'<span class="chip" style="padding:9px 12px">{c[0]}</span>' for c in CATS if c[0] != 'Work & Study')
    return (f'<div style="position:relative">{photo("study", 170, 0, inner=shade(.85))}<div style="position:absolute;left:18px;bottom:16px;color:{P};font:600 22px Urbanist">Work & Study</div></div>'
            + body(f'<div class="empty" style="padding-top:20px"><span class="ebig">{ic("users", CD, 28)}</span><div style="font:600 16px Urbanist;margin-top:12px">No one offers Work & Study yet</div><div class="sub" style="text-align:center">Companions are joining every week. Try another category, or see everyone near you.</div>'
                   f'<div style="margin-top:12px">{btn("See everyone near you", "dark", None, False, True)}</div><div class="chips" style="flex-wrap:wrap;justify-content:center;margin-top:14px">{others}</div></div>'))
def m_search():
    return (top(False) + h('Search companions', None, 24) + body(f'<div class="field on" style="margin-top:10px">{ic("search", MUT, 17)}<span style="color:{MUT}">Try a name, an area or ‘coffee’</span></div>'
            + f'<div class="chips" style="margin-top:10px;flex-wrap:nowrap;overflow:hidden"><span class="chip on" style="display:inline-flex;gap:4px">{ic("pin", P, 12)}Hyderabad</span><span class="chip">Area</span><span class="chip on" style="display:inline-flex;gap:4px">{ic("filter", P, 12)}Sort</span><span class="chip on" style="display:inline-flex;gap:4px">{ic("users", P, 12)}Showing women</span></div>'
            + f'<div class="panel">{chips(["Recommended", "ID-verified first", "Nearest area", "A–Z"], (0,), 0)}</div>'
            + chips(['All', 'New in Town', 'Don’t Go Alone', 'Explore'], (0,), 8, False)
            + f'<div class="sub" style="margin-top:10px">4 companions</div>' + bc('evening', 'Maya', 'Banjara Hills · Coffee, galleries') + bc('walks', 'Daniel', 'Gachibowli · Walks, cricket') + bc('cozy', 'Leila', 'Jubilee Hills · Books', badge='new', locked=True)) + tabs(1))
def m_search_empty():
    return (top(False) + h('Search companions', None, 24) + body(f'<div class="field on" style="margin-top:10px">{ic("search", MUT, 17)}<span>pottery</span><span style="margin-left:auto">{ic("x", MUT, 15)}</span></div>'
            f'<div class="empty"><span class="ebig">{ic("search", CD, 28)}</span><div style="font:600 16px Urbanist;margin-top:12px">No one matches “pottery”</div><div class="sub" style="text-align:center">Try another word, all areas of Hyderabad, or another category. You’re only seeing women companions; <u>change who you’d like to meet</u>.</div>'
            f'<div style="margin-top:14px">{btn("Clear filters", "dark", None, False, True)}</div></div>') + tabs(1))
def comp_profile(locked=False, new=False):
    durs = ''.join(f'<span class="dchip"><b>{hh} h</b>{inr(PRICES[hh])}</span>' for hh in (1, 2, 4, 6))
    tags = ''.join(f'<span class="tagc">{ic(i, CD, 18)}<span>{t}</span></span>' for i, t in [('star', 'Don’t Go Alone'), ('map', 'Explore')]) + ''.join(f'<span class="chip" style="padding:5px 10px">{t}</span>' for t in ['Coffee', 'Art', 'Hindi'])
    top_img = (f'<div style="height:250px;background:{DEEP};position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:{img("evening")} center/cover;filter:blur(18px);transform:scale(1.2);opacity:.55"></div>'
               f'<span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:30px;background:{W};display:flex;align-items:center;justify-content:center">{ic("lock", M, 24)}</span></div>') if locked else photo('evening', 250, 0)
    trust = (notice('New on prsnn. ID checked by our team before you meet. If it doesn’t pass, you get another companion or a full refund.', 'grey', 'id') if new
             else f'<div style="display:flex;gap:6px;align-items:center;margin-top:6px;font:500 12px Urbanist;color:{CD}">{ic("shield", CD, 14)}ID verified by {logo(10, CD, C)} · public places only</div>')
    return (f'<div style="position:relative">{top_img}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<span class="circ" style="position:absolute;top:42px;right:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("heart", "#fff", 16, 2)}</span></div>'
            f'<div class="sheet" style="margin-top:-22px;padding-top:16px"><div style="display:flex;align-items:center;gap:8px"><span class="h" style="font-size:24px">{"Leila" if locked else "Maya Iyer"}</span>{ic("shield", CD, 18)}</div>'
            + (notice('Leila keeps her photo private. It unlocks once your booking is confirmed and paid.', 'champ', 'lock') if locked else '')
            + f'<div class="sub" style="margin-top:6px">{ic("pin", MUT, 12)} Banjara Hills, Hyderabad</div>{trust}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">{tags}</div>'
            f'<div class="lab" style="margin-top:12px">About me</div><div style="font:400 13px/1.5 Urbanist;color:#4C4F66">Gallery openings, long coffees and city walks. Calm, curious and a good listener.</div>'
            f'<div class="lab" style="margin-top:12px">Durations and prices</div><div style="display:flex;gap:6px;margin-top:6px">{durs}</div>'
            f'<div class="lab" style="margin-top:12px">Availability</div>' + card(f'<div class="lrow" style="border:none">{ic("cal", CD, 15)}<span>Mon · Tue · Thu · Fri · Sat · Sun</span></div><div class="lrow" style="border:none">{ic("clock", CD, 15)}<span>10:00 AM – 8:00 PM</span></div>', mt=6, pad='2px 14px')
            + '</div>' + f'<div class="foot" style="flex-direction:row;align-items:center;background:{W};border-top:1px solid {LINE};padding-top:12px"><div style="flex:1"><div style="font:700 18px Outfit">From ₹399</div><div style="font:400 11px Urbanist;color:{MUT}">for 1 hour · longer costs less per hour</div></div><div style="width:130px">{btn("Book now")}</div></div>')
def m_companion(): return comp_profile()
def m_companion_locked(): return comp_profile(True, True)
def m_book():
    rest = [price_tab(x) for x in (1, 2, 6)]
    wk = ''.join(f'<span style="text-align:center;font:500 10.5px Urbanist;color:{MUT}">{d}</span>' for d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    days = ''.join(f'<span class="cd{" on" if d == 22 else (" off" if d < 15 or d in (19,) else "")}" style="{"text-decoration:line-through" if d < 15 or d == 19 else ""}">{d}</span>' for d in range(9, 30))
    times = ''.join(f'<span class="chip{" on" if t == "4:00 PM" else ""}">{t}</span>' for t in ['10:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM'])
    return (bar('Book a time') + body(h('Choose your time', 'Choose how long you’d like company. Longer bookings offer a lower hourly rate.', 20, '0') + f'<div style="margin-top:10px">{price_card(4, 150)}{stack(rest, -16)}</div>'
                                      + label('Pick a day', 16) + card(f'<div style="display:flex;justify-content:space-between;align-items:center"><span>{ic("back", MUT, 16)}</span><b>November 2026</b><span>{ic("chev", M, 16)}</span></div><div class="cal" style="margin-bottom:4px">{wk}{days}</div>', mt=6, pad='10px 12px')
                                      + label('Start time') + f'<div class="chips" style="margin-top:8px;flex-wrap:wrap">{times}</div><div class="hint">4:00 PM – 8:00 PM · sessions run between 7 AM and 10 PM</div>')
            + foot(btn('Continue · ₹1,299')))
def m_book_noslot():
    return (bar('Book a time') + body(label('Start time', 6) + notice('No 12-hour slot fits that day between 7 AM and 10 PM. Try another day or a shorter time.', 'grey', 'clock')
                                      + label('Before you choose') + f'<div class="sub">Choose how long first. Then pick a day.</div>') + foot(btn('Continue', 'soft')))
def m_review1():
    cats = ''.join(f'<span class="chip{" on" if t == "Don’t Go Alone" else ""}">{t}</span>' for t in ['Don’t Go Alone', 'Explore & Discover'])
    return (bar('Review & pay') + body(card(f'<div style="display:flex;gap:12px;align-items:center">{avatar("evening", 56, True)}<div><div style="font:600 15px Urbanist">Maya Iyer</div><div class="sub" style="margin:0">Banjara Hills, Hyderabad</div></div></div>', mt=4)
                                       + card(f'<div class="lrow" style="border:none">{ic("cal", CD, 15)}<span>Sat, 22 Nov 2026</span></div><div class="lrow" style="border:none">{ic("clock", CD, 15)}<span>4:00 PM – 8:00 PM (4 hours)</span></div>', pad='2px 14px')
                                       + label('What’s it for?') + f'<div class="chips" style="margin-top:8px">{cats}</div>'
                                       + label('Where will you meet?') + field('A public place', 'Blue Tokai, Banjara Hills', 'Public places only: cafés, malls, parks. You can fine-tune it in chat.', mt=6)
                                       + label('Who is this for?') + seg(['Me', 'Someone else'], 0) + field('Anything else? (optional)', 'Say what you’d like to do', None, ph=True, tall=True)))
def m_review2():
    rel = ''.join(f'<span class="chip{" on" if t == "Mother" else ""}">{t}</span>' for t in ['Mother', 'Father', 'Grandparent', 'Relative', 'Friend', 'Other'])
    return (bar('Review & pay') + body(label('Who is this for?', 4) + seg(['Me', 'Someone else'], 1) + f'<div class="chips" style="margin-top:10px;flex-wrap:wrap">{rel}</div>'
                                       + field('Their name', 'Fatima Khan') + field('Their mobile', '🇮🇳 +91 &nbsp;90000 11111', 'Kept private: only our team sees it, for safety. The companion never does.')
                                       + field('Their city (if not the same)', 'Hyderabad', ph=True)
                                       + notice('You pay and get every update. They meet Maya in a public place. Companionship only, no medical or care services.', 'champ', 'heart')
                                       + f'<div class="tagnote" style="position:static;margin-top:8px">“Other” adds: Who are they to you? (e.g. my neighbour, my aunt)</div>'))
def m_review3():
    steps_ = ''.join(f'<div style="display:flex;gap:10px;align-items:flex-start;margin-top:9px;font-size:12px;line-height:1.45"><span class="num">{i + 1}</span><span>{t}</span></div>' for i, t in enumerate(
        ['You pay now. Payment reserves your booking; it’s confirmed when a companion accepts, and shows “Paid · awaiting companion” until then.', 'Maya gets between 15 minutes and 5 hours to accept, depending on how far away your session is.',
         'If she can’t, we offer it to up to 2 similar companions (same city, your “show me” choice, free for this length), one at a time.', 'Nobody accepts by 1 hour before? It’s cancelled and you get a full refund automatically.']))
    terms = ''.join(f'<div style="display:flex;gap:8px;margin-top:6px;font-size:12px;line-height:1.4">{ic("check", CD, 14)}<span>{t}</span></div>' for t in ['Cancel 15 minutes or more before the start: 85% back', 'Less than 15 minutes, or after it starts: no refund', 'If your companion cancels: 100% back'])
    price = ''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{c_}">{b}</span></div>' for a, b, c_ in [('4-hour package · ₹325/hour', '₹1,299', M), ('You save vs. hourly', '₹297', CD), ('Booking fee', '₹0 · no fee', CD)])
    return (bar('Review & pay') + body(label('Price', 4) + card(price + f'<div style="display:flex;justify-content:space-between;padding-top:10px"><b>Total you pay now</b><b style="font:700 18px Outfit">₹1,299</b></div>', mt=6, pad='4px 14px 12px')
                                       + label('How it works') + card(steps_, mt=6, pad='4px 14px 12px') + label('Cancellation & refunds') + card(terms + '<div class="sub" style="margin-top:8px">Refunds go back to your original payment method. Questions: support@prsnn.com</div>', mt=6, pad='6px 14px 12px')
                                       + checkbox(True, 'I’ve read and agree to the price, the cancellation and refund terms, and that my booking may go to a similar companion if Maya can’t make it.'))
            + foot(btn('Continue to pay ₹1,299', 'dark', 'lock')))
def m_pay():
    ms = [('phone', 'UPI', 'GPay, PhonePe, Paytm'), ('wallet', 'Credit / debit card', 'Visa, Mastercard, RuPay'), ('globe', 'Net banking', 'All major banks'), ('wallet', 'Wallets', 'Paytm, Amazon Pay')]
    return (bar('Payment') + body(f'<div style="text-align:center;margin-top:6px"><span class="okb" style="background:{CM};width:56px;height:56px">{ic("shield", CD, 24)}</span><div class="sub">Total</div><div style="font:700 36px Outfit">₹1,299</div><div class="sub" style="margin:0">Booking with Maya Iyer</div></div>'
                                  + label('Pay with') + ''.join(opt(t, s, i == 0, k) for i, (k, t, s) in enumerate(ms))
                                  + '<div class="sub" style="margin-top:10px">Pay within 30 minutes to keep this time. Nothing is charged if you don’t.</div>')
            + foot(btn('Pay ₹1,299', 'dark', 'lock'), f'<div class="fine" style="margin:0">{ic("shield", MUT, 12)} Secure checkout · verified by prsnn.</div>'))
def m_pay_sheet():
    return (bar('Payment') + body(f'<div style="text-align:center;margin-top:30px;font:700 36px Outfit">₹1,299</div>')
            + sheet(f'<div style="font:600 16px Urbanist;text-align:center">Test checkout</div><div class="sub" style="text-align:center">Payments are simulated until Razorpay is switched on. No money moves.</div>'
                    f'<div style="font:700 30px Outfit;text-align:center;margin-top:10px">₹1,299</div><div class="sub" style="text-align:center;margin:0">UPI · Booking with Maya Iyer</div>'
                    f'<div style="margin-top:14px">{btn("Pay ₹1,299 (test)")}</div><div style="margin-top:8px">{btn("Simulate a failed payment", "ghost")}</div>'))
def booked(kind):
    icon, bg, title, sub = {'wait': ('clock', C, 'Payment received', 'We’re confirming Maya now. You’ll get a WhatsApp message the moment she accepts.'),
                            'done': ('check', M, 'Booking confirmed!', 'Maya accepted. Chat is open, so say hello and agree the details.'),
                            'fail': ('rupee', RED, 'No companion available', 'Nobody could take this booking in time. Your full payment is being refunded to your original payment method.')}[kind]
    stl = {'wait': [('Booked', None, 'done'), ('Paid', '₹1,299 paid', 'done'), ('Finding your companion', 'Offered to your chosen companion · 42 min left to answer', 'now'), ('Confirmed', None, 'todo')],
           'done': [('Booked', None, 'done'), ('Paid', '₹1,299 paid', 'done'), ('Finding your companion', None, 'done'), ('Confirmed', 'Chat is open', 'done')],
           'fail': [('Booked', None, 'done'), ('Paid', '₹1,299 paid', 'done'), ('Finding your companion', 'Nobody could take it in time', 'stop'), ('Cancelled · refunded', '₹1,299 refund started', 'stop')]}[kind]
    btns = {'wait': (btn('View booking'), btn('Back to home', 'ghost')), 'done': (btn('Chat with Maya', 'dark', 'chat'), btn('View booking', 'ghost')), 'fail': (btn('View booking'), btn('Back to home', 'ghost'))}[kind]
    return (f'<div style="text-align:center;padding:52px 24px 0"><span class="okb" style="background:{bg}">{ic(icon, P if kind != "wait" else M, 34, 2.4)}</span><div class="h" style="font-size:24px;margin-top:14px">{title}</div><div class="sub">{sub}</div></div>'
            + body(card(f'<div style="display:flex;gap:10px;align-items:center">{avatar("evening", 44)}<b style="flex:1">Maya Iyer</b></div><div class="lrow" style="border:none;padding:8px 0 0">{ic("cal", CD, 14)}<span>Sat 22 Nov · 4:00 PM</span></div><div class="lrow" style="border:none">{ic("doc", CD, 14)}<span>Booking #A6582F</span></div>'
                        + f'<div style="margin-top:8px">{tl(stl)}</div>', mt=14)) + foot(*btns))
def m_booked_wait(): return booked('wait')
def m_booked_done(): return booked('done')
def m_booked_fail(): return booked('fail')
def m_bookings():
    tick = (f'<div class="ticket" style="margin-top:12px"><div style="padding:14px 16px 12px"><div style="display:flex;justify-content:space-between">{logo(12, P, C)}{pill("Confirmed", "green")}</div>'
            f'<div style="font:700 30px/1 Outfit;color:{C};margin-top:10px">4:00 PM</div><div style="font:500 12px Urbanist;opacity:.85;margin-top:3px">Saturday, 22 November · Maya · 4 hours</div></div>'
            f'<div class="tear"></div><div style="padding:10px 16px 14px;display:flex;gap:8px"><div class="btn sm" style="flex:1;color:{P};box-shadow:inset 0 0 0 1.5px rgba(241,241,244,.3)">View</div><div class="btn b-champ sm" style="flex:1">{ic("chat", M, 15)}Chat</div></div></div>')
    return (top(False) + h('My bookings', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 0) + tick
                                                      + bk_card('walks', 'Daniel', 'Paid · awaiting companion', 'champ', 'Fri 28 Nov · 10:00 AM', '2 hours', extra=f'<div class="lrow" style="border:none;padding:2px 0">{ic("users", CD, 14)}<span>Waiting for Daniel · 3h left to answer</span></div>')
                                                      + bk_card('cozy', 'Leila', 'Payment not finished', 'red', 'Sun 30 Nov · 6:00 PM', '1 hour', 'Finish payment · ₹399', act='pay')) + tabs(2))
def m_bookings_states():
    rows_ = ''.join(f'<div class="lrow"><span>{a}</span><span class="rv">{pill(a, t)}</span></div>' for a, t in [('Awaiting confirmation', 'champ'), ('Accepted · pay to confirm', 'champ'), ('Payment not finished', 'red'), ('Paid · awaiting companion', 'champ'), ('Accepted · safety check', 'champ'),
                                                                                                             ('No companion · refunded', 'red'), ('Confirmed', 'green'), ('Completed', 'grey'), ('Declined', 'red'), ('Cancelled', 'grey')])
    return (top(False) + h('My bookings', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 1) + f'<div class="empty" style="padding-top:20px"><span class="ebig">{ic("cal", CD, 26)}</span><div style="font:600 15px Urbanist;margin-top:10px">No past bookings</div></div>'
                                                      + label('Every status a booking can show') + card(rows_, mt=6, pad='2px 14px')) + tabs(2))
def panic_card(state):
    if state == 'before':
        return card(f'<div style="display:flex;gap:12px;align-items:center;opacity:.75"><span class="sosm" style="color:{MUT};box-shadow:inset 0 0 0 2px #C2C3CF">SOS</span><div><b>Panic button</b><div class="sub" style="margin:0">Turns on at 4:00 PM and stays on until 9:00 PM.</div></div></div>')
    if state == 'live':
        return card(f'<div style="text-align:center">{sos(84)}<div style="font:600 14px Urbanist;margin-top:10px">Feel unsafe? Hold for 3 seconds</div><div class="sub" style="text-align:center">Every prsnn admin is alerted at once with both names, numbers and the place, and again every 5 minutes until it’s stopped.</div>'
                    f'<div style="margin-top:10px;font:600 13px Urbanist;color:{RED}">{ic("phone", RED, 14)} Call 112 (police, ambulance)</div></div>')
    return card(f'<div style="display:flex;gap:12px;align-items:center;color:#fff"><span class="sosm" style="background:#fff;color:{RED}">SOS</span><div><b>Safety alert active</b><div style="font:400 11.5px Urbanist;opacity:.9">Our team is being alerted every 5 minutes. Tap to see details or stop it.</div></div></div>', RED)
def booking_detail(state):
    head = card(f'<div style="display:flex;gap:12px;align-items:center">{avatar("evening", 56, True)}<div><div style="font:600 16px Urbanist">Maya Iyer</div><div style="margin-top:4px">{pill("Confirmed" if state != "finding" else "Paid · awaiting companion", "green" if state != "finding" else "champ")}</div></div></div>'
                + ''.join(f'<div class="lrow">{ic(i, CD, 15)}<span>{t}</span></div>' for i, t in [('cal', 'Sat 22 Nov · 4:00 PM'), ('clock', '4 hours'), ('rupee', '₹1,299 · Paid'), ('doc', 'Booking #A6582F')]), mt=4)
    info = card(''.join(f'<div class="lrow">{ic(i, CD, 15)}<span>{t}</span></div>' for i, t in [('pin', 'Meeting place: Blue Tokai, Banjara Hills'), ('users', 'For Fatima Khan (mother) · +91 90000 11111'), ('star', 'Don’t Go Alone')]), pad='2px 14px')
    if state == 'finding':
        stl = tl([('Booked', None, 'done'), ('Paid', '₹1,299 paid', 'done'), ('Finding your companion', 'Offered to companion 2 of 3 · 40 min left to answer', 'now'), ('Confirmed', None, 'todo')])
        return (bar('Booking details') + body(head + card(f'<div class="sub" style="margin:0 0 8px">Status</div>{stl}') + panic_card('before') + info + card(f'<div class="sub" style="margin:0">Your note</div><div style="font-size:13px;margin-top:2px">She loves old Hindi music.</div>'))
                + foot(btn('Cancel booking · full refund', 'danger'), btn('Report a problem', 'ghost', 'flag')))
    if state == 'live':
        return (bar('Booking details') + body(head + panic_card('live') + info) + foot(btn('Chat with Maya', 'dark', 'chat'), btn('Report a problem', 'ghost', 'flag')))
    return (bar('Booking details') + body(head + panic_card('alert') + info + card(f'<b>Problem reported</b><div class="sub" style="margin-top:2px">“Companion was 30 minutes late.” Our team will reply here and on WhatsApp.</div>', CM))
            + foot(btn('Chat with Maya', 'dark', 'chat'), btn('Problem reported · add details', 'ghost', 'flag')))
def m_booking_finding(): return booking_detail('finding')
def m_booking_live(): return booking_detail('live')
def m_booking_alert(): return booking_detail('alert')
def m_cancel_dialog():
    return (booking_detail('finding') + '<div class="dim" style="z-index:30"></div>'
            + f'<div class="dialog"><div style="font:600 16px Urbanist">Cancel this booking?</div><div class="sub" style="text-align:center">It’s 2 days away, so you get 85% back (₹1,104). ₹195 is kept as the cancellation fee.</div>'
            f'<div style="display:flex;border-top:1px solid {LINE};margin:12px -16px -14px"><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist">Keep booking</span><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist;color:{RED};border-left:1px solid {LINE}">Cancel booking</span></div></div>')
def chat_head(ended=False):
    return (f'<div class="bar" style="justify-content:flex-start;gap:10px"><span class="circ">{ic("back", M, 16, 2)}</span><span style="position:relative">{avatar("evening", 34)}<i style="position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:#3FB950;box-shadow:0 0 0 2px {P}"></i></span>'
            f'<div style="flex:1"><div style="font:600 14px Urbanist">Maya Iyer</div><div style="font:400 10.5px Urbanist;color:{MUT}">Sat 22 Nov · 4:00 PM</div></div>'
            + (f'<span class="sosm" style="width:34px;height:34px;font-size:9.5px">SOS</span>' if not ended else '') + f'<span class="circ">{ic("doc", M, 15)}</span></div>')
def m_chat():
    msgs = [('them', 'Hi Sam! Looking forward to Saturday 😊', '10:02'), ('me', 'Same here. Blue Tokai at 4?', '10:04'), ('them', 'Perfect, I’ll grab a table by the window. My number is ••••••••••', '10:05')]
    b = ''.join(f'<div class="bub {w}">{t}<div class="bt2">{tm}</div></div>' for w, t, tm in msgs)
    return (chat_head() + f'<div style="display:flex;justify-content:center;padding-top:8px"><span class="pill" style="background:{CM};color:{CD};padding:5px 10px">{ic("shield", CD, 12)} Keep it safe · public places only ›</span></div>'
            f'<div class="msgs">{b}</div><div class="comp"><span class="hidek">{ic("down", M, 18)}</span><div class="cin">See you at 4! I’ll message when I’m<i class="cur"></i></div><span class="sendb">{ic("send", P, 16)}</span></div><div class="kb"></div>')
def m_chat_panic():
    return (chat_head() + f'<div class="msgs">' + ''.join(f'<div class="bub {w}">{t}<div class="bt2">{tm}</div></div>' for w, t, tm in [('them', 'I’m at the entrance.', '4:02'), ('me', 'Coming in now.', '4:03')]) + '</div>'
            + sheet(f'<div style="text-align:center">{sos(90)}<div style="font:600 16px Urbanist;margin-top:12px">Feel unsafe? Hold for 3 seconds</div><div class="sub" style="text-align:center">Every prsnn admin is alerted at once, and again every 5 minutes until you’re safe.</div></div>'
                    f'<div style="margin-top:12px">{btn("Call 112 (police, ambulance)", "red", "phone")}</div><div style="margin-top:8px">{btn("Not now", "ghost")}</div>')
            + '<div class="tagnote" style="top:auto;bottom:6px;z-index:40">New: panic button in chat (approved)</div>')
def m_chat_ended():
    return (chat_head(True) + '<div class="msgs">' + ''.join(f'<div class="bub {w}">{t}<div class="bt2">{tm}</div></div>' for w, t, tm in [('them', 'Thanks for a lovely afternoon!', '8:05'), ('me', 'Thank you, Maya. See you again.', '8:06')]) + '</div>'
            + f'<div class="foot" style="background:{W};border-top:1px solid {LINE}"><div class="sub" style="text-align:center;margin:0">This session has ended, so the chat is read-only.</div></div>')
def m_panic_sent():
    shared = ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:5px;font:400 12px Urbanist">{ic("check", "#fff", 13, 2.4)}{t}</div>' for t in ['Both names and mobile numbers', 'Meeting place: Blue Tokai, Banjara Hills', 'Booking #A6582F, date and time'])
    return (f'<div style="position:absolute;inset:0;background:{RED}"></div><div style="position:relative;text-align:center;padding:50px 22px 0;color:#fff">'
            f'<div style="margin:0 auto;width:92px;height:92px;border-radius:50%;background:#fff;color:{RED};display:flex;align-items:center;justify-content:center;font:700 22px Outfit;box-shadow:0 0 0 12px rgba(255,255,255,.18)">SOS</div>'
            f'<div style="font:600 24px Urbanist;margin-top:16px">Alert sent</div><div style="font:400 12.5px Urbanist;opacity:.9;margin-top:4px">4:35 PM · our team has been told</div>'
            f'<div style="font:500 11.5px Urbanist;opacity:.85;margin-top:14px">Next alert in</div><div style="font:700 38px Outfit">4:52</div><div style="font:400 11.5px Urbanist;opacity:.85">Sent 2 times. Repeats every 5 minutes until you or our team stop it.</div>'
            f'<div style="text-align:left;margin-top:14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.12)"><b style="font-size:13px">Shared with every prsnn admin</b>{shared}</div></div>'
            f'<div class="foot" style="background:transparent"><div class="btn" style="background:#fff;color:{RED}">{ic("phone", RED, 16)}Call 112 (police, ambulance)</div><div class="btn" style="color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6)">I’m safe · stop alerts</div><div class="btn" style="color:#fff;height:36px">Back to the booking</div></div>')
def m_panic_pin():
    boxes = ''.join(f'<span class="pb{" f" if i < 1 else ""}" style="width:42px;height:50px">{"•" if i < 1 else ""}</span>' for i in range(4))
    return (m_panic_sent() + sheet(f'<div style="font:600 17px Urbanist;text-align:center">Enter your PIN to stop</div><div class="sub" style="text-align:center">Only do this if you’re safe. Our team will still check on the booking.</div><div class="pbs" style="margin-top:12px">{boxes}</div>'
                                   f'<div style="transform:scale(.8);transform-origin:top center;margin-top:-4px;height:230px">{keypad()}</div>{btn("Cancel · keep alerting", "ghost")}'))
def m_panic_closed():
    return (bar('Safety') + f'<div style="text-align:center;padding:40px 24px 0"><span class="okb">{ic("check", C, 34, 2.4)}</span><div class="h" style="font-size:24px;margin-top:14px">Alert closed</div><div class="sub">Glad you’re safe. Our team will still check in about this booking.</div></div>'
            + foot(btn('Back to the booking'), btn('Call 112', 'ghost', 'phone')))
def m_report():
    reasons = ['Companion didn’t show up', 'Safety or behaviour concern', 'Session ended early', 'Charged incorrectly', 'Refund not received', 'Something else']
    return (bar('Report a problem') + body(f'<div class="sub">Tell us what happened. Our team reads every report and replies in the app and on WhatsApp.</div><div class="chips" style="flex-wrap:wrap;margin-top:10px">' + ''.join(f'<span class="chip{" on" if i == 0 else ""}">{t}</span>' for i, t in enumerate(reasons)) + '</div>'
                                           + field('Details', 'What happened, and what would you like us to do?', None, ph=True, tall=True) + notice('In danger right now? Use the panic button or call 112.', 'red', 'alert')) + foot(btn('Send report', 'dark', 'send')))
def m_report_done():
    return bar('Report a problem') + f'<div style="text-align:center;padding:50px 24px 0"><span class="okb">{ic("check", C, 34, 2.4)}</span><div class="h" style="font-size:22px;margin-top:14px">Thanks — we’ve got it</div><div class="sub">Our team will look into booking #A6582F and reply here. You’ll also get a WhatsApp message.</div></div>' + foot(btn('Back to booking'))
def m_messages():
    rows_ = ''.join(f'<div class="crow">{avatar(k, 48)}<div style="flex:1"><div style="display:flex;justify-content:space-between"><span style="font:600 14.5px Urbanist">{n}</span><span style="font:400 11px Urbanist;color:{MUT}">{t}</span></div><div style="font:400 12.5px Urbanist;color:{MUT};margin-top:2px">{m}</div></div>' + ('<i class="unread"></i>' if u else '') + '</div>'
                    for k, n, t, m, u in [('evening', 'Maya Iyer', 'Sat 4 PM', 'Perfect, I’ll grab a table by the window.', True), ('walks', 'Daniel', 'Fri 10 AM', 'See you at the gate.', False)])
    return top(False) + h('Messages', 'Chats open once a booking is confirmed and paid. Numbers stay hidden.', 24) + body(rows_) + tabs(3)
def m_messages_empty():
    return (top(False) + h('Messages', None, 24) + body(f'<div class="empty"><span class="ebig">{ic("chat", CD, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">No conversations yet</div><div class="sub" style="text-align:center">Chat opens once your companion accepts and you’ve paid.</div></div>') + tabs(3))
def m_notifs():
    n = lambda i, t, s, a, act=None, unread=False, red=False: (f'<div class="crow" style="{"background:" + (REDS if red else CM) + ";margin:0 -18px;padding:12px 18px" if unread or red else ""}"><span class="rico" style="background:{W if unread or red else CM}">{ic(i, RED if red else CD, 16)}</span><div style="flex:1"><div style="font:600 13px/1.35 Urbanist">{t}</div><div style="font:400 11.5px/1.4 Urbanist;color:{MUT}">{s}</div>'
                                                             + (f'<div style="margin-top:8px">{btn(act, "dark", "edit", False, True)}</div>' if act else '') + f'</div><span style="font:400 11px Urbanist;color:{MUT}">{a}</span></div>')
    return (bar('Notifications', f'<span style="font:600 13px Urbanist;color:{MUT}">Clear</span>') + body(seg(['All', 'Bookings', 'Payments'], 0)
            + f'<div style="font:700 10.5px Urbanist;color:{A.C};margin-top:12px">ACTION NEEDED</div>' + n('edit', '“Please add a clearer photo: face visible, no sunglasses.”', 'From our team', '1h', 'Fix and resubmit', True)
            + n('check', 'Maya confirmed your booking #A6582F. Chat is open.', 'Bookings', '2m') + n('clock', 'Your session with Maya is today at 4:00 PM, Blue Tokai.', 'Bookings', '5 AM') + n('rupee', 'Refund of ₹699 started for booking #B1C04D.', 'Payments', 'Mon')))
def m_notifs_empty():
    return (bar('Notifications') + body(seg(['All', 'Bookings', 'Payments'], 2) + f'<div class="empty"><span class="ebig">{ic("bell", CD, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">You’re all caught up</div><div class="sub" style="text-align:center">Nothing here yet. Try “All”.</div><div style="margin-top:12px">{btn("Show all", "ghost", None, False, True)}</div></div>'))

# ═══════════════ PROFILE ═══════════════
def p_profile(role='member'):
    who = {'member': ('cozy', 'Sam Rivera', '+91 98765 43210 · Hyderabad', pill(f'{ic("shield", "#2E7D4F", 10)} Verified member', 'green')),
           'companion': ('evening', 'Maya Iyer', '+91 90000 11111 · Banjara Hills', pill(f'{ic("shield", "#2E7D4F", 10)} ID verified', 'green')),
           'staff': ('study', 'Arjun Mehta', '+91 98765 00000', pill('Sub-admin', 'dark'))}[role]
    extra = {'member': group(row('star', 'Become a companion', 'Earn doing what you love', last=True)),
             'companion': group(row('chart', 'Companion dashboard'), row('wallet', 'Earnings'), row('id', 'ID check', 'Verified', last=True)),
             'staff': group(row('shield', 'Admin', 'Sub-admin', last=True))}[role]
    return (top(False) + body(f'<div style="display:flex;gap:14px;align-items:center;margin-top:10px">{avatar(who[0], 62, True)}<div><div class="h" style="font-size:21px">{who[1]}</div><div class="sub" style="margin:0">{who[2]}</div><div style="margin-top:6px">{who[3]}</div></div></div>'
                              + extra + group(row('user', 'Personal information'), row('lock', 'Privacy & preferences', 'Photo open · Showing women' if role == 'member' else 'Photo locked'), row('heart', 'Saved companions', '3 saved'), row('bell', 'Notifications'), row('lock', 'Change PIN', last=True))
                              + group(row('help', 'Help & support'), row('shield', 'Code of conduct'), row('doc', 'Terms & privacy', last=True))
                              + group(row('logout', 'Log out', danger=True, chevron=False), row('trash', 'Delete account', danger=True, last=True))) + tabs(4, role == 'companion'))
def p_member(): return p_profile('member')
def p_staff(): return p_profile('staff')
def p_edit():
    tiles = ''.join(f'<span class="chip{" on" if i < 2 else ""}" style="padding:7px 10px">{c[0]}</span>' for i, c in enumerate(CATS))
    return (bar('Personal information') + body(f'<div style="text-align:center;margin-top:4px">{avatar("cozy", 80, True)}<div style="font:600 12.5px Urbanist;color:{CD};margin-top:8px">Change photo</div></div>'
                                               + field('Full name', 'Sam Rivera') + label('What you’re interested in') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">{tiles}</div>'
                                               + field('About you', 'New to Hyderabad. Love long walks and live music.', tall=True) + field('Mobile number', '+91 98765 43210', 'Your number is never shown to other members.')
                                               + notice('A new photo is reviewed by our team before others see it.', 'grey', 'cam')) + foot(btn('Save')))
def p_privacy():
    gender = seg(['Woman', 'Man', 'Non-binary'], 1)
    see = f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">' + ''.join(f'<span class="chip{" on" if t == "Women" else ""}">{t}</span>' for t in ['Women', 'Men', 'Non-binary people', 'Everyone']) + '</div>'
    return (bar('Privacy & preferences') + body(label('I am', 4) + gender + label('Show me') + '<div class="sub" style="margin:2px 0 0">You’ll only see companions of this gender. Change it any time.</div>' + see
                                                + label('Who can see your photo') + opt('Open · default', 'Everyone can see your photo and full name.', True, 'globe') + opt('Locked', 'Blurred placeholder and first name until a confirmed, paid booking.', False, 'lock')
                                                + f'<div class="notice" style="background:{DEEP};color:{M}">{ic("check", CD, 15)}<span>Tapping an option means you agree to your profile being shown that way. Change it any time.</span></div>'
                                                + field('City', 'Hyderabad', 'Companions are shown from your city first.') + field('Area', 'Gachibowli')) + foot(btn('Save')))
def p_saved():
    rows_ = ''.join(f'<div class="crow">{avatar(k, 52)}<div style="flex:1"><div style="font:600 14.5px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{a} · from ₹399</div></div>{ic("heart", C, 20, 2.2)}</div>' for k, n, a in [('evening', 'Maya', 'Banjara Hills'), ('walks', 'Daniel', 'Gachibowli')])
    return bar('Saved companions') + body(rows_)
def p_saved_empty():
    return bar('Saved companions') + body(f'<div class="empty"><span class="ebig">{ic("heart", CD, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">Nothing saved yet</div><div class="sub" style="text-align:center">Tap the heart on a companion to keep them here.</div><div style="margin-top:12px">{btn("Browse companions", "dark", None, False, True)}</div></div>')
def p_delete(): return A.s_delete()
def p_fix(target='photo'):
    if target == 'photo':
        return (bar('Update your photo') + body(notice('Our team asked: “Please add a clearer photo: face visible, no sunglasses.”', 'champ', 'cam')
                                                + f'<div style="text-align:center;margin-top:16px"><div style="margin:0 auto;width:120px;height:120px;border-radius:50%;border:2px dashed {C};background:{CM};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:{CD};font:600 12.5px Urbanist">{ic("cam", CD, 24)}Add a new photo</div></div>'
                                                + ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:7px;font-size:12.5px">{ic("check", CD, 14, 2.4)}{t}</div>' for t in ['Daylight or a bright room', 'Face the camera, no sunglasses or filters', 'Just you in the photo']))
                + foot(btn('Send again for review', 'dark', 'send')))
    return (bar('Update your profile') + body(notice('Our team asked: “Please write a little more about yourself and the plans you enjoy.”', 'champ', 'edit')
                                              + field('About you (optional — leave empty to keep it)', 'What do you enjoy? What kind of company are you?', None, ph=True, tall=True)
                                              + label('What you offer') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">' + ''.join(f'<span class="chip{" on" if i in (1, 2) else ""}">{c[0]}</span>' for i, c in enumerate(CATS)) + '</div>')
            + foot(btn('Send again for review', 'dark', 'send')))
def p_fix_profile(): return p_fix('profile')
def p_fix_sent():
    return bar() + f'<div style="text-align:center;padding:60px 24px 0"><span class="okb">{ic("send", C, 30)}</span><div class="h" style="font-size:24px;margin-top:14px">Sent for review</div><div class="sub">Thanks! Our team will look at it soon and let you know in your notifications.</div></div>' + foot(btn('Back to home'))

# ═══════════════ COMPANION ═══════════════
def c_apply():
    perks = ''.join(f'<div style="display:flex;gap:12px;align-items:flex-start;margin-top:12px"><span class="rico" style="background:{CM}">{ic(i, CD, 16)}</span><div><div style="font:600 14px Urbanist">{t}</div><div style="font:400 12px/1.4 Urbanist;color:{MUT}">{d}</div></div></div>'
                    for i, t, d in [('users', 'Meet new people', 'Coffee, walks, events: the things you already enjoy.'), ('clock', 'Your hours, your lengths', 'Choose your days, hours and booking lengths. Accept only what suits you.'),
                                    ('shield', 'Safe by design', 'Public places only, numbers hidden in chat, and a panic button in every session.'), ('rupee', 'Keep 80% of every booking', 'One fair price list for everyone. A 4-hour booking pays you ₹1,039.')])
    return (f'<div style="position:relative">{photo("evening", 220, 0, inner=shade(.9))}<span class="circ" style="position:absolute;top:42px;left:14px;background:rgba(0,0,0,.35);box-shadow:none">{ic("back", "#fff", 16, 2)}</span>'
            f'<div style="position:absolute;left:18px;right:18px;bottom:18px;color:{P}"><div style="font:600 25px/1.05 Urbanist">Earn doing what you love</div><div style="font:400 12.5px Urbanist;opacity:.9;margin-top:5px">Be good company. Spend time with people who could use some, on your own terms.</div></div></div>'
            + body(perks + notice('Changed copy: today’s screen says “Set your own hourly rate” and “Every member is ID-verified”. Neither is true now.', 'grey', 'edit')) + foot(btn('Apply now →')))
CN = 9
def c1(): return setup_head(1, CN, 'Companion') + q('I am') + body(notice('Your answers are saved.', 'champ', 'check') + ''.join(opt(t, None, t == 'Woman', 'user') for t in ['Woman', 'Man', 'Non-binary']))
def c2():
    tips = ''.join(f'<div style="display:flex;gap:8px;align-items:center;margin-top:7px;font-size:12.5px">{ic("shield", CD, 14)}{t}</div>' for t in ['Face clearly visible', 'Just you', 'A smile helps'])
    return (setup_head(2, CN, 'Companion') + q('Add your photo', 'Members see this first.')
            + body(f'<div style="margin:12px auto 0;width:118px;height:118px;border-radius:50%;background:{img("evening")} center/cover;box-shadow:0 0 0 4px {W},0 0 0 5.5px {C}"></div><div style="text-align:center;font:600 12px Urbanist;color:{CD};margin-top:8px">Tap to change</div>{tips}') + foot(btn('Next →')))
def c3(): return (setup_head(3, CN, 'Companion') + q('Who can see your photo?', 'You can change this later.')
                  + body(opt('Locked', 'Only people who’ve booked you', True, 'lock') + opt('Open', 'Everyone', False, 'globe')))
def c4(): return (setup_head(4, CN, 'Companion') + q('Where are you based?', 'You’ll get bookings near you.') + body(field('State', 'Telangana') + field('City', 'Hyderabad') + field('Area', 'Banjara Hills', on=True)) + foot(btn('Next →')))
def c5():
    ints = ['Coffee', 'Walks', 'Food', 'Movies', 'Music', 'Books', 'Sports', 'Art', 'Shopping', 'Travel', 'Hindi', 'English', 'Telugu', 'Urdu']
    return (setup_head(5, CN, 'Companion') + q('About you', 'A few lines for members.')
            + body(field('About you', 'Gallery openings, long coffees and city walks. Calm, curious and a good listener.', 'At least 30 letters', tall=True)
                   + label('Interests and languages') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">' + ''.join(f'<span class="chip{" on" if t in ("Coffee", "Art", "Hindi", "English") else ""}">{t}</span>' for t in ints) + '</div>') + foot(btn('Next →')))
def c6():
    tiles = ''.join(f'<div class="ctile{" on" if i in (1, 2) else ""}" style="padding:8px 12px;margin-top:7px"><span class="av" style="width:36px;height:36px;border-radius:10px;background:{img(k)} center/cover"></span><div style="flex:1"><div style="font:600 13.5px Urbanist">{t}</div><div style="font:400 11px Urbanist;color:{MUT}">{s}</div></div><span class="cb{" on" if i in (1, 2) else ""}">{ic("check", P, 12, 2.6) if i in (1, 2) else ""}</span></div>' for i, (t, s, k) in enumerate(CATS))
    return setup_head(6, CN, 'Companion') + q('What would you like to do?', 'Pick one or more.') + body(tiles) + foot(btn('Next · 2 chosen →'))
def c7():
    rows_ = ''.join(f'<div style="margin-top:{0 if i == 0 else 7}px">{price_tab(h_, "You get " + inr(earn(h_)))}</div>' for i, h_ in enumerate(range(1, 13)))
    return setup_head(7, CN, 'Companion') + q('How long can you meet?', 'You get 80% of each booking.') + body(f'<div style="margin-top:10px">{rows_}</div>') + foot(btn('Next →'))
def c8():
    days = ''.join(f'<span class="chip{" on" if on else ""}">{d}</span>' for d, on in zip(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [1, 1, 0, 1, 1, 1, 1]))
    frm = ''.join(f'<span class="chip{" on" if t == "10 AM" else ""}">{t}</span>' for t in ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM'])
    unt = ''.join(f'<span class="chip{" on" if t == "8 PM" else ""}">{t}</span>' for t in ['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'])
    return (setup_head(8, CN, 'Companion') + q('When are you free?')
            + body(label('Days', 8) + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">{days}</div>' + label('From') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">{frm}</div>' + label('Until') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">{unt}</div>') + foot(btn('Next →')))
def c9():
    lines = ''.join(f'<div class="lrow" style="display:block"><div class="sub" style="margin:0">{a}</div><div style="font:500 13px Urbanist">{b}</div></div>' for a, b in [('Based in', 'Banjara Hills, Hyderabad'), ('You’d like to do', 'Don’t Go Alone, Explore & Discover'), ('Lengths', '1, 2, 4 and 6 hours')])
    return (setup_head(9, CN, 'Companion') + q('Almost done') + body(notice('We’ll ask for your ID at your first booking. Nothing needed now.', 'champ', 'id') + card(lines, pad='2px 14px')
                                                                                         + checkbox(True, 'I agree to the <u>Code of Conduct</u>.')) + foot(btn('Send for approval →')))
def status_screen(kind):
    if kind == 'review':
        top_ = f'<div style="text-align:center;margin-top:6px"><span class="okb" style="background:{CM}">{ic("clock", CD, 32)}</span><div class="h" style="font-size:22px;margin-top:14px">Profile sent for approval</div><div class="sub">Our team reviews every companion before they go live, usually within 24 hours. We’ll let you know in your notifications.</div></div>'
        steps_ = [('Profile complete', None, 'done'), ('Approved by the prsnn team', None, 'now'), ('Live: members in your city can book you', None, 'todo'), ('First booking: quick ID check', None, 'todo')]
        cta = (btn('Go to my dashboard'),)
    elif kind == 'changes':
        top_ = f'<div class="h" style="font-size:22px;margin-top:6px">A few changes, please</div>' + notice('Our team says: “Please add a clearer photo and a few more lines about you.”', 'champ', 'edit') + '<div class="sub">Make the changes and send it back. It goes straight to the top of our review list.</div>'
        steps_ = [('Profile complete', None, 'done'), ('Approved by the prsnn team', 'Changes requested', 'stop'), ('Live: members in your city can book you', None, 'todo'), ('First booking: quick ID check', None, 'todo')]
        cta = (btn('Fix and resubmit', 'dark', 'edit'),)
    elif kind == 'rejected':
        top_ = f'<div class="h" style="font-size:22px;margin-top:6px">Your profile wasn’t approved</div>' + notice('Our team says: “Photos must show only you.”', 'red', 'alert')
        steps_ = [('Profile complete', None, 'done'), ('Approved by the prsnn team', 'Not approved', 'stop')]
        cta = (btn('Update my profile', 'dark', 'edit'), btn('Contact support', 'ghost'))
    else:
        top_ = f'<div style="text-align:center;margin-top:6px"><span class="okb">{ic("star", C, 30)}</span><div class="h" style="font-size:22px;margin-top:14px">You’re live</div><div class="sub">Members in your city can find and book you. When your first booking arrives, we’ll ask for a photo ID and a selfie: about 2 minutes.</div></div>'
        steps_ = [('Profile complete', None, 'done'), ('Approved by the prsnn team', None, 'done'), ('Live: members in your city can book you', None, 'done'), ('First booking: quick ID check', None, 'todo')]
        cta = (btn('Verify my ID now', 'dark', 'shield'), btn('Go to my dashboard', 'ghost'))
    return (bar('My status') + body(top_ + card(tl(steps_), mt=14) + card('<b>Tip: get booked sooner</b><div class="sub" style="margin-top:2px">Offer 2 and 4 hours, and keep evenings free. They get the most requests.</div>', CM)) + foot(*cta))
def c_status_review(): return status_screen('review')
def c_status_changes(): return status_screen('changes')
def c_status_rejected(): return status_screen('rejected')
def c_status_live(): return status_screen('live')
def req_card(name, k, stg, tone, when, length, h_, note=None, actions='offer'):
    acts = {'offer': f'<div style="display:flex;gap:8px;margin-top:8px">{btn("Decline", "ghost", None, True, True)}{btn("Verify ID & accept", "dark", "shield", True, True)}</div>',
            'accept': f'<div style="display:flex;gap:8px;margin-top:8px">{btn("Decline", "ghost", None, True, True)}{btn("Accept", "dark", None, True, True)}</div>',
            'confirmed': f'<div style="display:flex;gap:8px;margin-top:8px">{btn("Chat", "dark", "chat", True, True)}{btn("Mark completed", "ghost", None, True, True)}</div>',
            'held': '<div class="sub" style="margin-top:6px">Held for you while our team checks your ID. You’ll hear as soon as it’s confirmed.</div>', 'none': ''}[actions]
    return card(f'<div style="display:flex;gap:12px;align-items:center">{avatar(k, 44)}<div style="flex:1"><div style="font:600 14px Urbanist">{name}</div><div style="margin-top:3px">{pill(stg, tone)}</div></div>'
                f'<div style="text-align:right"><div style="font:700 15px Outfit">{inr(earn(h_))}</div><div style="font:400 10.5px Urbanist;color:{MUT}">you get</div></div></div>'
                f'<div class="lrow" style="border:none;padding:8px 0 0">{ic("cal", CD, 14)}<span>{when}</span></div><div class="lrow" style="border:none;padding:3px 0 0">{ic("clock", CD, 14)}<span>{length}</span></div>'
                + (f'<div class="lrow" style="border:none;padding:3px 0 0">{ic("chat", CD, 14)}<span>“{note}”</span></div>' if note else '') + acts, mt=10)
def c_dashboard():
    return (top() + body(f'<div class="sub" style="margin-top:8px">Good evening</div><div class="h" style="font-size:22px">Maya</div><div style="font:500 12px Urbanist;color:{CD}">You’re live · ID verified</div>'
                         + f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px">{stat("6", "Sessions")}{stat("₹6,231", "Earnings", CD)}{stat("1", "Pending")}</div><div class="fine" style="text-align:left;margin-top:4px">November · 80% of each paid booking</div>'
                         + f'<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px"><b>Waiting for your answer</b><span style="font:600 12px Urbanist;color:{CD}">See all</span></div>'
                         + req_card('Sam', 'cozy', 'Paid offer · 42 min left', 'champ', 'Sat 22 Nov · 4:00 PM', '4 hours', 4, 'Gig at Hard Rock, dinner after', 'accept')
                         + group(row('cal', 'Upcoming bookings'), row('wallet', 'Earnings', '₹6,231 this month'), row('edit', 'Edit profile'), row('clock', 'Packages & availability', 'Durations, days and hours', last=True))) + tabs(0, True))
def c_dashboard_review():
    return (top() + body(f'<div class="sub" style="margin-top:8px">Good evening</div><div class="h" style="font-size:22px">Maya</div><div style="font:500 12px Urbanist;color:{MUT}">Waiting for approval</div>'
                         + banner('Your profile is being reviewed', 'Usually within 24 hours. You go live as soon as it’s approved.', 'champ', 'clock')
                         + banner('Your first booking is here', 'Verify your ID to accept it. About 2 minutes.', 'dark', 'id')
                         + f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px">{stat("0", "Sessions")}{stat("₹0", "Earnings")}{stat("0", "Pending")}</div>'
                         + group(row('cal', 'Upcoming bookings'), row('edit', 'Edit profile'), row('clock', 'Packages & availability', last=True)) + f'<div style="margin-top:10px">{btn("Share your profile", "ghost", "users")}</div>') + tabs(0, True))
def c_requests():
    return (top(False) + h('Booking requests', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 0)
                                                           + req_card('Sam', 'cozy', 'Paid offer · 42 min left', 'champ', 'Sat 22 Nov · 4:00 PM', '4 hours', 4, None, 'offer')
                                                           + req_card('Priya', 'study', 'Confirmed · paid', 'green', 'Sun 23 Nov · 11:00 AM', '2 hours', 2, None, 'confirmed')
                                                           + req_card('Rahul', 'walks', 'Held · ID check in progress', 'champ', 'Tue 25 Nov · 6:00 PM', '1 hour', 1, None, 'held')) + tabs(2, True))
def c_requests_past():
    rows_ = ''.join(f'<div class="crow">{avatar(k, 40)}<div style="flex:1"><div style="font:600 13.5px Urbanist">{n}</div><div style="font:400 11px Urbanist;color:{MUT}">{w}</div></div>{pill(s_, t)}</div>'
                    for k, n, w, s_, t in [('cozy', 'Anil · 2 hours', 'Mon 17 Nov', 'You declined', 'grey'), ('walks', 'Kiran · 1 hour', 'Sun 16 Nov', 'Taken by someone else', 'grey'), ('study', 'Neha · 4 hours', 'Sat 15 Nov', 'Offer expired', 'grey'), ('evening', 'Ravi · 3 hours', 'Fri 14 Nov', 'Cancelled', 'red')])
    return (top(False) + h('Booking requests', None, 24) + body(seg(['Upcoming', 'Past', 'Cancelled'], 2) + rows_ + f'<div class="empty" style="padding-top:20px"><div class="sub" style="text-align:center">No requests yet? When someone books you, the request shows up here for you to accept.</div></div>') + tabs(2, True))
def c_verify_why():
    pts = ''.join(f'<div style="display:flex;gap:8px;align-items:flex-start;margin-top:8px;font-size:13px">{ic("lock", CD, 15)}<span>{t}</span></div>' for t in ['Encrypted and stored privately', 'Only our safety team sees it, never Sam or any member', 'Used only to confirm you are you'])
    return (bar('Accept booking') + body(card(f'<div style="display:flex;justify-content:space-between;align-items:center"><div><div class="sub" style="margin:0">Sam · Sat 22 Nov · 4 hours</div><div style="font:700 20px Outfit;margin-top:2px">You earn ₹1,039</div></div>{pill("Paid", "green")}</div>', CM, mt=4)
                                         + h('Quick ID check, then it’s yours', 'Nobody meets anyone on prsnn before their ID is checked. It takes about 2 minutes.', 20, '14px 0 0') + pts)
            + foot(btn('Choose an ID'), btn('Not now', 'ghost')))
def c_verify_form():
    ids = [('Aadhaar', 'Front and back'), ('PAN', 'Front only'), ('Driving licence', 'Front and back'), ('Passport', 'Photo page'), ('Voter ID', 'Front and back')]
    return (bar('Verify your ID') + body(h('Which ID will you use?', 'Any one of these.', 19, '4px 0 0') + ''.join(opt(t, s, i == 0) for i, (t, s) in enumerate(ids)).replace('padding:12px 14px', 'padding:8px 12px')
                                         + '<div class="sub" style="margin-top:6px">You can mask the first 8 digits of your Aadhaar.</div>'
                                         + f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px">' + ''.join(f'<div class="up">{ic("cam", CD, 18)}<span>{t}</span></div>' for t in ['Front of ID', 'Back of ID', 'Selfie']) + '</div>')
            + foot(btn('Submit and accept booking', 'dark', 'lock')))
def c_verify_held():
    return (bar() + f'<div style="text-align:center;padding:40px 24px 0"><span class="okb" style="background:{CM}">{ic("shield", CD, 32)}</span><div class="h" style="font-size:22px;margin-top:14px">Checking your ID</div><div class="sub">Sam’s booking is held for you. We’ll message you as soon as it’s confirmed.</div></div>'
            + body(card(tl([('You accepted', None, 'done'), ('ID submitted', None, 'done'), ('Safety check by our team', None, 'now'), ('Confirmed: chat opens', None, 'todo')]), mt=16)
                   + card(f'<div style="display:flex;justify-content:space-between"><span>You earn</span><b style="font:700 16px Outfit">₹1,039</b></div>')) + foot(btn('Go to my dashboard')))
def c_availability():
    rows_ = ''.join(f'<div style="margin-top:{0 if i == 0 else 7}px">{price_tab(h_, "You get " + inr(earn(h_)))}</div>' for i, h_ in enumerate(range(1, 13)))
    days = ''.join(f'<span class="chip{" on" if on else ""}">{d}</span>' for d, on in zip(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [1, 1, 0, 1, 1, 1, 1]))
    return (bar('Packages & availability') + body(h('Durations you offer', 'Same prices for everyone. You receive 80% of each booking.', 18, '4px 0 10px') + rows_
                                                  + h('Days and hours', 'Members can only book inside these hours. Sessions run between 7 AM and 10 PM.', 18, '16px 0 0')
                                                  + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">{days}</div><div style="display:flex;gap:10px">{field("From", "10:00 AM")}{field("Until", "8:00 PM")}</div>') + foot(btn('Save availability')))
def c_earnings():
    return A.s_earnings().replace('Payouts go to your bank account as set up with the prsnn team.', 'Payouts go to your bank account as set up with the prsnn team. Questions? Contact support.')
def c_earnings_empty():
    return (bar('Earnings') + body(card(f'<div style="display:flex;justify-content:space-between"><span style="display:flex;gap:10px">{ic("back", MUT, 16)}<b>December</b>{ic("chev", "#C2C3CF", 16)}</span></div><div style="font:700 36px Outfit;margin-top:10px">₹0</div>', mt=4)
                                   + f'<div class="empty" style="padding-top:20px"><span class="ebig">{ic("wallet", CD, 26)}</span><div style="font:600 15px Urbanist;margin-top:10px">No paid sessions this month</div><div class="sub" style="text-align:center">Keep evenings free and offer 2 and 4 hours to get booked sooner.</div></div>'))

# ═══════════════ ADMIN ═══════════════
def a_overview(role='super'):
    t = lambda v, l_, tone=None: f'<div class="stat" style="text-align:left"><div class="sv" style="{"color:" + tone if tone else ""}">{v}</div><div class="sl">{l_}</div></div>'
    money = (label('Money (all time)') + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">{t("₹84,210", "Collected")}{t("₹6,980", "Refunded")}{t("₹61,784", "Companion payouts")}{t("₹15,446", "prsnn net", CD)}</div>') if role == 'super' else ''
    rows_ = [row('alert', 'Panic alerts', '1 open'), row('users', 'Approvals', 'Profiles · photos'), row('id', 'ID checks', 'Held bookings first'), row('map', 'City plans', '“Popular in your city”'),
             row('cal', 'Bookings', 'Live · Refunds · Done'), row('flag', 'Disputes'), row('users', 'Users', 'Search, edit, suspend', last=role != 'super')]
    if role == 'super':
        rows_ += [row('shield', 'Sub-admins'), row('rupee', 'Prices', 'Packages, split'), row('send', 'Broadcast', 'Push to members'), row('doc', 'Activity log', last=True)]
    return (top(False) + h('Admin', 'Signed in as superadmin.' if role == 'super' else 'Signed in as sub-admin. Refunds, prices and broadcasts are handled by a superadmin.', 24)
            + body(card(f'<div style="display:flex;gap:10px;align-items:center;color:#fff"><span class="sosm" style="background:#fff;color:{RED}">SOS</span><div><b>Panic alert · #A6582F</b><div style="font:400 11.5px Urbanist;opacity:.9">Sam (member) · Blue Tokai · Alert 2 · tap to respond</div></div></div>', RED, mt=4)
                   + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">{t("4", "Companion profiles to approve")}{t("2", "Member photos to approve")}{t("3", "ID checks")}{t("12", "Live bookings")}{t("2", "Open disputes", RED)}' + (t("1 failed", "Refunds to decide", RED) if role == 'super' else '') + '</div>'
                   + money + group(*rows_)))
def a_overview_sub(): return a_overview('sub')
def a_approvals(tab='c'):
    if tab == 'c':
        items = ''.join(f'<div class="crow">{avatar(k, 50)}<div style="flex:1"><div style="font:600 14px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div>{ic("chev", MUT, 14)}</div>' for k, n, s in [('evening', 'Maya Iyer', 'New · Banjara Hills · 2h ago'), ('walks', 'Daniel Rao', 'Resubmitted · Gachibowli · 5h ago')])
        return bar('Approvals') + body(seg(['Companions · 2', 'Photos · 2'], 0) + items)
    return (bar('Approvals') + body(seg(['Companions · 2', 'Photos · 2'], 1) + card(f'<div style="display:flex;gap:12px;align-items:center">{avatar("cozy", 60)}<div style="flex:1"><div style="font:600 14px Urbanist">Sam Rivera</div><div style="font:400 11.5px Urbanist;color:{MUT}">Member · new photo</div></div></div><div style="display:flex;gap:8px;margin-top:10px">{btn("Ask for a new photo", "ghost", None, True, True)}{btn("Approve", "dark", None, True, True)}</div>', mt=12))
            + sheet(f'<div style="font:600 16px Urbanist">Ask for a new photo</div><div class="sub">Sam gets a notification with your reasons and a “Fix and resubmit” button.</div><div class="chips" style="flex-wrap:wrap;margin-top:10px">'
                    + ''.join(f'<span class="chip{" on" if i < 2 else ""}">{t_}</span>' for i, t_ in enumerate(['Face not clear', 'Sunglasses or filter', 'More than one person', 'Not a real photo', 'Low light'])) + '</div>'
                    + field('Note (optional)', 'Daylight works best.', None) + f'<div style="margin-top:10px">{btn("Send request")}</div>'))
def a_approvals_photos(): return a_approvals('p')
def a_review(): return A.s_review_profile().replace('Next ›', 'Next in the queue ›')
def a_reject():
    return (A.s_review_profile() + sheet(f'<div style="font:600 16px Urbanist">Reject Maya’s profile?</div><div class="sub">They’re told why and won’t be listed. Prefer “Ask for changes” if it can be fixed.</div>'
                                         + field('Reason', 'Photos must show only you.', None, on=True) + f'<div style="margin-top:10px">{btn("Reject", "red")}</div>'))
def a_verify():
    docs = ''.join(f'<div style="flex:1"><div style="height:62px;border-radius:12px;background:{img(k)} center/cover"></div><div style="font:500 10.5px Urbanist;color:{MUT};margin-top:4px;text-align:center">{t}</div></div>' for k, t in [('study', 'ID front'), ('park', 'ID back'), ('evening', 'Selfie')])
    kv = ''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{M}">{b}</span></div>' for a, b in [('ID', 'Aadhaar'), ('Gender', 'Woman'), ('Hours', '10:00–20:00')])
    return (bar('Verify companions') + body(card(f'<div style="display:flex;gap:10px;align-items:center">{avatar("evening", 44)}<div style="flex:1"><b>Maya Iyer</b><div class="sub" style="margin:0">Banjara Hills</div></div></div><div style="margin-top:8px">{pill("1 booking held · decide by Sat 3:00 PM", "red")}</div>'
                                                 + f'<div class="chips" style="margin-top:8px">{"".join(f"<span class=chip style=padding:4px_10px>{t}</span>".replace("_", " ") for t in ["Coffee", "Art", "Hindi"])}</div>' + kv
                                                 + f'<div style="display:flex;gap:8px;margin-top:10px">{docs}</div><div style="display:flex;gap:8px;margin-top:10px">{btn("Reject", "danger", None, True, True)}{btn("Verify", "dark", None, True, True)}</div>', mt=4, pad='12px 14px')))
def a_booking():
    kv = ''.join(f'<div class="lrow"><span style="color:{MUT};min-width:78px">{a}</span><span style="color:{M};font-weight:500;text-align:right;margin-left:auto">{b}</span></div>' for a, b in [('When', 'Sat 22 Nov · 4–8 PM'), ('Member', '<u>Sam Rivera</u> · +91 98765 43210'), ('Companion', '<u>Maya Iyer</u> · +91 90000 11111'),
        ('Place', 'Banjara Hills, Hyderabad'), ('Price', '₹1,299'), ('Payment', 'paid (simulated) · ₹1,299'), ('Payout', '₹1,039 companion · ₹260 prsnn'), ('Offers', 'Maya: accepted')])
    return (bar('Booking #A6582F') + body(f'<div style="display:flex;gap:6px">{pill("Confirmed", "green")}{pill("App (prepaid)", "grey")}</div>' + card(kv, mt=8, pad='2px 14px')
                                          + card(f'<div style="display:flex;justify-content:space-between"><b>Dispute</b>{pill("Open", "red")}</div><div class="sub" style="margin-top:2px">Reported by Sam · 2h ago · “Companion was 30 minutes late.”</div><div style="display:flex;gap:8px;margin-top:8px">{btn("View chat", "ghost", None, True, True)}{btn("Reply", "dark", None, True, True)}</div><div style="margin-top:6px">{btn("Close dispute", "soft", None, True, True)}</div>')))
def a_booking_actions():
    acts = [('Change date or time', 'ghost'), ('Reassign companion', 'ghost'), ('Mark completed', 'ghost'), ('Cancel booking', 'danger'), ('Refund (up to ₹1,299)', 'danger'), ('Retry failed refund', 'dark'), ('Set cancellation fee', 'ghost'), ('Mark paid (simulated)', 'ghost'), ('Delete booking', 'danger')]
    return (bar('Booking #A6582F') + body(label('Actions', 4) + ''.join(f'<div style="margin-top:7px">{btn(a, k)}</div>' for a, k in acts) + '<div class="hint">Refund, fee, mark paid and delete are superadmin only. A sub-admin’s cancel flags the refund for a superadmin.</div>'))
def a_bookings(): return A.s_admin_bookings()
def a_disputes():
    return (bar('Disputes') + body(seg(['Open', 'Resolved'], 0) + card(f'<div style="display:flex;justify-content:space-between"><b>#A6582F · Sam → Maya</b>{pill("2 replies", "red")}</div><div class="sub" style="margin-top:4px">“Companion was 30 minutes late.” · 2h ago</div>', mt=12)
                                   + card(f'<div style="display:flex;justify-content:space-between"><b>#B1C04D · Priya → Daniel</b>{pill("0 replies", "red")}</div><div class="sub" style="margin-top:4px">“Refund not received.” · 1d ago</div>')))
def a_panics(): return A.s_panics()
def a_panic():
    return (A.s_panic_detail() + sheet(f'<div style="font:600 16px Urbanist">Mark this alert resolved?</div><div class="sub">Repeats stop for every admin. Write what happened (kept in the activity log).</div>' + field('What happened', 'Spoke to both. All fine, they were lost.', None, on=True) + f'<div style="margin-top:10px">{btn("Resolve")}</div>'))
def a_users():
    r = lambda k, n, s, st: f'<div class="crow">{avatar(k, 44)}<div style="flex:1"><div style="font:600 14px Urbanist">{n}</div><div style="font:400 11.5px Urbanist;color:{MUT}">{s}</div></div>{st}</div>'
    return (bar('Users') + body(f'<div class="field" style="margin-top:4px">{ic("search", MUT, 16)}<span style="color:{MUT}">Name, phone or city</span></div>' + chips(['All', 'Members', 'Companions', 'Staff'], (0,), 10, False)
                                + r('cozy', 'Sam Rivera', 'Member · Hyderabad · ••3210', '') + r('evening', 'Maya Iyer', 'Companion · ID verified', pill('Live', 'green')) + r('study', 'Arjun Mehta', 'Sub-admin', pill('Staff', 'dark')) + r('walks', 'Kiran P', 'Member', pill('Suspended', 'red'))))
def a_user():
    kv = ''.join(f'<div class="lrow"><span style="color:{MUT}">{a}</span><span class="rv" style="color:{M}">{b}</span></div>' for a, b in [('Photo visibility', 'Locked'), ('Packages offered', '1, 2, 4, 6 h'), ('Available days', 'Mon–Sun except Wed')])
    return (bar('User') + body(f'<div style="display:flex;gap:12px;align-items:center;margin-top:4px">{avatar("evening", 56)}<div><div class="h" style="font-size:19px">Maya Iyer</div><div class="sub" style="margin:0">Companion · +91 90000 11111</div></div></div>'
                               + card(kv, mt=10, pad='2px 14px') + field('Full name', 'Maya Iyer') + f'<div style="display:flex;gap:10px">{field("City", "Hyderabad")}{field("Area", "Banjara Hills")}</div>'
                               + f'<div style="display:flex;gap:10px">{field("From (HH:MM)", "10:00")}{field("Until (HH:MM)", "20:00")}</div>' + field('About', 'Gallery openings, long coffees…', tall=True)
                               + f'<div style="margin-top:10px">{btn("Save changes")}</div>' + label('Account') + group(row('lock', 'Suspend account'), row('shield', 'Make sub-admin'), row('trash', 'Delete account', danger=True, last=True))
                               + label('Recent bookings') + card(f'<div class="lrow"><span>#A6582F · Sat 22 Nov</span><span class="rv">{pill("Confirmed", "green")}</span></div>', mt=6, pad='2px 14px')))
def a_admins():
    return (bar('Sub-admins') + body(notice('Sub-admins verify companions, edit users and bookings, and answer disputes. They can’t refund, change prices, see payout totals, add admins or send broadcasts.', 'grey', 'shield')
                                     + f'<div style="margin-top:10px">{btn("Add sub-admin by phone", "dark", "plus")}</div>' + label('Staff') + f'<div class="crow">{avatar("study", 44)}<div style="flex:1"><div style="font:600 14px Urbanist">Arjun Mehta</div><div style="font:400 11.5px Urbanist;color:{MUT}">Sub-admin · +91 98765 00000</div></div>{ic("chev", MUT, 14)}</div>')
            + sheet(f'<div style="font:600 16px Urbanist">Add sub-admin</div>' + field('Mobile number', '🇮🇳 +91 &nbsp;98765 00000', 'If nobody has this number yet, an account is made for it. They log in with OTP as usual.', on=True) + f'<div style="margin-top:10px">{btn("Add")}</div>'))
def a_prices():
    pk = ''.join(f'<div class="lrow"><span>{h_} {"hour" if h_ == 1 else "hours"}</span><span class="pfield">₹{PRICES[h_]:,}</span></div>' for h_ in range(1, 13))
    return (bar('Prices') + body('<div class="sub" style="margin-top:2px">One price list for every companion. Each longer package must cost more in total and less per hour.</div>' + label('Packages') + card(pk, mt=6, pad='2px 14px')
                                 + label('Headline packages') + '<div class="sub" style="margin:2px 0 0">Shown first, and offered by companions who haven’t picked their own.</div>' + chips(['1 h', '2 h', '4 h', '6 h', '12 h', '3 h', '8 h'], (0, 1, 2, 3, 4), 8)
                                 + label('Split and cancellation') + f'<div style="display:flex;gap:10px">{field("prsnn share (%)", "20", "Companion gets 80%")}{field("Cancellation fee (%)", "15")}</div>' + field('Free-cancellation cutoff (minutes before start)', '15')
                                 + label('Timing') + f'<div style="display:flex;gap:10px">{field("Day starts", "07:00")}{field("Day ends", "22:00")}</div><div style="display:flex;gap:10px">{field("Offer window min (min)", "15")}{field("Offer window max (min)", "300")}</div>'
                                 + checkbox(False, '<b>Re-price unpaid bookings.</b> Only bookings still awaiting payment. Paid bookings never change.')) + foot(btn('Save prices')))
def a_plans():
    form = (field('City', 'Hyderabad', mt=4) + field('Title', 'Fort and heritage walk') + field('Details (optional)', 'Golconda, tea after. Entry tickets extra.', tall=True)
            + label('Category') + chips([c[0] for c in CATS[:4]], (2,), 8) + label('Hours') + chips(['2 h', '3 h', '4 h', '6 h'], (2,), 8)
            + f'<div style="display:flex;gap:8px;margin-top:12px">{btn("Cancel", "ghost", None, True)}{btn("Save plan", "dark", None, True)}</div>')
    return bar('City plans', ic('plus', M, 18)) + body(form + label('Hyderabad · 2 plans') + card(f'<div style="display:flex;gap:10px;align-items:center"><div style="flex:1"><b>Live music night</b><div class="sub" style="margin:0">Don’t Go Alone · 3 hrs</div></div>{ic("edit", M, 16)}{ic("trash", RED, 16)}</div>', mt=6))
def a_broadcast():
    return (bar('Broadcast') + body(label('Send to', 4) + seg(['Members · 1', 'Companions · 3'], 0) + field('Title (27/60)', 'Weekend slots are filling up') + field('Message (49/180)', 'Book before Friday to get your favourite companion.', tall=True)
                                    + label('Preview') + card(f'<div style="display:flex;gap:10px"><span class="rico" style="background:{M}">{logo(7, P, C)}</span><div><div style="font:600 13px Urbanist">Weekend slots are filling up</div><div style="font:400 12px Urbanist;color:{MUT}">Book before Friday to get your favourite companion.</div></div></div>', mt=6)
                                    + label('Sent before') + card(f'<div class="lrow"><span>Diwali hours</span><span class="rv">Members · 3 Nov</span></div>', mt=6, pad='2px 14px')) + foot(btn('Send to 1 device', 'dark', 'send')))
def a_activity(): return A.s_activity()
def a_plans_empty():
    return bar('City plans', ic('plus', M, 18)) + body(f'<div class="empty"><span class="ebig">{ic("map", CD, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">No city plans yet</div><div class="sub" style="text-align:center">Add a few popular outings per city. Members see them on Home and in each category.</div><div style="margin-top:12px">{btn("Add a plan", "dark", "plus", False, True)}</div></div>')

# ═══════════════ EVERYWHERE ═══════════════
def e_loading(): return top(False) + h('Search companions', None, 24) + body(skel(46) + skel(30, '70%') + ''.join(f'<div style="display:flex;gap:12px;margin-top:14px"><div class="sk" style="width:54px;height:54px;border-radius:50%"></div><div style="flex:1">{skel(14, "60%", 6, 7)}{skel(12, "40%", 8, 6)}</div></div>' for _ in range(5))) + tabs(1)
def e_error(): return top(False) + h('Search companions', None, 24) + body(f'<div class="empty"><span class="ebig" style="background:{REDS}">{ic("alert", RED, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">Couldn’t load companions</div><div class="sub" style="text-align:center">Check your connection and try again. Nothing you typed was lost.</div><div style="margin-top:12px">{btn("Try again", "dark", None, False, True)}</div></div>') + tabs(1)
def e_offline(): return home_head(False) + offline() + body(f'<div style="margin-top:10px">{wallet_home(0)}</div>') + tabs(0)
def e_slow(): return bar('Review & pay') + body(f'<div style="margin-top:30px;text-align:center"><div class="spin"></div><div style="font:600 14px Urbanist;margin-top:14px">Still working…</div><div class="sub">Your connection is slow. We’re still saving your booking; please don’t close the app.</div><div style="height:6px;border-radius:3px;background:{DEEP};margin-top:14px;overflow:hidden"><div style="width:62%;height:100%;background:{M}"></div></div></div>')
def e_expired(): return g_login('expired')
def e_validation(): return g_login('error')
def e_notfound(): return bar() + f'<div class="empty" style="padding-top:80px"><span class="ebig">{ic("search", CD, 26)}</span><div style="font:600 16px Urbanist;margin-top:12px">This page doesn’t exist</div><div class="sub" style="text-align:center">It may have moved.</div><div style="margin-top:12px">{btn("Back to home", "dark", None, False, True)}</div></div>'
def e_confirm(): return p_member() + '<div class="dim" style="z-index:30"></div>' + f'<div class="dialog"><div style="font:600 16px Urbanist">Log out?</div><div class="sub" style="text-align:center">You’ll log back in with your PIN. No code needed.</div><div style="display:flex;border-top:1px solid {LINE};margin:12px -16px -14px"><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist">Cancel</span><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist;color:{RED};border-left:1px solid {LINE}">Log out</span></div></div>'

GROUPS = [
 ('Get started', 'First open to a ready account.', [
   ('Splash', g_splash), ('Welcome', g_welcome), ('I’m here as a…', g_role), ('Log in', g_login), ('Log in · reset PIN', lambda: g_login('reset')), ('Code · WhatsApp', g_otp), ('Code · resend', lambda: g_otp('resend')), ('Code · email', lambda: g_otp('email')),
   ('Email (abroad)', g_email), ('Set a PIN', g_pin_set), ('Confirm PIN · error', g_pin_confirm), ('Enter your PIN', g_pin_login),
   ('Setup 1 · name', s1), ('Setup 2 · mobile (email sign-ups)', s2), ('Setup 3 · where', s3), ('Setup 4 · what for', s4), ('Setup 5 · I am', s5), ('Setup 6 · who to meet', s6), ('Setup 7 · photo', s7), ('Setup 8 · photo visibility', s8)]),
 ('Member · find', 'Home, categories, search and profiles.', [
   ('Home', m_home), ('Home · scrolled', m_home2), ('Home · new city, photo to fix', m_home3), ('Category', m_category), ('Category · nobody yet', m_category_empty), ('Search · sort open', m_search), ('Search · no results', m_search_empty),
   ('Companion profile', m_companion), ('Companion · locked + new', m_companion_locked)]),
 ('Member · book and pay', 'From choosing a time to a confirmed booking.', [
   ('Book a time', m_book), ('Book a time · no slot', m_book_noslot), ('Review & pay · top', m_review1), ('Review & pay · someone else', m_review2), ('Review & pay · terms', m_review3),
   ('Payment', m_pay), ('Test checkout', m_pay_sheet), ('Booked · waiting', m_booked_wait), ('Booked · confirmed', m_booked_done), ('Booked · nobody available', m_booked_fail)]),
 ('Member · bookings, chat and safety', 'Everything after paying, including the panic button.', [
   ('My bookings', m_bookings), ('My bookings · statuses', m_bookings_states), ('Booking · finding', m_booking_finding), ('Cancel dialog', m_cancel_dialog), ('Booking · during session', m_booking_live), ('Booking · alert active', m_booking_alert),
   ('Chat', m_chat), ('Chat · panic (new)', m_chat_panic), ('Chat · ended', m_chat_ended), ('Alert sent', m_panic_sent), ('Stop with PIN', m_panic_pin), ('Alert closed', m_panic_closed),
   ('Report a problem', m_report), ('Report sent', m_report_done), ('Messages', m_messages), ('Messages · empty', m_messages_empty), ('Notifications', m_notifs), ('Notifications · empty', m_notifs_empty)]),
 ('Profile', 'Account and privacy.', [
   ('Profile · member', p_member), ('Profile · staff', p_staff), ('Personal information', p_edit), ('Privacy & preferences', p_privacy), ('Saved', p_saved), ('Saved · empty', p_saved_empty),
   ('Delete account', p_delete), ('Fix · photo', p_fix), ('Fix · profile (companion)', p_fix_profile), ('Sent for review', p_fix_sent)]),
 ('Companion', 'Apply, the nine onboarding steps, status, requests, ID and earnings.', [
   ('Become a companion', c_apply), ('Onboarding 1 · I am', c1), ('2 · photo', c2), ('3 · photo visibility', c3), ('4 · where', c4), ('5 · about + interests', c5), ('6 · offers', c6), ('7 · durations', c7), ('8 · days and hours', c8), ('9 · summary', c9),
   ('Status · in review', c_status_review), ('Status · changes', c_status_changes), ('Status · not approved', c_status_rejected), ('Status · live', c_status_live),
   ('Dashboard · live', c_dashboard), ('Dashboard · in review', c_dashboard_review), ('Requests', c_requests), ('Requests · past', c_requests_past),
   ('Verify ID · why', c_verify_why), ('Verify ID · form', c_verify_form), ('Checking your ID', c_verify_held), ('Packages & availability', c_availability), ('Earnings', c_earnings), ('Earnings · empty', c_earnings_empty), ('Profile · companion', lambda: p_profile('companion'))]),
 ('Admin', 'Every staff tool, superadmin and sub-admin.', [
   ('Overview · superadmin', a_overview), ('Overview · sub-admin', a_overview_sub), ('Approvals', a_approvals), ('Approvals · photos + ask', a_approvals_photos), ('Review profile', a_review), ('Reject', a_reject),
   ('Verify IDs', a_verify), ('Bookings', a_bookings), ('Booking', a_booking), ('Booking · actions', a_booking_actions), ('Disputes', a_disputes), ('Panic alerts', a_panics), ('Panic · resolve', a_panic),
   ('Users', a_users), ('User', a_user), ('Sub-admins + add', a_admins), ('Prices', a_prices), ('City plans', a_plans), ('City plans · empty', a_plans_empty), ('Broadcast', a_broadcast), ('Activity', a_activity)]),
 ('Everywhere', 'The 10-state checklist and shared pieces.', [
   ('Loading', e_loading), ('Error', e_error), ('Offline', e_offline), ('Slow network', e_slow), ('Session ended (drafts kept)', e_expired), ('Inline validation', e_validation), ('Confirm dialog', e_confirm), ('Not found', e_notfound)]),
]

EXTRA_CSS = f'''
.tagnote{{position:absolute;top:44px;right:14px;font:600 10px Urbanist;padding:3px 8px;border-radius:99px;background:{M};color:{P};z-index:30}}
.dim{{position:absolute;inset:0;background:rgba(14,17,30,.42);z-index:25}}
.bsheet{{position:absolute;left:0;right:0;bottom:0;background:{P};border-radius:24px 24px 0 0;padding:10px 18px 22px;z-index:26;box-shadow:0 -10px 30px rgba(24,27,52,.2)}}
.grab{{width:36px;height:4px;border-radius:2px;background:#C9CAD6;margin:0 auto 12px}}
.dialog{{position:absolute;left:34px;right:34px;top:38%;background:{W};border-radius:18px;padding:16px 16px 14px;z-index:31;text-align:center;overflow:hidden}}
.sosm{{width:44px;height:44px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;font:700 11px Outfit;background:{RED};color:#fff}}
.tagc{{display:inline-flex;flex-direction:column;align-items:center;gap:3px;padding:8px 10px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE};font:500 10.5px Urbanist}}
.panel{{margin-top:8px;padding:8px;border-radius:14px;background:{W};box-shadow:inset 0 0 0 1px {LINE}}}.panel .chips{{flex-wrap:wrap}}
.sk{{background:linear-gradient(90deg,#E4E4EA,#EEEEF2,#E4E4EA)}}
.spin{{width:36px;height:36px;margin:0 auto;border-radius:50%;border:3px solid {DEEP};border-top-color:{M}}}
.cal{{grid-template-columns:repeat(7,1fr)}}
'''

def phone(fn):
    html = fn()
    cut = max(html.rfind('<div class="tabs">'), html.rfind('<div class="foot"'))
    overlay = html.find('<div class="dim"')
    if overlay > 0 and (cut < 0 or overlay < cut or True):
        # keep sheets and dialogs fixed on top of the phone
        sheet_start = overlay
        content, fixed = html[:sheet_start], html[sheet_start:]
        tail = max(content.rfind('<div class="tabs">'), content.rfind('<div class="foot"'))
        if tail > 0:
            content, fixed = content[:tail], content[tail:] + fixed
    else:
        content, fixed = (html[:cut], html[cut:]) if cut > 0 else (html, '')
    return f'<div class="ph"><div class="notch"></div><div class="scr{" pad" if fixed else ""}">{content}</div>{fixed}</div>'

count = sum(len(s) for _, _, s in GROUPS)
toc = ''.join(f'<a href="#g{i}">{g} · {len(s)}</a>' for i, (g, _, s) in enumerate(GROUPS))
groups_html = ''.join(f'<section class="grp" id="g{i}"><h2>{g}</h2><p>{d}</p><div class="grid">' + ''.join(f'<div class="cell">{phone(fn)}<span class="cap">{t}</span></div>' for t, fn in s) + '</div></section>' for i, (g, d, s) in enumerate(GROUPS))
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn screens v2</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
        f'<style>{A.CSS}{EXTRA_CSS}</style></head><body><div class="intro"><h1>prsnn. · every screen and state, v2</h1>'
        f'<p>{count} screens in the approved look, checked line by line against the current app (see preview/screens-gap-audit.md). Every option, step, state and admin tool from today is here; the one addition is the panic button in chat, as you asked. Each phone scrolls like the real app.</p>'
        f'<div class="toc">{toc}</div></div>{groups_html}</body></html>')
html = re.sub(r'url\(IMG_(\w+)\)', r'var(--\1)', html)
(A.ROOT / 'preview/all-screens-v2.html').write_text(html)
print('wrote preview/all-screens-v2.html', count, 'screens', len(html) // 1024, 'KB')
