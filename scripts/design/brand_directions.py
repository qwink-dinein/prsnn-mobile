"""Generates preview/brand-directions.html: four premium identity directions for prsnn.,
each rooted in Hyderabad (bidri metalwork, pearls, the Charminar arch, the old clubs).
For owner review. Run: python3 scripts/design/brand_directions.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images' / f'{n}.jpg').read_bytes()).decode()
PHOTO = {k: img(k) for k in ('coffee', 'evening', 'walks', 'together')}

FONTS = ('Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500',
         'Hanken+Grotesk:wght@400;500;600', 'Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300,100,1;0,9..144,400,100,1;1,9..144,300,100,1',
         'Schibsted+Grotesk:wght@400;500;600', 'Marcellus', 'Jost:wght@300;400;500', 'Gilda+Display', 'Manrope:wght@400;500;600;700')

# A jaali (pierced lattice) tile: eight-point stars, used as a whisper of texture.
def jaali(stroke, op=.18, size=44):
    s = size; c = s / 2; k = s * .2
    star = f'M{c},{k} L{c + k * .7},{c - k * .7} L{s - k},{c} L{c + k * .7},{c + k * .7} L{c},{s - k} L{c - k * .7},{c + k * .7} L{k},{c} L{c - k * .7},{c - k * .7} Z'
    return (f'<svg width="100%" height="100%" style="position:absolute;inset:0;opacity:{op}"><defs><pattern id="j{stroke[1:]}" width="{s}" height="{s}" patternUnits="userSpaceOnUse">'
            f'<path d="{star}" fill="none" stroke="{stroke}" stroke-width=".8"/><rect x="0" y="0" width="{s}" height="{s}" fill="none" stroke="{stroke}" stroke-width=".5"/></pattern></defs>'
            f'<rect width="100%" height="100%" fill="url(#j{stroke[1:]})"/></svg>')

ARCH = 'M10,100 V46 C10,22 28,6 50,2 C72,6 90,22 90,46 V100'

D = []

# ── 1. Bidri ─────────────────────────────────────────────
b = dict(bg='#1D2420', fg='#DCDFD9', silver='#B9BEB7', muted='#8E958D', paper='#E6E7E2', inkOnPaper='#1D2420')
D.append(dict(
  key='bidri', name='Bidri', pick=True,
  why='Hyderabad’s own luxury craft: blackened metal with fine silver inlay. Deep oxidised green-black, silver hairlines, a Bodoni wordmark sharp as engraving, and a cut diamond (Golconda) for the full stop. Quiet, expensive, unmistakably from this city.',
  colors=[('Bidri', b['bg']), ('Inlay silver', b['silver']), ('Polished', b['fg']), ('Patina', '#4E5A52'), ('Ash paper', b['paper'])],
  fonts=('Bodoni Moda', 'Hanken Grotesk'),
  css=f'''.bidri{{background:{b["bg"]};color:{b["fg"]}}}.bidri .lk{{font:italic 400 132px/1 "Bodoni Moda";letter-spacing:-2px;color:{b["fg"]}}}
.bidri .dia{{display:inline-block;width:20px;height:20px;background:linear-gradient(135deg,#F2F4F0,{b["silver"]} 55%,#7E847D);transform:rotate(45deg);margin-left:10px;vertical-align:4px}}
.bidri .disp{{font:italic 400 34px/1.15 "Bodoni Moda"}}.bidri .body{{font:400 15px/1.55 "Hanken Grotesk";color:{b["muted"]}}}
.bidri .rule{{height:1px;background:linear-gradient(90deg,transparent,{b["silver"]},transparent);margin:18px 0}}''',
  logo='<div class="lk">prsnn<span class="dia"></span></div><div class="rule"></div><div style="font:400 15px Hanken Grotesk;letter-spacing:.5px;color:#8E958D">Good company, on your terms.</div>',
  icon=f'<div style="width:100%;height:100%;background:{b["bg"]};position:relative;display:flex;align-items:center;justify-content:center">{jaali(b["silver"], .14, 22)}'
       f'<svg viewBox="0 0 100 100" style="position:absolute;inset:14%"><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="{b["bg"]}" stroke="{b["silver"]}" stroke-width="1.6"/></svg>'
       f'<span style="position:relative;font:italic 400 64px/1 Bodoni Moda;color:{b["fg"]};margin-top:-8px">p</span></div>',
  phone=dict(bg=b['bg'], fg=b['fg'], muted=b['muted'], line='rgba(185,190,183,.22)', card='#252D28', btn=b['fg'], btnfg=b['bg'], disp="italic 400 27px/1.15 'Bodoni Moda'", ui='Hanken Grotesk', mark='<span style="font:italic 400 19px Bodoni Moda">prsnn</span><span class="dia" style="width:7px;height:7px;margin-left:5px;vertical-align:2px"></span>', photo='evening'),
  card=dict(front=f'<div style="background:{b["bg"]};position:relative;height:100%;display:flex;align-items:center;justify-content:center">{jaali(b["silver"], .1, 26)}<span style="position:relative;font:italic 400 46px Bodoni Moda;color:{b["fg"]}">prsnn</span><span class="dia" style="position:relative;width:9px;height:9px;margin-left:7px;margin-top:16px"></span></div>',
            back=f'<div style="background:{b["paper"]};color:{b["inkOnPaper"]};height:100%;padding:14px 18px;display:flex;flex-direction:column;justify-content:space-between"><div><div style="font:italic 400 19px Bodoni Moda">Sana Qadri</div><div style="font:400 12px Hanken Grotesk;color:#5E665F;margin-top:3px">Guest relations, Hyderabad</div></div><div style="font:400 11px/1.45 Hanken Grotesk;color:#3A433D">hello@prsnn.com<br>prsnn.com</div></div>'),
))

# ── 2. Pearl ─────────────────────────────────────────────
p = dict(bg='#ECE7E4', fg='#2A1C2C', muted='#776A73', rose='#C9A9A6', plum='#4A2E4C')
PEARL = 'radial-gradient(circle at 34% 30%,#FFFFFF 0%,#F4EEF0 22%,#DCCFD6 55%,#B9A9B7 80%,#9C8E9F 100%)'
D.append(dict(
  key='pearl', name='Pearl',
  why='The City of Pearls. A soft, cool lustre instead of cream, deep aubergine ink, and Fraunces set soft and light, warm like a conversation. The full stop is a real pearl: the one precious thing in every lockup.',
  colors=[('Nacre', p['bg']), ('Aubergine', p['fg']), ('Plum', p['plum']), ('Blush stone', p['rose']), ('Mist lilac', '#D8CFD8')],
  fonts=('Fraunces (soft)', 'Schibsted Grotesk'),
  css=f'''.pearl{{background:{p["bg"]};color:{p["fg"]}}}.pearl .lk{{font:300 140px/1 Fraunces;font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 144;letter-spacing:-4px}}
.pearl .prl{{display:inline-block;width:30px;height:30px;border-radius:50%;background:{PEARL};box-shadow:0 6px 14px rgba(42,28,44,.25),inset -2px -3px 6px rgba(74,46,76,.25);margin-left:8px}}
.pearl .disp{{font:300 36px/1.12 Fraunces;font-variation-settings:"SOFT" 100,"opsz" 72}}.pearl .body{{font:400 15px/1.55 "Schibsted Grotesk";color:{p["muted"]}}}''',
  logo=f'<div class="lk">prsnn<span class="prl"></span></div><div style="font:400 16px Schibsted Grotesk;color:{p["muted"]};margin-top:34px">Good company, on your terms.</div>',
  icon=f'<div style="width:100%;height:100%;background:{p["plum"]};display:flex;align-items:center;justify-content:center;gap:4px"><span style="font:300 74px/1 Fraunces;font-variation-settings:\'SOFT\' 100,\'WONK\' 1;color:#F3EEF0;margin-top:-14px">p</span><span class="prl" style="width:16px;height:16px;margin:30px 0 0"></span></div>',
  phone=dict(bg=p['bg'], fg=p['fg'], muted=p['muted'], line='rgba(42,28,44,.1)', card='#F6F2F1', btn=p['plum'], btnfg='#F6F2F1', disp='300 29px/1.12 Fraunces', ui='Schibsted Grotesk', mark='<span style="font:300 24px Fraunces">prsnn</span><span class="prl" style="width:8px;height:8px;margin-left:3px"></span>', photo='coffee'),
  card=dict(front=f'<div style="background:{p["plum"]};height:100%;display:flex;align-items:center;justify-content:center"><span style="font:300 50px Fraunces;color:#F3EEF0;letter-spacing:-1px">prsnn</span><span class="prl" style="width:12px;height:12px;margin:18px 0 0 4px"></span></div>',
            back=f'<div style="background:{p["bg"]};height:100%;padding:14px 18px;display:flex;flex-direction:column;justify-content:space-between"><div><div style="font:400 19px Fraunces">Sana Qadri</div><div style="font:400 12px Schibsted Grotesk;color:{p["muted"]};margin-top:3px">Guest relations, Hyderabad</div></div><div style="font:400 11px/1.45 Schibsted Grotesk">hello@prsnn.com<br>prsnn.com</div></div>'),
))

# ── 3. Arch ─────────────────────────────────────────────
a = dict(bg='#1E2740', fg='#E9DCC6', sand='#CDB48F', lamp='#E0A458', muted='#9AA0B4', stone='#B7826F')
D.append(dict(
  key='arch', name='Arch',
  why='The Charminar’s arch as a doorway: every meeting is someone stepping into the frame. Dusk indigo, sandstone and lamplight gold, with open, carved capitals. The most architectural and the most “Hyderabad at 7 pm”.',
  colors=[('Dusk', a['bg']), ('Sandstone', a['sand']), ('Lamplight', a['lamp']), ('Rose stone', a['stone']), ('Limewash', a['fg'])],
  fonts=('Marcellus', 'Jost'),
  css=f'''.arch{{background:{a["bg"]};color:{a["fg"]}}}.arch .lk{{font:400 104px/1 Marcellus;letter-spacing:22px;color:{a["fg"]}}}
.arch .lamp{{display:inline-block;width:16px;height:16px;border-radius:50%;background:{a["lamp"]};box-shadow:0 0 22px {a["lamp"]}}}
.arch .disp{{font:400 32px/1.15 Marcellus;letter-spacing:1px}}.arch .body{{font:300 15px/1.6 Jost;color:{a["muted"]}}}''',
  logo=f'<div style="display:flex;align-items:center;gap:26px"><svg viewBox="0 0 100 104" width="84" height="88"><path d="{ARCH}" fill="none" stroke="{a["sand"]}" stroke-width="3"/><path d="M28,100 V54 C28,38 38,28 50,24 C62,28 72,38 72,54 V100" fill="none" stroke="{a["sand"]}" stroke-width="1.5" opacity=".6"/><circle cx="50" cy="66" r="5" fill="{a["lamp"]}"/></svg>'
       f'<div class="lk">PRSNN<span class="lamp" style="margin-left:-6px"></span></div></div><div style="font:300 16px Jost;letter-spacing:1.5px;color:{a["muted"]};margin-top:18px">Good company, on your terms.</div>',
  icon=f'<div style="width:100%;height:100%;background:{a["bg"]};display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 100 104" style="width:62%"><path d="{ARCH}" fill="none" stroke="{a["sand"]}" stroke-width="4"/><text x="50" y="86" text-anchor="middle" font-family="Marcellus" font-size="46" fill="{a["fg"]}">P</text><circle cx="50" cy="30" r="4.5" fill="{a["lamp"]}"/></svg></div>',
  phone=dict(bg=a['bg'], fg=a['fg'], muted=a['muted'], line='rgba(205,180,143,.2)', card='#26304C', btn=a['lamp'], btnfg=a['bg'], disp='400 26px/1.18 Marcellus', ui='Jost', mark=f'<span style="font:400 17px Marcellus;letter-spacing:6px">PRSNN</span>', photo='walks', arch=True, archc=a['sand']),
  card=dict(front=f'<div style="background:{a["bg"]};height:100%;display:flex;align-items:center;justify-content:center;gap:16px"><svg viewBox="0 0 100 104" width="40"><path d="{ARCH}" fill="none" stroke="{a["sand"]}" stroke-width="5"/><circle cx="50" cy="66" r="7" fill="{a["lamp"]}"/></svg><span style="font:400 30px Marcellus;letter-spacing:9px;color:{a["fg"]}">PRSNN</span></div>',
            back=f'<div style="background:{a["fg"]};color:{a["bg"]};height:100%;padding:14px 18px;display:flex;flex-direction:column;justify-content:space-between"><div><div style="font:400 18px Marcellus;letter-spacing:1px">Sana Qadri</div><div style="font:400 12px Jost;color:#6B6F80;margin-top:3px">Guest relations, Hyderabad</div></div><div style="font:400 11px/1.45 Jost">hello@prsnn.com<br>prsnn.com</div></div>'),
))

# ── 4. Club ─────────────────────────────────────────────
c = dict(bg='#203528', fg='#EEEAE0', brass='#B6935C', ox='#6B2532', muted='#A7B1A6', linen='#E9E6DD')
seal_text = 'GOOD COMPANY ON YOUR TERMS · HYDERABAD · '
D.append(dict(
  key='club', name='Club',
  why='The private members’ clubs of the Deccan, made modern: deep racing green (an evolution of today’s moss), brass and oxblood, Gilda Display for an old-world wordmark, and a brass seal that turns every booking into an invitation.',
  colors=[('Racing green', c['bg']), ('Brass', c['brass']), ('Oxblood', c['ox']), ('Linen', c['linen']), ('Sage', c['muted'])],
  fonts=('Gilda Display', 'Manrope'),
  css=f'''.club{{background:{c["bg"]};color:{c["fg"]}}}.club .lk{{font:400 128px/1 "Gilda Display";letter-spacing:-1px}}
.club .disp{{font:400 34px/1.15 "Gilda Display"}}.club .body{{font:400 15px/1.6 Manrope;color:{c["muted"]}}}''',
  logo=f'<div class="lk">prsnn<span style="color:{c["brass"]}">.</span></div><div style="display:flex;align-items:center;gap:14px;margin-top:16px"><span style="height:1px;width:48px;background:{c["brass"]}"></span><span style="font:400 16px Manrope;color:{c["muted"]}">Good company, on your terms.</span></div>',
  icon=f'<div style="width:100%;height:100%;background:{c["bg"]};display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 120 120" style="width:84%"><defs><path id="sp" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs>'
       f'<circle cx="60" cy="60" r="56" fill="none" stroke="{c["brass"]}" stroke-width="1.5"/><circle cx="60" cy="60" r="34" fill="none" stroke="{c["brass"]}" stroke-width="1"/>'
       f'<text font-family="Manrope" font-size="8.2" letter-spacing="2.4" fill="{c["brass"]}"><textPath href="#sp">{seal_text}</textPath></text>'
       f'<text x="60" y="74" text-anchor="middle" font-family="Gilda Display" font-size="44" fill="{c["fg"]}">p</text></svg></div>',
  phone=dict(bg=c['linen'], fg=c['bg'], muted='#5D6B60', line='rgba(32,53,40,.12)', card='#F4F2EC', btn=c['bg'], btnfg=c['fg'], disp="400 28px/1.15 'Gilda Display'", ui='Manrope', mark=f'<span style="font:400 24px Gilda Display">prsnn</span><span style="font:400 24px Gilda Display;color:{c["brass"]}">.</span>', photo='together'),
  card=dict(front=f'<div style="background:{c["bg"]};height:100%;display:flex;align-items:center;justify-content:center"><span style="font:400 46px Gilda Display;color:{c["fg"]}">prsnn</span><span style="font:400 46px Gilda Display;color:{c["brass"]}">.</span></div>',
            back=f'<div style="background:{c["linen"]};color:{c["bg"]};height:100%;padding:14px 18px;display:flex;flex-direction:column;justify-content:space-between;outline:1px solid {c["brass"]};outline-offset:-7px;padding:13px 20px!important"><div><div style="font:400 19px Gilda Display">Sana Qadri</div><div style="font:400 12px Manrope;color:#5D6B60;margin-top:3px">Guest relations</div></div><div style="font:400 11px/1.45 Manrope">hello@prsnn.com<br>prsnn.com</div></div>'),
))

def phone(d):
    ph = d['phone']
    arch = (f'<svg viewBox="0 0 100 104" preserveAspectRatio="none" style="position:absolute;inset:-1px;width:calc(100% + 2px);height:calc(100% + 2px)"><path d="M0,0 H100 V104 H0 Z M10,104 V46 C10,22 28,6 50,2 C72,6 90,22 90,46 V104 Z" fill="{ph["bg"]}" fill-rule="evenodd"/>'
            f'<path d="{ARCH}" fill="none" stroke="{ph["archc"]}" stroke-width=".8" vector-effect="non-scaling-stroke"/></svg>') if ph.get('arch') else ''
    radius = '0' if ph.get('arch') else '18px'
    return (f'<div class="phone" style="background:{ph["bg"]};color:{ph["fg"]};font-family:{ph["ui"]}"><div class="notch"></div>'
            f'<div style="padding:46px 20px 0;display:flex;justify-content:space-between;align-items:center"><span style="display:inline-flex;align-items:center">{ph["mark"]}</span>'
            f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="{ph["fg"]}" stroke-width="1.6" stroke-linecap="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4"/></svg></div>'
            f'<div style="padding:22px 20px 0"><div style="font-size:13px;color:{ph["muted"]}">Good evening, Riya</div><div style="font:{ph["disp"]};margin-top:6px">Who would you like to meet this weekend?</div></div>'
            f'<div style="margin:18px 20px 0;height:228px;border-radius:{radius};overflow:hidden;position:relative;background:url({PHOTO[ph["photo"]]}) center/cover">{arch}</div>'
            f'<div style="padding:12px 20px 0;display:flex;justify-content:space-between;align-items:baseline"><div><div style="font-size:16px;font-weight:600">Ananya</div><div style="font-size:12.5px;color:{ph["muted"]};margin-top:2px">Jubilee Hills, coffee and walks</div></div>'
            f'<div style="font-size:13px;color:{ph["muted"]}">from ₹399</div></div>'
            f'<div style="margin:16px 20px 0;height:48px;border-radius:{"0" if ph.get("arch") else "14px"};background:{ph["btn"]};color:{ph["btnfg"]};display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14.5px">Book Ananya</div>'
            f'<div style="position:absolute;left:0;right:0;bottom:0;height:64px;border-top:1px solid {ph["line"]};display:flex;justify-content:space-around;align-items:center;font-size:10.5px;color:{ph["muted"]}">'
            + ''.join(f'<span style="{"color:" + ph["fg"] + ";font-weight:600" if i == 0 else ""}">{t}</span>' for i, t in enumerate(['Home', 'Search', 'Bookings', 'Messages', 'Profile'])) + '</div></div>')

def section(d, i):
    sw = ''.join(f'<div class="sw"><i style="background:{h}"></i><span>{n}<br><em>{h}</em></span></div>' for n, h in d['colors'])
    return (f'<section class="dir {d["key"]}"><div class="wrap">'
            f'<header class="dh"><h2>{d["name"]}{" <small>My pick</small>" if d.get("pick") else ""}</h2><p class="why">{d["why"]}</p></header>'
            f'<div class="hero">{d["logo"]}</div>'
            f'<div class="kit"><div class="col">'
            f'<div class="blk"><div class="icons"><div class="ic">{d["icon"]}</div><div class="ic sm">{d["icon"]}</div><div class="ic xs">{d["icon"]}</div></div></div>'
            f'<div class="blk"><div class="disp">Never go alone.</div><p class="body" style="margin:10px 0 0;max-width:42ch">Verified people for coffee, walks and evenings out, booked in a minute and met in public places.</p>'
            f'<p class="fn">{d["fonts"][0]} for the logo and titles, {d["fonts"][1]} for everything else.</p></div>'
            f'<div class="blk swatches">{sw}</div>'
            f'<div class="blk cards"><div class="bc">{d["card"]["front"]}</div><div class="bc">{d["card"]["back"]}</div></div>'
            f'</div><div class="col ph">{phone(d)}</div></div></div></section>')

CSS = '''*{box-sizing:border-box}body{margin:0;background:#C9C7C2;font-family:"Hanken Grotesk",system-ui,sans-serif}
.intro{max-width:1280px;margin:0 auto;padding:44px 40px 30px;color:#22251F}.intro h1{font:italic 400 46px/1.05 "Bodoni Moda";margin:0 0 10px;letter-spacing:-.5px}
.intro p{margin:0;max-width:70ch;font-size:16px;line-height:1.6;color:#41463F}
.dir{position:relative;overflow:hidden}.wrap{max-width:1280px;margin:0 auto;padding:56px 40px 60px}
.dh{display:flex;gap:40px;align-items:flex-start;justify-content:space-between}.dh h2{margin:0;font:500 15px "Hanken Grotesk";letter-spacing:.3px;opacity:.9}
.dh h2 small{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;margin-left:8px;border:1px solid currentColor;opacity:.85}
.why{margin:0;max-width:62ch;font-size:15px;line-height:1.6;opacity:.82}
.hero{padding:70px 0 64px}
.kit{display:grid;grid-template-columns:1fr 330px;gap:48px;align-items:center}
.col{display:grid;grid-template-columns:1fr 1fr;gap:34px 40px}.col.ph{display:block}
.blk{min-width:0}.fn{font-size:12.5px;opacity:.7;margin:14px 0 0}
.icons{display:flex;gap:18px;align-items:flex-end}.ic{width:132px;height:132px;border-radius:30px;overflow:hidden;box-shadow:0 14px 30px rgba(0,0,0,.28)}
.ic.sm{width:76px;height:76px;border-radius:18px}.ic.xs{width:44px;height:44px;border-radius:11px}
.ic.sm>div,.ic.xs>div{transform-origin:top left}.ic.sm>div{transform:scale(.576);width:132px!important;height:132px!important}.ic.xs>div{transform:scale(.333);width:132px!important;height:132px!important}
.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.sw i{display:block;height:64px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(127,127,127,.25)}
.sw span{display:block;font-size:12px;margin-top:7px;line-height:1.35}.sw em{font-style:normal;opacity:.6;font-size:11px}
.cards{display:flex;gap:14px}.bc{width:50%;aspect-ratio:1.75;border-radius:6px;overflow:hidden;box-shadow:0 12px 26px rgba(0,0,0,.3)}
.phone{width:330px;height:690px;border-radius:46px;border:10px solid #0A0A0A;position:relative;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.35)}
.notch{position:absolute;top:9px;left:50%;transform:translateX(-50%);width:92px;height:25px;background:#0A0A0A;border-radius:20px;z-index:3}
.verdict{max-width:1280px;margin:0 auto;padding:40px 40px 60px;color:#22251F}.verdict h2{font:italic 400 30px "Bodoni Moda";margin:0 0 10px}.verdict p{max-width:72ch;line-height:1.65;margin:0 0 10px;color:#41463F}
'''
css_dirs = ''.join(d['css'] for d in D)
link = 'https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in FONTS) + '&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn brand directions</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}{css_dirs}</style></head><body>'
        '<div class="intro"><h1>Four ways prsnn. could look and feel</h1><p>Each direction starts from Hyderabad rather than from a template: its metalwork, its pearls, its arches and its old clubs. '
        'Every one comes with a logo, an app icon at three sizes, two typefaces, a palette, the home screen and a business card, so you can judge it as a whole brand rather than a logo alone.</p></div>'
        + ''.join(section(d, i) for i, d in enumerate(D)) +
        '<div class="verdict"><h2>Why I would choose Bidri</h2>'
        '<p>It is the only direction nobody else could own. Bidri is a craft that exists because of this region, so the brand tells people where it is from without saying it. Silver on near-black reads as discreet and expensive, which suits a service built on trust and privacy.</p>'
        '<p>The diamond full stop keeps the signature you already have and gives it more value. It is also the most practical: the octagon icon stays crisp at tiny sizes, and the palette works in dark mode by default.</p>'
        '<p>If you want something warmer and more welcoming for first-time members, Pearl is the closest second. All four use free Google fonts, so there are no licence costs.</p></div>'
        '</body></html>')
(ROOT / 'preview/brand-directions.html').write_text(html)
print('wrote preview/brand-directions.html', len(html) // 1024, 'KB')
