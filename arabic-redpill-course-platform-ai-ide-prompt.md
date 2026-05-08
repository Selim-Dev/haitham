# AI IDE Master Prompt — Arabic Red/Black Course Platform

Use this prompt in Cursor, Windsurf, Bolt, Lovable, Replit Agent, or any AI coding assistant to generate the project from scratch.

---

## Master Prompt

You are a senior full-stack product engineer, UI/UX designer, and software architect. Build a premium, modern, production-quality Arabic online course platform from scratch.

The platform is intended mainly for **Arabic-speaking users**. The whole public frontend must be **Arabic-first**, **RTL by default**, visually powerful, and emotionally persuasive.

The brand direction is inspired by **Redpill**:
- strong
- bold
- premium
- dark
- masculine/serious
- confidence-building
- high-conversion
- black and red visual identity

The platform owner will provide:
- A logo image for the website.
- A personal image of the owner/instructor to use beautifully in the hero section.

The owner image must be used in a cinematic, premium, astonishing hero section. The design should make the owner look like the trusted expert/mentor behind the platform.

The final result should look like a premium creator academy / high-end course platform, not a basic LMS template.

---

## Core Product Idea

Build a custom course-selling platform where Arabic-speaking users can browse courses, create an account, upload a payment receipt manually, wait for admin approval, and after approval get lifetime access to purchased course videos.

The platform does **not** use an online payment gateway in MVP.

Payment flow:
1. User opens a course.
2. User clicks the Arabic CTA: "اشترك الآن" or "احصل على الكورس".
3. Website shows manual payment instructions.
4. User uploads payment receipt.
5. Admin reviews receipt from dashboard.
6. Admin approves or rejects payment.
7. If approved, user gets lifetime access to the course.
8. User can watch the course videos anytime.

The videos must not be uploaded directly to our server. Use an external video provider abstraction.

Primary video provider for MVP:
- **Bunny Stream**

Optional future providers:
- VdoCipher
- Cloudflare Stream
- Mux

Store only provider name and video asset ID in the database. Do not expose permanent video URLs to the frontend.

---

## Product Positioning

The platform should feel like a serious Arabic learning/productivity/transformation academy.

The visual message should communicate:

```txt
تعلم بجدية
ادخل عالم مختلف
محتوى قوي ومباشر
ادفع مرة واحدة واحصل على وصول دائم
تجربة تعليمية منظمة وآمنة
```

The tone should be:
- confident
- direct
- premium
- Arabic-native
- persuasive without sounding cheap
- strong but clean

Avoid generic English SaaS copy. Use polished Arabic copy.

---

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- shadcn/ui
- Framer Motion
- lucide-react
- React Hook Form
- Zod
- bcryptjs
- JWT auth with HTTP-only cookies
- Cloudinary or S3-compatible storage abstraction for receipt uploads
- Bunny Stream as the default video provider
- External video provider abstraction
- Responsive design
- RTL by default
- Arabic-first UI
- Arabic fonts using `next/font/google`

Prefer clean, maintainable architecture.

Do not use Prisma.
Do not use SQL.
Do not build video transcoding, HLS, DRM, or CDN infrastructure from scratch.
Do not store receipt images inside MongoDB. Store only the file URL/key.
Do not use YouTube as the video provider for paid course videos.

---

## Arabic and RTL Requirements

The public website must be Arabic-first.

Requirements:
- Set `<html lang="ar" dir="rtl">`.
- Use RTL-friendly layout and spacing.
- Sidebar should appear on the right in Arabic layouts.
- Tables, forms, filters, dashboards, dropdowns, and cards must be RTL-aware.
- Form labels and placeholders must be in Arabic.
- Public navigation must be Arabic.
- Student dashboard must be Arabic.
- Payment proof upload flow must be Arabic.
- Admin dashboard can be Arabic too. Prefer Arabic labels unless technical fields require English.
- Use clear Arabic copy, not machine-translated awkward Arabic.
- Use Arabic punctuation and natural phrasing.
- Avoid mixing English unless it is a technical/provider field.

