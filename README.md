# The Jobsync — Website

A full-stack site with a clear split between frontend and backend:

```
thejobsync-website/
├── frontend/     React + TypeScript + Vite app
├── backend/      Express API, using Supabase (PostgreSQL) for storage
└── supabase/     SQL to create the database schema (+ optional seed data)
```

## 1. Create the Supabase project

1. Create a project at https://supabase.com.
2. Open **SQL Editor** in the Supabase dashboard, paste in `supabase/schema.sql`, and run it. This creates the `blogs`, `testimonials`, `inquiries`, `careers`, and `admin_users` tables.
3. Optionally run `supabase/seed.sql` too, to add a couple of sample testimonials/careers and a default admin login (`admin@thejobsync.com` / `admin123` — change this password after your first login).
4. Go to **Project Settings → API** and copy the **Project URL** and the **`service_role` key** (not the `anon` key — the backend needs the service role key to bypass Row Level Security).

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in `backend/.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — from step 1.
- `SMTP_*` / `CONTACT_EMAIL` are optional — leave blank to skip email notifications on new contact-form submissions (inquiries are always saved to Supabase either way).

`frontend/.env` just needs the backend's URL:
```
VITE_API_BASE_URL=http://localhost:5000
```

## 3. Install & run locally

```bash
npm run install:all

# Terminal 1
npm run dev:backend     # http://localhost:5000

# Terminal 2
npm run dev:frontend    # http://localhost:5173
```

## 4. Deploy

Deploy `frontend/` and `backend/` as two separate projects (each has its own `vercel.json`, so this works well on Vercel — but any Node host works for the backend and any static host works for the frontend build).

- **Backend**: deploy `backend/`, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and (optionally) the `SMTP_*` vars in the host's environment settings.
- **Frontend**: deploy `frontend/`, set `VITE_API_BASE_URL` to your deployed backend's URL.

## API routes

All under `/api`: `blogs`, `testimonials`, `inquiries`, `careers`, `admin/login`, `admin/register`, `contact`, `health`.

## ⚠️ Before you push this anywhere

Two secrets were hardcoded in the original project files and are exposed in this zip:
1. A **MongoDB Atlas connection string with a real username/password** was committed in `backend/.env.example`.
2. A **hardcoded SMTP username/password** (`hr@thejobsync.com` / a Zoho password) was used as a fallback default inside `api/contact.js` and `frontend/api/contact.js`.

Both of these are no longer present in this restructured project (Mongo is gone entirely, and the new `backend/src/routes/contact.js` only uses SMTP credentials from environment variables, with no fallback). **But since they were already committed to the zip/repo you shared, rotate/change that MongoDB password and that SMTP password now** — treat them as compromised regardless of this cleanup.

## Notes on what changed from the original zip

- Removed the duplicate `api/` (root) and `frontend/api/` serverless functions — the app now has one backend implementation, in `backend/`.
- Removed MongoDB/Mongoose entirely; all data access now goes through `@supabase/supabase-js` using the service-role key server-side.
- Removed the root-level `index.html`, `vercel.json`, and `package.json` that duplicated `frontend/`'s files.
- `frontend/package.json` no longer lists backend-only dependencies (`mongodb`, `mongoose`, `nodemailer`, `cors`, `dotenv`) that had nothing to do with the frontend build.
- Fixed a naming mismatch: the old `frontend/.env.local` defined `VITE_API_URL`, but the frontend code actually reads `VITE_API_BASE_URL` — this is now consistent in `frontend/.env.example`.
- Admin login/registration still compares passwords as plain text (same behavior as the original) — fine for a first pass, but hash passwords (e.g. with bcrypt) before this handles real users.
