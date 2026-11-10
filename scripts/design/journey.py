"""The whole journey, landing page to the end — members, companions, admin.
Round 2 with the owner's changes: PIN right after the number is verified,
email sign-up for visitors from abroad, state → city → area dropdowns (all
India), "Who would you like to meet?", photo upload (admin-approved) before
privacy, new price cards everywhere, five categories, admin approval for
every companion, change requests in the bell, panic button.
Run: python3 scripts/design/journey.py  → preview/journey.html"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import flows as F
from flows import ROOT, page, ic, bar, tabs, dots, ticks, setup, opts, keypad, pk, pkrow, PRICES, share, inr
import id_later as L

WORDS = [
  ('for coffee, walks and events in Hyderabad — from ₹399.', 'for coffee, walks, events and more — from ₹399.'),
  ('Book a verified companion', 'Book an ID-checked companion'), ('Book verified people', 'Book ID-checked people'),
  ('You’re verified. Members can now book you.', 'Your ID is verified. Every booking is now one tap to accept.'),
  ('Mukarram Jah', 'Rahul Mehta'), ('Mukarram', 'Rahul'), ('>MJ<', '>RM<'), ('Ayesha Khan', 'Priya Nair'), ('Ayesha', 'Priya'),
  ('Verified companions only', 'ID-checked companions'), ('First time in Hyderabad!', 'First time in this city!'),
]
def generic(s):
    for a, b in WORDS:
        s = s.replace(a, b)
    return s
def g(cells): return [(generic(c), generic(h), n) for c, h, n in cells]
def restep(cell, old, new):
    c, h, n = cell
    return c, h.replace(dots(*old), dots(*new)).replace(f'Step {old[0]} of {old[1]}', f'Step {new[0]} of {new[1]}'), n
def cap(cell, text): return (text, cell[1], cell[2])

G = 'background:var(--green50);border-color:var(--mossSoft)'
RED = 'background:#F9E3E1;border-color:#f0c4bf'
BACK = f'<div style="position:absolute;top:38px;left:14px;width:32px;height:32px;border-radius:16px;background:#FAF9F6;display:flex;align-items:center;justify-content:center;z-index:3">{ic("back", "#0E110D", 17)}</div>'
def dd(label, val, on=True, hint=''):
    return f'<div><div class="lbl">{label}</div><div class="field{" on" if on else ""} row between"><span>{val}</span><span class="mut">▾</span></div>{f"<div class=xs style=color:var(--muted);margin-top:4px>{hint}</div>" if hint else ""}</div>'
def kv(k, v): return f'<div class="row sm" style="align-items:flex-start"><span class="mut" style="width:86px;flex:none">{k}</span><b style="flex:1">{v}</b></div>'
def chk(on=True): return f'<span style="width:20px;height:20px;border-radius:6px;flex:none;{"background:var(--moss)" if on else "border:1.5px solid var(--g4)"};display:inline-flex;align-items:center;justify-content:center">{ic("check", "#fff", 13, 3) if on else ""}</span>'

# Five categories (owner, 2026-11-10). name, photo, line, suggested hours, bullets
CATS = [
  ('New in Town', 'walks', 'Make your first days less lonely', 4, ['Explore neighbourhoods', 'Find cafés and local spots', 'Discover weekend activities', 'Meet someone who knows the city']),
  ('Don’t Go Alone', 'evening', 'Good plans deserve good company', 4, ['Concerts and live music', 'Weddings and social events', 'Movies and dinners', 'Festivals and weekend outings']),
  ('Explore & Discover', 'events', 'Experience more of your city with a local', 6, ['Food trucks and restaurants', 'Parks and outdoor activities', 'Local attractions', 'Shopping and neighbourhood walks']),
  ('Companion for a Loved One', 'park', 'Because you can’t always be there', 2, ['Coffee and social outings', 'Walks and recreation', 'Shopping trips', 'Non-medical social visits']),
  ('Work & Study Together', 'study', 'Make working alone feel less alone', 2, ['Coffee-shop co-working', 'Study sessions', 'Accountability sessions', 'Focus meetups']),
]
def tile(name, img, line, h=92, on=False, price=None):
    chkm = f'<i style="position:absolute;top:7px;right:7px;z-index:2;width:22px;height:22px;border-radius:11px;background:var(--moss);display:flex;align-items:center;justify-content:center">{ic("check", "#fff", 13, 3)}</i>' if on else ''
    pr = f'<div class="pill" style="position:absolute;top:7px;left:7px;z-index:2;font-size:10px;background:#FAF9F6;color:var(--moss)">{price}</div>' if price else ''
    return f'<div class="tile i-{img}" style="height:{h}px{";outline:3px solid var(--moss);outline-offset:-3px" if on else ""}">{chkm}{pr}<span>{name}<small>{line}</small></span></div>'
def from_price(h): return f'{h} hrs · {inr(PRICES[h])}'

# ───────── Shared screens ─────────
def mobile_screen(companion=False):
    head = ('evening', 'Start earning with prsnn.', 'Sign up with your mobile number.') if companion else ('park', 'Welcome to prsnn.', 'Log in or sign up in seconds.')
    return (f'<div class="hero i-{head[0]}" style="height:190px"><div class="wm">prsnn<i>.</i></div><div class="in"><div class="h2" style="color:#FAF9F6">{head[1]}</div><div class="sm" style="opacity:.9">{head[2]}</div></div></div>'
            '<div class="sheet"><div><div class="lbl">Indian mobile number</div><div class="field on"><span>🇮🇳 +91</span><span style="font-weight:500">98765 43210</span></div><div class="sm mut" style="margin-top:6px">We’ll send a 6-digit code on WhatsApp.</div></div>'
            '<div class="btn">Send code</div><div class="row" style="gap:8px"><span style="flex:1;height:1px;background:var(--line)"></span><span class="xs mut">Not in India?</span><span style="flex:1;height:1px;background:var(--line)"></span></div>'
            f'<div class="btn sec">{ic("send", "#2F4A34", 15)} Continue with email</div>'
            + ticks(['Your number is never shown to anyone', 'ID-checked companions · public places']) + '</div>')
def pin_screen():
    return (f'<div class="pad" style="text-align:center;align-items:center"><span class="pill" style="margin-top:6px">{ic("check", "#2F4A34", 12, 3)} Number verified</span>'
            f'<div class="ok" style="margin-top:6px">{ic("lock", "#fff", 28)}</div><div class="h1">Set a 4-digit PIN</div><div class="mut sm">Next time, open prsnn with your PIN — no code needed.</div>'
            f'<div class="pdots" style="margin:8px 0"><i class="on"></i><i class="on"></i><i></i><i></i></div>{keypad()}</div>')
email_screens = [
  ('NEW|Sign up with email|For visitors from abroad without an Indian number. A mobile with country code is still needed for booking updates and safety alerts.',
   f'{bar("Sign up with email")}<div class="pad" style="padding-top:4px;gap:9px"><div class="h2">Visiting India?</div><div class="sm mut">Sign up with your email. We’ll send a 6-digit code.</div>'
   '<div><div class="lbl">Email</div><div class="field on">emma.clarke@gmail.com</div></div>' + dd('Country you live in', '🇬🇧 United Kingdom')
   + '<div><div class="lbl">Mobile with country code</div><div class="field on"><span>🇬🇧 +44</span><span style="font-weight:500">7700 900123</span></div><div class="xs mut" style="margin-top:4px">For booking updates and safety alerts. Never shown to anyone.</div></div>'
   '<div class="btn" style="margin-top:auto">Email me a code</div></div>', True),
  ('NEW|Code from the email|Same 6-digit code; then the PIN, then setup.',
   f'{bar("")}<div class="pad" style="padding-top:8px"><div class="h1">Check your email</div><div class="mut sm">We sent a code to emma.clarke@gmail.com</div><div class="boxes"><span class="on">3</span><span class="on">9</span><span class="on">1</span><span class="on">7</span><span></span><span></span></div><div class="sm mut">Resend in 40s · <span style="color:var(--moss);font-weight:600">Change email</span></div><div class="btn dis" style="margin-top:auto">Verify</div></div>', True),
]
def photo_step(n, of, kind='Member'):
    return setup('cozy', 'Let people see the real you.', 'A clear photo builds trust.', n, of, 'Add a clear photo of you',
      '<div class="row" style="gap:12px"><div class="av i-together" style="width:84px;height:84px;border:3px solid var(--moss)"></div><div class="col" style="gap:4px"><span class="pill w">In review</span><span class="xs mut">Usually within a few hours</span><span class="sm" style="color:var(--moss);font-weight:600">Change photo</span></div></div>'
      + ticks(['Your face clearly visible — no sunglasses or filters', 'Just you in the photo', 'Our team approves every photo', 'You choose who sees it on the next step']).replace('<div class="ticks">', '<div class="ticks" style="margin-top:0">')
      + '<div class="btn" style="margin-top:auto">Continue →</div>', kind)
def area_sheet():
    rows = [('Gachibowli', '500032', 'Rangareddy, Telangana'), ('Telecom Nagar, Gachibowli', '500032', 'Rangareddy, Telangana'), ('Nanakramguda', '500032', 'Rangareddy, Telangana'), ('Indira Nagar, Gachibowli', '500032', 'Rangareddy, Telangana')]
    return (f'{bar("Choose your area")}<div class="pad" style="padding-top:2px;gap:8px"><div class="row" style="gap:6px"><span class="pill n">Telangana</span><span class="pill n">Hyderabad</span></div>'
            f'<div class="field on"><span class="mut">{ic("search", "#8E8A7E", 15)}</span><span>gachi</span></div><div class="grp">'
            + ''.join(f'<div class="li"><div class="t"><div class="sm" style="font-weight:600">{a}</div><div class="xs mut">{d}</div></div><span class="xs mut">{p}</span></div>' for a, p, d in rows)
            + '</div><div class="xs mut">Every locality and PIN code in India (India Post directory) — type a name or a PIN code.</div></div>')
def where_body():
    return (dd('State', 'Telangana') + dd('City or town', 'Hyderabad') + dd('Area or locality', 'Gachibowli · 500032', hint='Search by name or PIN code — every area in India.')
            + '<div class="btn" style="margin-top:auto">Continue →</div>')

# ───────── MEMBERS ─────────
S, D, B, A = F.signup, F.discover, F.book, F.after
m_signup = g([
  S[0], S[1],
  ('Your mobile number|Indian number gets a WhatsApp code. Visitors from abroad tap “Continue with email”.', mobile_screen(), True),
  S[3],
  ('NEW|Set a PIN — right away|As soon as the number is verified, before anything else.', pin_screen(), True),
  restep(S[4], (1, 7), (1, 7)),
  ('NEW|Where are you?|Three dropdowns: state → city → area, all of India. No location permission.',
   setup('park', 'Find company near you.', 'Companions near you show up first.', 2, 7, 'Where are you?', where_body()), True),
  ('NEW|Area dropdown, opened|Search every locality and PIN code in India.', area_sheet(), True),
  ('NEW|What can we help you with?|The five categories. Tap any; Home opens on them.',
   f'<div class="pad">{dots(3, 7)}<div><div class="step">Step 3 of 7</div><div class="h2">What can we help you with?</div><div class="sm mut">Tap all that fit. We’ll show the right companions.</div></div>'
   + tile(*CATS[0][:3], h=96, on=True, price=f'from {inr(PRICES[4])}') + '<div class="g2">' + ''.join(tile(n, i, l, 92, n == 'Don’t Go Alone') for n, i, l, *_ in CATS[1:]) + '</div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
  restep(S[6], (3, 7), (4, 7)),
  ('NEW|Who would you like to meet?|Was “Show me”. Plain words: which companions you’ll see.',
   setup('events', 'Company you’re comfortable with.', 'You decide who you meet.', 5, 7, 'Who would you like to meet?',
     opts([('Women companions', ''), ('Men companions', ''), ('Non-binary companions', ''), ('Anyone', 'All companions')], 'Anyone') + '<div class="xs mut">Only these companions are shown to you. Change it any time in Privacy.</div>'), True),
  ('NEW|Add a clear photo (required)|Can’t continue without one. Our team approves it; until then it’s “In review”.', photo_step(6, 7), True),
  restep(cap(S[8], 'Who can see your photo?|Now comes after the photo. Locked is recommended.'), (5, 7), (7, 7)),
])
m_email = g(email_screens)

home_top = (f'<div class="pad" style="gap:9px"><div class="row between"><div class="wm">prsnn<i>.</i></div><div class="row sm" style="gap:8px">{ic("pin", "#0E110D", 14)}Gachibowli ▾ {ic("bell", "#0E110D", 19)}</div></div>'
  '<div class="tile i-together" style="height:118px"><span style="font-size:18px;font-family:Lora">Good company, from ₹399<small style="font-size:11.5px;margin-top:2px">ID-checked people near you · pay safely · public places</small></span></div>'
  '<div class="h3">What would you like to do?</div>' + tile(*CATS[0][:3], h=88, price=f'from {inr(PRICES[4])} · 4 hrs')
  + '<div class="g2">' + ''.join(tile(n, i, l, 86, price=f'{h} hrs · {inr(PRICES[h])}') for n, i, l, h, _ in CATS[1:]) + '</div></div>' + tabs('Home'))
home_more = ('<div class="pad" style="gap:9px;padding-top:40px">'
  f'<div class="card row" style="background:var(--claySoft);border-color:#ecc8b4;padding:9px 11px">{ic("cam", "#C45C2A", 17)}<span class="xs" style="flex:1">Your photo is in review. You can book meanwhile.</span></div>'
  '<div class="row between"><div class="h3">Popular in Hyderabad</div><span class="xs mut">See all</span></div><div class="row" style="gap:8px;overflow:hidden">'
  + ''.join(f'<div class="tile i-{i}" style="flex:none;width:128px;height:86px"><span>{t}<small>{h} hrs · {inr(PRICES[h])}</small></span></div>' for t, i, h in [('Heritage walk + lunch', 'events', 6), ('Café hopping', 'coffee', 2), ('Weekend park outing', 'park', 4)]) + '</div>'
  '<div class="row between"><div class="h3">Near you now</div><span class="xs mut">See all</span></div><div class="row" style="gap:8px">'
  + ''.join(f'<div class="card" style="flex:1;padding:8px;text-align:center"><div class="av i-{i}" style="width:46px;height:46px;margin:0 auto 5px"></div><div class="sm" style="font-weight:600">{n}</div><div class="xs" style="color:var(--moss)">{t}</div></div>' for i, n, t in [('cozy', 'Priya', 'ID verified'), ('locked', 'Ananya', 'ID verified'), ('study', 'Karan', 'New')]) + '</div>'
  f'<div class="card row" style="{G}"><div class="av">{ic("heart", "#2F4A34", 18)}</div><div style="flex:1"><b class="sm">Can’t be there for mum or dad?</b><div class="xs mut">Weekly company for a loved one, paid from anywhere</div></div>{ic("chev", "#2F4A34", 16)}</div>'
  '<div class="card col" style="gap:4px"><b class="sm">How it works</b><div class="row xs mut" style="gap:6px;flex-wrap:wrap"><span>1 · Pick a plan</span><span>2 · Pay (UPI, cards)</span><span>3 · They confirm</span><span>4 · Meet in public</span></div></div></div>' + tabs('Home'))
def cat_page(c, city='Hyderabad'):
    n, img, line, h, bullets = c
    return (f'<div class="hero i-{img}" style="height:180px">{BACK}<div class="in"><div class="h1" style="color:#FAF9F6">{n}</div><div class="sm" style="opacity:.92">{line}.</div></div></div>'
            '<div class="sheet" style="gap:8px"><div class="col sm" style="gap:4px">' + ''.join(f'<span>{ic("check", "#2F4A34", 14, 2.4)} {t}</span>' for t in bullets) + '</div>'
            f'<div class="xs mut" style="margin-top:2px">Suggested</div>{pkrow(h, True)}'
            f'<div class="row between"><div class="h3">Locals in {city}</div><span class="xs" style="color:var(--moss);font-weight:600">See all</span></div>'
            '<div class="row" style="gap:7px">' + ''.join(f'<div class="av i-{i}" style="width:40px;height:40px"></div>' for i in ['cozy', 'locked', 'study', 'together']) + '<span class="xs mut">Priya, Ananya, Karan and more</span></div></div>'
            f'<div class="foot"><div class="btn">Plan it · {from_price(h)}</div></div>')
CITY_PLANS = {'Hyderabad': [('Fort & heritage walk', 'Golconda Fort, Qutb Shahi Tombs', 6), ('Film city day', 'Ramoji Film City', 8)],
              'Mumbai': [('Caves & national park', 'Kanheri Caves, Sanjay Gandhi NP', 6), ('Hill station day', 'Lonavala & Khandala', 8)]}
def explore(city):
    n, img, line, h, _ = CATS[2]
    return (f'<div class="hero i-{img}" style="height:160px">{BACK}<div class="in"><div class="h1" style="color:#FAF9F6">{n}</div><div class="sm" style="opacity:.92">{line}.</div></div></div>'
            f'<div class="sheet" style="gap:8px"><div class="row between"><div class="h3">Popular in {city}</div><span class="pill n">{ic("pin", "#4A473F", 11)} {city}</span></div>'
            + ''.join(f'<div class="card row" style="padding:9px 11px"><div class="av i-{img}" style="width:40px;height:40px;border-radius:10px"></div><div style="flex:1"><div class="h3" style="font-size:14px">{t}</div><div class="xs mut">{d}</div></div><b class="sm">{hh} hrs</b></div>' for t, d, hh in CITY_PLANS[city])
            + f'{pkrow(6, True)}{pkrow(8)}<div class="xs mut">Tickets, food and travel are paid by you on the day.</div></div>')
def profile(verified=True):
    badge = f'<span class="pill">{ic("shield", "#2F4A34", 11)} ID verified</span>' if verified else '<span class="pill n">New on prsnn</span>'
    return (f'<div class="hero i-cozy" style="height:170px">{BACK}</div><div class="sheet" style="gap:8px"><div class="row between"><div class="h1">Priya Nair</div>{badge}</div>'
            f'<div class="xs mut">{ic("pin", "#6A665C", 12)} Gachibowli · Hindi, English, Telugu · public places only</div>'
            '<div class="chips"><span class="chip">New in Town</span><span class="chip">Don’t Go Alone</span></div>'
            '<div class="sm">Café explorer and long-walk person. Happy to make a new city feel like home.</div>'
            + ('' if verified else f'<div class="card xs" style="{G};padding:8px 10px">{ic("shield", "#2F4A34", 12)} Her ID is checked before you meet. If it doesn’t pass: another companion or a full refund.</div>')
            + f'<div class="g2">{pk(2)}{pk(4, True)}</div></div>'
            '<div class="foot row between"><div><b style="font-size:17px">₹1,299</b><div class="xs mut">4 hrs · save ₹297</div></div><div class="btn" style="padding:0 22px">Book Priya</div></div>')
m_discover = g([
  ('NEW|Home — top|Big promise, the five categories with prices on each, your area on top.', home_top, True),
  ('NEW|Home — scrolled|Photo-review notice, popular in your city, near you now, loved-one card, how it works.', home_more, True),
  ('NEW|Category — New in Town|What you get, the suggested booking, locals in your city.', cat_page(CATS[0]), True),
  ('NEW|Explore & Discover — Hyderabad|Was “Day trips”. Plans come from the person’s city…', explore('Hyderabad'), True),
  ('NEW|…and Mumbai|Same category everywhere; the plans inside change by state and city.', explore('Mumbai'), True),
  D[1],
  ('Companion profile — ID verified|New price cards; sticky Book bar.', profile(True), True),
  ('NEW|Companion profile — new on prsnn|Honest label until her ID is checked; refund promise.', profile(False), True),
])
m_book = g([
  ('NEW|How long?|New price cards: duration, total, per-hour vs ₹399, saving %, value bar, what it fits. Long bookings as rows.',
   f'{bar("How long?")}<div class="pad" style="padding-top:4px;gap:9px"><div class="g2">{pk(1)}{pk(2)}{pk(4, True)}{pk(6)}</div>{pkrow(8)}{pkrow(12)}</div><div class="foot"><div class="btn">Continue · ₹1,299</div></div>', True),
  ('Pick a day and time|Calendar and start times; the end time is shown.',
   f'{bar("When?")}<div class="pad" style="padding-top:4px;gap:9px"><span class="pill">4 hrs · ₹1,299</span><div class="g7">' + ''.join(f'<span>{d}</span>' for d in 'MTWTFSS') + ''.join(f'<span class="d{" on" if n == 15 else (" x" if n in (11, 12) else "")}">{n}</span>' for n in range(10, 24)) + '</div>'
   '<div class="lbl" style="margin:0">Start time</div><div class="g3">' + ''.join(f'<div class="slot{" on" if t == "4:00 PM" else ""}">{t}</div>' for t in ['11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']) + '</div>'
   '<div class="card sm" style="padding:9px 11px">Sat 15 Nov · <b>4:00–8:00 PM</b></div><div><div class="lbl">Meet at (a public place)</div><div class="field on">Starbucks, Inorbit Mall</div></div></div><div class="foot"><div class="btn">Continue</div></div>', False),
  ('NEW|Who is this for?|Me or someone else — Mother, Father, Grandparent, Relative, Friend, Other (with a box to say who).',
   f'{bar("Who is it for?")}<div class="pad" style="padding-top:4px;gap:8px"><div class="g2"><div class="opt"><div class="h3">Me</div></div><div class="opt on"><div class="h3">Someone else</div></div></div>'
   '<div class="chips">' + ''.join(f'<span class="chip{" on" if r == "Other" else ""}">{r}</span>' for r in ['Mother', 'Father', 'Grandparent', 'Relative', 'Friend', 'Other']) + '</div>'
   '<div><div class="lbl">Who are they to you?</div><div class="field on">My neighbour aunty</div></div><div><div class="lbl">Their name</div><div class="field on">Asha Verma</div></div>'
   + dd('Their city', 'Pune, Maharashtra') + '<div><div class="lbl">Their mobile (we ask them to agree on WhatsApp)</div><div class="field">🇮🇳 +91 98480 00000</div></div></div><div class="foot"><div class="btn">Continue</div></div>', True),
  B[1], B[2], B[3],
  (lambda c: (c[0], c[1].replace('Ananya', 'Priya'), c[2]))(cap(L.members[1], 'NEW|If your companion is new|They accepted; their ID is checked before you meet.')),
])
m_loved = g([
  ('NEW|Companion for a Loved One — weekly|Weekly or monthly visits, same companion, paid from anywhere.',
   f'{bar("Companion for a Loved One")}<div class="pad" style="padding-top:4px;gap:8px"><div class="tile i-park" style="height:104px"><span>Company for your mother<small>Coffee, walks, shopping, social visits</small></span></div><div class="h3">How often?</div>'
   + ''.join(f'<div class="opt{" on" if o else ""}"><div><div class="h3">{t}</div><div class="sm mut">{d}</div></div><b style="margin-left:auto">{inr(v)}</b></div>' for t, d, v, o in [('Once', '2 hrs · one visit', 699, 0), ('Every week', '2 hrs · 4 visits a month', 699 * 4, 1), ('Twice a week', '2 hrs · 8 visits a month', 699 * 8, 0)])
   + '<div class="xs mut">Non-medical company only. She agrees first; same companion each week when free.</div></div><div class="foot"><div class="btn">Continue · ₹2,796 / month</div></div>', True),
  ('NEW|Gift a booking|Buy time for someone; a gift code goes by WhatsApp.',
   f'{bar("Gift a booking")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card" style="background:var(--moss);color:#FAF9F6;border:0;text-align:center;padding:14px"><div class="wm" style="color:#FAF9F6">prsnn<i>.</i></div><div class="h2" style="color:#FAF9F6;margin-top:4px">A gift of good company</div></div>'
   f'<div class="g2">{pk(2)}{pk(4, True)}</div><div><div class="lbl">Message</div><div class="field" style="height:44px"><span class="sm">Happy birthday! Go explore 🎉 — Rahul</span></div></div></div><div class="foot"><div class="btn">Pay ₹1,299 and send</div></div>', True),
])
def booking_safety(live, companion=False):
    other, img = ('Rahul', 'together') if companion else ('Priya', 'cozy')
    top = (f'{bar("Booking #A6F7ED")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card row"><div class="av i-{img}" style="width:44px;height:44px"></div><div style="flex:1"><div class="h3">{other}</div><div class="xs mut">Sat 15 Nov · 4:00–8:00 PM</div><div class="xs mut">Starbucks, Inorbit Mall</div></div><span class="pill">{"Live now" if live else "Confirmed"}</span></div>')
    if not live:
        return (top + f'<div class="btn">{ic("msg", "#fff", 16)} Chat with {other}</div>'
                '<div class="card col" style="gap:6px;opacity:.75"><div class="row"><div style="width:44px;height:44px;border-radius:22px;background:var(--mistDeep);display:flex;align-items:center;justify-content:center;font-weight:800;color:#8E8A7E">SOS</div><div style="flex:1"><b class="sm">Panic button</b><div class="xs mut">Turns on at 4:00 PM and stays on until 9:00 PM (1 hour after the end).</div></div></div></div>'
                '<div class="btn sec">Cancel booking</div></div>')
    return (top + '<div class="card col" style="align-items:center;text-align:center;gap:8px;padding:16px">'
            '<div style="width:118px;height:118px;border-radius:59px;background:radial-gradient(circle at 35% 30%,#E0453A,#B3261E);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;font-size:26px;animation:pulse 1.6s infinite">SOS<span style="font-size:10px;font-weight:600;opacity:.9">hold 3 s</span></div>'
            '<b class="sm">Feel unsafe? Hold the button.</b><div class="xs mut">Alerts the prsnn safety team at once, and again every 5 minutes until it’s stopped.</div></div>'
            '<div class="g2"><div class="btn danger" style="height:40px">Call 112</div><div class="btn sec" style="height:40px">Chat</div></div></div>')
alert_sent = ('<div class="pad" style="background:#B3261E;color:#fff;gap:10px;padding-top:46px"><div class="row" style="gap:10px"><div style="width:44px;height:44px;border-radius:22px;background:#fff;color:#B3261E;display:flex;align-items:center;justify-content:center;font-weight:800">SOS</div><div><div class="h2" style="color:#fff">Alert sent</div><div class="xs" style="opacity:.9">4:31 PM · our team has been told</div></div></div>'
  '<div class="card" style="background:rgba(255,255,255,.12);border:0;color:#fff"><div class="xs" style="opacity:.85">Next alert in</div><div style="font:600 30px DM Sans">4:12</div><div class="xs" style="opacity:.85">Repeats every 5 minutes until you or our team stop it.</div></div>'
  '<div class="card col xs" style="background:rgba(255,255,255,.12);border:0;color:#fff;gap:3px"><b class="sm">Shared with every prsnn admin</b><span>Your name and mobile · Priya’s name and mobile</span><span>Sat 15 Nov, 4:00–8:00 PM</span><span>Starbucks, Inorbit Mall</span></div>'
  '<div class="btn" style="background:#fff;color:#B3261E;margin-top:auto">Call 112 (police, ambulance)</div><div class="btn" style="background:transparent;border:1.5px solid #fff">I’m safe — stop alerts (PIN)</div></div>')
def bell(items):
    return (f'{bar("Notifications", "<span class=sm style=color:var(--moss)>Clear</span>")}<div class="pad" style="padding-top:4px;gap:8px">' + ''.join(
        (f'<div class="card col" style="background:var(--claySoft);border-color:#ecc8b4;gap:5px"><div class="row" style="gap:6px"><span class="pill w">Action needed</span><span class="xs mut">from the prsnn team · 10 min ago</span></div><div class="sm">“{t}”</div><div class="btn" style="height:36px;font-size:13px">Fix and resubmit</div></div>' if kind == 'ask'
         else f'<div class="row card"><div class="av" style="width:36px;height:36px">{ic(i, "#2F4A34", 17)}</div><div style="flex:1"><div class="sm">{t}</div><div class="xs mut">{w}</div></div></div>')
        for kind, i, t, w in items) + '</div>')
def fix_screen(note):
    return (f'{bar("Update your photo")}<div class="pad" style="padding-top:4px;gap:10px"><div class="card sm" style="background:var(--claySoft);border-color:#ecc8b4"><b>Our team asked:</b> “{note}”</div>'
            '<div class="row" style="gap:12px"><div class="av i-together" style="width:70px;height:70px;opacity:.5"></div><span style="font-size:20px">→</span><div class="av i-cozy" style="width:84px;height:84px;border:3px solid var(--moss)"></div></div>'
            + ticks(['Daylight or a bright room', 'Face the camera, no sunglasses', 'Just you in the photo']).replace('<div class="ticks">', '<div class="ticks" style="margin-top:0">')
            + '<div class="btn" style="margin-top:auto">Send again for review</div></div>')
m_safety = g([
  ('NEW|Booking — before it starts|Panic button shown but off until the session starts.', booking_safety(False), True),
  ('NEW|During the session: panic button|On from the start time until 1 hour after the end. Hold 3 s so it isn’t pressed by accident.', booking_safety(True), True),
  ('NEW|Alert sent|Every admin gets names, mobiles, date, time and the meeting place — again every 5 min until stopped by an admin or the person who pressed it.', alert_sent, True),
  ('NEW|Chat — with a safety reminder|Both sides see: no phone numbers, addresses, personal details, politics or religion. Numbers are masked anyway.', A[2][1], True),
])
m_after = g([
  A[0],
  ('NEW|Bell: the team asks for a change|Admins can ask for a new photo or other fixes; it shows here with “Fix and resubmit”.',
   bell([('ask', '', 'Your photo is a bit dark. Please upload one in daylight with your face clearly visible.', ''), ('', 'check', 'Priya confirmed your booking #A6F7ED. Chat is open.', '2 h ago'), ('', 'rupee', 'Payment received for booking #A6F7ED.', '2 h ago')]), True),
  ('NEW|Fix and resubmit|Shows the team’s note; send the new photo back for review.', fix_screen('Your photo is a bit dark. Please upload one in daylight with your face clearly visible.'), True),
  A[4],
])

# ───────── COMPANIONS ─────────
CS, CW = F.csign, F.cwork
OF = 11
c_signup = g([
  CS[0], CS[1],
  ('Your mobile number|Same as members; visitors from abroad use email.', mobile_screen(True), True),
  CS[3],
  ('NEW|Set a PIN — right away|Straight after the number is verified.', pin_screen(), True),
  restep(CS[4], (1, 9), (1, OF)),
  restep(cap(CS[5], 'What you keep|Real payouts, early in sign-up.'), (2, 9), (2, OF)),
  restep(CS[6], (3, 9), (3, OF)),
  ('NEW|Add a clear photo (required)|Approved by our team with the rest of the profile.', photo_step(4, OF, 'Companion'), True),
  restep(cap(CS[7], 'Who can see your photo?|After the photo.'), (4, 9), (5, OF)),
  ('NEW|Where you work|State → city → area dropdowns, all of India.',
   setup('park', 'Work close to home.', 'Bookings come from your area first.', 6, OF, 'Where are you based?', where_body(), 'Companion'), True),
  restep(CS[9], (6, 9), (7, OF)),
  ('NEW|What you offer|The five categories; members in your city find you there.',
   f'<div class="pad">{dots(8, OF)}<div><div class="step">Step 8 of {OF} · Companion</div><div class="h2">What would you enjoy doing?</div><div class="sm mut">You’ll show up in these categories.</div></div><div class="g2">'
   + ''.join(tile(n, i, l, 84, n != 'Companion for a Loved One') for n, i, l, *_ in CATS[:4]) + '</div>' + tile(*CATS[4][:3], h=70, on=True) + '<div class="btn" style="margin-top:auto">Continue →</div></div>', True),
  ('NEW|Which bookings do you want?|Companion price cards: duration, price, what you get, what it fits.',
   f'<div class="pad">{dots(9, OF)}<div><div class="step">Step 9 of {OF} · Companion</div><div class="h2">Which bookings do you want?</div><div class="sm mut">Same prices for everyone. You keep 80%.</div></div><div class="g2">{pk(1, True, True)}{pk(2, True, True)}{pk(4, True, True)}{pk(6, False, True)}</div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
  restep(CS[11], (8, 9), (10, OF)),
  ('NEW|Last step: no ID upload|Tells them an ID + selfie is asked at the first booking. Button sends the profile for approval.',
   restep(L.onboarding[0], (9, 9), (OF, OF))[1].replace('Got it, finish →', 'Send for approval →'), True),
  ('NEW|Sent for approval|Every companion is approved by the team before going live.',
   '<div class="pad" style="align-items:center;text-align:center;padding-top:56px"><div class="ok" style="background:var(--mossSoft)"><span style="width:30px;height:30px;border:3px solid var(--moss);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></span></div><div class="h1">Profile sent for approval</div><div class="sm mut">Our team reviews every companion. Usually within 24 hours — we’ll message you.</div>'
   '<div class="card" style="width:100%;text-align:left"><div class="tl"><div><i class="on"></i>Profile complete</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i>Review by the prsnn team</div><div><i></i>Live — members in your city can book you</div><div><i></i>First booking — quick ID check</div></div></div>'
   '<div class="btn sec" style="width:100%;margin-top:auto">Preview my profile</div></div>', True),
  ('NEW|Bell: changes requested|The admin’s note, with “Fix and resubmit”.',
   bell([('ask', '', 'Please add a photo without sunglasses, and tell members a bit more about the places you love.', ''), ('', 'shield', 'Profile received. We’re reviewing it.', 'yesterday')]), True),
  ('NEW|Approved — you’re live|After approval. The ID check still comes at the first booking.',
   f'<div class="pad" style="align-items:center;text-align:center;padding-top:60px"><div class="ok">{ic("check", "#fff", 32, 3)}</div><div class="h1">You’re approved, Ananya!</div><div class="sm mut">You’re live. Members in Hyderabad can now book you.</div>'
   f'<div class="card" style="width:100%;text-align:left;{G}"><b class="sm">Tip</b><div class="xs mut">Evenings and weekends get the most requests. Keep them open to earn more.</div></div><div class="card xs mut" style="width:100%;text-align:left">When your first booking arrives, we’ll ask for a quick ID check (about 2 minutes).</div>'
   '<div class="btn" style="width:100%;margin-top:auto">Go to my dashboard</div></div>', True),
])
c_first = g(L.first_booking)
c_work = g([
  CW[0], CW[1],
  ('NEW|Requests show the category|What each booking is for, before accepting.',
   '<div class="pad" style="gap:10px"><div class="h1">Requests</div>' + ''.join(
     f'<div class="card col" style="{"border-color:var(--clay)" if o else ""}"><div class="row between"><div class="row"><div class="tile i-{img}" style="width:44px;height:44px;border-radius:12px"></div><div><div class="h3" style="font-size:14px">{cat}</div><div class="xs mut">{who}</div></div></div><div style="text-align:right"><b>{inr(share(PRICES[h]))}</b><div class="xs mut">you earn</div></div></div><div class="xs mut">{ic("cal", "#6A665C", 12)} {when} · {h} hrs</div>'
     + ('<div class="row" style="gap:8px"><div class="btn sec" style="flex:1;height:36px;font-size:13px">Decline</div><div class="btn" style="flex:1;height:36px;font-size:13px">Accept</div></div>' if o else '') + '</div>'
     for cat, img, who, when, h, o in [('New in Town', 'walks', 'Karan · just moved here', 'Sun 16 Nov · 11 AM', 4, 1), ('Companion for a Loved One', 'park', 'For Asha (booked by her son)', 'Every Sat · 10 AM', 2, 0), ('Explore & Discover', 'events', 'Neha + a friend', 'Sat 22 Nov · 8 AM', 6, 0)]) + '</div>' + tabs('Requests', True), True),
  ('NEW|Booking — panic button for companions too|Same button, same rules, during the session.', booking_safety(True, companion=True), True),
  cap(CW[4], 'NEW|Chat — with a safety reminder|Same warning on the companion side.'),
  CW[5], CW[6], CW[7],
  ('NEW|Companion for a Loved One — extra trust|A short extra check before seeing these bookings.',
   f'{bar("Companion for a Loved One")}<div class="pad" style="padding-top:4px;gap:9px"><div class="tile i-park" style="height:116px"><span>Spend time with someone’s parents<small>Weekly bookings · the same family each week</small></span></div><div class="col sm" style="gap:6px">' + ''.join(f'<span>{ic("check", "#2F4A34", 14, 2.4)} {t}</span>' for t in ['Patient, friendly and on time', 'Outings only — no medical care', 'Same person each week when free']) + f'</div><div class="card row between" style="{G}"><div><div class="xs mut">Every week · 2 hrs</div><b>{inr(share(699) * 4)} a month</b><div class="xs mut">from one family</div></div>{ic("users", "#2F4A34", 22)}</div><div class="btn" style="margin-top:auto">Request access (short video call)</div></div>', True),
  CW[8],
])

# ───────── ADMIN ─────────
admin = [
  ('NEW|Admin home|Panic alerts on top; approvals and ID checks waiting.',
   f'<div class="pad" style="gap:9px"><div class="row between"><div class="h1">Admin</div><span class="pill">Superadmin</span></div>'
   f'<div class="card row" style="{RED};animation:pulse 1.6s infinite"><div style="width:40px;height:40px;border-radius:20px;background:#B3261E;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px">SOS</div><div style="flex:1"><b class="sm" style="color:#B3261E">Panic alert · #A6F7ED</b><div class="xs">Rahul (member) · 4:31 PM · 3rd alert</div></div>{ic("chev", "#B3261E", 16)}</div>'
   '<div class="g2">' + ''.join(f'<div class="stat" style="text-align:left"><span class="xs mut">{k}</span><b>{v}</b></div>' for k, v in [('Companion profiles', '3'), ('Member photos', '5'), ('ID checks', '1 · held'), ('Disputes', '0')]) + '</div>'
   '<div class="grp">' + ''.join(f'<div class="li">{ic(i, "#2F4A34", 18)}<div class="t sm">{t}</div>{ic("chev", "#8E8A7E", 16)}</div>' for i, t in [('users', 'Approvals'), ('shield', 'ID checks'), ('cal', 'Bookings'), ('flag', 'Disputes'), ('users', 'Users'), ('rupee', 'Prices'), ('send', 'Broadcast')]) + '</div></div>', True),
  ('NEW|Panic alert (admin)|Who, numbers, when, where — call either person; resolve to stop the repeats.',
   '<div class="pad" style="gap:8px;padding-top:44px"><div class="card" style="background:#B3261E;color:#fff;border:0"><b>PANIC · booking #A6F7ED</b><div class="xs" style="opacity:.9">Pressed by Rahul (member) · 4:31 PM · 3rd alert · next in 4 min</div></div>'
   '<div class="card col" style="gap:5px">' + kv('Member', 'Rahul Mehta · +91 98765 43210') + kv('Companion', 'Priya Nair · +91 90000 11111') + kv('When', 'Sat 15 Nov, 4:00–8:00 PM') + kv('Where', 'Starbucks, Inorbit Mall, Hyderabad') + '</div>'
   '<div class="g2"><div class="btn" style="height:40px;font-size:13px">Call Rahul</div><div class="btn sec" style="height:40px;font-size:13px">Call Priya</div></div>'
   '<div class="bub them xs" style="max-width:100%">🚨 prsnn PANIC — #A6F7ED. Member Rahul Mehta +91 98765 43210 · Companion Priya Nair +91 90000 11111 · Sat 15 Nov 4–8 PM · Starbucks, Inorbit Mall. Repeats every 5 min until resolved.</div>'
   '<div class="btn danger" style="margin-top:auto">Mark resolved — stop alerts</div></div>', True),
  ('NEW|Approvals|Every companion profile and every member photo comes here.',
   f'{bar("Approvals")}<div class="pad" style="padding-top:2px;gap:8px"><div class="chips hs"><span class="chip on">Companions · 3</span><span class="chip">Member photos · 5</span><span class="chip">Resubmitted · 1</span></div>'
   + ''.join(f'<div class="card row"><div class="av i-{i}" style="width:48px;height:48px"></div><div style="flex:1"><div class="h3" style="font-size:14px">{n}</div><div class="xs mut">{d}</div></div>{ic("chev", "#8E8A7E", 16)}</div>' for i, n, d in [('cozy', 'Ananya Rao', 'Hyderabad · Gachibowli · 2 h ago'), ('study', 'Karan Shah', 'Pune · Kothrud · resubmitted'), ('locked', 'Sana Mirza', 'Bengaluru · Indiranagar · 5 h ago')]) + '</div>', True),
  ('NEW|Review a companion|Photo, bio, areas, categories, durations; approve, ask for changes or reject.',
   f'{bar("Ananya Rao")}<div class="pad" style="padding-top:2px;gap:8px"><div class="row" style="gap:10px"><div class="av i-cozy" style="width:72px;height:72px"></div><div class="col" style="gap:3px"><span class="xs mut">Woman · photo locked</span><span class="xs mut">Gachibowli, Hyderabad, Telangana</span><span class="xs mut">+91 90000 11111</span></div></div>'
   '<div class="card sm">Café hopper and long-walk person. Happy to show you the city’s quiet corners.</div><div class="chips"><span class="chip">New in Town</span><span class="chip">Don’t Go Alone</span><span class="chip">Work & Study</span></div>'
   '<div class="xs mut">1, 2, 4 hrs · Mon–Fri 10 AM–8 PM</div><div class="btn">Approve — go live</div><div class="g2"><div class="btn sec">Ask for changes</div><div class="btn danger">Reject</div></div></div>', True),
  ('NEW|Ask for changes|Pick reasons, write a note; it lands in their bell. They fix and resubmit to this queue.',
   f'{bar("Ask Ananya for changes")}<div class="pad" style="padding-top:4px;gap:8px">' + ''.join(f'<div class="row sm">{chk(o)} {t}</div>' for t, o in [('Photo isn’t clear', True), ('Bio is too short', True), ('Wrong area or city', False), ('Something else', False)])
   + '<div><div class="lbl">Message (they’ll see this)</div><div class="field" style="height:84px;align-items:flex-start;padding-top:9px"><span class="sm">Please add a photo without sunglasses, and tell members a bit more about the places you love.</span></div></div>'
   f'<div class="card xs mut" style="{G}">Shown in Ananya’s notifications with “Fix and resubmit”. Logged in the activity log.</div></div><div class="foot"><div class="btn">Send request</div></div>', True),
]

html = page('prsnn — the whole journey (round 2)',
  'Members, companions and admin, landing page to the end, with your changes: PIN right after the number is verified · email sign-up for visitors from abroad · state → city → area dropdowns for all of India · '
  '“Who would you like to meet?” · photo upload (team-approved) before privacy · new price cards everywhere · Other in “who is this for” · chat safety reminder · the five categories · '
  'every companion approved by the team · change requests in the bell · panic button. Orange numbers are new or changed screens. Photos are placeholders; names are samples.',
  [('m1', 'Members · Sign-up', 'Welcome → role → mobile → code → PIN → name → where → categories → I am → who to meet → photo → privacy', m_signup),
   ('m1b', 'Members · Visitors from abroad', 'Email sign-up, then the same PIN and setup', m_email),
   ('m2', 'Members · Discover', 'Home → category pages → city plans → search → profiles', m_discover),
   ('m3', 'Members · Book and pay', 'How long → when → who for → review → pay → status', m_book),
   ('m4', 'Members · Loved ones and gifts', 'Weekly visits; gifts', m_loved),
   ('m5', 'Members · Session and safety', 'Panic button, alert, chat reminder', m_safety),
   ('m6', 'Members · After', 'Bookings, change requests in the bell, resubmit, profile', m_after),
   ('c1', 'Companions · Sign-up → approval', 'Mobile → code → PIN → 11 steps (no ID upload) → sent for approval → changes requested → approved, live', c_signup),
   ('c2', 'Companions · First booking: ID check', 'Already built', c_first),
   ('c3', 'Companions · Everyday work', 'Dashboard, offers, requests, panic button, chat, earnings, availability, notifications, loved-one trust, profile', c_work),
   ('ad', 'Admin', 'Panic alerts, approvals, review, ask for changes', admin)],
  '<b>How the panic button works:</b> on from the session start until 1 hour after it ends, for both people; hold 3 seconds. It sends a WhatsApp/SMS and push to every admin at once with both names and mobiles, the date and time and the meeting place, '
  'then again every 5 minutes until an admin marks it resolved or the person who pressed it stops it with their PIN. 112 is always one tap away. '
  '<b>Locations:</b> the area dropdown uses the India Post directory (every post-office locality with its PIN code), loaded into the database; no maps API. '
  '<b>Images:</b> these use the app’s current photos; I can’t generate new images in this environment, so new category photos would need to be supplied, generated elsewhere or licensed. '
  '<b>Not changed:</b> prices (₹399 → ₹3,599) and the 80% companion share; the ID check at the first booking (already live). Reply “approve” or name screens to change.')
(ROOT / 'preview/journey.html').write_text(html)
print(len(html), sum(len(x) for x in [m_signup, m_email, m_discover, m_book, m_loved, m_safety, m_after, c_signup, c_first, c_work, admin]))
