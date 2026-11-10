"""PRD (India) screens for owner approval: members, book for someone else,
packages, gifts, safety & reviews, companions, admin.
Run: python3 scripts/design/prd.py  → preview/prd-screens.html"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from flows import ROOT, page, ic, bar, tabs, dots, ticks, PRICES, inr, chat_screen

SHARE = 0.75  # PRD: 25% commission (today the app pays 80%) — owner to confirm
earn = lambda p: int(p * SHARE)
BACK = f'<div style="position:absolute;top:38px;left:14px;width:32px;height:32px;border-radius:16px;background:#FAF9F6;display:flex;align-items:center;justify-content:center;z-index:3">{ic("back", "#0E110D", 17)}</div>'
G = 'background:var(--green50);border-color:var(--mossSoft)'

def pk(h, on=False, comp=False):
    p = PRICES[h]
    sub = (f'<span class="sm" style="color:var(--moss);font-weight:600">You get {inr(earn(p))}</span>' if comp
           else f'<span class="xs mut">{inr(round(p / h))}/hour</span>' + (f'<div class="sv">Save {inr(399 * h - p)}</div>' if h > 1 else ''))
    tag = '<span class="pill" style="position:absolute;top:-9px;left:9px;font-size:10px">Suggested</span>' if h == 4 and not comp else ''
    return f'<div class="pk{" on" if on else ""}">{tag}<div class="xs mut">{h} {"hour" if h == 1 else "hours"}</div><b>{inr(p)}</b>{sub}</div>'

CATS = [  # name, photo, headline, available
  ('Don’t Go Alone', 'evening', 'Good plans deserve good company', True),
  ('New to the City', 'walks', 'Discover your city with a local', True),
  ('Explore Together', 'events', 'Food trails, day trips, heritage', True),
  ('Walk & Study Buddy', 'study', 'Walks, reading, co-working', True),
  ('Companion for Loved Ones', 'park', 'Because you can’t always be there', False),
]
def tile(name, img, line, h=92, on=False, soon=False):
    badge = '<span class="pill n" style="position:absolute;top:7px;right:7px;z-index:2;font-size:10px">Pilot · coming soon</span>' if soon else ''
    chk = f'<i style="position:absolute;top:7px;right:7px;z-index:2;width:22px;height:22px;border-radius:11px;background:var(--moss);display:flex;align-items:center;justify-content:center">{ic("check", "#fff", 13, 3)}</i>' if on else ''
    return f'<div class="tile i-{img}" style="height:{h}px{";outline:3px solid var(--moss)" if on else ""}{";opacity:.75" if soon else ""}">{badge}{chk}<span>{name}<small>{line}</small></span></div>'

def comp_row(img, name, line, langs, acts, rev, idok, avail='Free 4–8 PM'):
    badge = f'<span class="pill">{ic("shield", "#2F4A34", 11)} ID verified</span>' if idok else '<span class="pill n">New on prsnn</span>'
    return (f'<div class="card col" style="gap:7px;padding:11px"><div class="row" style="align-items:flex-start"><div class="av i-{img}" style="width:52px;height:52px;border-radius:14px"></div>'
            f'<div style="flex:1"><div class="row between"><div class="h3">{name}</div><b class="sm">from ₹399</b></div><div class="xs mut">{line}</div><div class="xs mut" style="margin-top:2px">{ic("globe", "#6A665C", 11)} {langs}</div></div></div>'
            f'<div class="row" style="gap:5px;flex-wrap:wrap">{badge}<span class="pill n">{rev}</span><span class="pill n">{avail}</span></div><div class="xs mut">{acts}</div></div>')

def status_line(t, sub=''):
    return f'<div class="row sm"><span class="mut" style="width:96px">{t}</span><b style="flex:1">{sub}</b></div>'

# ───────────────────────── Members: find and book ─────────────────────────
members = [
 ('NEW|Where are you?|State → city → locality. Location permission is optional. Change any time from Home.',
  f'<div class="pad">{dots(2, 6)}<div><div class="step">Step 2 of 6</div><div class="h2">Where are you?</div><div class="sm mut">We show companions and experiences in your city.</div></div>'
  f'<div class="btn sec">{ic("pin", "#2F4A34", 15)} Use my location (optional)</div>'
  '<div><div class="lbl">State</div><div class="field on row between"><span>Telangana</span><span class="mut">▾</span></div></div>'
  '<div><div class="lbl">City</div><div class="field on row between"><span>Hyderabad</span><span class="mut">▾</span></div></div>'
  '<div><div class="lbl">Locality or area</div><div class="field on row between"><span>Gachibowli</span><span class="mut">▾</span></div></div>'
  '<div class="xs mut">Only companions who serve your area are shown.</div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
 ('NEW|Home — top|“What would you like to do today?” Five categories; Loved Ones shows as a pilot until it launches.',
  f'<div class="pad" style="gap:9px"><div class="row between"><div class="wm">prsnn<i>.</i></div><div class="row sm" style="gap:8px">{ic("pin", "#0E110D", 14)}Hyderabad ▾ {ic("bell", "#0E110D", 19)}<div class="av" style="width:28px;height:28px;font-size:11px">RS</div></div></div>'
  '<div><div class="h1" style="font-size:21px">What would you like to do today?</div><div class="sm mut">Find a companion for your plans, experiences and everyday activities.</div></div>'
  '<div class="g2">' + ''.join(tile(n, i, l, 86, soon=not a) for n, i, l, a in CATS[:4]) + '</div>'
  + tile(*CATS[4][:3], h=84, soon=True) + '</div>' + tabs('Home'), True),
 ('NEW|Home — scrolled|Popular in your city (from the admin’s city list), companions near you, book for someone, gift, how it works, safety.',
  '<div class="pad" style="gap:9px;padding-top:40px">'
  '<div class="row between"><div class="h3">Popular in Hyderabad</div><span class="xs mut">See all</span></div>'
  '<div class="row" style="gap:8px;overflow:hidden">' + ''.join(f'<div style="flex:none;width:132px"><div class="tile i-{i}" style="height:84px"><span>{t}<small>{h} h · {inr(PRICES[h])}</small></span></div></div>' for t, i, h in [('Charminar heritage walk', 'events', 4), ('Café hopping', 'coffee', 2), ('Weekend park outing', 'park', 2)]) + '</div>'
  '<div class="row between"><div class="h3">Companions near you</div><span class="xs mut">See all</span></div>'
  '<div class="row" style="gap:8px">' + ''.join(f'<div class="card" style="flex:1;padding:8px;text-align:center"><div class="av i-{i}" style="width:46px;height:46px;margin:0 auto 5px"></div><div class="sm" style="font-weight:600">{n}</div><div class="xs mut">{a}</div></div>' for i, n, a in [('cozy', 'Ananya', 'Gachibowli'), ('together', 'Priya', 'Madhapur'), ('locked', 'Karan', 'Kondapur')]) + '</div>'
  f'<div class="g2"><div class="card col" style="{G};gap:3px">{ic("users", "#2F4A34", 18)}<b class="sm">Book for someone else</b><span class="xs mut">A parent, relative or friend</span></div><div class="card col" style="background:var(--claySoft);border-color:#ecc8b4;gap:3px">{ic("heart", "#C45C2A", 18)}<b class="sm">Gift a booking</b><span class="xs mut">Give someone good company</span></div></div>'
  '<div class="card col" style="gap:3px"><b class="sm">How prsnn works</b><span class="xs mut">Pick a plan → pay (UPI, cards) → they confirm, chat opens → meet in public</span></div>'
  f'<div class="card col" style="gap:4px"><b class="sm">{ic("shield", "#2F4A34", 14)} Safety and verification</b><span class="xs mut">Every companion’s ID is checked before you meet. It confirms identity only. Report anything, any time.</span></div></div>' + tabs('Home'), True),
 ('NEW|Category — Don’t Go Alone|What you can book, suggested durations, then “Plan it”.',
  f'<div class="hero i-evening" style="height:190px">{BACK}<div class="in"><div class="h1" style="color:#FAF9F6">Don’t Go Alone</div><div class="sm" style="opacity:.92">Good plans deserve good company.</div></div></div>'
  '<div class="sheet" style="gap:9px"><div class="h3">What’s it for?</div><div class="chips">' + ''.join(f'<span class="chip{" on" if t == "Movies" else ""}">{t}</span>' for t in ['Movies', 'Weddings & functions', 'Concerts & live events', 'Restaurants & dinners', 'Shopping', 'Festivals & exhibitions']) + '</div>'
  f'<div class="g3">{pk(2)}{pk(4, True)}{pk(6)}</div><div class="xs mut">Tickets, food and travel are paid separately by you, on the day. The price is the companion’s time.</div><div class="btn" style="margin-top:auto">Plan it →</div></div>', True),
 ('NEW|Booking details|Date, start time, duration, meeting place and a short description — before choosing a companion.',
  f'{bar("Plan your outing")}<div class="pad" style="padding-top:4px;gap:9px"><div class="row" style="gap:6px"><span class="pill">Don’t Go Alone · Movies</span></div>'
  '<div class="g7">' + ''.join(f'<span>{d}</span>' for d in 'MTWTFSS') + ''.join(f'<span class="d{" on" if n == 15 else ""}">{n}</span>' for n in range(10, 17)) + '</div>'
  '<div class="lbl" style="margin:0">Start time</div><div class="g3">' + ''.join(f'<div class="slot{" on" if t == "6:00 PM" else ""}">{t}</div>' for t in ['4:00 PM', '5:00 PM', '6:00 PM']) + '</div>'
  '<div class="lbl" style="margin:0">Duration</div><div class="chips">' + ''.join(f'<span class="chip{" on" if h == 4 else ""}">{h} h · {inr(PRICES[h])}</span>' for h in [2, 4, 6]) + '</div>'
  '<div><div class="lbl">Meeting place (public)</div><div class="field on">PVR, Inorbit Mall</div></div>'
  '<div><div class="lbl">About the plan</div><div class="field" style="height:52px"><span class="sm mut">New release, then dinner nearby</span></div></div>'
  '<div class="xs mut">Ends 10:00 PM — inside today’s hours (7 AM–10 PM in Hyderabad).</div></div><div class="foot"><div class="btn">See who’s free →</div></div>', True),
 ('NEW|Who’s free then|Only companions free at that time, in your area, offering that duration and activity.',
  f'{bar("Free Sat 15 Nov, 6–10 PM")}<div class="pad" style="padding-top:2px;gap:8px"><div class="chips hs"><span class="chip on">Movies</span><span class="chip">Women</span><span class="chip">Hindi</span><span class="chip">Telugu</span></div>'
  + comp_row('cozy', 'Ananya', 'Film buff · Gachibowli · 3 km', 'English, Hindi, Telugu', 'Movies · Restaurants · Concerts', '★ 4.8 · 12 reviews · 15 done', True)
  + comp_row('together', 'Priya', 'Foodie · Madhapur · 5 km', 'English, Hindi', 'Movies · Shopping', 'No reviews yet', False)
  + '<div class="xs mut">Sample data. Reviews and counts come only from completed bookings.</div></div>', True),
 ('Companion profile|Intro, areas, languages, activities, reviews, verification (scope and date), availability.',
  f'<div class="hero i-cozy" style="height:200px">{BACK}</div><div class="sheet" style="gap:8px"><div class="row between"><div class="h1">Ananya</div><span class="pill">{ic("shield", "#2F4A34", 11)} ID verified</span></div>'
  '<div class="sm mut">Film buff and café regular. Happy to make a solo plan feel easy.</div>'
  f'<div class="col xs" style="gap:4px"><span>{ic("pin", "#6A665C", 12)} Gachibowli, Madhapur, Kondapur</span><span>{ic("globe", "#6A665C", 12)} English, Hindi, Telugu</span><span>{ic("star", "#6A665C", 12)} 4.8 · 12 reviews · 15 completed bookings</span><span>{ic("shield", "#6A665C", 12)} Identity checked by prsnn · 2 Nov 2026</span></div>'
  '<div class="chips"><span class="chip">Movies</span><span class="chip">Restaurants</span><span class="chip">Concerts</span></div>'
  '<div class="card sm" style="padding:9px"><b>“Easy to talk to, on time, picked a great place for dinner.”</b><div class="xs mut">Riya · Oct 2026</div></div></div>'
  '<div class="foot row between"><div><b>₹1,299</b><div class="xs mut">4 h · Sat 6–10 PM</div></div><div class="btn" style="padding:0 20px">Choose Ananya</div></div>', True),
 ('Durations and prices|Total, per-hour and saving on each card. 4 hours is highlighted as “Suggested” — not “most popular” until data shows it.',
  f'{bar("How long?")}<div class="pad" style="padding-top:4px;gap:10px"><div class="g2">{pk(1)}{pk(2)}{pk(4, True)}{pk(6)}</div>{pk(12)}<div class="card sm" style="{G}">Same prices for every companion. Longer bookings cost less per hour.</div></div><div class="foot"><div class="btn">Continue · ₹1,299</div></div>', False),
 ('NEW|Checkout|Booking fee, platform charge, taxes, total, cancellation policy and meeting details on one page.',
  f'{bar("Review & pay")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card row"><div class="av i-cozy" style="width:44px;height:44px"></div><div><div class="h3">Ananya · Movies</div><div class="xs mut">Sat 15 Nov · 6:00–10:00 PM · PVR, Inorbit Mall</div></div></div>'
  '<div class="card col" style="gap:6px">' + status_line('Booking fee', '₹1,299 (4 h)') + status_line('Platform fee', '₹0') + status_line('Taxes', 'Included') + '<div class="row between" style="border-top:1px solid var(--line);padding-top:6px"><b>Total</b><b style="font-size:17px">₹1,299</b></div></div>'
  '<div class="card xs mut col" style="gap:3px"><b class="sm" style="color:var(--ink)">Not included</b>Movie tickets, food and travel — paid by you on the day.</div>'
  '<div class="card xs mut col" style="gap:3px"><b class="sm" style="color:var(--ink)">Cancellation</b>15+ min before start: 85% back. Later: no refund. If Ananya cancels or nobody accepts: 100% back.</div>'
  f'<div class="row sm"><span style="width:20px;height:20px;border-radius:6px;background:var(--moss);display:flex;align-items:center;justify-content:center">{ic("check", "#fff", 14, 3)}</span>I agree to the cancellation terms</div></div><div class="foot"><div class="btn">{ic("lock", "#fff", 16)} Pay ₹1,299</div></div>', True),
 ('NEW|Payment|UPI apps first, UPI QR, cards, net banking, other methods from the gateway.',
  f'{bar("Pay ₹1,299")}<div class="pad" style="padding-top:4px;gap:8px"><div class="lbl" style="margin:0">UPI</div><div class="g3">' + ''.join(f'<div class="card" style="text-align:center;padding:10px 4px"><div class="av" style="margin:0 auto 4px;width:34px;height:34px;font-size:12px">{a}</div><div class="xs">{n}</div></div>' for a, n in [('G', 'GPay'), ('P', 'PhonePe'), ('₹', 'Paytm')]) + '</div>'
  '<div class="opt"><div><div class="h3">Other UPI app or UPI ID</div><div class="sm mut">yourname@bank</div></div><div class="rd"></div></div><div class="opt"><div><div class="h3">Scan a UPI QR</div><div class="sm mut">Pay from another phone</div></div><div class="rd"></div></div>'
  '<div class="opt on"><div><div class="h3">Debit or credit card</div></div><div class="rd"></div></div><div class="opt"><div><div class="h3">Net banking</div></div><div class="rd"></div></div>'
  f'<div class="xs mut" style="text-align:center">{ic("lock", "#6A665C", 12)} Secured by the payment gateway. prsnn never sees your card or UPI PIN.</div></div>', True),
 ('NEW|After payment — clear status|Payment state and booking state shown separately, with what happens next.',
  f'{bar("Booking #4C1A20")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card col" style="gap:6px">' + status_line('Payment', '<span class="pill">Captured · ₹1,299</span>') + status_line('Booking', '<span class="pill w">Waiting for Ananya</span>') + '</div>'
  '<div class="card"><div class="tl"><div><i class="on"></i>Paid</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i><span>Ananya has <b>1 h 40 min</b> to accept</span></div><div><i></i>If she can’t: up to 2 similar companions, one at a time</div><div><i></i>Nobody by 5:00 PM → full refund, automatically</div></div></div>'
  '<div class="xs mut">Possible payment states: pending · authorised · captured · refund started · refunded.</div><div class="btn sec" style="margin-top:auto">Cancel booking</div></div>', True),
 ('Confirmed + chat|Chat opens on acceptance. Numbers stay hidden.',
  chat_screen('Ananya', 'A', [('them', 'Hi Riya! Excited for the movie. Meet at the PVR entrance at 5:55?', '11:02'), ('me', 'Perfect, see you there!', '11:04')], img='cozy', when='Sat 15 Nov · 6:00–10:00 PM'), False),
]

# ───────────────────────── Book for someone else ─────────────────────────
other = [
 ('NEW|Who is it for?|From Home “Book for someone else”. Relationship first.',
  f'{bar("Book for someone else")}<div class="pad" style="padding-top:4px;gap:9px"><div class="h2">Booking for someone you care about?</div><div class="sm mut">Arrange a companion for a parent, relative or friend. You pay; they agree first.</div>'
  '<div class="g2">' + ''.join(f'<div class="opt{" on" if r == "Mother" else ""}" style="padding:11px"><div class="h3" style="font-size:14px">{r}</div></div>' for r in ['Mother', 'Father', 'Grandparent', 'Relative', 'Friend', 'Other']) + '</div><div class="btn" style="margin-top:auto">Continue</div></div>', True),
 ('NEW|About them|Name, number, their city (can differ from yours), meeting area, preferences.',
  f'{bar("About your mother")}<div class="pad" style="padding-top:4px;gap:8px"><div><div class="lbl">Her name</div><div class="field on">Asha Verma</div></div><div><div class="lbl">Her mobile (we ask her to agree on WhatsApp)</div><div class="field">🇮🇳 +91 98480 00000</div></div>'
  '<div><div class="lbl">Her city</div><div class="field on row between"><span>Pune, Maharashtra</span><span class="mut">▾</span></div></div><div><div class="lbl">Preferred meeting area</div><div class="field">Kothrud</div></div>'
  '<div class="lbl" style="margin:0">Preferences</div><div class="chips">' + ''.join(f'<span class="chip{" on" if t in ("Woman companion", "Marathi", "Walks") else ""}">{t}</span>' for t in ['Woman companion', 'Marathi', 'Hindi', 'Walks', 'Coffee', 'Shopping']) + '</div></div><div class="foot"><div class="btn">Choose activity & time</div></div>', True),
 ('NEW|Check and pay|You pay; she agrees before anyone is offered the booking.',
  f'{bar("Review & pay")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card col" style="gap:5px">' + status_line('For', 'Asha (your mother)') + status_line('Where', 'Kothrud, Pune') + status_line('When', 'Sun 16 Nov · 10 AM–12 PM') + status_line('Activity', 'Walk and coffee') + status_line('Total', '₹699') + '</div>'
  f'<div class="card col sm" style="{G};gap:5px"><b>What happens next</b><span class="mut">1 · We send Asha a WhatsApp message to agree.</span><span class="mut">2 · Then a companion in Pune accepts.</span><span class="mut">3 · She doesn’t agree within 24 h → full refund.</span></div>'
  '<div class="card xs mut">Her chats and details stay private to her. You get booking updates (confirmed, started, finished) — not her messages.</div></div><div class="foot"><div class="btn">Pay ₹699</div></div>', True),
 ('NEW|Waiting for her OK|Purchaser’s booking page. Resend or cancel if she says no.',
  f'{bar("For Asha · #7D21B0")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card col" style="gap:6px">' + status_line('Payment', '<span class="pill">Captured · ₹699</span>') + status_line('Asha', '<span class="pill w">Asked on WhatsApp · not yet</span>') + status_line('Companion', '<span class="pill n">After she agrees</span>') + '</div>'
  '<div class="btn sec">Resend her the invite</div><div class="btn ghost">Cancel — full refund</div></div>', True),
 ('NEW|What she sees|A link from WhatsApp opens this page (no app needed). Agree or decline.',
  f'<div class="pad" style="gap:10px"><div class="wm">prsnn<i>.</i></div><div class="h2">Hi Asha</div><div class="sm">Your son Rahul has arranged a companion for a walk and coffee.</div>'
  '<div class="card col" style="gap:5px">' + status_line('When', 'Sun 16 Nov · 10 AM–12 PM') + status_line('Where', 'Kothrud (a public place)') + status_line('Paid by', 'Rahul') + '</div>'
  '<div class="xs mut">Companionship only — not medical or care services. You can cancel any time before the visit.</div>'
  '<div class="btn" style="margin-top:auto">Yes, I’d like this</div><div class="btn sec">No thanks</div></div>', True),
]

# ───────────────────────── Packages ─────────────────────────
packages = [
 ('NEW|One visit or a package|Prepaid, no auto-debit. Same price per visit (no discount unless you set one).',
  f'{bar("Walk & Study Buddy")}<div class="pad" style="padding-top:4px;gap:8px"><div class="h2">How often?</div>'
  + ''.join(f'<div class="opt{" on" if o else ""}"><div><div class="h3">{t}</div><div class="sm mut">{d}</div></div><b style="margin-left:auto">{inr(v)}</b></div>' for t, d, v, o in [('One-time', '1 visit · 1 hour', 399, 0), ('4 sessions', '1 hour each · use within 6 weeks', 399 * 4, 1), ('8 sessions', '1 hour each · use within 10 weeks', 399 * 8, 0)])
  + '<div class="xs mut">Unused sessions are refunded at the per-visit price, less any used.</div></div><div class="foot"><div class="btn">Choose days · ₹1,596</div></div>', True),
 ('NEW|Days, time and same companion|Preferred days and slot; request the same companion each time.',
  f'{bar("Schedule 4 sessions")}<div class="pad" style="padding-top:4px;gap:9px"><div class="lbl" style="margin:0">Days</div><div class="chips">' + ''.join(f'<span class="chip{" on" if d in ("Tue", "Sat") else ""}">{d}</span>' for d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) + '</div>'
  '<div class="lbl" style="margin:0">Time</div><div class="g3">' + ''.join(f'<div class="slot{" on" if t == "7:00 AM" else ""}">{t}</div>' for t in ['6:00 AM', '7:00 AM', '6:00 PM']) + '</div>'
  f'<div class="card row"><div class="av i-study" style="width:40px;height:40px"></div><div style="flex:1"><div class="h3" style="font-size:14px">Same companion: Karan</div><div class="xs mut">Free Tue & Sat at 7 AM</div></div>{ic("check", "#2F4A34", 18, 2.6)}</div>'
  '<div class="card col xs" style="gap:3px"><b class="sm">Schedule</b><span>Tue 18 Nov · Sat 22 Nov · Tue 25 Nov · Sat 29 Nov</span></div></div><div class="foot"><div class="btn">Review & pay ₹1,596</div></div>', True),
 ('NEW|My package|Sessions used and left, next visit, reschedule, cancel, renew.',
  f'{bar("Walks with Karan")}<div class="pad" style="padding-top:4px;gap:9px"><div class="row" style="gap:7px"><div class="stat"><b>1</b><span class="xs mut">Used</span></div><div class="stat"><b>3</b><span class="xs mut">Left</span></div><div class="stat"><b>29 Dec</b><span class="xs mut">Expires</span></div></div>'
  + ''.join(f'<div class="card row between" style="padding:10px 12px"><div><div class="h3" style="font-size:14px">{d}</div><div class="xs mut">7:00–8:00 AM · KBR Park gate</div></div><span class="pill{" n" if s != "Done" else ""}">{s}</span></div>' for d, s in [('Tue 18 Nov', 'Done'), ('Sat 22 Nov', 'Next'), ('Tue 25 Nov', 'Booked')])
  + '<div class="g2"><div class="btn sec">Reschedule</div><div class="btn sec">Cancel a visit</div></div><div class="btn ghost">Buy 4 more</div></div>', True),
]

# ───────────────────────── Gifts ─────────────────────────
gifts = [
 ('NEW|Gift a booking|Duration, category, recipient, message, pay. A gift code goes by WhatsApp.',
  f'{bar("Gift a booking")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card" style="background:var(--moss);color:#FAF9F6;border:0;text-align:center;padding:16px"><div class="wm" style="color:#FAF9F6">prsnn<i>.</i></div><div class="h2" style="color:#FAF9F6;margin-top:4px">Give someone good company</div></div>'
  f'<div class="g2">{pk(2)}{pk(4, True)}</div><div class="chips"><span class="chip on">Explore Together</span><span class="chip">Don’t Go Alone</span><span class="chip">Any</span></div>'
  '<div class="g2"><div><div class="lbl">Their name</div><div class="field">Neha</div></div><div><div class="lbl">Mobile</div><div class="field sm">98480 00000</div></div></div>'
  '<div><div class="lbl">Message</div><div class="field" style="height:44px"><span class="sm">Happy birthday! Go explore 🎉</span></div></div></div><div class="foot"><div class="btn">Pay ₹1,299 and send</div></div>', True),
 ('NEW|Gift sent|Code, status and expiry for the buyer. Refund if not redeemed.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:60px"><div class="ok">{ic("heart", "#fff", 30)}</div><div class="h1">Gift sent to Neha</div><div class="card" style="width:100%"><div class="xs mut">Gift code</div><div style="font:600 22px DM Sans;letter-spacing:2px">PRSN-8K4Q</div></div>'
  '<div class="card col" style="width:100%;gap:5px;text-align:left">' + status_line('Status', '<span class="pill w">Sent · not redeemed</span>') + status_line('Valid until', '10 Feb 2027') + status_line('If unused', 'Full refund to you') + '</div>'
  '<div class="xs mut">You’ll know when she books. Her chats stay private.</div></div>', True),
 ('NEW|Redeem (recipient)|Recipient agrees, then picks city, time and companion. No payment.',
  f'<div class="pad" style="gap:10px"><div class="wm">prsnn<i>.</i></div><div class="card" style="background:var(--moss);color:#FAF9F6;border:0;padding:16px"><div class="h2" style="color:#FAF9F6">Rahul sent you 4 hours of good company</div><div class="sm" style="opacity:.9;margin-top:4px">“Happy birthday! Go explore 🎉”</div></div>'
  '<div class="card col" style="gap:5px">' + status_line('Code', 'PRSN-8K4Q') + status_line('Valid until', '10 Feb 2027') + status_line('Category', 'Explore Together') + '</div>'
  '<div class="btn" style="margin-top:auto">Accept and plan it</div><div class="btn ghost">No thanks (Rahul is refunded)</div></div>', True),
]

# ───────────────────────── Safety & reviews ─────────────────────────
safety = [
 ('NEW|Safety in every booking|Report, block, emergency steps; booking events recorded.',
  f'{bar("Safety")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card col" style="background:#F9E3E1;border-color:#f0c4bf;gap:4px"><b style="color:#B3261E">In danger right now?</b><span class="sm">Call 112 (India emergency). Then tell us.</span><div class="btn danger" style="height:40px">Call 112</div></div>'
  '<div class="grp">' + ''.join(f'<div class="li">{ic(i, "#2F4A34", 18)}<div class="t sm">{t}</div>{ic("chev", "#8E8A7E", 16)}</div>' for i, t in [('flag', 'Report a problem with this booking'), ('lock', 'Block Ananya'), ('pin', 'Share my booking details with a friend'), ('help', 'Talk to support')]) + '</div>'
  '<div class="card xs mut">Not allowed on prsnn: private or home meetings at launch, overnight bookings, intimacy, alcohol-only outings, medical or care work, childcare. Reports are reviewed by our team.</div></div>', True),
 ('NEW|Review after the booking|Only after a completed booking. Rating, a few words, private feedback.',
  f'{bar("How was it?")}<div class="pad" style="padding-top:4px;gap:10px;align-items:center;text-align:center"><div class="av i-cozy" style="width:64px;height:64px"></div><div class="h2">Your outing with Ananya</div><div class="row" style="gap:8px;justify-content:center">' + ''.join(ic('star', '#C45C2A' if i < 4 else '#8E8A7E', 30, 2) for i in range(5)) + '</div>'
  '<div class="chips" style="justify-content:center">' + ''.join(f'<span class="chip{" on" if t in ("On time", "Good company") else ""}">{t}</span>' for t in ['On time', 'Good company', 'Great plan', 'Felt safe']) + '</div>'
  '<div class="field" style="height:64px;width:100%"><span class="sm mut">Write a short public review…</span></div><div class="xs mut">Something wrong? Report it privately instead.</div><div class="btn" style="width:100%;margin-top:auto">Post review</div></div>', True),
]

# ───────────────────────── Companions ─────────────────────────
companions = [
 ('NEW|Where and what you offer|Operating city, service areas, languages, activities by category, durations.',
  f'{bar("My services")}<div class="pad" style="padding-top:4px;gap:8px"><div><div class="lbl">Operating city</div><div class="field on row between"><span>Hyderabad, Telangana</span><span class="mut">▾</span></div></div>'
  '<div class="lbl" style="margin:0">Areas I serve</div><div class="chips">' + ''.join(f'<span class="chip{" on" if a in ("Gachibowli", "Madhapur", "Kondapur") else ""}">{a}</span>' for a in ['Gachibowli', 'Madhapur', 'Kondapur', 'Jubilee Hills', '+ more']) + '</div>'
  '<div class="lbl" style="margin:0">Languages</div><div class="chips">' + ''.join(f'<span class="chip{" on" if a != "Urdu" else ""}">{a}</span>' for a in ['English', 'Hindi', 'Telugu', 'Urdu']) + '</div>'
  '<div class="lbl" style="margin:0">Categories</div><div class="chips">' + ''.join(f'<span class="chip{" on" if n in ("Don’t Go Alone", "Explore Together") else ""}">{n}</span>' for n, *_ in CATS[:4]) + '</div>'
  f'<div class="lbl" style="margin:0">Durations</div><div class="chips">' + ''.join(f'<span class="chip{" on" if h in (2, 4, 6) else ""}">{h} h · you get {inr(earn(PRICES[h]))}</span>' for h in [1, 2, 4, 6, 12]) + '</div></div>', True),
 ('NEW|Earnings and payouts|Completed bookings, what’s available, request a payout to bank/UPI.',
  f'{bar("Earnings")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card" style="background:var(--moss);color:#FAF9F6;border:0"><div class="xs" style="opacity:.85">Available to withdraw</div><div style="font:600 28px Lora">{inr(earn(1299) + earn(699))}</div><div class="btn" style="background:#FAF9F6;color:var(--moss);margin-top:8px;height:40px">Request payout to UPI</div></div>'
  + ''.join(f'<div class="li card" style="padding:9px 12px"><div class="t"><div class="sm" style="font-weight:600">{d}</div><div class="xs mut">{w}</div></div><b class="sm">{inr(earn(p))}</b></div>' for d, w, p in [('Movies · Riya', 'Sat 15 Nov · 4 h · completed', 1299), ('Walk · Karan', 'Tue 18 Nov · package 1/4', 399), ('Café · Neha', 'Wed 19 Nov · 2 h · completed', 699)])
  + '<div class="xs mut">Earnings count after a booking is completed. Payouts reach you in 1–3 working days.</div></div>', True),
 ('NEW|Repeat bookings|Package customers in one place; confirm each visit.',
  f'{bar("Repeat bookings")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card col"><div class="row between"><div class="h3">Karan · Walk & Study</div><span class="pill">3 of 4 left</span></div><div class="xs mut">Tue & Sat · 7:00 AM · KBR Park gate</div><div class="row" style="gap:8px"><div class="btn sec" style="flex:1;height:36px;font-size:13px">Can’t make Sat</div><div class="btn" style="flex:1;height:36px;font-size:13px">Confirm Sat</div></div></div>'
  '<div class="card col"><div class="row between"><div class="h3">Mrs. Rao · Loved Ones (pilot)</div><span class="pill n">7 of 8 left</span></div><div class="xs mut">Sun · 10:00 AM · Banjara Hills (booked by her son)</div></div></div>', True),
 ('NEW|Report a customer|Companions can report and block too.',
  f'{bar("Report Riya")}<div class="pad" style="padding-top:4px;gap:8px">' + ''.join(f'<div class="opt{" on" if t == "Made me uncomfortable" else ""}"><div class="h3" style="font-size:14px">{t}</div><div class="rd"></div></div>' for t in ['Didn’t show up', 'Made me uncomfortable', 'Asked for something not allowed', 'Payment or money issue', 'Something else'])
  + '<div class="field" style="height:56px"><span class="sm mut">What happened? (private)</span></div><div class="row sm"><span style="width:20px;height:20px;border-radius:6px;background:var(--moss)"></span>Also block Riya</div></div><div class="foot"><div class="btn">Send report</div></div>', True),
]

# ───────────────────────── Admin ─────────────────────────
admin = [
 ('NEW|Cities|States, cities, localities, operating hours and popular experiences — edited here, not in code.',
  f'{bar("Hyderabad")}<div class="pad" style="padding-top:4px;gap:8px"><div class="row" style="gap:6px"><span class="pill">Live</span><span class="pill n">Telangana</span><span class="pill n">42 localities</span></div>'
  '<div class="g2"><div><div class="lbl">Opens</div><div class="field">7:00 AM</div></div><div><div class="lbl">Closes</div><div class="field">10:00 PM</div></div></div>'
  '<div class="row between"><div class="h3">Popular experiences</div><span class="sm" style="color:var(--moss);font-weight:600">+ Add</span></div>'
  + ''.join(f'<div class="card row between" style="padding:9px 11px"><div><div class="sm" style="font-weight:600">{t}</div><div class="xs mut">{c} · {h} h</div></div>{ic("edit", "#6A665C", 16)}</div>' for t, c, h in [('Charminar heritage walk', 'Explore Together', 4), ('Café hopping', 'New to the City', 2), ('Weekend park outing', 'Walk & Study Buddy', 2)])
  + '<div class="row between card" style="padding:9px 11px"><span class="sm">Companion for Loved Ones</span><span class="pill n">Pilot off</span></div></div>', True),
 ('NEW|Prices per city|Durations, commission, packages, promo codes; changes apply to new bookings.',
  f'{bar("Prices · Hyderabad")}<div class="pad" style="padding-top:4px;gap:7px">' + ''.join(f'<div class="row between card" style="padding:8px 11px"><span class="sm">{h} hours</span><b class="sm">{inr(PRICES[h])}</b></div>' for h in [1, 2, 4, 6, 12])
  + '<div class="g2"><div><div class="lbl">Commission</div><div class="field on">25%</div></div><div><div class="lbl">Package sizes</div><div class="field">4, 8</div></div></div><div class="row between card" style="padding:8px 11px"><span class="sm">Promo codes</span><span class="pill n">None active</span></div><div class="btn" style="margin-top:auto">Save for new bookings</div></div>', True),
 ('NEW|Analytics|Bookings, conversion, repeat rate, order value, revenue, cancellations, acceptance.',
  f'{bar("Analytics · last 30 days")}<div class="pad" style="padding-top:4px;gap:8px"><div class="g2">' + ''.join(f'<div class="stat" style="text-align:left"><span class="xs mut">{k}</span><b>{v}</b></div>' for k, v in [('Completed bookings', '—'), ('Visit → booking', '—'), ('Repeat customers', '—'), ('Avg order value', '—'), ('Revenue', '—'), ('Commission', '—'), ('Cancellation rate', '—'), ('Acceptance rate', '—')]) + '</div>'
  '<div class="xs mut">Shows real numbers once events are tracked (home viewed, category, city, profile, checkout, paid, accepted, completed, package, gift, repeat).</div></div>', True),
 ('NEW|Companion screening|ID (checked at first booking), extra screening with scope and date, approval, payouts.',
  f'{bar("Ananya Rao")}<div class="pad" style="padding-top:4px;gap:8px"><div class="card col" style="gap:5px">' + status_line('Profile', '<span class="pill">Approved</span>') + status_line('ID check', '<span class="pill">Verified · 2 Nov 2026</span>') + status_line('Police check', '<span class="pill n">Not done</span>') + status_line('Loved Ones', '<span class="pill n">Not screened</span>') + status_line('Re-check due', '2 Nov 2027') + '</div>'
  '<div class="row" style="gap:7px"><div class="stat"><b>15</b><span class="xs mut">Completed</span></div><div class="stat"><b>92%</b><span class="xs mut">Accepted</span></div><div class="stat"><b>4.8</b><span class="xs mut">Rating</span></div></div>'
  '<div class="btn sec">Record a screening</div><div class="btn sec">Payouts</div><div class="btn danger">Suspend</div></div>', True),
]

html = page('prsnn India PRD — screens for approval',
  'Every screen the PRD adds or changes, as phone mock-ups in the current prsnn look (Lora + DM Sans, moss accent). Orange numbers are new screens. Names, reviews and counts are sample data; the app shows only real numbers. Nothing is built yet — reply with what to keep or change.',
  [('find', 'Members — find and book', 'City → category → plan → who’s free → profile → duration → checkout → pay → clear status → chat', members),
   ('other', 'Book for someone else', 'Purchaser and recipient are separate; she agrees before a companion is assigned', other),
   ('pkg', 'Prepaid packages (Phase 2)', '4 or 8 sessions, same companion, no auto-debit', packages),
   ('gift', 'Gift a booking (Phase 2)', 'Code, expiry, recipient consent, refund if unused', gifts),
   ('safe', 'Safety and reviews', 'Report, block, emergency, honest reviews', safety),
   ('comp', 'Companions', 'Areas, languages, categories, earnings and payouts, repeat bookings, reporting', companions),
   ('admin', 'Admin', 'Cities, prices per city, analytics, screening records', admin)],
  '<b>Decisions for you before I build:</b> '
  '(1) <b>Commission:</b> the PRD says 25% (companion gets 75%: ₹974 on ₹1,299); the app pays 80% today. These screens show 75%. '
  '(2) <b>Taxes and platform fee:</b> shown as “Platform fee ₹0 · Taxes included”. Please confirm GST treatment with your CA before launch. '
  '(3) <b>Categories:</b> the PRD’s five replace the eight from the last round; launch with Don’t Go Alone, New to the City, Explore Together (+ Walk & Study Buddy), Loved Ones as a separate pilot. '
  '(4) <b>Booking order:</b> category → plan (date, time, place) → who’s free, as the PRD asks; booking straight from a companion’s profile still works. '
  '(5) <b>Recipient consent window:</b> 24 hours, then a full refund. (6) <b>Gift validity:</b> 3 months, refund if unused. (7) <b>Package validity:</b> 6 weeks (4) / 10 weeks (8); no package discount unless you set one. '
  '(8) <b>New backend work:</b> reviews, recipient consent, packages, gifts, payouts, per-city prices and content, analytics events, and Razorpay (needed for “authorised/captured”). '
  'The ID check stays at the first booking; companions without a verified ID show “New on prsnn”, never “ID verified”. '
  'Reply “approve all”, or name the screens to change.')
html = html.replace('</style>', '.pad>*,.sheet>*{flex-shrink:0}</style>', 1)
(ROOT / 'preview/prd-screens.html').write_text(html)
print(len(html))