Recommended Arabic fonts:
- Cairo
- Tajawal
- IBM Plex Sans Arabic
- Noto Kufi Arabic

Use one main font and one optional display/accent font.

Example:
- Main UI font: Cairo
- Strong headings: Noto Kufi Arabic or IBM Plex Sans Arabic

Implement fonts using `next/font/google`.

Example style direction:
```ts
import { Cairo, Noto_Kufi_Arabic } from "next/font/google";
```

---

## Brand Identity

Brand style:
- Black and red dominant colors.
- The red should feel powerful and premium, not childish.
- Use deep red, crimson, blood red, or electric red.
- Use black, near-black, charcoal, and dark gradients.
- Use white/off-white text.
- Use muted gray for secondary text.
- Use red glow accents carefully.

Suggested palette:
```txt
Background: #050505
Surface: #0B0B0F
Card: #111116
Border: rgba(255,255,255,0.08)
Primary Red: #E50914
Deep Red: #B00020
Dark Red: #7A0015
Text: #F5F5F5
Muted Text: #A3A3A3
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
```

Visual direction:
- Dark luxury theme by default.
- Red/black gradients.
- Cinematic lighting.
- Glassmorphism cards.
- Premium shadows.
- Subtle red glow.
- Strong contrast.
- Large Arabic headlines.
- Modern course cards.
- Animated hero visuals.
- Smooth page transitions.
- Clean dashboard.
- Responsive mobile-first design.

Avoid:
- childish red backgrounds
- too much neon
- weak generic templates
- blue SaaS style
- English-first layout
- crowded pages

---

## Logo and Owner Image Requirements

The platform owner will provide:
- logo
- personal image

Assume files may be placed at:
```txt
/public/logo.png
/public/logo.svg
/public/owner-hero.png
/public/owner-hero.jpg
```

If files do not exist yet:
- show graceful placeholders
- add comments showing where to replace them
- do not break the build

Hero image treatment:
- owner image should be inside a premium cinematic card
- black/red gradient aura behind the owner
- subtle red radial glow
- glass panel behind image
- floating badges around the image
- optional blurred red ring/light effect
- owner should feel like the mentor/expert

Floating hero badges examples:
```txt
وصول مدى الحياة
محتوى حصري
دفع يدوي آمن
مراجعة سريعة
تعلم بدون تعقيد
```

---

## Public Website Copy Direction

Use Arabic copy across the frontend.

Hero headline examples:
```txt
ادخل عالم التعلم الجاد مع كورسات مصممة لتغيير مستواك
```

Alternative:
```txt
تعلم بعمق. طبّق بثقة. وابدأ رحلتك من هنا.
```

Hero subtitle:
```txt
منصة عربية تقدم كورسات مركزة وعملية، ادفع مرة واحدة، ارفع إيصال الدفع، وبعد الموافقة تحصل على وصول دائم للمحتوى.
```

CTA buttons:
```txt
تصفح الكورسات
ابدأ الآن
اشترك في كورس
ارفع إيصال الدفع
```

How it works:
```txt
١. اختر الكورس المناسب لك
٢. ادفع بالطريقة الموضحة
٣. ارفع إيصال الدفع
٤. انتظر موافقة الإدارة
٥. ابدأ التعلم بوصول دائم
```

Security/access message:
```txt
وصولك للمحتوى مرتبط بحسابك، والفيديوهات محمية بروابط مؤقتة وعلامة مائية خاصة بك.
```

Course card labels:
```txt
المستوى
عدد الدروس
السعر
اشترك الآن
تفاصيل الكورس
```

Payment statuses:
```txt
قيد المراجعة
تمت الموافقة
مرفوض
```

Enrollment/access statuses:
```txt
لديك وصول لهذا الكورس
بانتظار مراجعة الدفع
لم تشترك بعد
```

---

## Required User Roles

Create two roles:

```ts
"STUDENT" | "ADMIN"
```

Student can:
- Register/login/logout.
- Browse published courses.
- Search/filter courses.
- View course details.
- Upload payment proof.
- View payment request status.
- View approved/enrolled courses.
- Watch enrolled course lessons.
- Track lesson progress.

