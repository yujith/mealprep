# Features

## MVP (Phase 1)

### Customer-Facing

- [ ] **User Registration & Login** — Email + password via Supabase Auth
- [ ] **Profile Management** — Name, phone, address, city
- [ ] **Browse Menu** — Grid/list view with categories, dietary tags, images, prices
- [ ] **Search & Filter** — Filter by category (Keto, Rice & Curry, etc.) and dietary tags
- [ ] **Shopping Cart** — Add/remove items, adjust quantities, persistent via localStorage
- [ ] **Place Order** — Review cart, select payment method, enter delivery address, add notes
- [ ] **Bank Transfer Flow** — View bank details, upload receipt photo
- [ ] **Order Tracking** — Real-time status updates (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- [ ] **Order History** — View past orders with details
- [ ] **Mobile Responsive** — Optimized for mobile-first (customers will come from social media on phones)

### Admin Dashboard (Mom)

- [ ] **Admin Login** — Role-based access, separate admin layout
- [ ] **Dashboard Overview** — Today's orders count, pending orders, revenue summary
- [ ] **Menu Management** — Add/edit/delete menu items, upload images, set availability, manage categories
- [ ] **Order Management** — View all orders, filter by status/date, update order status
- [ ] **Payment Verification** — View uploaded bank transfer receipts, confirm or reject
- [ ] **Delivery Assignment** — Assign delivery method per order (Dad / PickMe / Uber)
- [ ] **Site Settings** — Update delivery fee, operating hours, bank details, business name, contact info
- [ ] **Toggle Order Accepting** — Turn ordering on/off (e.g., when fully booked)

---

## Phase 2 (Post-MVP)

- [ ] **Email Notifications** — Order confirmation, status updates (via Supabase Edge Functions + Resend)
- [ ] **WhatsApp Notifications** — Send order confirmations via WhatsApp Business API
- [ ] **Weekly Menu Scheduling** — Set which items are available on which days
- [ ] **Order Scheduling** — Customers can schedule orders for specific dates/time slots
- [ ] **Repeat Orders** — Re-order a previous order with one click
- [ ] **Reviews & Ratings** — Customers rate meals after delivery
- [ ] **Promo Codes** — Discount codes for social media campaigns

---

## Phase 3 (Future)

- [ ] **Online Payments** — Integrate PayHere or Stripe for card payments
- [ ] **Delivery Tracking** — PickMe/Uber API integration for live tracking
- [ ] **Multi-language** — Sinhala and Tamil translations
- [ ] **Loyalty Program** — Points system for repeat customers
- [ ] **Referral System** — Refer friends, earn discounts
- [ ] **Analytics Dashboard** — Sales trends, popular items, customer insights
- [ ] **SMS Notifications** — Via Dialog/Mobitel SMS gateway
- [ ] **PWA Support** — Install as app on phone, push notifications
