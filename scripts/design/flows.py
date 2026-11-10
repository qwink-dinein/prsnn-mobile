"""Generates preview/flow-members.html and preview/flow-companions.html:
every screen of each journey as phone mock-ups (design A), for owner approval.
Run: python3 scripts/design/flows.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
IMGS = ['coffee', 'walks', 'events', 'study', 'park', 'evening', 'cozy', 'together', 'locked']
def b64(n): return base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()

PRICES = {1: 399, 2: 699, 3: 999, 4: 1299, 5: 1599, 6: 1899, 8: 2499, 12: 3599}
share = lambda p: int(p * 0.8)
inr = lambda n: f'₹{n:,}'

def svg(d, c='currentColor', w=20, sw=1.9):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
I = dict(
  home='M4 11l8-7 8 7v9h-5v-6h-6v6H4z', search='M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4', cal='M5 6h14v14H5zM5 10h14M9 4v4m6-4v4',
  msg='M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', user='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0',
  chart='M4 20V10m6 10V4m6 16v-7m4 7H3', bell='M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4', back='M15 5l-7 7 7 7', chev='M9 5l7 7-7 7',
  shield='M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3zM9 12l2 2 4-4', lock='M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', pin='M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z',
  check='M5 12.5 10 17l9-10', heart='M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', rupee='M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7',
  clock='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2', send='M4 12 20 4l-6 16-3-7-7-1z', cam='M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  id='M3 6h18v12H3zM8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 3a3 3 0 0 1 6 0M14 10h4m-4 3h3', wallet='M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4V7zm0 0V6a1 1 0 0 1 1-1h11M16 13h.01',
  flag='M5 21V4m0 0h11l-2 4 2 4H5', star='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z', logout='M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  trash='M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13', help='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-2.5-11.5a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 4m0 2.7v.1',
  users='M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a5 5 0 0 0-3-4.6', edit='M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  sparkle='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z', globe='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z')
ic = lambda n, c='currentColor', w=20, sw=1.9: svg(I[n], c, w, sw)

CSS = '''
:root{--ink:#0E110D;--mist:#F3F1EB;--mistDeep:#E8E5DC;--paper:#FAF9F6;--moss:#2F4A34;--mossSoft:#D7E3D4;--green50:#F2F6F1;--clay:#C45C2A;--claySoft:#F6E4DA;--muted:#6A665C;--line:rgba(14,17,13,.08);--g4:#8E8A7E}
*{box-sizing:border-box}body{margin:0;background:#E3E0D6;font-family:'DM Sans',system-ui,sans-serif;color:var(--ink)}
.top{max-width:1500px;margin:0 auto;padding:28px 16px 4px}.top h1{font:600 30px Lora;margin:0 0 6px}.top p{margin:0;color:var(--muted);max-width:820px;line-height:1.5}
.top nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.top nav a{font-size:13px;font-weight:600;color:var(--moss);text-decoration:none;background:var(--paper);border:1px solid var(--line);padding:6px 12px;border-radius:999px}
.part{max-width:1500px;margin:0 auto;padding:26px 16px 4px}.part h2{font:600 21px Lora;margin:0}.part p{margin:4px 0 0;color:var(--muted);font-size:14px}
.grid{max-width:1500px;margin:0 auto;padding:16px 16px 10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px 22px}
.cell{display:flex;flex-direction:column;align-items:center;gap:10px}.cap{width:300px;max-width:100%;font-size:13px;color:var(--muted);line-height:1.4}.cap b{color:var(--ink);font-size:14px;display:block}.cap .n{display:inline-block;min-width:22px;height:22px;border-radius:11px;background:var(--moss);color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:22px;margin-right:6px;padding:0 6px}
.cap .new{background:var(--clay)}
.ph{width:300px;height:640px;border-radius:40px;border:9px solid #111;background:var(--mist);position:relative;overflow:hidden;box-shadow:0 18px 44px rgba(14,17,13,.22);font-size:14px}
.ph .notch{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:84px;height:22px;background:#111;border-radius:18px;z-index:9}
.s{position:absolute;inset:0;display:flex;flex-direction:column}
.pad{padding:44px 18px 14px;display:flex;flex-direction:column;gap:11px;flex:1;min-height:0}
.wm{font:italic 600 22px Lora;letter-spacing:-.5px}.wm i{color:var(--clay);font-style:normal}
.h1{font:600 23px/1.15 Lora;letter-spacing:-.3px}.h2{font:600 19px/1.2 Lora}.h3{font-weight:600;font-size:15.5px}
.mut{color:var(--muted)}.sm{font-size:12px}.xs{font-size:11px}
.btn{height:46px;border-radius:14px;background:var(--moss);color:#FAF9F6;font-weight:600;font-size:15px;display:flex;align-items:center;justify-content:center;gap:6px;flex:none}
.btn.sec{background:var(--paper);color:var(--moss);border:1px solid var(--line)}.btn.ghost{background:transparent;color:var(--moss)}.btn.dis{opacity:.45}.btn.danger{background:#F9E3E1;color:#B3261E}
.field{display:flex;align-items:center;gap:9px;background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:0 12px;height:46px}.field.on{border-color:var(--moss)}
.lbl{font-size:12px;color:#4A473F;font-weight:500;margin-bottom:5px}
.hero{background-size:cover;background-position:center 35%;position:relative;flex:none}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,17,13,.25),rgba(14,17,13,.05) 35%,rgba(14,17,13,.8))}
.hero>*{position:relative;z-index:1}.hero .in{position:absolute;left:18px;right:18px;bottom:30px;color:#FAF9F6}.hero .wm{position:absolute;top:38px;left:18px;color:#FAF9F6}
.sheet{flex:1;margin-top:-20px;background:var(--mist);border-radius:24px 24px 0 0;position:relative;z-index:2;padding:16px 18px 14px;display:flex;flex-direction:column;gap:11px;min-height:0}
.dots{display:flex;gap:5px}.dots span{height:4px;border-radius:4px;background:var(--mossSoft);flex:1}.dots span.on{background:var(--moss)}
.step{font-size:11px;font-weight:700;color:var(--moss);letter-spacing:.5px;text-transform:uppercase}
.opt{display:flex;align-items:center;gap:10px;background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:12px 13px}.opt.on{border-color:var(--moss);background:var(--green50)}
.opt .rd{width:20px;height:20px;border-radius:10px;border:2px solid var(--g4);flex:none;margin-left:auto}.opt.on .rd{border:6px solid var(--moss)}
.ticks{display:flex;flex-direction:column;gap:7px;margin-top:auto}.ticks div{display:flex;gap:8px;align-items:center;font-size:12px;color:#4A473F}.ticks svg{flex:none}
.card{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:13px}
.row{display:flex;align-items:center;gap:10px}.between{justify-content:space-between}.col{display:flex;flex-direction:column;gap:6px}
.av{width:40px;height:40px;border-radius:50%;background:var(--mossSoft);color:var(--moss);font:600 15px Lora;display:flex;align-items:center;justify-content:center;flex:none;background-size:cover;background-position:center}
.pill{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--mossSoft);color:var(--moss)}.pill.w{background:var(--claySoft);color:var(--clay)}.pill.n{background:var(--mistDeep);color:#4A473F}
.chip{flex:none;font-size:12.5px;font-weight:500;padding:7px 12px;border-radius:999px;background:var(--paper);border:1px solid var(--line)}.chip.on{background:var(--moss);color:#FAF9F6;border-color:var(--moss)}
.chips{display:flex;gap:6px;flex-wrap:wrap}.chips.hs{flex-wrap:nowrap;overflow:hidden;flex:none}.chips.hs .chip{white-space:nowrap}
.tabs{flex:none;display:flex;justify-content:space-around;background:var(--paper);border-top:1px solid var(--line);padding:7px 0 14px}.tabs div{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;color:var(--g4)}.tabs .on{color:var(--moss);font-weight:600}
.bar{display:flex;align-items:center;gap:8px;padding:42px 14px 6px}.bar .t{flex:1;text-align:center;font-weight:600;font-size:15px;margin-right:28px}
.scroll{overflow:hidden;flex:1;min-height:0}
.img{background-size:cover;background-position:center}
.tile{border-radius:14px;position:relative;overflow:hidden;background-size:cover;background-position:center}.tile:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(14,17,13,.72))}
.tile span{position:absolute;left:9px;bottom:7px;z-index:1;color:#fff;font-weight:600;font-size:13px;line-height:1.15}.tile small{display:block;font-weight:500;font-size:10.5px;opacity:.92}
.pk{background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:9px 10px;position:relative}.pk.on{border-color:var(--moss);background:var(--green50)}.pk b{font-size:17px;display:block}.pk .sv{color:var(--moss);font-size:10.5px;font-weight:700}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.g7{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:11.5px}
.g7 .d{height:28px;display:flex;align-items:center;justify-content:center;border-radius:14px}.g7 .d.x{color:var(--g4);text-decoration:line-through}.g7 .d.on{background:var(--moss);color:#fff;font-weight:700}
.slot{font-size:12px;font-weight:500;text-align:center;padding:8px 0;border-radius:10px;background:var(--paper);border:1px solid var(--line)}.slot.on{background:var(--moss);color:#fff}
.li{display:flex;align-items:center;gap:11px;padding:11px 12px;border-bottom:1px solid var(--line)}.li:last-child{border:0}.li .t{flex:1}.grp{background:var(--paper);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.bub{max-width:78%;padding:9px 12px;border-radius:16px;font-size:13px;line-height:1.35}.bub.me{align-self:flex-end;background:var(--moss);color:#FAF9F6;border-bottom-right-radius:5px}.bub.them{align-self:flex-start;background:var(--paper);border:1px solid var(--line);border-bottom-left-radius:5px}
.tl{display:flex;flex-direction:column;gap:0}.tl div{display:flex;gap:10px;align-items:flex-start;font-size:12.5px;padding-bottom:10px;position:relative}.tl i{width:12px;height:12px;border-radius:6px;border:2px solid var(--mossSoft);background:var(--paper);flex:none;margin-top:2px}.tl i.on{background:var(--moss);border-color:var(--moss)}
.boxes{display:flex;gap:7px}.boxes span{flex:1;height:48px;border-radius:12px;background:var(--paper);border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;font:600 20px 'DM Sans'}.boxes span.on{border-color:var(--moss)}
.keys{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:auto;width:100%}.keys span{height:52px;border-radius:26px;background:var(--paper);display:flex;align-items:center;justify-content:center;font:500 22px 'DM Sans'}
.pdots{display:flex;gap:14px;justify-content:center}.pdots i{width:14px;height:14px;border-radius:7px;border:2px solid var(--moss)}.pdots i.on{background:var(--moss)}
.stat{flex:1;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:9px;text-align:center}.stat b{display:block;font-size:17px}
.ok{width:66px;height:66px;border-radius:33px;background:var(--moss);color:#fff;display:flex;align-items:center;justify-content:center}
.upl{border:1.5px dashed var(--g4);border-radius:14px;height:86px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:12px;color:var(--muted);background:var(--paper)}.upl.done{border:1.5px solid var(--moss);background-size:cover;background-position:center;color:#fff}
.foot{flex:none;padding:10px 16px 16px;background:var(--mist);border-top:1px solid var(--line)}
.note{max-width:1500px;margin:0 auto;padding:18px 16px 50px;color:var(--muted);font-size:14px;line-height:1.55}.note b{color:var(--ink)}
.pk2{background:var(--paper);border:1.5px solid var(--line);border-radius:16px;padding:10px 11px 9px;position:relative;box-shadow:0 1px 0 rgba(14,17,13,.03);transition:transform .2s}
.pk2.on{border:2px solid var(--moss);background:linear-gradient(180deg,#F2F6F1,#FAF9F6);box-shadow:0 8px 20px rgba(47,74,52,.16);transform:translateY(-2px)}
.pk2 .du{font:600 22px/1 Lora;color:var(--ink)}.pk2 .du small{font:500 11px 'DM Sans';color:var(--muted)}
.pk2 .tk{width:18px;height:18px;border-radius:9px;background:var(--moss);display:inline-flex;align-items:center;justify-content:center}.pk2 .tk.off{background:transparent;border:1.5px solid var(--g4)}
.pk2 .pr{font-weight:700;font-size:19px;margin-top:6px;letter-spacing:-.3px}.pk2 .per{font-size:11px;color:var(--muted);font-weight:500}.pk2 .per s{opacity:.6}
.pk2 .sv2{display:inline-block;white-space:nowrap;margin-top:5px;font-size:10px;font-weight:700;color:var(--moss);background:var(--mossSoft);padding:2px 7px;border-radius:999px}.pk2 .sv2.n{background:var(--mistDeep);color:#4A473F}
.pk2 .vb{height:4px;border-radius:2px;background:var(--mistDeep);margin-top:7px;overflow:hidden}.pk2 .vb i{display:block;height:100%;background:linear-gradient(90deg,var(--moss),#5E8A63);border-radius:2px}
.pk2 .ft{font-size:10.5px;color:#4A473F;margin-top:6px;line-height:1.25}.pk2 .get{margin-top:5px;font-size:12px;color:var(--moss);background:var(--green50);border:1px solid var(--mossSoft);border-radius:9px;padding:4px 7px}.pk2 .get b{font-size:14px}
.pk2 .rib{position:absolute;top:-9px;right:10px;font-size:9.5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#fff;background:linear-gradient(90deg,var(--clay),#D9793F);padding:3px 8px;border-radius:999px;box-shadow:0 3px 8px rgba(196,92,42,.3);background-size:200% 100%;animation:shine 2.4s linear infinite}
@keyframes shine{0%{background-position:0 0}100%{background-position:200% 0}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(179,38,30,.55)}70%{box-shadow:0 0 0 18px rgba(179,38,30,0)}100%{box-shadow:0 0 0 0 rgba(179,38,30,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes kenburns{from{transform:scale(1)}to{transform:scale(1.08)}}
.ph .s>.pad>*,.ph .s>.sheet>*{animation:rise .5s both}.ph .s>.pad>*:nth-child(2),.ph .s>.sheet>*:nth-child(2){animation-delay:.06s}.ph .s>.pad>*:nth-child(3),.ph .s>.sheet>*:nth-child(3){animation-delay:.12s}.ph .s>.pad>*:nth-child(4),.ph .s>.sheet>*:nth-child(4){animation-delay:.18s}
.pad>*,.sheet>*{flex-shrink:0}
@media (max-width:360px){.ph,.cap{width:100%}}
'''

def page(title, intro, sections, note):
    css_imgs = ''.join(f'.i-{n}{{background-image:url(data:image/jpeg;base64,{b64(n)})}}' for n in IMGS)
    nav = ''.join(f'<a href="#{sid}">{name}</a>' for sid, name, _, _ in sections)
    body = ''
    for sid, name, sub, cells in sections:
        body += f'<div class="part" id="{sid}"><h2>{name}</h2><p>{sub}</p></div><div class="grid">'
        for i, (cap, html, new) in enumerate(cells):
            body += f'<div class="cell"><div class="ph"><div class="notch"></div><div class="s">{html}</div></div><div class="cap">{cap}</div></div>'
        body += '</div>'
    # number the captions in order
    n = 0
    out = []
    for part in body.split('<div class="cap">'):
        if out:
            n += 1
            head, rest = part.split('</div>', 1)
            new = head.startswith('NEW|')
            head = head[4:] if new else head
            t, _, d = head.partition('|')
            part = f'<span class="n{" new" if new else ""}">{n}</span><b style="display:inline">{t}</b>{"<span class=pill w style=margin-left:6px>New</span>" if new else ""}<br>{d}</div>{rest}'
        out.append(part)
    body = '<div class="cap">'.join(out)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,600&display=swap" rel="stylesheet">
<style>{CSS}{css_imgs}</style></head><body>
<div class="top"><h1>{title}</h1><p>{intro}</p><nav>{nav}</nav></div>{body}<div class="note">{note}</div></body></html>'''

# ───────── shared bits ─────────
def dots(n, of): return '<div class="dots">' + ''.join(f'<span class="{"on" if i < n else ""}"></span>' for i in range(of)) + '</div>'
def ticks(items): return '<div class="ticks">' + ''.join(f'<div>{ic("shield", "#2F4A34", 16, 2.1)}{t}</div>' for t in items) + '</div>'
def tabs(active, companion=False):
    items = [('chart' if companion else 'home', 'Home'), ('search', 'Search'), ('cal', 'Requests' if companion else 'Bookings'), ('msg', 'Messages'), ('user', 'Profile')]
    return '<div class="tabs">' + ''.join(f'<div class="{"on" if l == active else ""}">{ic(i, "currentColor", 22, 2.1 if l == active else 1.7)}{l}</div>' for i, l in items) + '</div>'
def bar(title, right=''): return f'<div class="bar">{ic("back", "#0E110D", 22)}<div class="t">{title}</div>{right}</div>'
def setup(img, line, sub, n, of, title, body, kind='Member'):
    return (f'<div class="hero i-{img}" style="height:210px"><div class="wm">prsnn<i>.</i></div><div class="in"><div class="h2" style="color:#FAF9F6">{line}</div><div class="sm" style="opacity:.92;margin-top:3px">{sub}</div></div></div>'
            f'<div class="sheet">{dots(n, of)}<div><div class="step">Step {n} of {of}{" · " + kind if kind == "Companion" else ""}</div><div class="h2" style="margin-top:2px">{title}</div></div>{body}</div>')
def opts(items, on):
    return '<div class="col" style="gap:8px">' + ''.join(f'<div class="opt{" on" if t == on else ""}"><div><div class="h3">{t}</div>{"<div class=sm style=color:var(--muted)>" + d + "</div>" if d else ""}</div><div class="rd"></div></div>' for t, d in items) + '</div>'
def keypad(): return '<div class="keys">' + ''.join(f'<span>{k}</span>' for k in '123456789') + '<span></span><span>0</span><span>⌫</span></div>'
FITS = {1: '☕ Coffee or a walk', 2: '🍽️ Lunch and a long chat', 3: '🎬 A movie and dinner', 4: '🧭 Explore an area', 5: '🛍️ Shopping, then food', 6: '🌳 Half a day out', 8: '🚗 A full day out', 12: '🏞️ A day trip'}
def pk(h, on=False, comp=False):
    """Price card: duration, total, per-hour vs ₹399, saving %, value bar, what it fits."""
    p = PRICES[h]; per = round(p / h); save = 399 * h - p; pct = round(save * 100 / (399 * h))
    tag = '<span class="rib">Suggested</span>' if h == 4 and not comp else ''
    tick = f'<span class="tk">{ic("check", "#fff", 11, 3.2)}</span>' if on else '<span class="tk off"></span>'
    head = f'<div class="row between"><span class="du">{h}<small>{" hr" if h == 1 else " hrs"}</small></span>{tick}</div>'
    if comp:
        body = f'<div class="pr">{inr(p)}</div><div class="get">You get <b>{inr(share(p))}</b></div><div class="ft">{FITS[h]}</div>'
    else:
        body = (f'<div class="pr">{inr(p)}</div><div class="per">{inr(per)}/hr' + (f' <s>₹399</s>' if h > 1 else '') + '</div>'
                + (f'<div class="sv2">Save {inr(save)} ({pct}%)</div>' if h > 1 else '<div class="sv2 n">Try it out</div>')
                + f'<div class="vb"><i style="width:{max(12, min(100, pct * 4))}%"></i></div><div class="ft">{FITS[h]}</div>')
    return f'<div class="pk2{" on" if on else ""}">{tag}{head}{body}</div>'
def pkrow(h, on=False):
    """Wide price row for lists of long bookings."""
    p = PRICES[h]; save = 399 * h - p; pct = round(save * 100 / (399 * h))
    tick = f'<span class="tk">{ic("check", "#fff", 11, 3.2)}</span>' if on else '<span class="tk off"></span>'
    return (f'<div class="pk2 row{" on" if on else ""}" style="align-items:center;gap:10px"><span class="du">{h}<small> hrs</small></span>'
            f'<div style="flex:1"><div class="pr" style="font-size:17px">{inr(p)} <span class="per">{inr(round(p / h))}/hr</span></div><div class="ft" style="margin:0">{FITS[h]}</div></div>'
            f'<div style="text-align:right"><div class="sv2">−{pct}%</div>{tick}</div></div>')
def chat_screen(name, initials, msgs, img=None, when='Sat 15 Nov · 4:00–6:00 PM'):
    av = f'<div class="av {"i-" + img if img else ""}" style="width:34px;height:34px">{"" if img else initials}</div>'
    bubbles = ''.join(f'<div class="bub {w}">{t}<div class="xs" style="opacity:.6;margin-top:3px;text-align:right">{tm}</div></div>' for w, t, tm in msgs)
    return (f'<div class="bar" style="gap:10px">{ic("back", "#0E110D", 22)}{av}<div style="flex:1"><div class="h3">{name}</div><div class="xs mut">{when}</div></div></div>'
            f'<div class="pad" style="padding-top:6px;gap:8px"><div class="card sm mut" style="background:var(--green50);border-color:var(--mossSoft);text-align:center">{ic("shield", "#2F4A34", 14)} Meet in public places. Don’t share phone numbers, addresses or other personal details, and keep politics and religion out of it — keep it about the plan. Numbers are hidden automatically.</div>{bubbles}</div>'
            f'<div class="foot row"><div class="field" style="flex:1;height:42px"><span class="mut sm">Type a message…</span></div><div class="av" style="background:var(--moss);color:#fff">{ic("send", "#fff", 18)}</div></div>')

# ───────── MEMBERS ─────────
M = []
signup = [
 ('Welcome|Full-bleed photo carousel (coffee, walks, events). The promise in one line.',
  f'<div class="hero i-together" style="flex:1"><div class="wm">prsnn<i>.</i></div><div class="in" style="bottom:22px"><div class="h1" style="color:#FAF9F6;font-size:28px">Never go alone.</div><div class="sm" style="opacity:.92;margin:6px 0 16px">Book a verified companion for coffee, walks and events in Hyderabad — from ₹399.</div><div class="row" style="gap:5px;margin-bottom:14px"><i style="width:16px;height:5px;border-radius:3px;background:#fff"></i><i style="width:5px;height:5px;border-radius:3px;background:#ffffff88"></i><i style="width:5px;height:5px;border-radius:3px;background:#ffffff88"></i></div><div class="btn">Get started →</div><div class="btn ghost" style="color:#FAF9F6">I already have an account</div></div></div>', False),
 ('I’m here to…|Two photo cards. Members tap “Find company”.',
  '<div class="pad"><div class="wm">prsnn<i>.</i></div><div class="h1">I’m here to…</div>'
  '<div class="tile i-coffee" style="height:190px;border:3px solid var(--moss)"><span style="font-size:17px">Find company<small>Book verified people for coffee, walks and events</small></span></div>'
  '<div class="tile i-evening" style="height:190px"><span style="font-size:17px">Earn as a companion<small>Spend time with people, on your schedule</small></span></div></div>', False),
 ('Your mobile number|Small photo header, one field. Code comes on WhatsApp.',
  f'<div class="hero i-park" style="height:200px"><div class="wm">prsnn<i>.</i></div><div class="in"><div class="h2" style="color:#FAF9F6">Welcome to prsnn.</div><div class="sm" style="opacity:.9">Log in or sign up in seconds.</div></div></div><div class="sheet"><div><div class="lbl">Mobile number</div><div class="field on"><span>🇮🇳 +91</span><span style="font-weight:500">98765 43210</span></div><div class="sm mut" style="margin-top:6px">We’ll send a 6-digit code on WhatsApp.</div></div><div class="btn">Send code</div><div class="btn ghost">Log in with PIN</div>{ticks(["Verified companions only","Your number is never shown to anyone"])}</div>', False),
 ('Enter the code|Auto-fills from WhatsApp/SMS; resend timer; SMS backup.',
  f'{bar("")}<div class="pad" style="padding-top:8px"><div class="h1">Enter the code</div><div class="mut sm">Sent on WhatsApp to +91 98765 43210</div><div class="boxes"><span class="on">4</span><span class="on">8</span><span class="on">2</span><span>6</span><span></span><span></span></div><div class="sm mut">Resend in 24s · <span style="color:var(--moss);font-weight:600">Send by SMS instead</span></div><div class="btn dis" style="margin-top:auto">Verify</div></div>', False),
 ('Name|Design A sheet. First name only is shown to companions.',
  setup('coffee', 'Never go alone.', 'Coffee, walks and events — from ₹399.', 1, 7, 'First, what’s your name?',
   f'<div><div class="lbl">Full name</div><div class="field on"><div class="av" style="width:32px;height:32px;font-size:12px">MJ</div><span style="font-weight:500">Mukarram Jah</span></div><div class="sm mut" style="margin-top:5px">Companions only see your first name.</div></div><div class="btn">Continue →</div>{ticks(["Every companion ID-checked by our team","Public places only · numbers stay private","Full refund if no one accepts"])}'), False),
 ('NEW|What would you like to do first?|Pick activities. Home opens on them and highlights the 4-hour package.',
  f'<div class="pad">{dots(2, 7)}<div><div class="step">Step 2 of 7</div><div class="h2">What would you like to do first, Mukarram?</div></div>'
  '<div class="g2"><div class="tile i-coffee" style="height:92px;outline:3px solid var(--moss)"><span>Coffee &amp; talk<small>from ₹399</small></span></div><div class="tile i-walks" style="height:92px"><span>City walks<small>Old City, KBR Park</small></span></div><div class="tile i-events" style="height:92px;outline:3px solid var(--moss)"><span>Events &amp; gigs<small>don’t go alone</small></span></div><div class="tile i-study" style="height:92px"><span>Study buddy<small>stay on task</small></span></div></div>'
  '<div class="card row between"><div><div class="xs mut">Popular choice</div><div style="font-weight:700;font-size:17px">4 hours · ₹1,299</div><div class="xs mut">₹325/hour · save ₹297</div></div><span class="pill">Best value</span></div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
 ('I am|Photo header stays; quick single tap moves on.',
  setup('walks', 'Real people, real moments.', 'Tell us a little about you.', 3, 7, 'I am', opts([('Woman', ''), ('Man', ''), ('Non-binary', '')], 'Man')), False),
 ('Show me|Who you’d like to see. Change any time.',
  setup('events', 'Company that fits you.', 'You choose who you see.', 4, 7, 'Show me', opts([('Women', ''), ('Men', ''), ('Non-binary people', ''), ('Everyone', '')], 'Everyone')), False),
 ('Who can see your photo?|Locked is recommended: photo shows only after a paid booking.',
  setup('cozy', 'Your privacy, your call.', 'Nothing is shown without your OK.', 5, 7, 'Who can see your photo?',
   opts([('Open', 'Everyone sees your photo and full name.'), ('Locked · recommended', 'A blurred placeholder and first name until a booking is paid.')], 'Locked · recommended')), False),
 ('Your city|Most-used cities first; search for any Indian city.',
  setup('park', 'Find company near you.', 'We show companions from your city first.', 6, 7, 'Your city',
   '<div class="field"><span class="mut">'+ic('search','#8E8A7E',16)+' Search city</span></div><div class="col" style="gap:6px">' + ''.join(f'<div class="opt{" on" if c == "Hyderabad" else ""}" style="padding:10px 12px"><div class="h3" style="font-size:14px">{c}</div><span class="xs mut" style="margin-left:auto">{s}</span></div>' for c, s in [('Hyderabad', 'Telangana'), ('Bengaluru', 'Karnataka'), ('Mumbai', 'Maharashtra')]) + '</div>'), False),
 ('Your area|Chips of Hyderabad areas; skip allowed.',
  setup('walks', 'Almost there.', 'Companions near you show up first.', 7, 7, 'Your area in Hyderabad',
   '<div class="chips">' + ''.join(f'<span class="chip{" on" if a == "Gachibowli" else ""}">{a}</span>' for a in ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Hitech City', 'Tolichowki', 'Old City', 'Begumpet', 'Secunderabad']) + '</div><div class="btn ghost" style="margin-top:auto">Skip for now</div>'), False),
 ('Set a PIN|Quick, secure unlock on this phone.',
  f'<div class="pad" style="text-align:center;align-items:center"><div class="sm" style="align-self:flex-end;color:var(--moss);font-weight:600">Skip</div><div class="ok" style="margin-top:10px">{ic("lock", "#fff", 28)}</div><div class="h1">Set a 4-digit PIN</div><div class="mut sm">Open prsnn quickly and securely on this phone.</div><div class="pdots" style="margin:10px 0"><i class="on"></i><i class="on"></i><i></i><i></i></div>{keypad()}</div>', False),
]
discover = [
 ('Home|Search, categories, verified companions near you, ideas to book.',
  f'<div class="pad" style="gap:12px"><div class="row between"><div class="wm">prsnn<i>.</i></div><div class="row sm">{ic("pin", "#0E110D", 15)}Hyderabad {ic("bell", "#0E110D", 20)}</div></div><div class="field"><span class="mut sm">{ic("search", "#8E8A7E", 15)} Search companions, activities…</span></div>'
  '<div class="chips hs">' + ''.join(f'<span class="chip{" on" if c == "Coffee" else ""}">{c}</span>' for c in ['Coffee', 'Walks', 'Events', 'Study', 'Food']) + '</div>'
  '<div class="row between"><div class="h3">Verified near you</div><span class="sm" style="color:var(--moss);font-weight:600">See all</span></div>'
  '<div class="row" style="gap:9px;overflow:hidden">' + ''.join(f'<div style="flex:none;width:128px" class="card" ><div class="img {c}" style="height:110px;border-radius:12px;margin:-4px -4px 6px"></div><div class="h3" style="font-size:14px">{n}</div><div class="xs mut">{a}</div><div class="sm" style="color:var(--moss);font-weight:600">from ₹399</div></div>' for c, n, a in [('i-cozy', 'Ayesha', 'Banjara Hills'), ('i-locked', 'Fatima', 'Tolichowki')]) + '</div>'
  '<div class="h3">Plan something special</div><div class="g2"><div class="tile i-coffee" style="height:74px"><span>Coffee</span></div><div class="tile i-events" style="height:74px"><span>Events</span></div></div></div>' + tabs('Home'), False),
 ('Search|Filters for area, activity, “show me”; list with prices.',
  f'<div class="pad" style="gap:10px"><div class="h1">Search</div><div class="field on"><span class="sm">{ic("search", "#0E110D", 15)} coffee</span></div><div class="chips hs"><span class="chip on">Hyderabad</span><span class="chip">Area</span><span class="chip">Available today</span><span class="chip">4 h+</span></div>'
  + ''.join(f'<div class="row card" style="padding:10px"><div class="av {c}" style="width:56px;height:56px"></div><div style="flex:1"><div class="h3">{n}</div><div class="xs mut">{a}</div><div class="xs" style="color:var(--g4)">{t}</div></div><div style="text-align:right">{ic("heart", "#C45C2A", 18)}<div class="sm" style="color:var(--moss);font-weight:600">from ₹399</div></div></div>' for c, n, a, t in [('i-cozy', 'Ayesha Khan', 'Banjara Hills', 'Coffee · Walks · Books'), ('i-locked', 'Fatima', 'Tolichowki', 'Study · Coffee'), ('i-park', 'Rohan Mehta', 'Jubilee Hills', 'Events · Cricket')]) + '</div>' + tabs('Search'), False),
 ('Companion profile|Big photo, verified badge, interests, packages, availability; sticky Book bar.',
  f'<div class="hero i-cozy" style="height:250px"><div style="position:absolute;top:38px;left:14px;width:34px;height:34px;border-radius:17px;background:#FAF9F6;display:flex;align-items:center;justify-content:center">{ic("back", "#0E110D", 18)}</div></div><div class="sheet" style="gap:9px"><div class="row"><div class="h1">Ayesha Khan</div>{ic("shield", "#2F4A34", 20, 2.1)}</div><div class="sm mut">{ic("pin", "#6A665C", 13)} Banjara Hills · ID verified by prsnn · public places only</div><div class="chips"><span class="chip">☕ Coffee</span><span class="chip">🚶 Walks</span><span class="chip">📚 Books</span></div><div class="sm">Café explorer and long-walk person. Happy to show you the city’s quiet corners.</div><div class="h3">Durations &amp; prices</div><div class="g2">{pk(1)}{pk(4)}</div></div><div class="foot row between"><div><b style="font-size:17px">from ₹399</b><div class="xs mut">longer costs less per hour</div></div><div class="btn" style="padding:0 22px">Book now</div></div>', False),
]
book = [
 ('Choose your time|Package cards (4 h = Popular choice), calendar, start times.',
  f'{bar("Book a time")}<div class="pad" style="padding-top:4px;gap:9px"><div class="h2">Choose your time</div><div class="g2">{pk(1)}{pk(2)}{pk(4, True)}{pk(6)}</div><div class="h3">Pick a day</div><div class="g7">' + ''.join(f'<span class="xs mut">{d}</span>' for d in 'SMTWTFS') + ''.join(f'<span class="d{" x" if i < 3 else ""}{" on" if i == 6 else ""}">{i + 9}</span>' for i in range(14)) + '</div><div class="g3">' + ''.join(f'<span class="slot{" on" if t == "4:00 PM" else ""}">{t}</span>' for t in ['11:00 AM', '1:00 PM', '4:00 PM']) + f'</div></div><div class="foot"><div class="btn">Continue · ₹1,299</div></div>', False),
 ('Review & pay|Everything on one page: price, saving, how it works, refund terms.',
  f'{bar("Review &amp; pay")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card row"><div class="av i-cozy" style="width:48px;height:48px"></div><div><div class="h3">Ayesha Khan</div><div class="xs mut">Sat 15 Nov · 4:00–8:00 PM (4 hours)</div></div></div><div class="card col" style="gap:7px"><div class="row between sm"><span>4 hours package · ₹325/hour</span><b>₹1,299</b></div><div class="row between sm" style="color:var(--moss)"><span>You save vs. hourly</span><b>₹297</b></div><div class="row between sm"><span>Booking fee</span><span>₹0</span></div><div class="row between" style="border-top:1px solid var(--line);padding-top:7px"><b>Total you pay</b><b style="font-size:17px">₹1,299</b></div></div><div class="card sm col" style="gap:5px"><b>How it works</b><span class="mut">1 · You pay now — your booking is reserved.</span><span class="mut">2 · Ayesha confirms; if she can’t, a similar verified companion is offered.</span><span class="mut">3 · Nobody accepts → full refund.</span></div><div class="row sm"><span style="width:20px;height:20px;border-radius:6px;background:var(--moss);display:flex;align-items:center;justify-content:center">{ic("check", "#fff", 14, 3)}</span>I agree to the cancellation &amp; refund terms</div></div><div class="foot"><div class="btn">{ic("lock", "#fff", 16)} Pay ₹1,299</div></div>', False),
 ('Payment|UPI first; cards, net banking, wallets. Secure.',
  f'{bar("Payment")}<div class="pad" style="padding-top:4px"><div class="card" style="text-align:center"><div class="xs mut">Secure payment</div><div style="font:700 30px DM Sans;margin:4px 0">₹1,299</div><div class="xs mut">Booking with Ayesha · Sat 15 Nov, 4 PM</div></div><div class="grp">' + ''.join(f'<div class="li"><div class="t"><div class="h3" style="font-size:14px">{a}</div><div class="xs mut">{b}</div></div><div class="opt{" on" if a == "UPI" else ""}" style="border:0;padding:0;background:none"><div class="rd"></div></div></div>' for a, b in [('UPI', 'GPay, PhonePe, Paytm'), ('Card', 'Visa, Mastercard, RuPay'), ('Net banking', 'All major banks'), ('Wallets', 'Paytm, Amazon Pay')]) + f'</div><div class="xs mut" style="text-align:center">If no companion accepts, you’re refunded in full.</div></div><div class="foot"><div class="btn">Pay ₹1,299</div></div>', False),
 ('Payment received|Clear next step and live status.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:70px"><div class="ok">{ic("check", "#fff", 34, 3)}</div><div class="h1">Payment received</div><div class="sm mut">We’ve sent your booking to Ayesha. You’ll be notified the moment it’s confirmed.</div><div class="card" style="width:100%;text-align:left"><div class="tl"><div><i class="on"></i>Booked</div><div><i class="on"></i>Paid ₹1,299</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i><span>Finding your companion<br><span class="xs mut">Offered to Ayesha · 3 h left to answer</span></span></div><div><i></i>Confirmed</div></div></div><div class="btn" style="width:100%;margin-top:auto">View booking</div><div class="btn ghost">Back to home</div></div>', False),
]
after = [
 ('My bookings|Upcoming / Past / Cancelled; status at a glance.',
  f'<div class="pad"><div class="h1">My bookings</div><div class="row" style="background:var(--mistDeep);border-radius:12px;padding:3px"><span class="chip on" style="flex:1;text-align:center">Upcoming</span><span style="flex:1;text-align:center" class="sm mut">Past</span><span style="flex:1;text-align:center" class="sm mut">Cancelled</span></div>'
  + ''.join(f'<div class="card col"><div class="row"><div class="av {c}" style="width:46px;height:46px"></div><div style="flex:1"><div class="h3">{n}</div><span class="pill{p}">{s}</span></div><b>{amt}</b></div><div class="xs mut">{ic("cal", "#6A665C", 13)} {w}</div><div class="row" style="gap:8px"><div class="btn sec" style="flex:1;height:38px;font-size:13px">View</div>{"<div class=btn style=flex:1;height:38px;font-size:13px>Chat</div>" if s == "Confirmed" else ""}</div></div>' for c, n, s, p, amt, w in [('i-cozy', 'Ayesha Khan', 'Confirmed', '', '₹1,299', 'Sat 15 Nov · 4:00–8:00 PM'), ('i-park', 'Rohan', 'Paid · finding companion', ' w', '₹699', 'Tue 18 Nov · 11:00 AM–1:00 PM')]) + '</div>' + tabs('Bookings'), False),
 ('Booking details|Status timeline, chat, cancel with the exact refund shown, report a problem.',
  f'{bar("Booking details")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card row"><div class="av i-cozy" style="width:52px;height:52px"></div><div style="flex:1"><div class="h3">Ayesha Khan</div><span class="pill">Confirmed</span></div></div><div class="card sm col" style="gap:5px"><span>{ic("cal", "#6A665C", 13)} Sat 15 Nov · 4:00–8:00 PM</span><span>{ic("rupee", "#6A665C", 13)} ₹1,299 paid</span><span class="mut">Booking #A6F7ED</span></div><div class="card"><div class="tl"><div><i class="on"></i>Booked</div><div><i class="on"></i>Paid</div><div><i class="on"></i>Confirmed — chat is open</div></div></div><div class="btn">{ic("msg", "#fff", 16)} Chat with Ayesha</div><div class="btn sec">Cancel booking <span class="xs mut">· ₹1,104 back</span></div><div class="btn ghost">{ic("flag", "#2F4A34", 15)} Report a problem</div></div>', False),
 ('Chat|Opens once confirmed and paid. Numbers are hidden.',
  chat_screen('Ayesha Khan', 'AK', [('them', 'Hi Mukarram! Coffee at Roastery, Banjara Hills?', '3:12 pm'), ('me', 'Perfect, see you at 4!', '3:14 pm'), ('them', 'Call me on ••••••••••', '3:15 pm')], 'cozy', 'Sat 15 Nov · 4:00–8:00 PM'), False),
 ('Notifications|Bookings and payments, newest first.',
  f'{bar("Notifications", "<span class=sm style=color:var(--moss);font-weight:600>Clear</span>")}<div class="pad" style="padding-top:4px;gap:8px">' + ''.join(f'<div class="row card" style="{"background:var(--green50);border-color:var(--mossSoft)" if u else ""}"><div class="av" style="width:36px;height:36px">{ic(i, "#2F4A34", 17)}</div><div style="flex:1"><div class="sm">{t}</div><div class="xs mut">{w}</div></div>{"<i style=width:8px;height:8px;border-radius:4px;background:var(--clay)></i>" if u else ""}</div>' for i, t, w, u in [('check', 'Ayesha confirmed your booking #A6F7ED. Chat is open.', '2 min ago', 1), ('rupee', 'Payment received for booking #A6F7ED.', '20 min ago', 1), ('sparkle', 'New companions near Gachibowli.', '3 days ago', 0)]) + '</div>', False),
 ('Profile|Personal info, privacy, saved, PIN, help; become a companion.',
  f'<div class="pad"><div class="h1">My profile</div><div class="row"><div class="av" style="width:64px;height:64px;font-size:22px">MJ</div><div><div class="h2">Mukarram Jah</div><div class="sm" style="color:var(--moss)">{ic("shield", "#2F4A34", 14)} Verified member</div><div class="xs mut">+91 98765 43210</div></div></div>'
  '<div class="tile i-evening" style="height:70px"><span>Become a companion<small>Earn on your own time →</small></span></div>'
  '<div class="grp">' + ''.join(f'<div class="li">{ic(i, "#2F4A34", 18)}<div class="t sm">{t}</div>{ic("chev", "#8E8A7E", 16)}</div>' for i, t in [('user', 'Personal information'), ('lock', 'Privacy & preferences'), ('heart', 'Saved companions'), ('bell', 'Notifications'), ('help', 'Help & support')]) + '</div></div>' + tabs('Profile'), False),
]
members_html = page('prsnn for members — every screen',
  'The full journey for people who book: sign-up (design A photo header), discovering companions, booking and paying, and everything after. New screens are marked in orange. All prices are from your price list.',
  [('m-signup', 'Sign up', 'Welcome → number → code → 7 quick setup steps → PIN', signup),
   ('m-discover', 'Discover', 'Home, search and a companion’s profile', discover),
   ('m-book', 'Book & pay', 'Pick a package and time, review, pay', book),
   ('m-after', 'After booking & account', 'Bookings, details, chat, notifications, profile', after)],
  '<b>What sells more:</b> the activity pick (step 6) puts the right companions on Home; “Popular choice · 4 hours” and the “save ₹297” line nudge bigger bookings; the trust points and refund promise remove the last doubts before paying. Tell me what to change, or “approve members”.')

# ───────── COMPANIONS ─────────
C = []
csign = [
 ('Welcome|The companion side leads with freedom and money.',
  f'<div class="hero i-evening" style="flex:1"><div class="wm">prsnn<i>.</i></div><div class="in" style="bottom:22px"><div class="h1" style="color:#FAF9F6;font-size:27px">Get paid to show up as yourself.</div><div class="sm" style="opacity:.92;margin:6px 0 16px">Coffee, walks and events with verified members — on your schedule. You keep 80%.</div><div class="btn">Become a companion →</div><div class="btn ghost" style="color:#FAF9F6">I already have an account</div></div></div>', False),
 ('I’m here to…|“Earn as a companion” selected.',
  '<div class="pad"><div class="wm">prsnn<i>.</i></div><div class="h1">I’m here to…</div><div class="tile i-coffee" style="height:190px"><span style="font-size:17px">Find company<small>Book verified people</small></span></div><div class="tile i-evening" style="height:190px;border:3px solid var(--moss)"><span style="font-size:17px">Earn as a companion<small>Spend time with people, on your schedule</small></span></div></div>', False),
 ('Your mobile number|Same quick login as members.',
  f'<div class="hero i-evening" style="height:200px"><div class="wm">prsnn<i>.</i></div><div class="in"><div class="h2" style="color:#FAF9F6">Start earning with prsnn.</div><div class="sm" style="opacity:.9">Sign up with your mobile number.</div></div></div><div class="sheet"><div><div class="lbl">Mobile number</div><div class="field on"><span>🇮🇳 +91</span><span style="font-weight:500">90000 11111</span></div><div class="sm mut" style="margin-top:6px">We’ll send a 6-digit code on WhatsApp.</div></div><div class="btn">Send code</div>{ticks(["Your number is never shown to members","Free to join · no fees"])}</div>', False),
 ('Enter the code|Auto-fills from WhatsApp/SMS; SMS backup.',
  f'{bar("")}<div class="pad" style="padding-top:8px"><div class="h1">Enter the code</div><div class="mut sm">Sent on WhatsApp to +91 90000 11111</div><div class="boxes"><span class="on">7</span><span class="on">3</span><span>1</span><span></span><span></span><span></span></div><div class="sm mut">Resend in 18s · <span style="color:var(--moss);font-weight:600">Send by SMS instead</span></div><div class="btn dis" style="margin-top:auto">Verify</div></div>', False),
 ('Name|Design A sheet with the 80% promise.',
  setup('evening', 'Get paid to show up as yourself.', 'Your time, your rules.', 1, 9, 'First, what’s your name?',
   f'<div><div class="lbl">Full name</div><div class="field on"><div class="av" style="width:32px;height:32px;font-size:12px">AR</div><span style="font-weight:500">Ananya Rao</span></div></div><div class="card row" style="background:var(--green50);border-color:var(--mossSoft);padding:9px 11px">{ic("rupee", "#2F4A34", 18)}<span class="sm"><b>You keep 80%</b> — ₹1,039 for a 4-hour booking</span></div><div class="btn">Continue →</div>{ticks(["You choose days, hours and durations","Every booking is paid before you meet","Verified members · public places only"])}', 'Companion'), False),
 ('NEW|What you keep|Real payouts and an honest example — right before the ID step.',
  f'<div class="pad">{dots(2, 9)}<div><div class="step">Step 2 of 9 · Companion</div><div class="h2">Here’s what you keep, Ananya</div></div><div class="card col" style="gap:0">' + ''.join(f'<div class="row between" style="padding:7px 0;border-bottom:1px solid var(--line)"><span class="sm">{h} {"hour" if h == 1 else "hours"}</span><b>{inr(share(PRICES[h]))}</b></div>' for h in [1, 2, 4, 12]) + '</div><div class="sm mut">How often could you go out?</div><div class="row" style="gap:6px"><span class="chip" style="flex:1;text-align:center">1 day/wk</span><span class="chip on" style="flex:1;text-align:center">3 days/wk</span><span class="chip" style="flex:1;text-align:center">Weekends</span></div>'
  f'<div class="card" style="background:var(--moss);color:#FAF9F6;border:0"><div class="xs" style="opacity:.85">Example: one 4-hour booking, 3 days a week</div><div style="font:600 27px Lora">{inr(share(1299) * 12)} a month</div><div class="xs" style="opacity:.8">From today’s prices — not a promise.</div></div><div class="btn" style="margin-top:auto">Continue →</div></div>', True),
 ('I am|Single tap; members choose who they see.',
  setup('cozy', 'Members choose who they see.', 'So the right people find you.', 3, 9, 'I am', opts([('Woman', ''), ('Man', ''), ('Non-binary', '')], 'Woman'), 'Companion'), False),
 ('Who can see your photo?|Locked recommended — photo only after a paid booking.',
  setup('cozy', 'Stay in control.', 'Your photo, your choice.', 4, 9, 'Who can see your photo?', opts([('Open', 'Members see your photo — more bookings.'), ('Locked · recommended', 'First name and a placeholder until a booking is paid.')], 'Open'), 'Companion'), False),
 ('City & area|One screen: city, then area chips.',
  setup('park', 'Work close to home.', 'Bookings come from your area first.', 5, 9, 'Where do you meet people?',
   '<div class="field on"><span>Hyderabad</span><span class="xs mut" style="margin-left:auto">Telangana</span></div><div class="chips">' + ''.join(f'<span class="chip{" on" if a == "Gachibowli" else ""}">{a}</span>' for a in ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Hitech City', 'Old City']) + '</div><div class="btn" style="margin-top:auto">Continue →</div>', 'Companion'), False),
 ('About you|A short bio and interests — this is what members read.',
  f'<div class="pad">{dots(6, 9)}<div><div class="step">Step 6 of 9 · Companion</div><div class="h2">Tell members about you</div></div><div class="row"><div class="av i-cozy" style="width:64px;height:64px"></div><div class="sm" style="color:var(--moss);font-weight:600">{ic("cam", "#2F4A34", 15)} Change photo</div></div><div class="field" style="height:84px;align-items:flex-start;padding-top:10px"><span class="sm">Café hopper and long-walk person. Happy to show you the city’s quiet corners.</span></div><div class="lbl">What you enjoy</div><div class="chips">' + ''.join(f'<span class="chip{" on" if t in ("Coffee", "Walks", "Books") else ""}">{t}</span>' for t in ['Coffee', 'Walks', 'Events', 'Books', 'Food', 'Study', 'Music']) + '</div><div class="btn" style="margin-top:auto">Continue →</div></div>', False),
 ('Durations you offer|Prices are fixed; you choose durations and see your share.',
  f'<div class="pad">{dots(7, 9)}<div><div class="step">Step 7 of 9 · Companion</div><div class="h2">Which bookings do you want?</div><div class="sm mut">Same prices for everyone. Longer bookings earn more.</div></div><div class="g2">{pk(1, True, True)}{pk(2, True, True)}{pk(4, True, True)}{pk(6, False, True)}{pk(8, False, True)}{pk(12, False, True)}</div><div class="btn" style="margin-top:auto">Continue →</div></div>', False),
 ('Availability|Days and hours you’re free (7 AM–10 PM).',
  f'<div class="pad">{dots(8, 9)}<div><div class="step">Step 8 of 9 · Companion</div><div class="h2">When are you free?</div></div><div class="g7" style="gap:5px">' + ''.join(f'<span class="d{" on" if d in "MWFS" else ""}" style="height:38px;border-radius:12px;border:1px solid var(--line)">{d}</span>' for d in 'MTWTFSS') + '</div><div class="g2"><div><div class="lbl">From</div><div class="field">10:00 AM</div></div><div><div class="lbl">Until</div><div class="field">8:00 PM</div></div></div><div class="card sm" style="background:var(--green50);border-color:var(--mossSoft)">Tip: weekends and evenings get the most requests.</div><div class="btn" style="margin-top:auto">Continue →</div></div>', False),
 ('Verify your ID|Front, back and a selfie. Reviewed by our team.',
  f'<div class="pad">{dots(9, 9)}<div><div class="step">Step 9 of 9 · Companion</div><div class="h2">Verify your ID</div><div class="sm mut">Aadhaar, PAN, passport or driving licence. Only our team sees it.</div></div><div class="g2"><div class="upl done i-locked">{ic("check", "#fff", 22, 3)}Front</div><div class="upl">{ic("id", "#6A665C", 22)}ID back</div></div><div class="upl">{ic("cam", "#6A665C", 22)}Take a selfie</div>{ticks(["Stored privately, never shown to members", "Usually reviewed within 24 hours"])}<div class="btn dis">Submit for review</div></div>', False),
 ('Under review|What happens next while we check.',
  f'<div class="pad" style="align-items:center;text-align:center;padding-top:70px"><div class="ok" style="background:var(--mossSoft);color:var(--moss)">{ic("shield", "#2F4A34", 32)}</div><div class="h1">You’re almost live</div><div class="sm mut">We’re checking your ID. We’ll message you on WhatsApp when you’re verified.</div><div class="card" style="width:100%;text-align:left"><div class="tl"><div><i class="on"></i>Profile done</div><div><i class="on"></i>ID submitted</div><div><i class="on" style="background:var(--clay);border-color:var(--clay)"></i>Review by our team</div><div><i></i>Live — members can book you</div></div></div><div class="btn sec" style="width:100%;margin-top:auto">Preview my profile</div></div>', False),
 ('Set a PIN|Open the app in a tap to answer offers fast.',
  f'<div class="pad" style="text-align:center;align-items:center"><div class="sm" style="align-self:flex-end;color:var(--moss);font-weight:600">Skip</div><div class="ok" style="margin-top:10px">{ic("lock", "#fff", 28)}</div><div class="h1">Set a 4-digit PIN</div><div class="mut sm">Answer offers quickly — open prsnn in a tap.</div><div class="pdots" style="margin:10px 0"><i class="on"></i><i></i><i></i><i></i></div>{keypad()}</div>', False),
]
cwork = [
 ('Dashboard|This month at a glance and offers waiting for an answer.',
  f'<div class="pad" style="gap:10px"><div class="row"><div class="av i-cozy" style="width:48px;height:48px"></div><div style="flex:1"><div class="xs mut">Welcome back</div><div class="h2">Ananya</div><div class="xs" style="color:var(--moss)">● Live · accepting bookings</div></div>{ic("bell", "#0E110D", 21)}</div><div class="row" style="gap:7px"><div class="stat"><b>6</b><span class="xs mut">Sessions</span></div><div class="stat"><b>₹5,034</b><span class="xs mut">Earned</span></div><div class="stat"><b>1</b><span class="xs mut">Waiting</span></div></div><div class="h3">Waiting for your answer</div>'
  f'<div class="card col" style="border-color:var(--clay)"><div class="row between"><div class="row"><div class="av" style="width:36px;height:36px">RT</div><div><div class="h3" style="font-size:14px">Riya</div><span class="pill w">Paid offer · 2 h 40 min left</span></div></div><div style="text-align:right"><b style="font-size:17px">₹559</b><div class="xs mut">you earn</div></div></div><div class="xs mut">{ic("cal", "#6A665C", 13)} Sat 15 Nov · 4:00–6:00 PM · Coffee</div><div class="row" style="gap:8px"><div class="btn sec" style="flex:1;height:38px;font-size:13px">Decline</div><div class="btn" style="flex:1;height:38px;font-size:13px">Accept</div></div></div>'
  '<div class="grp">' + ''.join(f'<div class="li">{ic(i, "#2F4A34", 18)}<div class="t sm">{t}</div>{ic("chev", "#8E8A7E", 16)}</div>' for i, t in [('cal', 'Upcoming bookings'), ('wallet', 'Earnings'), ('clock', 'Packages & availability')]) + '</div></div>' + tabs('Home', True), False),
 ('Offer details|Everything before you accept: time, place idea, what you earn, deadline.',
  f'{bar("New paid booking")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card" style="background:var(--claySoft);border-color:#ecc8b4;text-align:center"><div class="xs" style="color:var(--clay);font-weight:700">ANSWER WITHIN</div><div style="font:600 26px Lora;color:var(--clay)">2 h 40 min</div><div class="xs mut">Otherwise it goes to another companion.</div></div><div class="card row"><div class="av" style="width:46px;height:46px">RT</div><div><div class="h3">Riya</div><div class="xs mut">Verified member · Gachibowli</div></div></div><div class="card sm col" style="gap:5px"><span>{ic("cal", "#6A665C", 13)} Sat 15 Nov · 4:00–6:00 PM (2 h)</span><span>{ic("coffee" if False else "sparkle", "#6A665C", 13)} Coffee — “First time in Hyderabad!”</span><span>{ic("shield", "#6A665C", 13)} Already paid · public place</span></div><div class="card row between" style="background:var(--green50);border-color:var(--mossSoft)"><span class="sm">You earn</span><b style="font-size:20px">₹559</b></div></div><div class="foot row" style="gap:8px"><div class="btn sec" style="flex:1">Decline</div><div class="btn" style="flex:2">Accept booking</div></div>', False),
 ('Requests|Offers and confirmed bookings in one list.',
  f'<div class="pad"><div class="h1">Requests</div><div class="row" style="background:var(--mistDeep);border-radius:12px;padding:3px"><span class="chip on" style="flex:1;text-align:center">Upcoming</span><span style="flex:1;text-align:center" class="sm mut">Past</span></div>'
  + ''.join(f'<div class="card col"><div class="row"><div class="av" style="width:42px;height:42px">{ini}</div><div style="flex:1"><div class="h3">{n}</div><span class="pill{p}">{s}</span></div><b>{amt}</b></div><div class="xs mut">{ic("cal", "#6A665C", 13)} {w}</div></div>' for ini, n, s, p, amt, w in [('RT', 'Riya', 'Confirmed', '', '₹559', 'Sat 15 Nov · 4:00–6:00 PM'), ('KM', 'Karan', 'Offer · 4 h left', ' w', '₹1,039', 'Sun 16 Nov · 11:00 AM–3:00 PM'), ('IS', 'Imran', 'Confirmed', '', '₹319', 'Tue 18 Nov · 6:00–7:00 PM')]) + '</div>' + tabs('Requests', True), False),
 ('Booking details|Confirmed: chat, mark completed, cancel (member refunded in full).',
  f'{bar("Booking details")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card row"><div class="av" style="width:50px;height:50px">RT</div><div style="flex:1"><div class="h3">Riya Test</div><span class="pill">Confirmed</span></div><b>₹559</b></div><div class="card sm col" style="gap:5px"><span>{ic("cal", "#6A665C", 13)} Sat 15 Nov · 4:00–6:00 PM</span><span>{ic("pin", "#6A665C", 13)} Meet in a public place you agree on</span><span class="mut">Booking #A6F7ED · paid by member</span></div><div class="btn">{ic("msg", "#fff", 16)} Chat with Riya</div><div class="btn sec">Mark completed</div><div class="btn ghost" style="color:#B3261E">Cancel booking</div></div>', False),
 ('Chat|Opens when the booking is confirmed. Numbers hidden.',
  chat_screen('Riya', 'RT', [('them', 'Hi! First time in Hyderabad — any café you love?', '2:02 pm'), ('me', 'Roastery in Banjara Hills, you’ll love it ☕', '2:05 pm'), ('them', 'Perfect, see you at 4!', '2:06 pm')]), False),
 ('Earnings|This month, per booking, what’s coming.',
  f'{bar("Earnings")}<div class="pad" style="padding-top:4px;gap:9px"><div class="card" style="background:var(--moss);color:#FAF9F6;border:0"><div class="xs" style="opacity:.85">November · paid sessions</div><div style="font:600 30px Lora">₹5,034</div><div class="xs" style="opacity:.85">6 sessions · you keep 80% of every booking</div></div><div class="row" style="gap:7px"><div class="stat"><b>₹1,598</b><span class="xs mut">Upcoming</span></div><div class="stat"><b>₹839</b><span class="xs mut">This week</span></div></div><div class="h3">Recent</div><div class="grp">' + ''.join(f'<div class="li"><div class="av" style="width:32px;height:32px;font-size:12px">{a}</div><div class="t"><div class="sm">{n}</div><div class="xs mut">{d}</div></div><b class="sm">{v}</b></div>' for a, n, d, v in [('IS', 'Imran · 1 hour', 'Tue 11 Nov', '₹319'), ('KM', 'Karan · 4 hours', 'Sun 9 Nov', '₹1,039'), ('PN', 'Priya · 2 hours', 'Sat 8 Nov', '₹559')]) + '</div></div>', False),
 ('Packages & availability|Edit any time; changes apply to new bookings.',
  f'{bar("Packages &amp; availability")}<div class="pad" style="padding-top:4px;gap:9px"><div class="h3">Durations you offer</div><div class="g3">' + ''.join(f'<span class="slot{" on" if h in (1, 2, 4) else ""}">{h} h</span>' for h in [1, 2, 3, 4, 6, 12]) + '</div><div class="h3">Days</div><div class="g7" style="gap:5px">' + ''.join(f'<span class="d{" on" if d in "MWFS" else ""}" style="height:34px;border-radius:11px;border:1px solid var(--line)">{d}</span>' for d in 'MTWTFSS') + '</div><div class="g2"><div><div class="lbl">From</div><div class="field">10:00 AM</div></div><div><div class="lbl">Until</div><div class="field">8:00 PM</div></div></div></div><div class="foot"><div class="btn">Save</div></div>', False),
 ('Notifications|Offers first — with a push to your phone.',
  f'{bar("Notifications")}<div class="pad" style="padding-top:4px;gap:8px">' + ''.join(f'<div class="row card" style="{"background:var(--green50);border-color:var(--mossSoft)" if u else ""}"><div class="av" style="width:36px;height:36px">{ic(i, "#2F4A34", 17)}</div><div style="flex:1"><div class="sm">{t}</div><div class="xs mut">{w}</div></div></div>' for i, t, w, u in [('cal', 'New paid 2-hour booking (you earn ₹559). Accept within 2.7 h.', 'just now', 1), ('shield', 'You’re verified. Members can now book you.', 'yesterday', 0), ('rupee', 'Booking #4C1A20 completed · ₹1,039 earned.', '2 days ago', 0)]) + '</div>', False),
 ('Profile|Public profile, verification, payouts, help.',
  f'<div class="pad"><div class="h1">My profile</div><div class="row"><div class="av i-cozy" style="width:64px;height:64px"></div><div><div class="h2">Ananya Rao</div><div class="sm" style="color:var(--moss)">{ic("shield", "#2F4A34", 14)} Verified companion</div><div class="xs mut">Gachibowli, Hyderabad</div></div></div><div class="btn sec">{ic("users", "#2F4A34", 16)} See my public profile</div><div class="grp">' + ''.join(f'<div class="li">{ic(i, "#2F4A34", 18)}<div class="t sm">{t}</div>{ic("chev", "#8E8A7E", 16)}</div>' for i, t in [('edit', 'Edit profile & photo'), ('clock', 'Packages & availability'), ('wallet', 'Earnings'), ('lock', 'Privacy'), ('help', 'Help & support')]) + '</div></div>' + tabs('Profile', True), False),
]
companions_html = page('prsnn for companions — every screen',
  'The full journey for people who earn: sign-up (design A, selling freedom and real payouts), the application with ID check, then offers, bookings, chat and earnings. New screens are marked in orange. Payouts are 80% of your price list.',
  [('c-signup', 'Sign up & apply', 'Welcome → number → code → 9 setup steps → review → PIN', csign),
   ('c-work', 'Getting booked', 'Dashboard, offers, requests, chat, earnings, availability, profile', cwork)],
  '<b>What sells more:</b> payouts are shown from the very first screen and again right before the ID upload (where people usually drop off); the dashboard puts the paid offer and its countdown on top so offers get accepted fast. Earnings figures in the mock-ups are illustrations. Tell me what to change, or “approve companions”.')

if __name__ == '__main__':
    (ROOT / 'preview/flow-members.html').write_text(members_html)
    (ROOT / 'preview/flow-companions.html').write_text(companions_html)
    print('members', len(members_html), 'companions', len(companions_html))
