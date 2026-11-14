// End-to-end journey against the real Supabase project, as the app calls it.
// Uses the e2e test accounts (e2e-*@prsnn.test, email+password, created by SQL —
// not phone users). The password is NOT in the repo:
//   E2E_PASSWORD=… node scripts/e2e-supabase.mjs [image.png]
// Reset the test accounts first: prsnn-backend/supabase/tests/e2e-reset.sql.
// Delete these accounts before launch (prsnn-backend/supabase/README.md).
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
const URL = 'https://mhovyhapzhxcmcuelbol.supabase.co';
const KEY = 'sb_publishable_EjvwHde8WRvzboJF3JE6LQ_1L5FJdIT';
const PASS = process.env.E2E_PASSWORD;
if (!PASS) {
  console.error('Set E2E_PASSWORD (the e2e test accounts’ password).');
  process.exit(2);
}
let pass = 0, fail = 0;
const ok = (c, label, x) => { if (c) { pass++; console.log('  ✓', label); } else { fail++; console.log('  ✗', label, x === undefined ? '' : JSON.stringify(x).slice(0, 300)); } };
const client = async (email) => { const c = createClient(URL, KEY, { auth: { persistSession: false } }); if (email) { const { error } = await c.auth.signInWithPassword({ email, password: PASS }); if (error) throw new Error(`${email}: ${error.message}`); } return c; };
const rpc = async (c, fn, args) => { const { data, error } = await c.rpc(fn, args); return { data, error: error?.message }; };
const img = fs.readFileSync(process.argv[2] ?? new URL('../assets/icon.png', import.meta.url));
const day = (n) => new Date(Date.now() + n * 864e5 + 5.5 * 36e5).toISOString().slice(0, 10);

const anon = await client();
const sup = await client('e2e-super@prsnn.test');
const mem = await client('e2e-member@prsnn.test');
const comp = await client('e2e-companion@prsnn.test');
const sub = await client('e2e-sub@prsnn.test');
const mem2 = await client('e2e-member2@prsnn.test');
const id = async (c) => (await c.auth.getUser()).data.user.id;
const [compId, memId] = [await id(comp), await id(mem)];

console.log('1. Who can call what');
ok((await rpc(anon, 'admin_overview')).error, 'logged-out: admin refused');
ok(!(await rpc(anon, 'list_companions')).error, 'logged-out: can browse companions');
ok((await rpc(anon, 'my_bookings')).error, 'logged-out: no bookings');
const meSup = await rpc(sup, 'sync_my_role');
ok(meSup.data?.role === 'superadmin', 'superadmin from phone list', meSup);
ok((await rpc(mem, 'admin_overview')).error === 'Access denied', 'member: admin refused');
{ const { data } = await anon.from('settings').select('value').eq('key', 'pricing').single(); ok(data?.value?.packagePrices?.['1'] === 399, 'prices readable by everyone'); }

console.log('2. Profiles');
let r = await rpc(mem, 'update_my_profile', { p: { fullName: 'Riya Test', gender: 'woman', seeGender: 'everyone', profileVisibility: 'open', visibilityConsent: true, city: 'Hyderabad', area: 'Gachibowli' } });
ok(r.data?.fullName === 'Riya Test', 'member saves profile', r);
r = await rpc(mem, 'update_my_profile', { p: { profileVisibility: 'locked' } });
ok(/confirm/.test(r.error ?? ''), 'visibility change needs consent', r);

console.log('3. Companion signs up: live without an ID');
const up = async (c, bucket, name) => { const p = `${await id(c)}/${name}-${Date.now()}.png`; const { error } = await c.storage.from(bucket).upload(p, img, { contentType: 'image/png' }); return { p, error: error?.message }; };
const photo = await up(comp, 'avatars', 'profile'); ok(!photo.error, 'photo uploaded', photo);
const bad = await comp.storage.from('avatars').upload(`${memId}/x.png`, img, { contentType: 'image/png' });
ok(!!bad.error, 'cannot upload into someone else’s folder');
r = await rpc(comp, 'submit_companion_application', { p: { fullName: 'Ananya Rao', gender: 'woman', profileVisibility: 'locked', visibilityConsent: true, city: 'Hyderabad', area: 'Gachibowli', description: 'Coffee and walks.', packages: [1, 2, 4], startTime: '09:00', endTime: '20:00', tags: ['Coffee'],
  availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true }, photoPath: photo.p } });
