"""Generates preview/chat-keyboard.html: the chat screen with the keyboard open,
today vs the proposed fix, for owner approval.
Run: python3 scripts/design/chat_keyboard.py"""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]

def svg(d, c='currentColor', w=20, sw=1.9):
    return f'<svg width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
BACK = 'M15 5l-7 7 7 7'
INFO = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01'
SEND = 'M4 12 20 4l-6 16-3-7-7-1z'
SHIELD = 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3zM9 12l2 2 4-4'
DOWN = 'M6 9l6 6 6-6'
CHEV = 'M9 5l7 7-7 7'

CSS = '''
:root{--ink:#0E110D;--mist:#F3F1EB;--paper:#FAF9F6;--moss:#2F4A34;--mossSoft:#D7E3D4;--green50:#F2F6F1;--clay:#C45C2A;--muted:#6A665C;--line:rgba(14,17,13,.08);--g4:#8E8A7E;--danger:#B3261E}
*{box-sizing:border-box}body{margin:0;background:#E3E0D6;font-family:'DM Sans',system-ui,sans-serif;color:var(--ink)}
.top{max-width:1400px;margin:0 auto;padding:28px 16px 4px}.top h1{font:600 28px Lora,serif;margin:0 0 6px}.top p{margin:0;color:var(--muted);max-width:860px;line-height:1.5}
.grid{max-width:1400px;margin:0 auto;padding:18px 16px 30px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px 22px}
.cell{display:flex;flex-direction:column;align-items:center;gap:10px}
.cap{width:300px;font-size:13px;color:var(--muted);line-height:1.45}.cap b{color:var(--ink);font-size:14px;display:block;margin-bottom:2px}
.tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:2px 8px;border-radius:999px;margin-bottom:4px}
.tag.bad{background:#F9E3E1;color:var(--danger)}.tag.good{background:var(--mossSoft);color:var(--moss)}
.ph{width:300px;height:640px;border-radius:40px;border:9px solid #111;background:var(--mist);position:relative;overflow:hidden;box-shadow:0 18px 44px rgba(14,17,13,.22);font-size:14px;display:flex;flex-direction:column}
.notch{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:84px;height:22px;background:#111;border-radius:18px;z-index:9}
.hdr{background:var(--paper);border-bottom:1px solid var(--line);padding:38px 10px 8px;display:flex;align-items:center;gap:8px;flex:none}
.av{width:34px;height:34px;border-radius:50%;background:var(--mossSoft);color:var(--moss);font:600 13px Lora,serif;display:flex;align-items:center;justify-content:center;position:relative;flex:none}
.av .on{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:5px;background:#3FB950;border:2px solid var(--paper)}
.h3{font-weight:600;font-size:15px}.xs{font-size:11px}.mut{color:var(--muted)}
.tip{margin:8px 12px 0;background:var(--green50);border:1px solid var(--mossSoft);border-radius:12px;padding:10px;font-size:11.5px;color:#4A473F;line-height:1.4;display:flex;gap:8px}
.pill{margin:8px auto 0;background:var(--green50);border:1px solid var(--mossSoft);border-radius:999px;padding:5px 10px 5px 8px;font-size:11.5px;color:var(--moss);font-weight:600;display:flex;align-items:center;gap:5px;flex:none}
.msgs{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:7px;padding:10px 12px}
.b{max-width:78%;padding:7px 10px;border-radius:15px;font-size:13.5px;line-height:1.35}
.b.me{align-self:flex-end;background:var(--moss);color:#FAF9F6;border-bottom-right-radius:4px}
.b.them{align-self:flex-start;background:var(--paper);border:1px solid var(--line);border-bottom-left-radius:4px}
.b .t{font-size:10px;opacity:.65;text-align:right;margin-top:2px}
.comp{background:var(--paper);border-top:1px solid var(--line);padding:8px 10px;display:flex;align-items:flex-end;gap:7px;flex:none}
.in{flex:1;background:var(--mist);border-radius:20px;padding:10px 14px;font-size:13.5px;min-height:40px;line-height:1.35}
.in .cur{display:inline-block;width:1.5px;height:15px;background:var(--moss);vertical-align:-3px;margin-left:1px}
.rb{width:40px;height:40px;border-radius:20px;display:flex;align-items:center;justify-content:center;flex:none}
.rb.send{background:var(--moss)}.rb.hide{background:var(--mist);border:1px solid var(--line)}
.kb{height:250px;background:#D1D3D9;flex:none;padding:8px 4px;display:grid;grid-template-rows:repeat(4,1fr);gap:9px}
.kb div{display:flex;gap:5px;justify-content:center}.kb span{background:#fff;border-radius:5px;flex:0 0 24px;box-shadow:0 1px 0 #898A8D}
.kb .wide{flex:0 0 150px}
.cover{position:absolute;left:0;right:0;bottom:0;height:250px}
.note{position:absolute;left:12px;right:12px;font-size:11px;font-weight:700;color:var(--danger);background:#fff;border:1.5px dashed var(--danger);border-radius:10px;padding:5px 8px;text-align:center;z-index:5}
.sheet{position:absolute;left:0;right:0;bottom:0;background:var(--paper);border-radius:22px 22px 0 0;padding:16px 18px 22px;box-shadow:0 -8px 30px rgba(14,17,13,.18);z-index:6}
.dim{position:absolute;inset:0;background:rgba(14,17,13,.35);z-index:5}
.grab{width:36px;height:4px;border-radius:2px;background:#D5D1C6;margin:0 auto 12px}
.btn{height:44px;border-radius:14px;background:var(--moss);color:#FAF9F6;font-weight:600;font-size:14.5px;display:flex;align-items:center;justify-content:center;margin-top:12px}
ul{margin:8px 0 0;padding-left:18px;font-size:12.5px;color:#4A473F;line-height:1.55}
'''

