# Barber Dashboard — Design

Brainstormed 2026-06-19. Covers Phase 2 of the build plan (see `../../../project-spec.md`).

## Booking Lifecycle & Slot Locking

A slot becomes unavailable to other clients the moment a request is **submitted with proof of payment attached** — not earlier. Browsing/picking a slot without paying doesn't block it, since the public flow already requires proof upload before submission is possible. No expiry/TTL logic needed for abandoned carts.

States: `pending_verification` -> `confirmed` (barber verifies proof) or `rejected` (bad/fake proof, slot releases) -> `completed` / `no_show` / `cancelled`.

**Walk-ins** skip the public page entirely: the barber adds a booking directly from the dashboard (pick/create client + service + slot), created as `confirmed` immediately, no proof-of-payment step. Confirmed bookings carry a `source: online | walk_in` field, surfaced as a small visual marker in the schedule view so the barber can tell at a glance which is which.

## Screens

- **Login** — single-user auth (barber/owner only, no roles)
- **Today / Week View** (landing) — confirmed bookings for the day/week; each card shows client, service, time, online/walk-in marker; includes a "+ Add walk-in" action
- **Pending Requests** — tab with badge count; lists `pending_verification` bookings
- **Booking Detail** — client info, service, time, uploaded proof image, Approve/Reject (reject only available pre-verification — no refund flow exists for declining after a valid payment, per the original payment-model constraint)
- **Add Walk-in** — pick/create client, service, slot; confirms immediately, no payment step
- **Client List** — contact + last visit, sorted by who's due for a rebooking reminder
- **Client Detail** — full visit history (online + walk-in together)
- **Settings** — services/prices, working hours, payment QR images, shop profile

## Data Model

```
Booking
  id, clientId -> Client
  service: { name, price, durationMinutes }   // snapshotted at booking time, not a live reference
  date, time
  status: pending_verification | confirmed | rejected | completed | no_show | cancelled
  source: online | walk_in
  proofImageUrl   // null for walk-ins
  paymentMethod   // null for walk-ins
  createdAt, updatedAt

Client
  id, name, phone
  lastVisitDate   // derived from most recent completed booking
  createdAt

ShopSettings (single row — one barber)
  services: [{ name, price, durationMinutes }]
  workingHours: [{ day, openTime, closeTime }]
  paymentQrImages: { gcash, gotyme, maya, bdo, bpi }
  shopName, address
```

Service price/duration is snapshotted onto `Booking` at creation time so a future price change doesn't retroactively alter past booking history.

## Notifications (deferred detail)

Badge count + push notification for new pending requests, confirmed in brainstorming. Actual push delivery (web push / service worker, or SMS via a provider like Semaphore) is a backend concern — deferred until auth/backend exists (Phase 3+). For this UI-prototype pass, the badge count is computed client-side from mock data; no real push wiring yet.

## Status

Design validated via brainstorming dialogue. Proceeding to build dashboard screens against mock data (same pattern as the public booking flow) — no backend/database yet.