ok(r.data?.verification_status === 'id_required', 'no ID at sign-up: live, ID at first booking', r);
r = await rpc(mem, 'list_companions');
let card = r.data?.find((c) => c.id === compId);
ok(card && card.idVerified === false && card.locked && card.fullName === 'Ananya' && !card.profilePhoto, 'listed as new (not ID-verified), locked: first name, no photo', card);
{ const { data } = await mem2.from('profiles').select('id'); ok(data?.length === 1, 'members read only their own profile row', data?.length); }

console.log('4. First booking asks for the ID; staff reject → re-offered/refunded');
const key = `e2e-${Date.now()}`;
const book = async (k, date, start, dur) => (await rpc(mem, 'create_prepaid_booking', { p: { companionId: compId, scheduledDate: date, startTime: start, duration: dur, idempotencyKey: k, acceptTerms: true } }));
r = await book(key + 'a', day(2), '12:00', '120'); const bidA = r.data?.booking?._id; ok(r.data?.quote?.amount === 699, 'booked a new companion: ₹699', r);
r = await rpc(mem, 'simulate_payment', { bid: bidA, outcome: 'success' }); ok(r.data?.booking?.allocation?.state === 'offering', 'paid → offered to them', r);
r = await rpc(comp, 'accept_offer', { bid: bidA }); ok(/Verify your ID/.test(r.error ?? ''), 'accept without an ID is refused', r);
const f = await up(comp, 'verification', 'id-front'); const bk = await up(comp, 'verification', 'id-back'); const sf = await up(comp, 'verification', 'selfie');
ok(!f.error && !bk.error && !sf.error, 'ID + selfie uploaded (private bucket)', [f, bk, sf]);
r = await rpc(comp, 'submit_id_documents', { p: { idType: 'aadhaar', idFrontPath: f.p, selfiePath: sf.p } }); ok(/back/.test(r.error ?? ''), 'Aadhaar needs the back', r);
r = await rpc(comp, 'submit_id_documents', { p: { idType: 'pan', idFrontPath: f.p } }); ok(/selfie/.test(r.error ?? ''), 'selfie required', r);
r = await rpc(comp, 'submit_id_documents', { p: { idType: 'aadhaar', idFrontPath: f.p, idBackPath: bk.p, selfiePath: sf.p } }); ok(r.data?.verification_status === 'pending', 'ID sent → pending', r);
r = await rpc(comp, 'accept_offer', { bid: bidA }); ok(r.data?.idCheck === true && r.data?.booking?.allocation?.state === 'id_check', 'accepted → held for ID check', r);
r = await rpc(mem, 'get_booking', { bid: bidA }); ok(r.data?.status === 'pending' && r.data?.allocation?.state === 'id_check', 'member sees the safety check', r.data?.allocation);
{ const { error } = await mem.from('messages').insert({ booking_id: bidA, sender_id: memId, content: 'hi' }); ok(!!error, 'no chat while the ID is checked'); }
{ const { data } = await mem2.storage.from('verification').createSignedUrl(f.p, 60); ok(!data?.signedUrl, 'other members cannot open ID documents'); }
r = await rpc(sup, 'admin_verifications');
let cand = r.data?.find((u) => u.id === compId);
ok(cand?.idFrontPath === f.p && cand.idType === 'aadhaar' && cand.heldBookings === 1 && cand.heldUntil, 'queue shows the held booking and its deadline', cand);
{ const { data } = await sup.storage.from('verification').createSignedUrls([f.p, bk.p, sf.p], 600); ok(data?.every((d) => d.signedUrl), 'staff can open ID documents'); }
r = await rpc(sup, 'admin_decide_verification', { uid: compId, decision: 'rejected', note: 'Photo is blurry' }); ok(/offered to others/.test(r.data?.message ?? ''), 'rejected: held booking re-offered', r);
r = await rpc(mem, 'get_booking', { bid: bidA }); ok(r.data?.allocation?.state === 'failed' && r.data?.refund?.amount === 699, 'nobody else free → member refunded in full', r.data && { a: r.data.allocation, rf: r.data.refund });
r = await rpc(mem, 'list_companions'); ok(!r.data?.some((c) => c.id === compId), 'rejected companion hidden');

