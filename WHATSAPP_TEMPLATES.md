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
numbering exactly as shown**.

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

**Body**
```
Hi {{1}}, you have a new booking request on prsnn.

From: {{2}}
When: {{3}}, {{4}}
Duration: {{5}}
Booking ref: {{6}}

Please open the prsnn app to accept or decline this request.
```
**Footer:** `prsnn · Good company, on your terms`
**Button (optional):** Visit website → `Open prsnn` → `https://prsnn.com`

| Var | Meaning | Sample |
|---|---|---|
| {{1}} | companion's first name | Ayesha |
| {{2}} | member's first name | Karan |
| {{3}} | date | Sun, 15 Nov |
| {{4}} | start time | 4:00 PM |
| {{5}} | duration | 2 hours |
| {{6}} | booking reference | ABC9F1 |

---

## 3 · `prsnn_booking_accepted` (Utility → member)

**Body**
```
Hi {{1}}, {{2}} has accepted your booking request on prsnn.

When: {{3}}, {{4}}
Amount due: ₹{{5}}
Booking ref: {{6}}

Please complete the payment in the prsnn app to confirm your booking. Chat with your companion opens once the payment is done.
```
**Footer:** `prsnn · Good company, on your terms`
**Button (optional):** Visit website → `Pay in app` → `https://prsnn.com`

| Var | Meaning | Sample |
|---|---|---|
| {{1}} | member's first name | Karan |
| {{2}} | companion's first name | Ayesha |
| {{3}} | date | Sun, 15 Nov |
| {{4}} | start time | 4:00 PM |
| {{5}} | amount (no ₹, Indian commas) | 1,200 |
| {{6}} | booking reference | ABC9F1 |

---

## 4 · `prsnn_payment_received` (Utility → companion)

**Body**
```
Hi {{1}}, {{2}} has completed the payment of ₹{{3}} for your booking on prsnn.

When: {{4}}, {{5}}
Booking ref: {{6}}

Your booking is confirmed and chat is now open in the prsnn app. Please meet only in public places.
```
**Footer:** `prsnn · Good company, on your terms`

| Var | Meaning | Sample |
|---|---|---|
| {{1}} | companion's first name | Ayesha |
| {{2}} | member's first name | Karan |
| {{3}} | amount | 1,200 |
| {{4}} | date | Sun, 15 Nov |
| {{5}} | start time | 4:00 PM |
| {{6}} | booking reference | ABC9F1 |

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