Admin can:
- Login.
- Access admin dashboard.
- Create/update/delete courses.
- Publish/unpublish courses.
- Create/update/delete lessons.
- Add Bunny Stream video asset ID per lesson.
- Optionally choose other video providers in future.
- View payment proofs.
- Approve/reject payment proofs.
- Automatically create enrollment after approval.
- View users.
- View enrollments.
- Revoke enrollment.
- See basic dashboard analytics.

---

## Main Data Models

Create Mongoose models in `/src/models`.

### User

Fields:
- name
- email
- phone
- passwordHash
- role: STUDENT | ADMIN
- isBlocked
- timestamps

Rules:
- email unique, lowercase, trimmed
- phone indexed
- password never returned in API responses

### Course

Fields:
- title
- slug
- description
- shortDescription
- price
- currency, default "EGP"
- thumbnailUrl
- category
- level: BEGINNER | INTERMEDIATE | ADVANCED
- durationLabel
- lessonsCount
- isPublished
- featured
- createdBy
- timestamps

Indexes:
- slug unique
- text index on title, description, category

Arabic display labels:
```txt
BEGINNER = مبتدئ
INTERMEDIATE = متوسط
ADVANCED = متقدم
```

### Lesson

Fields:
- courseId
- title
- description
- order
- videoProvider: BUNNY | VDOCIPHER | CLOUDFLARE_STREAM | MUX
- videoAssetId
- durationSeconds
- isPreview
- isPublished
- timestamps

Rules:
- default provider should be `BUNNY`
- never expose permanent playback URL
- frontend receives playback data only through protected endpoint

### PaymentProof

Fields:
- userId
- courseId
- amount
- currency
- receiptUrl
- receiptStorageKey
- transactionReference
- userNote
- status: PENDING | APPROVED | REJECTED
- adminNote
- reviewedBy
- reviewedAt
- timestamps

Arabic display labels:
```txt
PENDING = قيد المراجعة
APPROVED = تمت الموافقة
REJECTED = مرفوض
```

### Enrollment

Fields:
- userId
- courseId
- paymentProofId
- status: ACTIVE | REVOKED
- accessType: LIFETIME
- timestamps

Rules:
- unique compound index on userId + courseId

Arabic display labels:
```txt
ACTIVE = نشط
REVOKED = تم إلغاء الوصول
LIFETIME = مدى الحياة
```

### WatchProgress

Fields:
- userId
- lessonId
- progressSeconds
- completed
- timestamps

Rules:
- unique compound index on userId + lessonId

### AuditLog

Fields:
- actorId
- action
- entityType
- entityId
- metadata
- timestamps

Use audit logs for admin approval, rejection, course updates, lesson updates, and enrollment revoke.

---

## Access-Control Rules

Implement server-side access control only. Never trust frontend checks.

Rules:
- Public visitors can view published course listing and course detail pages.
- Only logged-in students can upload payment proof.
- Users can only see their own payment proofs.
- Users can only access lessons if:
  - lesson is preview, OR
  - user has ACTIVE enrollment for the lesson's course.
- Only admins can access `/admin`.
- Only admins can create/update/delete courses.
- Only admins can approve/reject payments.
- Only admins can revoke enrollments.
- Blocked users cannot log in or request playback.
- The frontend should never receive Bunny API keys.
- The frontend should never receive permanent Bunny video URLs.

---

## App Routes

Use Next.js App Router.

### Public Routes

```txt
/
 /courses
 /courses/[slug]
 /login
 /register
```

Arabic page titles:
```txt
/ = الرئيسية
/courses = الكورسات
/login = تسجيل الدخول
/register = إنشاء حساب
```

### Student Routes

```txt
/dashboard
/dashboard/my-courses
/dashboard/my-courses/[courseSlug]
/dashboard/lessons/[lessonId]
/dashboard/payment-proofs
/dashboard/payment-proofs/new?courseId=
```

Arabic labels:
```txt
لوحة التعلم
كورساتي
الدروس
إيصالات الدفع
رفع إيصال جديد
```

### Admin Routes

