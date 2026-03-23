# Database Schema

## Overview

All tables live in Supabase Postgres. Auth is handled by Supabase Auth (`auth.users`). Application tables are in the `public` schema with Row Level Security (RLS) enabled on all tables.

---

## Enums

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Order statuses
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM ('cash_on_delivery', 'bank_transfer');

-- Payment statuses
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected');

-- Delivery methods
CREATE TYPE delivery_method AS ENUM ('dad', 'pickme', 'uber');
```

---

## Tables

### `profiles`

Extends `auth.users`. Created automatically via trigger on user signup.

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, FK → auth.users.id |
| `full_name` | text | NOT NULL |
| `phone` | text | NOT NULL |
| `address` | text | |
| `city` | text | |
| `role` | user_role | DEFAULT 'customer' |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | DEFAULT now() |

### `menu_categories`

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() |
| `name` | text | NOT NULL, UNIQUE |
| `description` | text | |
| `sort_order` | int | DEFAULT 0 |
| `is_active` | boolean | DEFAULT true |
| `created_at` | timestamptz | DEFAULT now() |

### `menu_items`

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() |
| `category_id` | uuid | FK → menu_categories.id |
| `name` | text | NOT NULL |
| `description` | text | |
| `price` | decimal(10,2) | NOT NULL |
| `image_url` | text | |
| `tags` | text[] | DEFAULT '{}' (e.g., keto, spicy, vegetarian) |
| `is_available` | boolean | DEFAULT true |
| `max_quantity_per_day` | int | |
| `sort_order` | int | DEFAULT 0 |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | DEFAULT now() |

### `orders`

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() |
| `order_number` | serial | UNIQUE, auto-incrementing display number |
| `customer_id` | uuid | FK → profiles.id, NOT NULL |
| `status` | order_status | DEFAULT 'pending' |
| `payment_method` | payment_method | NOT NULL |
| `payment_status` | payment_status | DEFAULT 'pending' |
| `subtotal` | decimal(10,2) | NOT NULL |
| `delivery_fee` | decimal(10,2) | NOT NULL |
| `total` | decimal(10,2) | NOT NULL |
| `delivery_method` | delivery_method | |
| `delivery_address` | text | NOT NULL |
| `delivery_city` | text | |
| `delivery_notes` | text | |
| `scheduled_date` | date | |
| `scheduled_time_slot` | text | |
| `admin_notes` | text | |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | DEFAULT now() |

### `order_items`

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() |
| `order_id` | uuid | FK → orders.id ON DELETE CASCADE |
| `menu_item_id` | uuid | FK → menu_items.id |
| `item_name` | text | NOT NULL (snapshot at order time) |
| `item_price` | decimal(10,2) | NOT NULL (snapshot at order time) |
| `quantity` | int | NOT NULL, CHECK > 0 |
| `line_total` | decimal(10,2) | NOT NULL |

### `payment_receipts`

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() |
| `order_id` | uuid | FK → orders.id, NOT NULL |
| `receipt_url` | text | NOT NULL |
| `uploaded_by` | uuid | FK → profiles.id |
| `status` | payment_status | DEFAULT 'pending' |
| `admin_note` | text | |
| `created_at` | timestamptz | DEFAULT now() |

### `site_settings`

Single-row config table.

| Column | Type | Constraints |
|---|---|---|
| `id` | int | PK, DEFAULT 1, CHECK = 1 |
| `business_name` | text | DEFAULT 'MealPrep' |
| `delivery_fee` | decimal(10,2) | DEFAULT 300.00 |
| `min_order_amount` | decimal(10,2) | DEFAULT 0 |
| `is_accepting_orders` | boolean | DEFAULT true |
| `operating_hours` | jsonb | |
| `bank_details` | jsonb | (bank name, account number, account name) |
| `contact_phone` | text | |
| `contact_whatsapp` | text | |
| `social_links` | jsonb | |
| `created_at` | timestamptz | DEFAULT now() |
| `updated_at` | timestamptz | DEFAULT now() |

---

## Row Level Security (RLS) Policies

### `profiles`
- **SELECT**: Users can read their own profile. Admins can read all.
- **UPDATE**: Users can update their own profile. Admins can update any.
- **INSERT**: Handled by trigger (auto-create on signup).

### `menu_categories` / `menu_items`
- **SELECT**: Public (anyone can browse the menu).
- **INSERT/UPDATE/DELETE**: Admins only.

### `orders`
- **SELECT**: Customers see their own orders. Admins see all.
- **INSERT**: Authenticated customers can create orders.
- **UPDATE**: Admins can update any order. Customers cannot modify after placing.

### `order_items`
- **SELECT**: Same as parent order.
- **INSERT**: Authenticated customers (during order creation).

### `payment_receipts`
- **SELECT**: Owner of the order + admins.
- **INSERT**: Owner of the order.
- **UPDATE**: Admins only (to confirm/reject).

### `site_settings`
- **SELECT**: Public.
- **UPDATE**: Admins only.

---

## Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `menu-images` | Menu item photos | Public read, admin write |
| `payment-receipts` | Bank transfer receipt uploads | Owner + admin read, owner write |

---

## Triggers

1. **`on_auth_user_created`** → Auto-create `profiles` row with default role `customer`
2. **`on_order_updated`** → Update `updated_at` timestamp
3. **`on_menu_item_updated`** → Update `updated_at` timestamp
