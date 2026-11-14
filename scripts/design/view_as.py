"""Generates preview/view-as.html: the admin "View the app as…" flow, for approval.
Run: python3 scripts/design/view_as.py"""
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import all_screens as A
import screens_v2 as V
from all_screens import bar, h, btn, foot, body, card, row, group, label, pill, notice, ic, logo, tabs

P, W, M, MUT, C, CD, CM, LINE, RED = A.P, A.W, A.M, A.MUT, A.C, A.CD, A.CM, A.LINE, A.RED

def strip_banner(who):
    return (f'<div class="pvbar"><span style="display:flex;gap:7px;align-items:center;white-space:nowrap">{ic("users", C, 15)}<b>{who.capitalize()} preview</b><span style="opacity:.7">· sample data</span></span>'
            f'<span class="pvx">Exit</span></div>')
def with_banner(html, who):
    # push the screen down under the preview strip
    return strip_banner(who) + f'<div style="position:relative;margin-top:30px">{html}</div>'

def s_admin():
    rows_ = group(row('alert', 'Panic alerts', '1 open'), row('users', 'Approvals', 'Profiles · photos'), row('cal', 'Bookings', 'Live · Refunds · Done'), row('users', 'Users', 'Search, edit, suspend', last=True))
    view = card(f'<div style="display:flex;gap:12px;align-items:center"><span class="rico" style="background:{W}">{ic("globe", CD, 16)}</span><div style="flex:1"><div style="font:600 14px Urbanist">View the app as…</div>'
                f'<div style="font:400 11.5px Urbanist;color:{MUT}">See exactly what members and companions see</div></div>{ic("chev", MUT, 14)}</div>', CM, mt=4)
    return A.top(False) + h('Admin', 'Signed in as superadmin.', 24) + body(view + rows_)
def s_pick():
    opt = lambda icon, t, s, on: (f'<div class="opt{" on" if on else ""}" style="align-items:center;gap:12px;padding:14px"><span class="rico" style="background:{W if on else CM}">{ic(icon, CD, 17)}</span>'
                                  f'<div style="flex:1"><div style="font:600 14.5px Urbanist">{t}</div><div style="font:400 11.5px/1.4 Urbanist;color:{MUT}">{s}</div></div><span class="rd{" on" if on else ""}"></span></div>')
    return (s_admin() + V.sheet(f'<div style="font:600 18px Urbanist">View the app as…</div><div class="sub">Opens the real screens with sample people and bookings. Nothing you do reaches real users.</div>'
                                + opt('user', 'A member', 'Home, search, booking, payment, chat and safety', True) + opt('star', 'A companion', 'Onboarding, requests, ID check and earnings', False)
                                + label('Start at') + f'<div class="chips" style="flex-wrap:wrap;margin-top:8px">' + ''.join(f'<span class="chip{" on" if i == 0 else ""}">{t}</span>' for i, t in enumerate(['Home', 'Sign-up', 'A booking', 'Chat'])) + '</div>'
                                + f'<div style="margin-top:14px">{btn("Start preview")}</div>'))
def s_member_home():
    return with_banner(V.m_home(), 'member')
def s_member_book():
    return with_banner(V.m_review3(), 'member')
def s_companion_dash():
    return with_banner(V.c_dashboard(), 'companion')
def s_companion_onb():
    return with_banner(V.c7(), 'companion')
def s_action():
    base = with_banner(V.m_pay(), 'member')
    return base + '<div class="dim" style="z-index:30"></div>' + (f'<div class="dialog"><div style="font:600 16px Urbanist">Sample payment</div><div class="sub" style="text-align:center">In preview, payments, messages and alerts stay on this phone. No money moves and nobody is notified.</div>'
                                                                  f'<div style="display:flex;border-top:1px solid {LINE};margin:12px -16px -14px"><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist">Got it</span></div></div>')
def s_exit():
    return (with_banner(V.c_dashboard(), 'companion') + '<div class="dim" style="z-index:30"></div>'
            + f'<div class="dialog"><div style="font:600 16px Urbanist">Exit preview?</div><div class="sub" style="text-align:center">You’ll go back to Admin. Sample changes are cleared.</div>'
              f'<div style="display:flex;border-top:1px solid {LINE};margin:12px -16px -14px"><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist">Keep looking</span><span style="flex:1;padding:12px;text-align:center;font:600 14px Urbanist;color:{CD};border-left:1px solid {LINE}">Exit</span></div></div>')
def s_switch():
    return with_banner(V.p_profile('companion'), 'companion').replace('Log out', 'Switch to member view', 1)

SCREENS = [('1 · Admin: new “View the app as…” row', s_admin), ('2 · Choose member or companion', s_pick), ('3 · Member app, preview strip on top', s_member_home), ('4 · Every member screen works', s_member_book),
           ('5 · Actions stay on this phone', s_action), ('6 · Companion app', s_companion_dash), ('7 · Companion onboarding too', s_companion_onb), ('8 · Exit any time', s_exit)]

CSS = A.CSS + V.EXTRA_CSS + f'''
.pvbar{{position:absolute;left:0;right:0;top:0;height:76px;padding:44px 14px 0;background:{M};color:{P};display:flex;justify-content:space-between;align-items:center;font:500 11.5px Urbanist;z-index:22}}
.pvx{{font:600 12px Urbanist;color:{M};background:{C};padding:4px 12px;border-radius:99px}}
.pvbar + div .top,.pvbar + div .bar{{padding-top:40px}}
'''
cells = ''.join(f'<div class="cell">{V.phone(fn)}<span class="cap" style="max-width:300px;text-align:center">{t}</span></div>' for t, fn in SCREENS)
notes = ''.join(f'<li>{t}</li>' for t in [
    'Only staff see “View the app as…” (Admin overview, and Profile → Admin). Sub-admins and superadmins both get it.',
    'The preview uses the real app screens with the built-in sample data (the same sample people and bookings used for screenshots). Admins don’t see or act as any real user.',
    'A midnight strip stays on top of every screen: “Member preview · sample data · Exit”. It can’t be missed in screenshots or screen shares.',
    'Everything is clickable: search, book, pay (sample checkout), chat, panic, companion onboarding, accept/decline, ID check, earnings. Nothing is sent to the server, no notifications or WhatsApp go out, and sample changes are cleared on exit.',
    'Admins can jump straight to a starting point (Home, Sign-up, A booking, Chat) and switch between member and companion from the preview’s Profile tab.',
    'Exit returns to Admin with the admin’s own session untouched. Each preview start is written to the activity log.',
    'Separate, read-only option for later (needs your OK): from Users → a companion, “See their profile as members do”, which opens that companion’s real public profile page.'])
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>View the app as</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Outfit:wght@700&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="intro"><h1>Admin · View the app as a member or companion</h1>'
        f'<p>A safe way for admins to explore both apps end to end, with sample data, without touching real people’s accounts.</p><ul style="color:#4C4F66;line-height:1.6;max-width:96ch;font-size:14.5px">{notes}</ul></div>'
        f'<section class="grp"><div class="grid">{cells}</div></section></body></html>')
html = re.sub(r'url\(IMG_(\w+)\)', r'var(--\1)', html)
(A.ROOT / 'preview/view-as.html').write_text(html)
print('wrote preview/view-as.html')