```txt
/admin
/admin/courses
/admin/courses/new
/admin/courses/[id]/edit
/admin/courses/[id]/lessons
/admin/payments
/admin/payments/[id]
/admin/users
/admin/enrollments
/admin/settings
```

Arabic labels:
```txt
لوحة التحكم
إدارة الكورسات
إضافة كورس
إدارة الدروس
مراجعة المدفوعات
المستخدمون
الاشتراكات
الإعدادات
```

---

## API Routes

Create REST-style route handlers.

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Public Courses

```txt
GET /api/courses
GET /api/courses/[slug]
```

Course listing must support:
- search
- category
- level
- minPrice
- maxPrice
- sort: newest | price-low | price-high

Arabic search placeholder:
```txt
ابحث عن كورس، مهارة، أو موضوع...
```

### Student

```txt
GET  /api/me/enrollments
GET  /api/me/payment-proofs
POST /api/payment-proofs
GET  /api/lessons/[lessonId]/playback
PATCH /api/watch-progress/[lessonId]
```

### Admin Courses

```txt
GET    /api/admin/courses
POST   /api/admin/courses
GET    /api/admin/courses/[id]
PATCH  /api/admin/courses/[id]
DELETE /api/admin/courses/[id]
```

### Admin Lessons

```txt
POST   /api/admin/lessons
PATCH  /api/admin/lessons/[id]
DELETE /api/admin/lessons/[id]
```

### Admin Payments

```txt
GET   /api/admin/payment-proofs
GET   /api/admin/payment-proofs/[id]
PATCH /api/admin/payment-proofs/[id]/approve
PATCH /api/admin/payment-proofs/[id]/reject
```

When approving a payment:
- Start a MongoDB transaction.
- Change payment status to APPROVED.
- Set reviewedBy and reviewedAt.
- Create or activate enrollment.
- Add audit log.
- Commit transaction.

When rejecting:
- Change payment status to REJECTED.
- Store admin note.
- Add audit log.

### Admin Users/Enrollments

```txt
GET   /api/admin/users
PATCH /api/admin/users/[id]/block
PATCH /api/admin/users/[id]/unblock
GET   /api/admin/enrollments
PATCH /api/admin/enrollments/[id]/revoke
```

---

## Authentication Requirements

Use custom email/password authentication for MVP.

Implementation:
- Hash passwords with bcryptjs.
- Use JWT stored in HTTP-only cookie.
- Cookie should be:
  - httpOnly
  - secure in production
  - sameSite=lax
  - path=/
- Implement helpers:
  - getCurrentUser()
  - requireAuth()
  - requireAdmin()
  - requireStudent()
- Middleware should protect:
  - `/dashboard`
  - `/admin`
- Admin pages must additionally verify role on the server.

Do not expose passwordHash.

Arabic auth copy:
```txt
تسجيل الدخول
إنشاء حساب جديد
البريد الإلكتروني
رقم الهاتف
كلمة المرور
تأكيد كلمة المرور
نسيت كلمة المرور؟
ليس لديك حساب؟
لديك حساب بالفعل؟
```

---

## Bunny Stream Video Provider Design

Primary video provider: **Bunny Stream**.

Create:

```txt
/src/services/video/video.service.ts
/src/services/video/providers/bunny.provider.ts
/src/services/video/providers/vdocipher.provider.ts
/src/services/video/providers/cloudflare.provider.ts
/src/services/video/providers/mux.provider.ts
```

Create a provider interface:

```ts
export type VideoProviderName =
  | "BUNNY"
  | "VDOCIPHER"
  | "CLOUDFLARE_STREAM"
  | "MUX";

export type PlaybackData = {
  provider: VideoProviderName;
  embedUrl?: string;
  token?: string;
  expiresAt?: string;
  watermarkText?: string;
};

export interface VideoProvider {
  getPlaybackData(input: {
    videoAssetId: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  }): Promise<PlaybackData>;
}
```

The lesson playback endpoint should:
1. Get current user.
2. Find lesson.
3. Check preview/enrollment.
4. Build watermark text from user data:
   - user name
   - email or phone
   - user ID
