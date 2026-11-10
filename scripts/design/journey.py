"""The whole journey, landing page to the end, for members and companions:
flow-members + flow-companions + categories (India-wide) + ID check at the
first booking, blended into one page for owner approval.
Run: python3 scripts/design/journey.py  → preview/journey.html"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import flows as F
from flows import ROOT, page, dots
import categories as C
import id_later as L

# India-wide wording and neutral sample names (areas only appear after a city is chosen).
WORDS = [
  ('for coffee, walks and events in Hyderabad — from ₹399.', 'for coffee, walks, events and more — from ₹399.'),
  ('Book a verified companion', 'Book an ID-checked companion'), ('Book verified people', 'Book ID-checked people'),
  ('You’re verified. Members can now book you.', 'Your ID is verified. Every booking is now one tap to accept.'),
  ('Mukarram Jah', 'Rahul Mehta'), ('Mukarram', 'Rahul'), ('>MJ<', '>RM<'),
  ('Ayesha Khan', 'Priya Nair'), ('Ayesha', 'Priya'),
  ('Verified companions only', 'ID-checked companions'),
  ('First time in Hyderabad!', 'First time in this city!'),
  ('Happy to show you the city’s quiet corners.', 'Happy to show you the city’s quiet corners.'),
]
def generic(s):
    for a, b in WORDS:
        s = s.replace(a, b)
    return s

def restep(cell, old, new, kind=''):
    """Renumber a setup step: dots bar and the 'Step n of m' label."""
    cap, html, isnew = cell
    (on, oo), (nn, no) = old, new
    html = html.replace(dots(on, oo), dots(nn, no)).replace(f'Step {on} of {oo}', f'Step {nn} of {no}')
    return cap, html, isnew

def cap(cell, text):
    return (text, cell[1], cell[2])

def g(cells):
    return [(generic(c), generic(h), n) for c, h, n in cells]

# ───────── Members ─────────
S, D, B, A = F.signup, F.discover, F.book, F.after
m_signup = g([
  S[0], S[1], S[2], S[3],
  restep(S[4], (1, 7), (1, 7)),                                                        # name
  restep(cap(C.member[0], 'NEW|Where are you?|State and city decide which companions and popular plans you see.'), (2, 8), (2, 7)),
  restep(cap(C.member[1], 'NEW|What can we help you with?|Categories, worded for all of India. Home opens on the ones picked.'), (3, 8), (3, 7)),
  restep(S[6], (3, 7), (4, 7)),                                                        # I am
  restep(S[7], (4, 7), (5, 7)),                                                        # show me
  restep(S[8], (5, 7), (6, 7)),                                                        # photo
  cap(S[10], 'Your area|Areas of the city picked in step 2; skip allowed.'),           # area 7/7
  S[11],                                                                               # PIN
])
m_discover = g([
  cap(C.member[2], 'NEW|Home|Category cards (generic), your city on top, “Popular in your city”, book for your parents.'),
  C.member[3],
  cap(C.member[4], 'NEW|Popular plans follow your city|Day trips for someone in Hyderabad…'),
  cap(C.member[5], 'NEW|…and in Mumbai|Same category card everywhere; the plans inside change by state and city.'),
  D[1],
  cap(D[2], 'Companion profile — ID verified|Big photo, “ID verified” badge, interests, packages, availability; sticky Book bar.'),
  cap(L.members[0], 'NEW|Companion profile — new on prsnn|Before their ID is checked: honest label, no verified badge, refund promise.'),
])
m_book = g([
  B[0],
  C.member[6],                                                                         # booking for someone else
  B[1], B[2], B[3],
  cap(L.members[1], 'NEW|If your companion is new|They accepted; their ID is checked before you meet. Chat opens once approved.'),
])
m_more = g([C.member[7], C.member[8]])                                                 # parents weekly plan, gift
m_after = g(A)

# ───────── Companions ─────────
CS, CW = F.csign, F.cwork
c_signup = g([
  CS[0], CS[1], CS[2], CS[3],
  restep(CS[4], (1, 9), (1, 10)),                                                      # name
  restep(cap(CS[5], 'What you keep|Real payouts and an honest example, early in sign-up.'), (2, 9), (2, 10)),
  restep(CS[6], (3, 9), (3, 10)),                                                      # I am
  restep(CS[7], (4, 9), (4, 10)),                                                      # photo visibility
  restep(cap(CS[8], 'City & area|One screen: state and city, then area chips for that city.'), (5, 9), (5, 10)),
  restep(CS[9], (6, 9), (6, 10)),                                                      # about you
  restep(cap(C.companion[0], 'NEW|What you offer|Tick the categories you’re good at; members in your city find you there.'), (6, 9), (7, 10)),
  restep(CS[10], (7, 9), (8, 10)),                                                     # durations
  restep(CS[11], (8, 9), (9, 10)),                                                     # availability
  restep(cap(L.onboarding[0], 'NEW|Last step: no ID upload|Only tells them an ID and selfie will be asked for at the first booking — encrypted, seen only by the safety team.'), (9, 9), (10, 10)),
  cap(L.onboarding[1], 'NEW|You’re live|Straight in, no review wait. Verifying now is optional.'),
  CS[14],                                                                              # PIN
])
c_first = g(L.first_booking)
c_work = g([
  CW[0], CW[1],
  cap(C.companion[2], 'NEW|Requests show the category|What each booking is for, before accepting.'),
  CW[3], CW[4], CW[5], CW[6], CW[7],
  C.companion[1],                                                                      # parents' companion extra trust
  CW[8],
])

html = page('prsnn — the whole journey, landing page to the end',
  'flow-members + flow-companions + the India-wide categories, blended, with the ID check moved to the first booking (already built in the backend). '
  'Orange numbers are screens that are new compared with the current app. Names and photos are samples; area names appear only after someone picks their city.',
  [('m1', 'Members · 1. Landing and sign-up', 'Welcome → role → mobile → code → name → state & city → categories → I am → show me → photo → area → PIN', m_signup),
   ('m2', 'Members · 2. Discover', 'Home with categories → category page → city-based plans → search → companion profile (verified or new)', m_discover),
   ('m3', 'Members · 3. Book and pay', 'Time → for me or someone else → review → pay → status (incl. the ID check of a new companion)', m_book),
   ('m4', 'Members · 4. Parents and gifts', 'Weekly visits for a parent; gift a booking', m_more),
   ('m5', 'Members · 5. After booking', 'Bookings, details, chat, notifications, profile', m_after),
   ('c1', 'Companions · 1. Landing and sign-up (no ID)', 'Welcome → role → mobile → code → name → what you keep → I am → photo → city & area → about you → what you offer → durations → availability → “before your first booking” → live → PIN', c_signup),
   ('c2', 'Companions · 2. First booking: ID check', 'First offer → why → pick ID → photos + selfie → booking held → verified for good', c_first),
   ('c3', 'Companions · 3. Everyday work', 'Dashboard, offers, requests, booking, chat, earnings, availability, notifications, parents’ companion, profile', c_work)],
  '<b>What changes in the app if you approve:</b> member sign-up gets state & city and the categories step; Home gets the category cards, “Popular in your city” and “Book for your parents”; '
  'category pages; booking for someone else; companion sign-up gets “What you offer” and ends with the ID notice instead of an upload. The ID check at the first booking is already live. '
  '<b>Needs backend work too:</b> categories on profiles and bookings, city-based popular plans (an admin list per city), booking for someone else, weekly plans and gifts. '
  'Reply “approve” (or name screens to change) and I’ll build it.')
(ROOT / 'preview/journey.html').write_text(html)
print(len(html), sum(len(x) for x in [m_signup, m_discover, m_book, m_more, m_after, c_signup, c_first, c_work]))
