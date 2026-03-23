# Google Stitch UI Prompt

Copy and paste the prompt below into Google Stitch to generate the UI for the MealPrep order management system.

---

## Prompt

```
Build a mobile-responsive meal prep ordering web application with the following pages and components. Use a warm, appetizing color palette (warm orange/amber primary, dark brown text, cream/white backgrounds). The design should feel homely and trustworthy — like ordering from a family kitchen. Use modern card-based layouts with rounded corners and subtle shadows.

IMPORTANT: This is a Next.js 14 App Router application using TypeScript, Tailwind CSS, and shadcn/ui components. All pages must be mobile-first responsive.

---

## PAGES & LAYOUTS

### 1. Root Layout
- Sticky top navbar with: logo/business name (left), navigation links (center on desktop, hamburger menu on mobile), cart icon with badge count (right), user avatar/login button (right)
- Footer with: contact info, WhatsApp link, social media icons, "Powered by" text
- Mobile: bottom navigation bar with icons for Home, Menu, Cart, Orders, Profile

### 2. Landing Page (/)
- Hero section with a large appetizing food photo background, overlay text: tagline like "Homemade Sri Lankan Meals, Delivered Fresh" and a CTA button "View Menu"
- "How It Works" section: 3-step cards (Browse Menu → Place Order → Get Delivered)
- Featured menu items section: horizontal scroll of 4-6 item cards
- "Why Choose Us" section: icons + text for Fresh, Homemade, Keto Options, Affordable

### 3. Menu Page (/menu)
- Category tabs/pills at the top (e.g., "All", "Keto", "Rice & Curry", "Snacks", "Beverages") — horizontally scrollable on mobile
- Grid of menu item cards (2 columns on mobile, 3-4 on desktop):
  - Each card: food image (top), name, short description, dietary tags as small badges, price in LKR, "Add to Cart" button with quantity selector
- Search bar at top with filter icon
- "Currently not accepting orders" banner (conditionally shown)

### 4. Menu Item Detail (modal or /menu/[id])
- Large food image
- Item name, full description
- Dietary tags as colored badges (Keto, Spicy, Vegetarian, etc.)
- Price prominently displayed in LKR
- Quantity selector (- / number / +)
- "Add to Cart" button (full width on mobile)

### 5. Cart Page (/cart)
- List of cart items: image thumbnail, name, price, quantity adjuster, line total, remove button
- Order summary card (sticky on desktop, bottom sheet on mobile):
  - Subtotal
  - Delivery fee (shown as flat amount)
  - Total
  - "Proceed to Checkout" button
- Empty cart state with illustration and "Browse Menu" CTA

### 6. Checkout Page (/checkout)
- Step indicator (Delivery Details → Payment → Confirm)
- Delivery details form: address (textarea), city (input), delivery notes (textarea), scheduled date (date picker, optional), time slot (select dropdown, optional)
- Payment method selection: two cards — "Cash on Delivery" (cash icon) and "Bank Transfer" (bank icon)
- If bank transfer selected: show bank details card (bank name, account number, account holder) with copy buttons, and a file upload area for receipt photo
- Order summary sidebar (desktop) / collapsible section (mobile)
- "Place Order" button

### 7. Order Confirmation (/orders/[id]/confirmation)
- Success checkmark animation
- Order number prominently displayed
- Order summary
- "If you chose bank transfer, please upload your receipt" reminder with upload button
- "View My Orders" and "Back to Menu" buttons

### 8. My Orders (/orders)
- Tabs: "Active" and "Past"
- Order cards showing: order number, date, status badge (color-coded), item count, total amount
- Click to expand/navigate to order detail

### 9. Order Detail (/orders/[id])
- Order status progress bar/stepper (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- Order items list with quantities and prices
- Payment info: method, status badge, receipt image (if bank transfer)
- Upload receipt button (if bank transfer and no receipt yet)
- Delivery info: address, notes, delivery method
- Order total breakdown

### 10. Auth Pages (/login, /register)
- Clean, centered card layout
- Login: email, password fields, "Forgot Password?" link, "Sign In" button, "Don't have an account? Register" link
- Register: full name, email, phone, password, confirm password fields, "Create Account" button, "Already have an account? Login" link
- Both should show the business logo/name at the top

### 11. Profile Page (/profile)
- Profile info card: name, email, phone, address, city
- Edit profile form (inline or modal)
- "My Orders" shortcut
- "Logout" button

---

## ADMIN PAGES (under /admin layout)

### 12. Admin Layout
- Sidebar navigation (collapsible on mobile): Dashboard, Menu Items, Categories, Orders, Payments, Settings
- Top bar: "Admin Panel" label, admin name, logout button
- Mobile: hamburger to toggle sidebar

### 13. Admin Dashboard (/admin)
- Stats cards row: Today's Orders, Pending Orders, Today's Revenue (LKR), Total Customers
- Recent orders table (last 10): order number, customer name, items count, total, status badge, time ago
- Quick actions: "Add Menu Item", "View Pending Orders"

### 14. Admin Menu Management (/admin/menu)
- Table/grid of all menu items: image, name, category, price, availability toggle, actions (edit/delete)
- "Add New Item" button → opens form (modal or page):
  - Image upload with preview
  - Name, description (textarea), price, category (select), tags (multi-select: Keto, Spicy, Vegetarian, Gluten-Free), max quantity per day, availability toggle
- Bulk toggle availability

### 15. Admin Categories (/admin/categories)
- Simple list with drag-to-reorder
- Add/edit inline or modal: name, description, active toggle

### 16. Admin Orders (/admin/orders)
- Filter bar: status dropdown, date range picker, search by order number or customer name
- Orders table: order number, customer name, phone, items, total, payment method, payment status, order status, delivery method, date
- Click row to expand order detail inline or navigate to detail page
- Quick actions per row: update status (dropdown), assign delivery method (dropdown)

### 17. Admin Order Detail (/admin/orders/[id])
- Full order info: customer details, items list, totals, payment info
- Status update dropdown with "Update" button
- Delivery method assignment dropdown
- Payment receipt viewer (image) with "Confirm" / "Reject" buttons
- Admin notes textarea with save button

### 18. Admin Payments (/admin/payments)
- Table of bank transfer orders: order number, customer, amount, receipt thumbnail, upload date, status
- Click to view receipt full-size
- "Confirm" / "Reject" buttons per row

### 19. Admin Settings (/admin/settings)
- Form sections:
  - Business Info: business name, contact phone, WhatsApp number
  - Delivery: delivery fee (number input in LKR), toggle accepting orders
  - Bank Details: bank name, account number, account holder name
  - Social Links: Facebook, Instagram, TikTok URLs
  - Operating Hours: day-by-day time inputs
- "Save Changes" button

---

## SHARED COMPONENTS

- **MenuItemCard** — Reusable food item card with image, name, price, tags, add-to-cart
- **OrderStatusBadge** — Color-coded badge (pending=yellow, confirmed=blue, preparing=orange, out_for_delivery=purple, delivered=green, cancelled=red)
- **CartDrawer** — Slide-out cart drawer accessible from any page
- **QuantitySelector** — Minus/plus buttons with number display
- **FileUpload** — Drag-and-drop or click to upload with preview
- **EmptyState** — Illustration + message + CTA for empty lists
- **LoadingSkeleton** — Skeleton loading states for all data-heavy sections
- **PriceDisplay** — Formatted LKR price component
- **StatusStepper** — Horizontal progress stepper for order status

---

## DESIGN NOTES

- Currency: Sri Lankan Rupee (LKR) — display as "Rs. 1,500.00" or "LKR 1,500"
- Mobile-first: design for 375px width first, then scale up
- Use warm food photography placeholders
- Status colors: pending=#EAB308, confirmed=#3B82F6, preparing=#F97316, out_for_delivery=#8B5CF6, delivered=#22C55E, cancelled=#EF4444
- Cards should have subtle hover effects on desktop
- Use toast notifications for actions (added to cart, order placed, status updated)
- All forms should have inline validation with helpful error messages
```