5. Request temporary playback data from Bunny provider.
6. Return playback data.

Bunny Stream implementation requirements:
- Store Bunny `videoAssetId` as the Bunny video GUID.
- Store Bunny library ID in environment variable.
- Store Bunny API/security key in environment variable.
- Generate protected iframe embed URLs server-side only.
- Use short token expiration, for example 30–60 minutes.
- Never expose Bunny API key to client.
- Never expose permanent video URLs.

Expected environment variables:
```env
BUNNY_STREAM_LIBRARY_ID=
BUNNY_STREAM_API_KEY=
BUNNY_STREAM_SECURITY_KEY=
```

Frontend player:
- Render Bunny iframe using the protected temporary `embedUrl`.
- Do not render a raw permanent video URL.
- Add visible moving frontend watermark overlay as fallback.
- Include warning text in Arabic:

```txt
هذا الفيديو محمي، والوصول إليه مرتبط بحسابك الشخصي.
```

Watermark text example:
```txt
أحمد محمد • ahmed@example.com • ID: 12345
```

Visible overlay behavior:
- Low opacity
- Moves every few seconds
- Appears at different positions
- Does not block learning experience
- Makes screen recording traceable

Important:
A website cannot fully prevent screen recording. The platform should focus on:
- access control
- private playback tokens
- domain restriction/hotlink protection where available
- watermarking
- admin ability to revoke access

---

## Receipt Upload

Create upload abstraction:

```txt
/src/services/storage/storage.service.ts
/src/services/storage/cloudinary.provider.ts
/src/services/storage/s3.provider.ts
```

For MVP:
- Use Cloudinary if easier.
- Or implement S3-compatible placeholder.

Receipt upload restrictions:
- allowed file types: jpg, jpeg, png, pdf
- max size: 5MB
- validate file type on server
- store URL and storage key in PaymentProof
- never store file binary in MongoDB

Payment proof form Arabic fields:
```txt
المبلغ المدفوع
رقم العملية أو المرجع
ارفع صورة الإيصال
ملاحظات إضافية
إرسال للمراجعة
```

After upload:
- status = PENDING
- show Arabic success screen:

```txt
تم إرسال إيصال الدفع بنجاح. سيتم مراجعته من الإدارة في أقرب وقت.
```

---

## UI Pages Detail

### Home Page

Must include:
- premium RTL navbar with logo
- hero section with owner image
- black/red cinematic gradient background
- course search preview
- featured courses
- benefits section
- how it works section
- instructor/owner section
- testimonials placeholder
- FAQ
- CTA footer

Arabic navbar:
```txt
الرئيسية
الكورسات
كيف تعمل المنصة؟
عن المدرب
الأسئلة الشائعة
تسجيل الدخول
ابدأ الآن
```

### Courses Page

Must include:
- Arabic search input
- filters
- category chips
- level filter
- price range
- course cards
- empty state
- responsive layout
- loading skeletons

Empty state:
```txt
لا توجد كورسات مطابقة لبحثك حاليًا.
```

### Course Details Page

Must include:
- title
- thumbnail
- price
- description
- number of lessons
- level
- duration
- buy button
- course curriculum
- preview lessons if any
- access status:
  - not logged in
  - no payment proof
  - pending approval
  - rejected
  - enrolled

Arabic CTA examples:
```txt
اشترك الآن
ارفع إيصال الدفع
ابدأ التعلم
شاهد الدرس
```

### Student Dashboard

Must include:
- welcome card
- enrolled courses
- pending payments
- rejected payments
- continue learning
- progress cards

Arabic dashboard copy:
```txt
مرحبًا بك
أكمل رحلتك التعليمية
كورساتك
طلبات الدفع قيد المراجعة
```

### Lesson Player Page

Must include:
- protected Bunny video player
- lesson title
- course navigation sidebar on the right
- previous/next lesson
- progress tracking
- moving watermark overlay
- access denied state if not enrolled

Access denied message:
```txt
لا تملك صلاحية مشاهدة هذا الدرس. يرجى الاشتراك في الكورس أولًا.
```

