# أكاديمية أحمد هيثم — Ahmed Haitham Academy

> منصة عربية لبيع الكورسات بتصميم Redpill (أسود/أحمر)، RTL، مع موافقة يدوية على الدفع وتشغيل الفيديوهات عبر Bunny Stream.
>
> Premium Arabic-first, RTL course platform with manual payment approval and Bunny Stream video hosting.

---

## ✨ Features

- **Arabic-first / RTL** — كل الواجهة بالعربية وبتخطيط من اليمين لليسار.
- **Cinematic Redpill design** — أسود/أحمر، خطوط Cairo + Noto Kufi Arabic.
- **Manual payment approval** — الطالب يرفع إيصال الدفع، الإدارة تراجع وتفعّل.
- **Lifetime access** — وصول دائم بعد الموافقة.
- **Protected video playback** — Bunny Stream signed URLs + علامة مائية متحركة.
- **Admin dashboard** — كورسات، دروس، مدفوعات، مستخدمون، اشتراكات، Audit Logs.
- **Role-based access** — `STUDENT` / `ADMIN` مع تحقق من الجانب الخادم في كل مكان.

---

## 🧰 Tech Stack

- Next.js 16 (App Router, Turbopack) · TypeScript (strict)
- MongoDB + Mongoose
- Tailwind CSS v4 · Framer Motion · lucide-react
- React Hook Form + Zod
- bcryptjs · jose (JWT in HTTP-only cookie)
- Cloudinary (uploads) · Bunny Stream (video)

---

## 🚀 Setup

### 1. Prerequisites
- Node.js ≥ 20
- MongoDB (local instance أو Atlas)
- Cloudinary account (مجاني)
- Bunny Stream account (لاستضافة الفيديو)

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env.local
```

ثم عبّئ القيم:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Connection string لـ MongoDB |
| `JWT_SECRET` | سلسلة عشوائية ≥ 32 حرف لتوقيع جلسات JWT |
| `NEXT_PUBLIC_APP_URL` | رابط التطبيق (مثلاً `http://localhost:3000`) |
| `CLOUDINARY_*` | بيانات Cloudinary لرفع إيصالات الدفع |
| `BUNNY_STREAM_LIBRARY_ID` | Library ID من لوحة Bunny |
| `BUNNY_STREAM_API_KEY` | API key |
| `BUNNY_STREAM_SECURITY_KEY` | Security/Token key لتوقيع روابط المشاهدة |

### 4. Seed (يُفضّل قبل أول تشغيل)

```bash
npm run db:seed
```

هذا ينشئ:
- Admin: `admin@example.com` / `Admin@123456`
- Student: `student@example.com` / `Student@123456`
- ٣ كورسات تجريبية مع دروسها (بيانات `videoAssetId` placeholder)
- إيصال دفع تجريبي بحالة "قيد المراجعة"

> ⚠ **تحذير:** بيانات الدخول هذه للتطوير المحلي فقط. لا تستخدمها في الإنتاج.

### 5. Run

```bash
npm run dev
```

افتح http://localhost:3000

---

## 📁 Project Structure

```
src/
  app/
    (public)/                  # الصفحات العامة (Home, Courses, Login, Register)
    dashboard/
      (with-shell)/            # صفحات الطالب مع الـ shell
      lessons/[lessonId]/      # مشغّل الدرس (بدون shell)
    admin/                     # لوحة الإدارة (محمية بـ ADMIN role)
    api/                       # REST endpoints
  components/
    layout/  marketing/  courses/  dashboard/  admin/  forms/  video/  motion/  ui/
  lib/                         # auth · jwt · password · db · constants · arabic · utils
  models/                      # Mongoose schemas
  services/                    # Business logic (auth, course, payment, video, …)
  validators/                  # Zod schemas
middleware.ts                  # Gates /dashboard/* and /admin/*
scripts/seed.ts                # Local dev seed
```

---

## 🔐 Security Notes

- Passwords are hashed with **bcryptjs** (12 rounds).
- Sessions = signed JWT (HS256, jose) in **HTTP-only `Secure` cookie** (sameSite=lax, 7 day TTL).
- Bunny Stream signed embed URL is generated **server-side only**, with 45-minute expiry. The frontend never sees the security key or a permanent video URL.
- Receipt uploads validated on the server (MIME + size, max 5MB, only jpg/png/pdf).
- Every admin mutation writes an `AuditLog` entry.
- Payment approval runs in a Mongo transaction (with graceful fallback when running on a single-node MongoDB).
- Blocked users cannot login or fetch playback data.

---

## 🎨 Branding

| Token | Value |
|---|---|
| Primary Red | `#E50914` |
| Background | `#050505` |
| Surface / Card | `#0B0B0F` / `#111116` |
| Text / Muted | `#F5F5F5` / `#A3A3A3` |

Logo: `public/logo.png` · Owner hero: `public/owner-hero.jpg`

Design system tokens live in `src/app/globals.css` (Tailwind v4 `@theme`).

---

## 🧪 Verification — End-to-end happy path

1. `npm run db:seed`
2. `/` — hero loads with owner image, RTL, Arabic
3. `/courses` — search "تطوير" returns matches
4. Login as student → `/dashboard` shows zero enrollments + 1 pending payment
5. Open course → click **اشترك الآن** → upload jpg receipt → see "قيد المراجعة"
6. Login as admin → `/admin` → see KPI = N pending
7. Open payment → **قبول الدفع** → success toast
8. Login as student → `/dashboard/my-courses` shows the new enrollment
9. Click into a lesson → Bunny iframe renders, watermark moves
10. From admin → block the student → student can no longer login

---

## 📦 Scripts

```bash
npm run dev         # Next dev server (Turbopack)
npm run build       # Production build
npm run start       # Run production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run format      # Prettier
npm run db:seed     # Seed local MongoDB
```

---

## 🧱 Routes Map

**Public** — `/` · `/courses` · `/courses/[slug]` · `/login` · `/register`

**Student** — `/dashboard` · `/dashboard/my-courses` · `/dashboard/payment-proofs` · `/dashboard/payment-proofs/new?courseId=` · `/dashboard/lessons/[lessonId]`

**Admin** — `/admin` · `/admin/courses` · `/admin/courses/new` · `/admin/courses/[id]/edit` · `/admin/courses/[id]/lessons` · `/admin/payments` · `/admin/payments/[id]` · `/admin/users` · `/admin/enrollments`

**API** — see `src/app/api/`

---

## 📄 License

Private — © Ahmed Haitham Academy
