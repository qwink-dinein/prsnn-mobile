# WhatsApp templates for prsnn (Waplify → Meta)

Eight templates cover login, the booking flow, the day-of reminder and safety alerts. Submit them in Waplify →
Templates (language **English**), then put the approved names in the backend
env on Render.

| # | Name | Category | Sent to | When | Backend env |
|---|---|---|---|---|---|
| 1 | `prsnn_login_code` | **Authentication** | anyone logging in | sign up, log in, **forgot PIN** | `WAPLIFY_TEMPLATE_NAME` |
| 2 | `prsnn_booking_request` | Utility | companion | a member sends a booking request | `WAPLIFY_TPL_BOOKING_REQUEST` |
| 3 | `prsnn_booking_accepted` | Utility | member | companion accepts → please pay | `WAPLIFY_TPL_BOOKING_ACCEPTED` |
| 4 | `prsnn_payment_received` | Utility | companion | member has paid → chat is open | `WAPLIFY_TPL_PAYMENT_RECEIVED` |
| 5 | `prsnn_booking_confirmed` | Utility | member | companion accepted a paid booking | `WAPLIFY_TPL_BOOKING_CONFIRMED` |
| 6 | `prsnn_booking_unfulfilled` | Utility | member | nobody accepted → full refund | `WAPLIFY_TPL_BOOKING_UNFULFILLED` |
| 7 | `prsnn_panic_alert` | Utility | **every admin** | panic button pressed; repeats every 5 min until resolved | `WAPLIFY_TPL_PANIC_ALERT` |
| 8 | `prsnn_session_reminder` | Utility | member **and** companion | 5:00 AM on the day of a confirmed, paid session | `WAPLIFY_TPL_SESSION_REMINDER` |

