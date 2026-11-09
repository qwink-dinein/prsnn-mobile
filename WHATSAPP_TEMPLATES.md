# WhatsApp templates for prsnn (Waplify → Meta)

Four templates cover login and the booking flow. Submit them in Waplify →
Templates (language **English**), then put the approved names in the backend
env on Render.

| # | Name | Category | Sent to | When | Backend env |
|---|---|---|---|---|---|
| 1 | `prsnn_login_code` | **Authentication** | anyone logging in | sign up, log in, **forgot PIN** | `WAPLIFY_TEMPLATE_NAME` |
| 2 | `prsnn_booking_request` | Utility | companion | a member sends a booking request | `WAPLIFY_TPL_BOOKING_REQUEST` |
| 3 | `prsnn_booking_accepted` | Utility | member | companion accepts → please pay | `WAPLIFY_TPL_BOOKING_ACCEPTED` |
| 4 | `prsnn_payment_received` | Utility | companion | member has paid → chat is open | `WAPLIFY_TPL_PAYMENT_RECEIVED` |

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
