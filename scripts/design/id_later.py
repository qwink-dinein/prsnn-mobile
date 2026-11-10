"""Companion ID check moved to the first booking (owner request), for approval.
Run: python3 scripts/design/id_later.py  → preview/id-later.html"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from flows import ROOT, page, ic, bar, tabs, dots, ticks, share, inr, PRICES

EARN = inr(share(PRICES[2]))
DOCS = [('Aadhaar', 'Front and back'), ('PAN card', 'Front only'), ('Driving licence', 'Front and back'), ('Passport', 'Photo page'), ('Voter ID', 'Front and back')]

onboarding = [
 ('NEW|Last step: safety, not paperwork|Replaces the ID upload in sign-up. Nothing to upload here, just what will happen.',
  f'<div class="pad">{dots(9, 9)}<div><div class="step">Step 9 of 9 · Companion</div><div class="h2">One thing before your first booking</div><div class="sm mut">Nothing to upload now.</div></div>'
  f'<div class="card col" style="gap:8px;background:var(--green50);border-color:var(--mossSoft)"><div class="row">{ic("shield", "#2F4A34", 22)}<b class="sm">When you get your first booking, we’ll ask for a photo ID and a selfie.</b></div><div class="xs mut">It keeps members and you safe: everyone you meet knows you’re a real person, and you know they’re verified too.</div></div>'
  + ticks(['Encrypted and stored privately', 'Seen only by our safety team, never by members', 'Aadhaar, PAN, driving licence, passport or voter ID', 'Takes about 2 minutes'])
  + '<div class="btn">Got it, finish →</div></div>', True),
 ('NEW|You’re live|Straight in, no waiting for a review. The profile can get bookings right away.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:60px"><div class="ok" style="background:var(--mossSoft);color:var(--moss)">{ic("check", "#2F4A34", 32, 2.6)}</div><div class="h1">You’re live, Ananya</div><div class="sm mut">Members in your city can now find and book you.</div>'
  '<div class="card" style="width:100%;text-align:left"><div class="tl"><div><i class="on"></i>Profile done</div><div><i class="on"></i>Live: members can book you</div><div><i></i>First booking: quick ID check</div><div><i></i>Meet and get paid</div></div></div>'
  '<div class="btn" style="width:100%;margin-top:auto">Go to my dashboard</div><div class="btn ghost" style="width:100%">Verify ID now (optional)</div></div>', True),
]

first_booking = [
 ('NEW|First offer arrives|The offer itself is the reason to verify: real money waiting.',
  f'<div class="pad" style="gap:10px"><div class="row"><div class="av i-cozy" style="width:48px;height:48px"></div><div style="flex:1"><div class="xs mut">Welcome</div><div class="h2">Ananya</div><div class="xs" style="color:var(--moss)">● Live · accepting bookings</div></div>{ic("bell", "#0E110D", 21)}</div>'
  f'<div class="card" style="background:var(--claySoft);border-color:#ecc8b4"><div class="h3" style="color:var(--clay)">Your first booking is here</div><div class="xs mut">Verify your ID to accept it. About 2 minutes.</div></div>'
  f'<div class="card col" style="border-color:var(--clay)"><div class="row between"><div class="row"><div class="av" style="width:36px;height:36px">RT</div><div><div class="h3" style="font-size:14px">Riya</div><span class="pill w">Paid · 2 h 40 min left</span></div></div><div style="text-align:right"><b style="font-size:17px">{EARN}</b><div class="xs mut">you earn</div></div></div><div class="xs mut">{ic("cal", "#6A665C", 13)} Sat 15 Nov · 4:00–6:00 PM · Coffee</div><div class="row" style="gap:8px"><div class="btn sec" style="flex:1;height:38px;font-size:13px">Decline</div><div class="btn" style="flex:2;height:38px;font-size:13px">{ic("shield", "#fff", 14)} Verify ID &amp; accept</div></div></div></div>' + tabs('Home', True), True),
 ('NEW|Why we ask now|Shown once, after tapping accept. Short, honest, the money stays in view.',
  f'{bar("Accept booking")}<div class="pad" style="padding-top:4px;gap:10px"><div class="card row between" style="background:var(--green50);border-color:var(--mossSoft)"><div><div class="xs mut">Riya · Sat 15 Nov · 2 h</div><b>You earn {EARN}</b></div><span class="pill">Held for you</span></div>'
  '<div class="h2">Quick ID check, then it’s yours</div><div class="sm mut">Every companion does this once, before their first meeting. You won’t be asked again.</div>'
  + ticks(['Encrypted, stored privately', 'Only our safety team sees it, never Riya or any member', 'Used only to confirm you are you', 'Delete it any time by closing your account'])
  + '<div class="btn">Choose an ID →</div><div class="btn ghost">Not now (the booking goes to someone else)</div></div>', True),
 ('NEW|Pick the ID you have|Options, not one fixed document. The most common one comes first.',
  f'{bar("Verify your ID")}<div class="pad" style="padding-top:4px;gap:8px"><div class="h2">Which ID will you use?</div><div class="sm mut">Any one of these.</div>'
  + ''.join(f'<div class="opt{" on" if i == 0 else ""}"><div><div class="h3">{n}</div><div class="sm mut">{d}</div></div><div class="rd"></div></div>' for i, (n, d) in enumerate(DOCS))
  + '<div class="xs mut">Aadhaar: you can hide the first 8 digits before taking the photo (masked Aadhaar).</div><div class="btn" style="margin-top:auto">Continue</div></div>', True),
 ('NEW|Photos + selfie|Camera or gallery. The selfie is matched with the ID photo.',
  f'{bar("Aadhaar")}<div class="pad" style="padding-top:4px;gap:10px"><div class="g2"><div class="upl done i-locked">{ic("check", "#fff", 22, 3)}Front</div><div class="upl">{ic("id", "#6A665C", 22)}Back</div></div><div class="upl">{ic("cam", "#6A665C", 22)}Take a selfie</div>'
  + ticks(['Good light, all four corners visible', 'No glare on the card', 'Face the camera, no sunglasses'])
  + f'<div class="card xs mut" style="text-align:left">{ic("lock", "#6A665C", 13)} Sent encrypted. Never shown on your profile.</div><div class="btn dis">Submit &amp; accept booking</div></div>', True),
 ('NEW|Booking held while we check|The booking is confirmed as soon as the check passes. Reviews of first bookings jump the queue.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:60px"><div class="ok" style="background:var(--mossSoft);color:var(--moss)">{ic("shield", "#2F4A34", 32)}</div><div class="h1">Checking your ID</div><div class="sm mut">Riya’s booking is held for you. We’ll message you on WhatsApp as soon as it’s confirmed.</div>'
  '<div class="card" style="width:100%;text-align:left"><div class="tl"><div><i class="on"></i>You accepted</div><div><i class="on"></i>ID submitted</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i>Safety check: usually within 1 hour</div><div><i></i>Confirmed: chat with Riya opens</div></div></div>'
  f'<div class="card row between" style="width:100%"><span class="sm">You earn</span><b>{EARN}</b></div></div>', True),
 ('NEW|Verified for good|Next bookings are one tap. The badge now shows on the profile.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:60px"><div class="ok">{ic("check", "#fff", 32, 3)}</div><div class="h1">You’re verified</div><div class="sm mut">Riya’s booking is confirmed. Every booking after this is one tap to accept.</div>'
  f'<div class="card row" style="width:100%"><div class="av i-cozy" style="width:44px;height:44px"></div><div style="text-align:left"><div class="row h3" style="font-size:15px">Ananya {ic("shield", "#2F4A34", 16, 2.1)}</div><div class="xs" style="color:var(--moss)">ID verified by prsnn</div></div></div>'
  '<div class="btn" style="width:100%;margin-top:auto">Open chat with Riya</div></div>', True),
]

members = [
 ('NEW|New companion on a profile|Honest label until their ID is checked; no “verified” badge yet.',
  f'<div class="hero i-cozy" style="height:230px"><div style="position:absolute;top:38px;left:14px;width:34px;height:34px;border-radius:17px;background:#FAF9F6;display:flex;align-items:center;justify-content:center">{ic("back", "#0E110D", 18)}</div></div><div class="sheet" style="gap:9px"><div class="row"><div class="h1">Ananya</div><span class="pill n">New on prsnn</span></div>'
  f'<div class="card sm" style="background:var(--green50);border-color:var(--mossSoft)">{ic("shield", "#2F4A34", 14)} ID-checked by our team before you meet. If the check doesn’t pass, you get a full refund.</div><div class="chips"><span class="chip">☕ Coffee</span><span class="chip">🚶 Walks</span></div><div class="sm">Café hopper and long-walk person.</div></div><div class="foot row between"><div><b style="font-size:17px">from ₹399</b></div><div class="btn" style="padding:0 22px">Book now</div></div>', True),
 ('NEW|Member’s booking while the check runs|Paid, held, and clear about what happens either way.',
  f'{bar("Booking #4C1A20")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card row"><div class="av i-cozy" style="width:46px;height:46px"></div><div><div class="h3">Ananya</div><div class="xs mut">Sat 15 Nov · 4:00–6:00 PM</div></div></div>'
  '<div class="card"><div class="tl"><div><i class="on"></i>Paid</div><div><i class="on"></i>Ananya accepted</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i>Safety check of Ananya’s ID</div><div><i></i>Confirmed: chat opens</div></div></div>'
  '<div class="card sm col" style="gap:5px"><b>If the check doesn’t pass</b><span class="mut">We offer you another verified companion at the same time, or a full refund. Your choice.</span></div></div>', True),
]

html = page('Companion ID check — at the first booking',
  'The ID upload leaves sign-up. Companions finish in fewer steps and go live straight away; sign-up only tells them an ID will be needed. The ID is asked for when the first paid booking arrives, with the money on screen. Nobody meets anyone before their ID is checked.',
  [('on', 'Sign-up', 'Inform, don’t ask', onboarding),
   ('first', 'First booking', 'Offer → why → pick ID → upload → held → verified', first_booking),
   ('mem', 'What members see', 'Honest labels and a clear fallback', members)],
  '<b>Safety rules that stay:</b> chat, meeting details and payout unlock only after the ID is approved; unverified companions never get the “verified” badge; if the check fails or isn’t done before the offer deadline, the member gets another companion or a full refund. '
  '<b>What it needs from us:</b> fast reviews (first-booking checks go to the top of the admin queue with the deadline shown) and member-side copy changes: “Verified companions only” becomes “Every companion is ID-checked before you meet”. '
  '<b>Optional later:</b> DigiLocker or an ID-check provider to make approval instant. Reply “approve ID later” and I’ll build it in the app and backend.')
(ROOT / 'preview/id-later.html').write_text(html)
print(len(html))
