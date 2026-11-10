"""Category screens (members + companions) for owner approval.
Run: python3 scripts/design/categories.py  → preview/categories.html"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from flows import ROOT, page, ic, bar, tabs, dots, pk, PRICES, share, inr

# name, photo, line, best package (hours), who it's for
CATS = [
  ('New to the city', 'walks', 'A local shows you around', 4, 'Just moved or here for work'),
  ('Parents’ companion', 'park', 'Company for mum & dad', 2, 'Book for your parents, from anywhere'),
  ('Day trips', 'events', 'Golconda, Ramoji, Ananthagiri', 8, 'A full day out, planned with you'),
  ('Food & Old City trails', 'coffee', 'Biryani, Irani chai, Charminar', 4, 'Eat like a local'),
  ('Events & movies', 'evening', 'Gigs, stand-up, cricket', 4, 'Never go alone'),
  ('Walk & study buddy', 'study', 'KBR Park, cafés, libraries', 1, 'Stay on track, together'),
  ('Doctor & hospital visits', 'cozy', 'Someone by your side', 3, 'Wait, help with forms, get home'),
  ('Language practice', 'together', 'English, Telugu, Hindi, Urdu', 1, 'Speak with confidence'),
]
def tile(name, img, line, h=96, on=False):
    return f'<div class="tile i-{img}" style="height:{h}px{";outline:3px solid var(--moss)" if on else ""}"><span>{name}<small>{line}</small></span>{"<i style=position:absolute;top:7px;right:7px;z-index:2;width:22px;height:22px;border-radius:11px;background:var(--moss);display:flex;align-items:center;justify-content:center>" + ic("check", "#fff", 13, 3) + "</i>" if on else ""}</div>'

member = [
 ('NEW|What would you like to do first?|Setup step 2. Six launch categories; pick any. Home opens on them.',
  f'<div class="pad">{dots(2, 7)}<div><div class="step">Step 2 of 7</div><div class="h2">What can we help you with, Mukarram?</div><div class="sm mut">Pick any. We’ll show the right companions.</div></div><div class="g2">'
  + ''.join(tile(n, i, l, 86, n in ('New to the city', 'Food & Old City trails')) for n, i, l, *_ in CATS[:6]) + '</div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
 ('NEW|Home with categories|Categories replace the small chips; “For you” follows the setup pick.',
  f'<div class="pad" style="gap:10px"><div class="row between"><div class="wm">prsnn<i>.</i></div><div class="row sm">{ic("pin", "#0E110D", 15)}Hyderabad {ic("bell", "#0E110D", 20)}</div></div><div class="field"><span class="mut sm">{ic("search", "#8E8A7E", 15)} Search companions or plans…</span></div>'
  f'<div class="h3">What do you need today?</div><div class="g2">' + ''.join(tile(n, i, inr(PRICES[h]) + ' · ' + f'{h} h', 70) for n, i, l, h, w in CATS[:4]) + '</div>'
  '<div class="row" style="gap:6px;overflow:hidden">' + ''.join(f'<span class="chip" style="flex:none">{n}</span>' for n, *_ in CATS[4:]) + '</div>'
  f'<div class="card row" style="background:var(--green50);border-color:var(--mossSoft)"><div class="av">{ic("users", "#2F4A34", 18)}</div><div style="flex:1"><div class="h3" style="font-size:14px">Book for your parents</div><div class="xs mut">Weekly company, paid from anywhere</div></div>{ic("chev", "#2F4A34", 16)}</div></div>' + tabs('Home'), True),
 ('NEW|Category page — New to the city|What’s included, the suggested package, and companions who offer it.',
  f'<div class="hero i-walks" style="height:200px"><div style="position:absolute;top:38px;left:14px;width:32px;height:32px;border-radius:16px;background:#FAF9F6;display:flex;align-items:center;justify-content:center">{ic("back", "#0E110D", 17)}</div><div class="in"><div class="h1" style="color:#FAF9F6">New to the city</div><div class="sm" style="opacity:.92">A local shows you Hyderabad your way.</div></div></div>'
  '<div class="sheet" style="gap:9px"><div class="col sm" style="gap:5px">' + ''.join(f'<span>{ic("check", "#2F4A34", 14, 2.4)} {t}</span>' for t in ['Neighbourhoods to live in, markets, metro & autos', 'Where locals eat — and what to order', 'Weekend spots, gyms, cafés to work from']) + '</div>'
  f'<div class="card row between" style="padding:10px 12px"><div><div class="xs mut">Suggested</div><b>4 hours · ₹1,299</b><div class="xs mut">₹325/hour · save ₹297</div></div><span class="pill">Popular choice</span></div><div class="h3">Locals who do this</div>'
  + ''.join(f'<div class="row" style="gap:9px"><div class="av i-{c}" style="width:40px;height:40px"></div><div style="flex:1"><div class="h3" style="font-size:14px">{n}</div><div class="xs mut">{a}</div></div><span class="sm" style="color:var(--moss);font-weight:600">from ₹399</span></div>' for c, n, a in [('cozy', 'Ayesha', 'Banjara Hills · 6 yrs in Hyderabad'), ('locked', 'Fatima', 'Tolichowki · speaks Urdu, Telugu')]) + '</div>', True),
 ('NEW|Category page — Day trips|Long bookings show the day plan and the bigger packages.',
  f'<div class="hero i-events" style="height:190px"><div style="position:absolute;top:38px;left:14px;width:32px;height:32px;border-radius:16px;background:#FAF9F6;display:flex;align-items:center;justify-content:center">{ic("back", "#0E110D", 17)}</div><div class="in"><div class="h1" style="color:#FAF9F6">Day trips</div><div class="sm" style="opacity:.92">Golconda, Ramoji, Bhongir, Ananthagiri.</div></div></div>'
  f'<div class="sheet" style="gap:9px"><div class="h3">Popular plans</div>' + ''.join(f'<div class="card row" style="padding:9px 11px"><div style="flex:1"><div class="h3" style="font-size:14px">{t}</div><div class="xs mut">{d}</div></div><b class="sm">{inr(PRICES[h])}</b></div>' for t, d, h in [('Golconda + Qutb Shahi Tombs', 'Morning fort walk, lunch, tombs', 6), ('Ramoji Film City', 'Full day, tickets extra', 8), ('Ananthagiri Hills', 'Drive, viewpoint, waterfall trail', 12)]) + f'<div class="g3">{"".join(pk(h) for h in [6, 8, 12])}</div><div class="xs mut">Travel and tickets are paid by you on the day. The companion’s time is the package.</div></div>', True),
 ('NEW|Booking for someone else|“Who is this for?” — the step that unlocks parents’ companion.',
  f'{bar("Book a time")}<div class="pad" style="padding-top:4px;gap:9px"><div class="h2">Who is this booking for?</div>'
  '<div class="opt"><div><div class="h3">Me</div></div><div class="rd"></div></div><div class="opt on"><div><div class="h3">Someone else</div><div class="sm mut">A parent, relative or friend</div></div><div class="rd"></div></div>'
  '<div><div class="lbl">Their name</div><div class="field on">Shabana Begum (Ammi)</div></div><div><div class="lbl">Their mobile (we share booking details by WhatsApp)</div><div class="field">🇮🇳 +91 98480 00000</div></div>'
  '<div class="chips"><span class="chip on">Mother</span><span class="chip">Father</span><span class="chip">Grandparent</span><span class="chip">Friend</span></div>'
  f'<div class="card sm" style="background:var(--green50);border-color:var(--mossSoft)">{ic("shield", "#2F4A34", 14)} You pay and get every update; they meet the companion in a public place.</div></div><div class="foot"><div class="btn">Continue</div></div>', True),
 ('NEW|Parents’ companion — weekly plan|Same price per visit, booked as a set. Predictable revenue.',
  f'{bar("Parents’ companion")}<div class="pad" style="padding-top:4px;gap:9px"><div class="tile i-park" style="height:110px"><span>Company for Ammi<small>Park walks, shopping, temple or mosque visits</small></span></div><div class="h3">How often?</div>'
  '<div class="col" style="gap:7px">' + ''.join(f'<div class="opt{" on" if o else ""}"><div><div class="h3">{t}</div><div class="sm mut">{d}</div></div><b style="margin-left:auto">{inr(v)}</b></div>' for t, d, v, o in [('Once', '2 hours · one visit', 699, 0), ('Every week', '2 hours · 4 visits a month', 699 * 4, 1), ('Twice a week', '2 hours · 8 visits a month', 699 * 8, 0)]) + '</div>'
  '<div class="row sm" style="gap:6px">' + ''.join(f'<span class="chip{" on" if d in ("Sat",) else ""}">{d}</span>' for d in ['Mon', 'Wed', 'Fri', 'Sat', 'Sun']) + '<span class="sm mut">· 10:00 AM</span></div>'
  f'<div class="xs mut">Same companion each week when they’re free. Cancel any upcoming visit under the usual rules.</div></div><div class="foot"><div class="btn">Continue · {inr(699 * 4)} / month</div></div>', True),
 ('NEW|Gift a booking|Children abroad or friends buy time for someone.',
  f'{bar("Gift a booking")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card" style="background:var(--moss);color:#FAF9F6;border:0;text-align:center;padding:18px"><div class="wm" style="color:#FAF9F6">prsnn<i>.</i></div><div class="h2" style="color:#FAF9F6;margin-top:6px">A gift of good company</div><div class="xs" style="opacity:.85;margin-top:4px">For Ammi · 4 hours</div></div>'
  f'<div class="g2">{pk(2)}{pk(4, True)}</div><div><div class="lbl">Message</div><div class="field" style="height:64px;align-items:flex-start;padding-top:9px"><span class="sm">Go see the new café on Road No. 10 with someone fun! — Mukarram</span></div></div><div><div class="lbl">Send to (WhatsApp)</div><div class="field">🇮🇳 +91 98480 00000</div></div></div><div class="foot"><div class="btn">Pay ₹1,299 and send gift</div></div>', True),
]
companion = [
 ('NEW|Companion setup — what you offer|Companions tick the categories they’re good at; members find them there.',
  f'<div class="pad">{dots(6, 9)}<div><div class="step">Step 6 of 9 · Companion</div><div class="h2">What can you help people with?</div><div class="sm mut">Pick everything you’d enjoy. You’ll show up in these categories.</div></div><div class="g2">'
  + ''.join(tile(n, i, w, 74, n in ('New to the city', 'Food & Old City trails', 'Events & movies', 'Parents’ companion')) for n, i, l, h, w in CATS) + '</div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
 ('NEW|Parents’ companion — extra trust|A short extra check before seeing these bookings (they’re with older people).',
  f'{bar("Parents’ companion")}<div class="pad" style="padding-top:4px;gap:9px"><div class="tile i-park" style="height:120px"><span>Spend time with someone’s parents<small>Weekly bookings · the same family each week</small></span></div><div class="col sm" style="gap:6px">' + ''.join(f'<span>{ic("check", "#2F4A34", 14, 2.4)} {t}</span>' for t in ['Patient, friendly and on time', 'Outings only: walks, shopping, visits — no medical care', 'You’re matched with the same person each week when free']) + f'</div><div class="card row between" style="background:var(--green50);border-color:var(--mossSoft)"><div><div class="xs mut">Every week · 2 hours</div><b>{inr(share(699) * 4)} a month</b><div class="xs mut">from one family</div></div>{ic("users", "#2F4A34", 22)}</div><div class="btn" style="margin-top:auto">Request access (short video call)</div></div>', True),
 ('NEW|Offer card shows the category|Companions see what the booking is for before accepting.',
  f'<div class="pad" style="gap:10px"><div class="h1">Requests</div>'
  + ''.join(f'<div class="card col" style="{"border-color:var(--clay)" if o else ""}"><div class="row between"><div class="row"><div class="tile i-{img}" style="width:44px;height:44px;border-radius:12px"></div><div><div class="h3" style="font-size:14px">{cat}</div><div class="xs mut">{who}</div></div></div><div style="text-align:right"><b>{inr(share(PRICES[h]))}</b><div class="xs mut">you earn</div></div></div><div class="xs mut">{ic("cal", "#6A665C", 12)} {when} · {h} h</div>{"<div class=row style=gap:8px><div class=btn sec style=flex:1;height:36px;font-size:13px>Decline</div><div class=btn style=flex:1;height:36px;font-size:13px>Accept</div></div>" if o else ""}</div>' for cat, img, who, when, h, o in [('New to the city', 'walks', 'Karan · moved from Pune', 'Sun 16 Nov · 11 AM', 4, 1), ('Parents’ companion', 'park', 'For Shabana (booked by her son)', 'Every Sat · 10 AM', 2, 0), ('Day trip · Golconda', 'events', 'Priya + friend', 'Sat 22 Nov · 8 AM', 6, 0)]) + '</div>' + tabs('Requests', True), True),
]
html = page('Categories on prsnn — how they look',
  'The eight categories from the plan, shown where people meet them: setup, Home, category pages, booking for a parent, weekly plans and gifts — and how companions choose and receive them. Photos are placeholders from the app; final category photos would be shot or licensed.',
  [('mem', 'Members', 'Pick a need → see the right companions → book (for you or someone else)', member),
   ('comp', 'Companions', 'Choose your categories and see what each booking is for', companion)],
  '<b>Revenue levers on these screens:</b> categories with bigger suggested packages (day trips 6–12 h, new to the city 4 h); “Book for your parents” on Home and as a weekly plan (repeat revenue paid from abroad); gifts. Plan and gift prices use the current price list with no discount; you can add one later. Reply with which screens to keep, and which six categories go on the setup step.')
(ROOT / 'preview/categories.html').write_text(html)
print(len(html))