**Who gets which message (2026-11-14).** Each booking message goes to one side only:
the companion gets #2 when a member books (the member is not messaged — they know they
booked); the member gets #5 when a companion accepts (the companion is not messaged —
they know they accepted). Only the 5 AM reminder (#8) goes to both.

> **Why #1 is "Authentication", not "Utility".** Meta only allows one-time
> codes in Authentication templates. A Utility template containing a code
> is rejected or moved to Marketing pricing. Messages 2–4 are booking
> updates, **not codes**, so they are Utility. If you want a code at the
> meeting itself (the companion asks the member for a 4-digit "start code"
> to begin the session, like a ride PIN), that is a separate feature. Ask
> and I'll add it.

Rules Meta checks for Utility templates: no promotional words or offers, a
variable can't be the very first or last thing in the body, and every
variable needs a sample value. The wording below follows those rules. The
variables match `src/utils/whatsappNotify.js` in the backend, so **keep the
numbering exactly as shown**. No name is fixed in the text: people, brand,
dates and amounts are all variables.

---

## 1 · `prsnn_login_code` (Authentication)

Meta writes the body for Authentication templates. You only choose options:

- **Code delivery:** Copy code button (button text: `Copy code`)
- **Add security recommendation:** ✅ on
- **Add expiry time:** ✅ 5 minutes

The message people get:

> **123456** is your verification code. For your security, do not share this code.
> This code expires in 5 minutes.
> [ Copy code ]

The same template is used for registration, login and "Forgot PIN" (the app
asks for a code, then lets you choose a new PIN). The backend sends the code
in `body_data["1"]` and again in `url_button_data` for the Copy-code button.
Set `WAPLIFY_CODE_KEYS=1`.

*Can it reuse Hyderabad Rishta's template?* Only if both apps send from the
**same WhatsApp number / Waplify account**. Authentication text names no
brand, but members see the sender's business name and photo. If prsnn has
its own WhatsApp Business number (recommended, so people see "prsnn"),
create this template there. It is approved quickly.

---

## 2 · `prsnn_booking_request` (Utility → companion)

Every name is a variable, including the brand. No footer and no buttons
(footers can't hold variables, and a website button hardcodes the brand).

**Body**
```
Hello {{1}}, you have received a new booking request on {{2}}.

Requested by: {{3}}
Date: {{4}}
Time: {{5}}
Duration: {{6}}
Booking reference: {{7}}

Please open the app to accept or decline this request at the earliest.
```

| Var | Meaning | Sample to enter in Waplify |
|---|---|---|
| {{1}} | companion's first name | Ayesha |
| {{2}} | brand (`WAPLIFY_BRAND_NAME`, default "prsnn") | prsnn |
| {{3}} | member's first name | Karan |
| {{4}} | date | Sun, 15 Nov |
| {{5}} | start time | 4:00 PM |
| {{6}} | duration | 2 hours |
| {{7}} | booking reference | ABC9F1 |

---

## 3 · `prsnn_booking_accepted` (Utility → member)

**Body**
```
Hello {{1}}, your booking request on {{2}} has been accepted by {{3}}.

Date: {{4}}
Time: {{5}}
Amount payable: ₹{{6}}
Booking reference: {{7}}

Please complete the payment in the app to confirm your booking. Chat will be enabled once the payment is received.
```

| Var | Meaning | Sample |
|---|---|---|
| {{1}} | member's first name | Karan |
| {{2}} | brand | prsnn |
| {{3}} | companion's first name | Ayesha |
| {{4}} | date | Sun, 15 Nov |
| {{5}} | start time | 4:00 PM |
| {{6}} | amount (no ₹, Indian commas) | 1,200 |
| {{7}} | booking reference | ABC9F1 |

---

## 4 · `prsnn_payment_received` (Utility → companion)

**Body**
```
Hello {{1}}, the payment of ₹{{2}} from {{3}} has been received for your booking on {{4}}.

Date: {{5}}
Time: {{6}}
Booking reference: {{7}}

Your booking is now confirmed and chat is enabled in the app. Please remember to meet only in public places.
```

| Var | Meaning | Sample |
|---|---|---|
| {{1}} | companion's first name | Ayesha |
| {{2}} | amount | 1,200 |
| {{3}} | member's first name | Karan |
| {{4}} | brand | prsnn |
| {{5}} | date | Sun, 15 Nov |
| {{6}} | start time | 4:00 PM |
| {{7}} | booking reference | ABC9F1 |

### If Meta still rejects one

- **"Too many variables for the length"**: delete the `Duration` line from #2 and tell me. I'll drop that variable in the code.
- **Category changed to Marketing**: re-submit as Utility, with "Transactional booking update" as the use case.
- Never put a variable as the first or last word, or two variables side by side. These bodies avoid both.
- Waplify's sample-value fields must be filled exactly in order {{1}}…{{7}}.

---

## Worth adding next (not wired yet)

| Name | To | When |
|---|---|---|
| `prsnn_booking_declined` | member | companion declines. Without it, members only find out in the app |
| `prsnn_booking_cancelled` | the other person | either side cancels |
| `prsnn_session_reminder` | both | 1 hour before the session |
| `prsnn_companion_verified` | companion | admin approves their ID. "You're live on prsnn" |

## Render env (backend)

```
WAPLIFY_API_KEY=wapl_...
WAPLIFY_TEMPLATE_NAME=prsnn_login_code
WAPLIFY_CODE_KEYS=1
WAPLIFY_BRAND_NAME=prsnn
WAPLIFY_TPL_BOOKING_REQUEST=prsnn_booking_request
WAPLIFY_TPL_BOOKING_ACCEPTED=prsnn_booking_accepted
WAPLIFY_TPL_PAYMENT_RECEIVED=prsnn_payment_received
PAYMENT_MODE=simulated     # until Razorpay is switched on
```

Each booking message is optional. While a name is empty, that message is
skipped and the in-app notification still appears. The app's login screen
tells people they'll get login codes and booking updates on WhatsApp, which
is the opt-in Meta expects.

WhatsApp goes to the verified login number. For older web accounts without
one, it goes to the number on their profile.

---

## Prepaid booking messages (added 2026-11-09)

With the prepaid flow, the **companion offer** reuses `prsnn_booking_request` (template 2:
“…new booking request… open the app to accept or decline”). Two more Utility templates
are needed. `prsnn_booking_accepted` and `prsnn_payment_received` stay for website bookings.

### 5 · `prsnn_booking_confirmed` (Utility → member) · env `WAPLIFY_TPL_BOOKING_CONFIRMED`

```
Hello {{1}}, your booking on {{2}} is confirmed with {{3}}.

Date: {{4}}
Time: {{5}}
Booking reference: {{6}}

You can now chat with your companion in the app. Please remember to meet only in public places.
```
Samples: {{1}} Karan · {{2}} prsnn · {{3}} Ayesha · {{4}} Sun, 15 Nov · {{5}} 4:00 PM · {{6}} ABC9F1

### 6 · `prsnn_booking_unfulfilled` (Utility → member) · env `WAPLIFY_TPL_BOOKING_UNFULFILLED`

```
Hello {{1}}, we could not find an available companion for your booking on {{2}}.

Date: {{3}}
Time: {{4}}
Refund amount: ₹{{5}}
Booking reference: {{6}}

Your full refund has been started to your original payment method. You can book again in the app anytime.
```
Samples: {{1}} Karan · {{2}} prsnn · {{3}} Sun, 15 Nov · {{4}} 4:00 PM · {{5}} 1,299 · {{6}} ABC9F1

---

## 7 · `prsnn_panic_alert` (Utility → every admin) · env `WAPLIFY_TPL_PANIC_ALERT`

Sent when a member or companion holds the **panic button** during a session
(it is on from the start time until 1 hour after the end). It goes to every
admin number at once — every staff account (sub-admins and superadmins) and
every number in the superadmin list — and **again every 5 minutes** until an
admin marks it resolved in the app, or the person who pressed it stops it with
their PIN. Admins also get a loud push ("Safety alerts" channel on Android).

Category **Utility** (it is about an existing booking and is not promotional).
No header, no footer, no buttons. Language English.

**Body**
```
Safety alert from {{1}}: {{2}} pressed the panic button during booking {{3}}.

Date: {{4}}
Time: {{5}}
Member: {{6}}, {{7}}
Companion: {{8}}, {{9}}
Meeting place: {{10}}

Session: {{11}}
Status: {{12}}

Please call them now. This alert repeats every 5 minutes until it is marked resolved in the admin app.
```

| Var | Meaning | Sample to enter in Waplify |
|---|---|---|
| {{1}} | brand | prsnn |
| {{2}} | who pressed it, with their role | Rahul Mehta (member) |
| {{3}} | booking reference | #A6F7ED |
| {{4}} | date | Sat 15 Nov 2026 |
| {{5}} | session time | 4:00 PM – 8:00 PM |
| {{6}} | member's full name | Rahul Mehta |
| {{7}} | member's mobile | +91 98765 43210 |
| {{8}} | companion's full name | Priya Nair |
| {{9}} | companion's mobile | +91 90000 11111 |
| {{10}} | the agreed public place (and who they're meeting, for bookings made for someone else) | Starbucks, Inorbit Mall, Madhapur, Hyderabad |
| {{11}} | duration and activity | 4 hours · Don't Go Alone |
| {{12}} | which alert this is and when it was first pressed | Alert 2, first pressed at 4:35 PM |

> **Updated 2026-11-14: now 12 variables.** If you already submitted the 10-variable
> version, submit this one as a new template (same name with `_v2`, e.g.
> `prsnn_panic_alert_v2`) and set the secret to that name. Until the secret is set,
> admins still get the push and the in-app alert with all the same details.

After Meta approves it, add the secret **`WAPLIFY_TPL_PANIC_ALERT` = `prsnn_panic_alert`**
(Supabase → Edge Functions → Secrets). Until then admins still get the push and the
in-app alert; the WhatsApp message starts as soon as the secret is set.

> Admins must have a number on their account (phone login, or the mobile with
> country code that email sign-ups give) to receive it. Numbers in the superadmin
> list always receive it.

---

## 8 · `prsnn_session_reminder` (Utility → member and companion) · env `WAPLIFY_TPL_SESSION_REMINDER`

Sent at **5:00 AM India time** on the day of a confirmed, paid session, once to each side.
Not sent for bookings confirmed after 5 AM that same day (they have just had their
confirmation). No header, footer or buttons. Language English.

**Body**
```
Hello {{1}}, this is a reminder from {{2}} that your session with {{3}} is today.

Date: {{4}}
Time: {{5}}
Meeting place: {{6}}
Booking reference: {{7}}

Please be there on time and meet only in public places. You can chat in the app if anything changes.
```

| Var | Meaning | Sample to enter in Waplify |
|---|---|---|
| {{1}} | the person's first name | Karan |
| {{2}} | brand | prsnn |
| {{3}} | the other person's first name | Ayesha |
| {{4}} | date | Sun, 15 Nov |
| {{5}} | start time | 4:00 PM |
| {{6}} | meeting place, area, city | Starbucks, Inorbit Mall, Madhapur, Hyderabad |
| {{7}} | booking reference | ABC9F1 |

After Meta approves it, add the secret **`WAPLIFY_TPL_SESSION_REMINDER` = `prsnn_session_reminder`**
(Supabase → Edge Functions → Secrets). Until then the reminder arrives as a push and in the bell.