### Admin Dashboard

Must include:
- analytics cards:
  - total users
  - total courses
  - pending payments
  - active enrollments
- recent payment proofs
- recent enrollments
- quick actions

Arabic analytics labels:
```txt
إجمالي المستخدمين
إجمالي الكورسات
مدفوعات قيد المراجعة
اشتراكات نشطة
```

### Admin Courses

Must include:
- course table
- create course button
- publish/unpublish toggle
- edit/delete actions
- lesson management link

Arabic labels:
```txt
إدارة الكورسات
إضافة كورس جديد
منشور
غير منشور
تعديل
حذف
إدارة الدروس
```

### Admin Payment Review

Must include:
- receipt preview
- user data
- course data
- amount
- transaction reference
- approve button
- reject button
- admin note
- confirmation dialog

Arabic labels:
```txt
مراجعة إيصال الدفع
بيانات المستخدم
بيانات الكورس
المبلغ
رقم العملية
قبول الدفع
رفض الدفع
ملاحظة الإدارة
```

---

## Components

Create reusable components:

```txt
Navbar
Footer
Logo
HeroSection
OwnerHeroCard
CourseCard
CourseFilters
CourseSearch
DashboardShell
AdminSidebar
AdminTopbar
StatsCard
PaymentStatusBadge
CourseStatusBadge
ConfirmDialog
EmptyState
LoadingSkeleton
ProtectedVideoPlayer
BunnyVideoPlayer
WatermarkOverlay
ReceiptUploader
ArabicSectionTitle
RedGlowCard
```

Use shadcn/ui for:
- Button
- Card
- Input
- Dialog
- Badge
- Tabs
- Table
- DropdownMenu
- Sheet
- Avatar
- Skeleton
- Toast/Sonner
- Alert

---

## Folder Structure

Use this structure:

```txt
src/
  app/
    (public)/
      layout.tsx
      page.tsx
      courses/
        page.tsx
        [slug]/
          page.tsx
      login/
        page.tsx
      register/
        page.tsx

    dashboard/
      layout.tsx
      page.tsx
      my-courses/
        page.tsx
        [courseSlug]/
          page.tsx
      lessons/
        [lessonId]/
          page.tsx
      payment-proofs/
        page.tsx
        new/
          page.tsx

    admin/
      layout.tsx
      page.tsx
      courses/
      payments/
      users/
      enrollments/
      settings/

    api/
      auth/
      courses/
      payment-proofs/
      lessons/
      watch-progress/
      admin/

  components/
    ui/
    layout/
    marketing/
    courses/
    dashboard/
    admin/
    video/
    forms/

  lib/
    db.ts
    auth.ts
    jwt.ts
    password.ts
    validations.ts
    utils.ts
    constants.ts
    arabic.ts

  models/
    User.ts
    Course.ts
    Lesson.ts
    PaymentProof.ts
    Enrollment.ts
    WatchProgress.ts
    AuditLog.ts

  services/
    auth.service.ts
    course.service.ts
    lesson.service.ts
    payment.service.ts
    enrollment.service.ts
    user.service.ts
    analytics.service.ts
    storage/
    video/

  validators/
    auth.validator.ts
    course.validator.ts
    lesson.validator.ts
    payment.validator.ts
```

---

## Environment Variables

Create `.env.example`:

