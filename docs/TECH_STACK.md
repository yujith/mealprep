# Tech Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.x (App Router) | React framework, SSR/SSG, API routes |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **shadcn/ui** | latest | Accessible, customizable component library |
| **Lucide React** | latest | Icon library |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |
| **Zustand** | 4.x | Client-side state (cart) |
| **date-fns** | 3.x | Date formatting |

## Backend / BaaS

| Technology | Purpose |
|---|---|
| **Supabase** | Auth, Postgres DB, Storage (images/receipts), Realtime subscriptions |
| **@supabase/ssr** | Server-side Supabase client for Next.js App Router |
| **@supabase/supabase-js** | Client-side Supabase SDK |

## Hosting & Infrastructure

| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting, serverless functions, edge middleware |
| **Supabase Cloud** | Managed Postgres, Auth, Storage, Realtime |

## Development Tools

| Tool | Purpose |
|---|---|
| **ESLint** | Linting |
| **Prettier** | Code formatting |
| **Supabase CLI** | Local dev, migrations, type generation |

## Key Architecture Decisions

- **App Router** over Pages Router for server components, layouts, and streaming
- **Supabase RLS** (Row Level Security) for authorization — no custom auth middleware needed for data access
- **Server Components** by default; Client Components only where interactivity is needed (cart, forms)
- **Supabase Storage** for menu item images and bank transfer receipts
- **Zustand** for cart state (persisted to localStorage) — no need for server-side cart
- **Vercel** for zero-config Next.js deployment with automatic preview branches