console.log('5. New ID → accept → staff approve → confirmed');
const sf2 = await up(comp, 'verification', 'selfie');
r = await rpc(comp, 'submit_id_documents', { p: { idType: 'pan', idFrontPath: f.p, selfiePath: sf2.p } }); ok(r.data?.verification_status === 'pending', 'PAN (front only) resubmitted → pending, listed again', r);
r = await book(key, day(3), '16:00', '120'); const bid = r.data?.booking?._id; ok(!!bid, 'booked', r);
r = await book(key + 'x', day(3), '16:00', '480'); ok(/doesn’t offer 8-hour/.test(r.error ?? ''), 'duration not offered refused', r);
ok((await rpc(mem, 'payment_mode')).data === 'simulated', 'payment mode simulated');
r = await rpc(mem, 'simulate_payment', { bid, outcome: 'success' }); ok(r.data?.booking?.allocation?.state === 'offering', 'paid → offering', r);
r = await rpc(comp, 'incoming_bookings'); const offer = r.data?.find((x) => x._id === bid);
ok(offer?.myOffer?.status === 'offered' && offer.companionShare === 559, 'companion sees offer, earns ₹559', offer);
r = await rpc(mem2, 'get_booking', { bid }); ok(!!r.error, 'other members cannot see the booking');
r = await rpc(comp, 'accept_offer', { bid }); ok(r.data?.booking?.allocation?.state === 'id_check', 'ID in review: accept holds the booking (no second ID prompt)', r);
r = await rpc(sup, 'admin_decide_verification', { uid: compId, decision: 'verified', note: null }); ok(/1 held booking\(s\) confirmed/.test(r.data?.message ?? ''), 'verified: held booking confirmed', r);
r = await rpc(mem, 'get_booking', { bid }); ok(r.data?.status === 'accepted' && r.data?.companionId?.fullName === 'Ananya Rao' && !r.data.companionId.locked, 'confirmed: full name unlocked', r.data?.companionId);
r = await rpc(mem, 'list_companions'); card = r.data?.find((c) => c.id === compId); ok(card?.idVerified === true, 'listed as ID-verified', card);

console.log('6. Realtime chat');
const got = new Promise((resolve) => {
  const ch = mem.channel(`chat:${bid}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bid}` }, (p) => { resolve(p.new); mem.removeChannel(ch); })
    .subscribe(async (s) => { if (s === 'SUBSCRIBED') { await new Promise((w) => setTimeout(w, 3000)); const { error } = await comp.from('messages').insert({ booking_id: bid, sender_id: compId, content: 'Hi Riya, call me on 98765 43210' }); if (error) resolve({ error: error.message }); } });
  setTimeout(() => resolve(null), 15000);
});
const msg = await got;
ok(msg?.content === 'Hi Riya, call me on ••••••••••', 'member receives live message, number masked', msg);
{ const { data } = await mem2.from('messages').select('id').eq('booking_id', bid); ok((data ?? []).length === 0, 'others cannot read the chat'); }

console.log('7. Dispute, admin, money');
r = await rpc(mem, 'open_dispute', { bid, reason: 'Companion was 30 minutes late.' }); ok(!r.error, 'dispute opened', r);
r = await rpc(sup, 'admin_booking_messages', { bid }); ok(r.data?.length === 1, 'admin reads dispute chat', r);
r = await rpc(sup, 'admin_add_admin', { phone: '9000000001' }); ok(!r.error, 'sub-admin added', r);
ok((await rpc(sub, 'sync_my_role')).data?.role === 'subadmin', 'sub-admin role');
ok((await rpc(sub, 'admin_refund', { bid, amount: 100, reason: 'x' })).error === 'Access denied', 'sub-admin cannot refund');
r = await rpc(sub, 'admin_reply_dispute', { bid, msg: 'Looking into it.' }); ok(!r.error, 'sub-admin replies to dispute', r);
r = await rpc(sup, 'admin_refund', { bid, amount: 200, reason: 'Late start' }); ok(r.data?.result === 'processed', 'superadmin partial refund ₹200', r);
ok(/already/.test((await rpc(sup, 'admin_refund', { bid, amount: 50, reason: 'x' })).error ?? ''), 'no second refund');
r = await rpc(sup, 'admin_close_dispute', { bid, resolution: 'Refunded ₹200.' }); ok(!r.error, 'dispute closed', r);
r = await rpc(sup, 'admin_overview'); ok(r.data?.money?.collected === 699 * 2 && r.data.money.refunded === 699 + 200, 'overview money (one refunded in full, one partly)', r.data?.money);
r = await rpc(sup, 'admin_activity', { before_at: null }); ok(r.data?.length >= 5, `activity log: ${r.data?.length} entries`);