def header():
    return (f'<div class="hdr">{svg(BACK, "#0E110D", 22)}<div class="av">AR<i class="on"></i></div>'
            f'<div style="flex:1"><div class="h3">Ananya</div><div class="xs mut">Sat 15 Nov · 4:00–6:00 PM</div></div>{svg(INFO, "#2F4A34", 20)}</div>')

THREAD = [('them', 'Hi! Looking forward to Saturday 😊', '10:02 AM'), ('me', 'Same here. Starbucks at Inorbit, 4 PM?', '10:04 AM'),
          ('them', 'Perfect. I’ll be near the entrance.', '10:05 AM'), ('me', 'Great, I’ll wear a blue shirt.', '10:06 AM'),
          ('them', 'Haha noted. See you then!', '10:06 AM')]
def bubbles(items):
    return ''.join(f'<div class="b {w}">{t}<div class="t">{tm}</div></div>' for w, t, tm in items)

def keyboard():
    row = lambda n: '<div>' + '<span></span>' * n + '</div>'
    return f'<div class="kb">{row(10)}{row(9)}{row(9)}<div><span></span><span class="wide"></span><span></span></div></div>'

TIP_LONG = (f'<div class="tip">{svg(SHIELD, "#2F4A34", 16)}<div><b style="color:var(--ink)">Keep it safe and about the plan</b><br>Don’t share mobile numbers, addresses, '
            'social handles or other personal details, and keep politics and religion out of the chat. Meet only in public places. Numbers are hidden automatically, and you can report anything from the booking.</div></div>')
PILL = f'<div class="pill">{svg(SHIELD, "#2F4A34", 13)} Keep it safe · public places only {svg(CHEV, "#2F4A34", 12)}</div>'

