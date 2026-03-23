# API Routes

All data access goes through Supabase client SDK with RLS. Next.js API routes are used only for operations that need server-side logic (e.g., webhook handling, complex transactions).

---

## Authentication (Supabase Auth — no custom API needed)

| Action | Method | Supabase SDK |
|---|---|---|
| Register | — | `supabase.auth.signUp()` |
| Login | — | `supabase.auth.signInWithPassword()` |
| Logout | — | `supabase.auth.signOut()` |
| Get session | — | `supabase.auth.getSession()` |
| Reset password | — | `supabase.auth.resetPasswordForEmail()` |

---

## Next.js API Routes (`/app/api/`)

### Orders

| Route | Method | Description | Auth |
|---|---|---|---|
| `/api/orders` | POST | Create a new order (validates cart, calculates totals, inserts order + items in a transaction) | Customer |
| `/api/orders/[id]/status` | PATCH | Update order status | Admin |
| `/api/orders/[id]/delivery` | PATCH | Assign delivery method | Admin |

### Payments

| Route | Method | Description | Auth |
|---|---|---|---|
| `/api/payments/[orderId]/upload-receipt` | POST | Upload bank transfer receipt to Supabase Storage, create `payment_receipts` record | Customer |
| `/api/payments/[receiptId]/verify` | PATCH | Confirm or reject a payment receipt | Admin |

### Menu (Admin)

| Route | Method | Description | Auth |
|---|---|---|---|
| `/api/menu/items` | POST | Create menu item (with image upload) | Admin |
| `/api/menu/items/[id]` | PATCH | Update menu item | Admin |
| `/api/menu/items/[id]` | DELETE | Soft-delete / deactivate menu item | Admin |
| `/api/menu/categories` | POST | Create category | Admin |
| `/api/menu/categories/[id]` | PATCH | Update category | Admin |

### Settings

| Route | Method | Description | Auth |
|---|---|---|---|
| `/api/settings` | PATCH | Update site settings | Admin |

---

## Direct Supabase Queries (Client-Side via SDK + RLS)

These don't need API routes — the Supabase client handles them directly with RLS enforcing permissions.

### Public (No Auth)

- `menu_items` SELECT (where `is_available = true`) — Browse menu
- `menu_categories` SELECT (where `is_active = true`) — Get categories
- `site_settings` SELECT — Get delivery fee, business info, bank details

### Customer (Authenticated)

- `profiles` SELECT/UPDATE own profile
- `orders` SELECT own orders (with `order_items`)
- `payment_receipts` SELECT own receipts

### Admin

- `orders` SELECT all orders
- `profiles` SELECT all customer profiles
- `payment_receipts` SELECT all receipts
- `menu_items` full CRUD
- `menu_categories` full CRUD
- `site_settings` UPDATE

---

## Server Actions (Next.js)

For simple mutations, Next.js Server Actions can be used instead of API routes:

- `createOrder(formData)` — Validate + insert order
- `updateProfile(formData)` — Update customer profile
- `uploadReceipt(formData)` — Upload payment receipt
- `updateOrderStatus(orderId, status)` — Admin update
- `upsertMenuItem(formData)` — Admin menu management