console.log('8. Cancel policy, push, broadcast');
r = await rpc(mem, 'create_prepaid_booking', { p: { companionId: compId, scheduledDate: day(4), startTime: '11:00', duration: '60', idempotencyKey: key + 'b', acceptTerms: true } });
const b2 = r.data?.booking?._id; await rpc(mem, 'simulate_payment', { bid: b2, outcome: 'success' });
r = await rpc(mem, 'cancel_booking', { bid: b2 }); ok(r.data?.refundAmount === 339, 'cancel ≥15 min before: ₹339 of ₹399 (85%)', r.data);
r = await rpc(mem, 'save_push_token', { token: 'ExponentPushToken[e2e-test]' }); ok(!r.error, 'push token saved', r);
ok((await rpc(sup, 'admin_audience')).data?.members === 1, 'audience counts it');
{ const { data, error } = await sup.functions.invoke('broadcast', { body: { audience: 'companions', title: 'Hello', body: 'Weekend is busy' } }); ok(!error && /Nobody|Sent/.test(data?.message ?? ''), 'superadmin broadcast', data ?? error?.message); }
{ const { error } = await mem.functions.invoke('broadcast', { body: { audience: 'members', title: 'Hi', body: 'x x' } }); ok(!!error, 'member cannot broadcast'); }
await rpc(mem, 'save_push_token', { token: null });
{ const { data } = await mem.from('notifications').select('message').order('created_at'); ok(data?.length >= 4, `member has ${data?.length} notifications`); }

console.log('9. Who is told what (WhatsApp: offer → companion only, confirmed → member only)');
{
  const { data: mn } = await mem.from('notifications').select('type').eq('booking_id', bid);
  const { data: cn } = await comp.from('notifications').select('type').eq('booking_id', bid);
  ok(cn?.some((n) => n.type === 'booking_offer') && !mn?.some((n) => n.type === 'booking_offer'), 'the offer goes to the companion, not the member', { mn, cn });
  ok(mn?.some((n) => n.type === 'booking_confirmed'), 'the member is told the booking is confirmed', mn);
  ok((await rpc(mem, 'claim_notifications')).error, 'members cannot read the delivery queue');
}
// The 5 AM reminder and the 12-field panic alert run as the database itself:
// check them with prsnn-backend/supabase/tests/round3-notify.sql (always rolls back).

console.log('10. Live badges, chat read, staff preview log');
r = await rpc(mem, 'unread_counts');
ok(r.data?.messages >= 1 && r.data?.perChat?.[bid] >= 1, 'member has the companion’s message unread', r.data);
ok(typeof r.data?.notifications === 'number' && typeof r.data?.bookings === 'number', 'bell and bookings counts returned', r.data);
r = await rpc(mem, 'mark_chat_read', { bid }); ok(!r.error, 'opening the chat marks it read', r);
r = await rpc(mem, 'unread_counts'); ok(!r.data?.perChat?.[bid], 'that chat’s badge clears', r.data);
ok(!!(await rpc(mem2, 'mark_chat_read', { bid })).error, 'cannot mark someone else’s chat read');
ok((await rpc(mem, 'admin_log_preview', { as_role: 'member', start_at: 'home' })).error === 'Access denied', 'members cannot log a staff preview');
r = await rpc(sup, 'admin_log_preview', { as_role: 'companion', start_at: 'chat' }); ok(!r.error, 'staff preview recorded', r);
r = await rpc(sup, 'admin_activity', { before_at: null }); ok(r.data?.[0]?.action === 'app.preview' && r.data[0].after?.as === 'companion', 'activity log shows the preview', r.data?.[0]);

console.log('11. State rules (round 5)');
r = await rpc(comp, 'complete_booking', { bid }); ok(/session has ended/.test(r.error ?? ''), 'cannot mark completed before the session ends', r);
r = await book(key + 'f', day(5), '11:00', '60'); const bf = r.data?.booking?._id; ok(!!bf, 'booked for the payment test', r);
r = await rpc(mem, 'simulate_payment', { bid: bf, outcome: 'failure' }); ok(r.data?.failed === true, 'test payment fails', r);
r = await rpc(mem, 'get_booking', { bid: bf }); ok(r.data?.paymentStatus === 'failed' && r.data?.allocation?.state === 'awaiting_payment', 'failure recorded, still payable', r.data && { p: r.data.paymentStatus, a: r.data.allocation });
r = await rpc(mem, 'simulate_payment', { bid: bf, outcome: 'success' }); ok(r.data?.booking?.paymentStatus === 'paid', 'paying again works', r);
await rpc(mem, 'cancel_booking', { bid: bf });
r = await rpc(sup, 'admin_suspend_user', { uid: compId, on_off: true, reason: 'e2e' }); ok(!r.error, 'companion suspended', r);
r = await rpc(comp, 'accept_offer', { bid: bf }); ok(/isn’t live/.test(r.error ?? ''), 'a suspended companion cannot accept', r);
r = await rpc(sup, 'admin_suspend_user', { uid: compId, on_off: false, reason: null }); ok(!r.error, 'companion restored', r);
// Locks and the rest of the rules: prsnn-backend/supabase/tests/round5-states.sql (rolled back).

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