def composer(text, hide=False, rows=1):
    t = text or '<span class="mut">Type a message…</span>'
    return (f'<div class="comp">' + (f'<div class="rb hide" title="Hide keyboard">{svg(DOWN, "#2F4A34", 20)}</div>' if hide else '') +
            f'<div class="in" style="{"max-height:96px;overflow:hidden" if rows > 1 else ""}">{t}{"<span class=cur></span>" if hide else ""}</div>'
            f'<div class="rb send">{svg(SEND, "#fff", 18)}</div></div>')

screens = []
# 1. today
screens.append(('bad', 'Today: keyboard covers the chat',
  'On Android nothing moves up when the keyboard opens, so it sits on top of the messages and the box you type in. The long safety card takes the top third. There is no way to put the keyboard away.',
  f'<div class="notch"></div>{header()}{TIP_LONG}<div class="msgs">{bubbles(THREAD[:3])}</div>{composer("")}'
  f'<div class="cover">{keyboard()}</div><div class="note" style="bottom:262px">Composer and latest messages are under the keyboard</div>'))
# 2. proposed closed
screens.append(('good', 'A · Chat open, keyboard down',
  'The safety note becomes one short line under the header (tap it to read the full rules). Messages get the whole screen and open on the latest one.',
  f'<div class="notch"></div>{header()}{PILL}<div class="msgs">{bubbles(THREAD)}</div>{composer("")}<div style="height:16px;background:var(--paper)"></div>'))
# 3. proposed typing
screens.append(('good', 'B · Typing: the chat moves up, nothing is hidden',
  'The box you type in sits right on top of the keyboard on iPhone and Android, and the newest messages stay in view just above it. The safety line hides while typing to save room.<br><br><b>To put the keyboard away:</b> tap the ⌄ button, tap any message, or swipe the chat down.',
  f'<div class="notch"></div>{header()}<div class="msgs">{bubbles(THREAD[2:])}</div>{composer("See you at 4! I’ll message when I’m", hide=True)}{keyboard()}'))
# 4. long message
screens.append(('good', 'C · Long message',
  'The box grows to 4 lines, then scrolls inside itself, so the conversation never gets pushed off the screen.',
  f'<div class="notch"></div>{header()}<div class="msgs">{bubbles(THREAD[3:])}</div>'
  f'{composer("Running about 10 minutes late, traffic near Hitec City is bad today. Please grab a table near the window if you get there first and I’ll find you", hide=True, rows=4)}{keyboard()}'))
# 5. tip sheet
screens.append(('good', 'D · Tap the safety line',
  'The full rules open in a small sheet and close with one tap. Same words as today.',
  f'<div class="notch"></div>{header()}{PILL}<div class="msgs">{bubbles(THREAD)}</div>{composer("")}<div class="dim"></div>'
  f'<div class="sheet"><div class="grab"></div><div class="row" style="display:flex;gap:8px;align-items:center">{svg(SHIELD, "#2F4A34", 20)}<b style="font:600 17px Lora,serif">Keep it safe and about the plan</b></div>'
  '<ul><li>Don’t share mobile numbers, addresses or social handles.</li><li>Keep politics and religion out of the chat.</li><li>Meet only in public places.</li><li>Numbers are hidden automatically.</li><li>Report anything from the booking.</li></ul><div class="btn">Got it</div></div>'))

cells = ''.join(f'<div class="cell"><div class="ph">{body}</div><div class="cap"><span class="tag {k}">{"Problem" if k == "bad" else "Proposed"}</span><b>{t}</b>{d}</div></div>' for k, t, d, body in screens)
html = (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chat keyboard</title>'
        '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,600;1,600&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="top"><h1>Chat with the keyboard open</h1><p>For approval. The keyboard should never cover the conversation, '
        'and people should be able to put it away whenever they like. Colours, fonts and bubbles stay as they are.</p></div>'
        f'<div class="grid">{cells}</div></body></html>')
(ROOT / 'preview/chat-keyboard.html').write_text(html)
print('wrote preview/chat-keyboard.html')