```env
MONGODB_URI=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BUNNY_STREAM_LIBRARY_ID=
BUNNY_STREAM_API_KEY=
BUNNY_STREAM_SECURITY_KEY=

VDOCIPHER_API_SECRET=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_STREAM_API_TOKEN=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

---

## Seed Script

Create a seed script that creates:
- one admin user
- three sample Arabic courses
- several Arabic lessons per course
- placeholder Bunny video asset IDs
- sample student user
- optional sample pending payment proof

Admin credentials for local development:
```txt
email: admin@example.com
password: Admin@123456
```

Student credentials:
```txt
email: student@example.com
password: Student@123456
```

Add a clear warning that these credentials are for local development only.

Sample Arabic courses:
```txt
كورس البداية القوية
كورس تطوير الذات العملي
كورس بناء العقلية والانضباط
```

Sample categories:
```txt
تطوير الذات
مهارات عملية
عقلية وانضباط
بيزنس
```

---

## Important Security Details

Implement:
- password hashing
- HTTP-only JWT cookie
- role checks
- server-side authorization
- input validation with Zod
- file validation
- no permanent video URLs in API responses
- no Bunny API key in frontend
- no passwordHash in responses
- admin-only APIs protected server-side
- enrollment check before playback
- transaction for payment approval
- rate limiting placeholder for auth endpoints
- audit logs for sensitive admin actions
- moving watermark overlay on video page
- admin revoke access capability

---

## MVP Acceptance Criteria

The generated app is complete when:

1. User can register in Arabic UI.
2. User can login in Arabic UI.
3. User can browse published Arabic courses.
4. User can search/filter courses.
5. User can view course details.
6. User can upload payment receipt.
7. Admin can view pending receipts.
8. Admin can approve a receipt.
9. Approval creates active lifetime enrollment.
10. Student sees approved course in dashboard.
11. Student can open lessons only after enrollment.
12. Playback endpoint checks access server-side.
13. Bunny Stream provider abstraction exists.
14. Frontend renders protected Bunny iframe from backend-generated playback data.
15. Admin can create courses and lessons.
16. Website is RTL-first.
17. Website uses beautiful Arabic font.
18. Website uses black/red Redpill-inspired branding.
19. Owner image and logo are used gracefully if present.
20. App can run locally with seed data.

---

## Implementation Instructions for the AI IDE

Generate the project step by step.

First:
1. Create the Next.js project structure.
2. Install dependencies.
3. Configure Tailwind and shadcn/ui.
4. Configure Arabic fonts using `next/font/google`.
5. Set Arabic RTL defaults.
6. Create MongoDB/Mongoose connection helper.
7. Create Mongoose models.
8. Create auth helpers.
9. Create route handlers.
10. Create services.
11. Create Arabic public pages.
12. Create Arabic student dashboard.
13. Create Arabic admin dashboard.
14. Add Bunny Stream provider abstraction.
15. Add storage abstraction.
16. Add seed script.
17. Add README with setup instructions.

Do not skip files.
Do not leave vague TODOs for core functionality.
If external APIs require keys, create clean provider placeholders and document exactly where keys should be added.
Use TypeScript strictly.
Keep components beautiful and reusable.
Use loading and error states.
Make the UI feel premium.
Prioritize Arabic UX quality.
Make the site look astonishing.

---

## Design Copy Suggestions

Use polished Arabic copy like:

### Hero Headline

```txt
ادخل عالم التعلم الجاد مع كورسات مصممة لتغيير مستواك
```

### Hero Subtitle

```txt
اختر الكورس المناسب، ادفع مرة واحدة، ارفع إيصال الدفع، واحصل على وصول دائم بعد الموافقة.
```

### CTA Buttons

```txt
تصفح الكورسات
ابدأ الآن
```

### How It Works

```txt
١. اختر الكورس المناسب لك
٢. ادفع بالطريقة الموضحة
٣. ارفع إيصال الدفع
٤. انتظر موافقة الإدارة
٥. ابدأ التعلم بوصول دائم
```

### Security Message

```txt
وصولك للمحتوى مرتبط بحسابك الشخصي، والفيديوهات تُعرض بروابط مؤقتة مع علامة مائية خاصة بك.
```

### Footer CTA

```txt
ابدأ رحلتك الآن، واختر الكورس الذي سينقلك للمستوى التالي.
```

---

## Final Goal

Build a beautiful, complete, modern MVP that can be shown to the platform owner as a serious product demo and later connected to real Bunny Stream video hosting.

The result should look like a premium Arabic Redpill-style course platform:
- Arabic-first
- RTL-first
- black/red
- strong typography
- owner image in cinematic hero
- secure course access
- manual payment receipt approval
- Bunny Stream video serving
- custom admin dashboard
- polished student experience

The final result should not look like a generic course template. It should look like a powerful branded platform ready to sell.
