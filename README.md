# NHR Trio — Full-Stack Clothing E-Commerce

Premium clothing storefront built with **Laravel 12 (API) + React 19 (Vite SPA) + Tailwind v3 + MySQL**.

## What's inside

**Storefront**
- Premium, fully responsive UI with a custom Tailwind theme (ink + accent palette, Playfair Display + Inter)
- Home with hero, value props, category grid, featured & new arrivals
- Shop with filters (search, category, price range, featured, on sale) and sort
- Product detail with image gallery, size/color picker, quantity, reviews + verified-purchase ratings
- Cart (localStorage, persisted across sessions)
- Stripe-ready checkout with address book, promo codes, tax + shipping calc
- Order tracking page (public lookup by order number, with timeline)
- Customer account: profile, password change, orders, order detail, addresses, wishlist
- Live chat widget (polling) for logged-in customers AND a contact form for guests

**Admin Console** (`/admin`)
- KPI dashboard (revenue today/month/all, orders, customers, low stock, open chats)
- 30-day sales bar chart, orders-by-status breakdown, top products, recent orders
- Products CRUD with image URLs, variants (sizes/colors), pricing, stock, featured flag
- Categories CRUD
- Orders: filter, view, update status + tracking number; status changes auto-add timeline events visible to customer
- Customers list with lifetime value; promote/demote admin role
- Reviews moderation (approve/reject/delete)
- Coupons CRUD (percent / fixed amount, min total, expiry, usage limit)
- Live chat inbox with unread counts, reply, close

**Backend**
- Laravel 12, Sanctum bearer-token auth
- Eloquent models for User, Category, Product, ProductImage, Address, Order, OrderItem, OrderEvent, Review, Wishlist, Conversation, Message, Coupon
- API at `/api/v1/*` (see `backend/routes/api.php`)
- Stripe PaymentIntent flow (falls back to a mock `pi_mock_*` while you've not yet set real keys)
- Demo seeder: admin user, customer user, 5 categories, 12 products, 2 coupons

---

## Requirements

- PHP 8.2+ (XAMPP works), Composer 2
- Node 20+ and npm
- MySQL 8 (the script targets DB `nhrtrio`)

## Setup

### 1. Create the database

In MySQL Workbench / phpMyAdmin / CLI:

```sql
CREATE DATABASE nhrtrio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure the backend

```powershell
cd D:\nhrtrio\backend
# Edit .env and set DB_PASSWORD to your MySQL root password
notepad .env
```

Then run migrations + seeders:

```powershell
php artisan migrate --seed
```

Demo credentials (created by seeder):

| Role     | Email                     | Password |
|----------|---------------------------|----------|
| Admin    | admin@nhrtrio.test        | password |
| Customer | customer@nhrtrio.test     | password |

Promo codes: `WELCOME10` (10% off, min $50), `NHR25` ($25 off, min $150).

### 3. Run the backend

```powershell
php artisan serve
# http://localhost:8000
```

### 4. Run the frontend

In a second terminal:

```powershell
cd D:\nhrtrio\frontend
npm install        # if not already
npm run dev
# http://localhost:5173
```

Visit **http://localhost:5173** — the storefront. Sign in as admin to access **http://localhost:5173/admin**.

---

## Stripe (optional — works in mock mode without keys)

Get test keys from https://dashboard.stripe.com/test/apikeys and set in `backend/.env`:

```
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
```

And in `frontend/.env`:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

In mock mode the placeholder PaymentIntent succeeds automatically so you can exercise the full order flow before integrating real cards.

To go live with real cards you'd wire `@stripe/react-stripe-js` Elements in `frontend/src/pages/Checkout.jsx` and call `stripe.confirmCardPayment(clientSecret, ...)` before posting to `/orders/:id/confirm-payment`.

---

## Extra features included beyond your spec

- **Order tracking timeline** with public lookup (no login needed) at `/track/<order-number>` — every admin status change appends a timeline event the customer can see
- **Wishlist / favorites** tied to user account
- **Address book** with default address
- **Coupon system** (percent + fixed, min total, usage limit, expiry)
- **Low-stock alerts** on admin dashboard
- **Verified-purchase badges** on reviews (auto-detected from order history)
- **Lifetime value per customer** in admin users table
- **30-day sales chart** + orders-by-status breakdown
- **Guest live chat** so visitors can leave a message before signing up
- **Polished design tokens** (ink + accent palette, soft shadows, Playfair display) for a premium feel

---

## API surface (selected)

Public: `GET /products`, `GET /products/{slug}`, `GET /categories`, `GET /track/{orderNumber}`, `POST /auth/register`, `POST /auth/login`, `POST /chat/guest`

Authenticated: `GET /auth/me`, `GET /orders`, `POST /checkout/place`, `POST /chat/send`, `GET /chat/poll`, `POST /products/{slug}/reviews`, `POST /wishlist/toggle`

Admin: `GET /admin/dashboard`, `apiResource /admin/products`, `apiResource /admin/categories`, `apiResource /admin/coupons`, `GET /admin/orders`, `PATCH /admin/orders/{id}/status`, `GET /admin/conversations`, `POST /admin/conversations/{id}/reply`

Full route list: `backend/routes/api.php`.

---

## Folder layout

```
D:\nhrtrio
├── backend/                Laravel 12 API
│   ├── app/Models           Eloquent models
│   ├── app/Http/Controllers/Api          Public + auth controllers
│   ├── app/Http/Controllers/Api/Admin    Admin controllers
│   ├── database/migrations  Schema migrations
│   ├── database/seeders     Demo data
│   ├── routes/api.php       API routes
│   └── .env                 DB + Stripe config
└── frontend/               React (Vite) SPA
    ├── src/pages            Storefront + account + admin pages
    ├── src/pages/admin      Admin Console
    ├── src/components       Header, Footer, ProductCard, ChatWidget, Stars, …
    ├── src/layouts          SiteLayout, AdminLayout
    ├── src/store            auth + cart (Zustand)
    ├── src/lib              api (axios) + formatters
    └── .env                 API URL + Stripe publishable key
```

---

## Notes on chat real-time delivery

The chat uses **polling every 4s** for live updates. To upgrade to true WebSockets:

1. `composer require laravel/reverb` in the backend
2. Broadcast events from `ChatController@send` and `AdminChatController@reply`
3. Replace the polling loop in `frontend/src/components/ChatWidget.jsx` with Echo + Reverb subscription

The data model and controllers are already designed to support this without changes.
