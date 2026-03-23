# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- Supabase account (free tier works)
- Git repository (GitHub recommended for Vercel integration)

---

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g., `mealprep`) and set a strong database password
3. Select the closest region (Singapore for Sri Lanka)
4. Wait for project to provision

### Run Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Paste the contents of `supabase/schema.sql`
3. Click **Run** to create all tables, enums, RLS policies, and triggers

### Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `menu-images` (public)
3. Create bucket: `payment-receipts` (private)
4. Set policies:
   - `menu-images`: Public read, authenticated insert/update (admin check in app)
   - `payment-receipts`: Owner read + admin read, owner insert

### Get API Keys

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ never expose client-side)

### Create Admin User

1. Go to **Authentication → Users** → Invite user
2. Create your mom's account with her email
3. After signup, go to **SQL Editor** and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<user-id-from-auth>';
   ```

---

## 2. Local Development

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Install & Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

---

## 3. Vercel Deployment

### Connect Repository

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

### Custom Domain (Optional)

1. Go to **Settings → Domains** in Vercel
2. Add your domain and configure DNS

### Automatic Deployments

- Every push to `main` triggers a production deployment
- PRs get preview deployments automatically

---

## 4. Post-Deployment Checklist

- [ ] Verify Supabase connection works
- [ ] Create admin account and promote to admin role
- [ ] Add initial menu categories and items
- [ ] Set delivery fee and bank details in site settings
- [ ] Test full order flow (register → browse → order → pay → admin manage)
- [ ] Share the link on social media!

---

## Environment Variables Reference

| Variable | Where Used | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (API routes) | **No** |
