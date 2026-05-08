/* eslint-disable no-console */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import mongoose from "mongoose";
import { hashPassword } from "../src/lib/password";
import { UserModel } from "../src/models/User";
import { CourseModel } from "../src/models/Course";
import { LessonModel } from "../src/models/Lesson";
import { EnrollmentModel } from "../src/models/Enrollment";
import { PaymentProofModel } from "../src/models/PaymentProof";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
const STUDENT_EMAIL = process.env.SEED_STUDENT_EMAIL ?? "student@example.com";
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD ?? "Student@123456";

const COURSES = [
  {
    title: "كورس البداية القوية",
    slug: "starter-strong",
    category: "تطوير الذات",
    level: "BEGINNER" as const,
    price: 499,
    durationLabel: "٤ ساعات",
    shortDescription: "ابدأ رحلتك بأسس صلبة وعقلية واضحة.",
    description:
      "هذا الكورس مصمم لمن يبحث عن أساس قوي يضع به خطواته الأولى نحو تغيير حقيقي.\n\nستتعلم كيف تبني عاداتك، تنظم وقتك، وتركز جهدك على ما يصنع فرقًا فعليًا.",
    featured: true,
    lessons: [
      { title: "مقدمة الكورس", duration: 320, isPreview: true },
      { title: "بناء العقلية الصحيحة", duration: 720 },
      { title: "تنظيم الوقت اليومي", duration: 840 },
      { title: "كسر العادات السلبية", duration: 660 },
      { title: "خطة العمل العملية", duration: 540 },
    ],
  },
  {
    title: "كورس تطوير الذات العملي",
    slug: "self-dev-applied",
    category: "تطوير الذات",
    level: "INTERMEDIATE" as const,
    price: 799,
    durationLabel: "٦ ساعات",
    shortDescription: "أدوات تطبيقية لتحسين الأداء وزيادة الإنتاجية.",
    description:
      "كورس عملي يركز على الأدوات والتقنيات التي تستطيع تطبيقها مباشرة في حياتك ومع فريقك أو عملك.\n\nمن إدارة الطاقة إلى صنع القرار، الكورس يعطيك أدوات يومية يمكنك الاعتماد عليها.",
    featured: true,
    lessons: [
      { title: "نظرة عامة", duration: 280, isPreview: true },
      { title: "إدارة الطاقة قبل الوقت", duration: 920 },
      { title: "التركيز العميق", duration: 780 },
      { title: "اتخاذ القرارات السريعة", duration: 690 },
      { title: "بناء روتين فعّال", duration: 600 },
      { title: "متى تقول لا", duration: 540 },
    ],
  },
  {
    title: "كورس بناء العقلية والانضباط",
    slug: "mindset-discipline",
    category: "عقلية وانضباط",
    level: "ADVANCED" as const,
    price: 999,
    durationLabel: "٨ ساعات",
    shortDescription: "ادخل لمرحلة الانضباط الذاتي والوضوح الكامل.",
    description:
      "كورس متقدم لمن قرر أن يأخذ مستواه إلى مرحلة جديدة.\n\nالتركيز هنا على الأنظمة العقلية، التعامل مع الضغط، وبناء انضباط طويل الأمد.",
    featured: true,
    lessons: [
      { title: "البداية: قواعد اللعبة", duration: 380, isPreview: true },
      { title: "العقلية تحت الضغط", duration: 980 },
      { title: "الانضباط بدون اعتماد على المزاج", duration: 920 },
      { title: "التركيز الجراحي", duration: 870 },
      { title: "النظام اليومي للعقل القوي", duration: 780 },
      { title: "كيف تستمر سنوات", duration: 740 },
    ],
  },
];

async function main() {
  if (!MONGODB_URI) {
    console.error("✖ MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }

  console.log("\n══════════════════════════════════════════════════════════");
  console.log("  Ahmed Haitham Academy — DB Seed (LOCAL DEV ONLY)");
  console.log("  ⚠ تحذير: بيانات التسجيل التالية للتطوير المحلي فقط");
  console.log("══════════════════════════════════════════════════════════\n");

  await mongoose.connect(MONGODB_URI);
  console.log("✔ Connected to MongoDB");

  await Promise.all([
    UserModel.deleteMany({ email: { $in: [ADMIN_EMAIL, STUDENT_EMAIL] } }),
    CourseModel.deleteMany({ slug: { $in: COURSES.map((c) => c.slug) } }),
  ]);

  const [adminHash, studentHash] = await Promise.all([
    hashPassword(ADMIN_PASSWORD),
    hashPassword(STUDENT_PASSWORD),
  ]);

  const admin = await UserModel.create({
    name: "Ahmed Haitham",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash: adminHash,
    role: "ADMIN",
  });
  const student = await UserModel.create({
    name: "طالب تجريبي",
    email: STUDENT_EMAIL.toLowerCase(),
    passwordHash: studentHash,
    role: "STUDENT",
  });
  console.log(`✔ Admin: ${admin.email}`);
  console.log(`✔ Student: ${student.email}`);

  const createdCourses = [];
  for (const c of COURSES) {
    const lessonsInput = c.lessons.map((l, i) => ({
      title: l.title,
      order: i,
      videoProvider: "BUNNY" as const,
      videoAssetId: `placeholder-bunny-guid-${c.slug}-${i + 1}`,
      durationSeconds: l.duration,
      isPreview: l.isPreview ?? false,
      isPublished: true,
    }));

    const course = await CourseModel.create({
      title: c.title,
      slug: c.slug,
      description: c.description,
      shortDescription: c.shortDescription,
      price: c.price,
      currency: "EGP",
      category: c.category,
      level: c.level,
      durationLabel: c.durationLabel,
      lessonsCount: lessonsInput.length,
      isPublished: true,
      featured: c.featured,
      createdBy: admin._id,
    });
    await LessonModel.insertMany(
      lessonsInput.map((l) => ({ ...l, courseId: course._id })),
    );
    createdCourses.push(course);
    console.log(`✔ Course: ${course.title} (${lessonsInput.length} lessons)`);
  }

  // Sample PENDING payment proof for the student on the first course
  await PaymentProofModel.deleteMany({ userId: student._id });
  await EnrollmentModel.deleteMany({ userId: student._id });
  await PaymentProofModel.create({
    userId: student._id,
    courseId: createdCourses[0]._id,
    amount: createdCourses[0].price,
    currency: "EGP",
    receiptUrl:
      "https://placehold.co/800x1100/0b0b0f/E50914.png?text=Sample+Receipt",
    receiptStorageKey: "seed/sample-receipt",
    transactionReference: "TXN-DEV-0001",
    userNote: "إيصال تجريبي للاختبار",
    status: "PENDING",
  });
  console.log("✔ Sample PENDING payment proof for student created.");

  console.log("\n──────────────────── Local Dev Credentials ────────────────────");
  console.log(`  Admin   →  ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}`);
  console.log(`  Student →  ${STUDENT_EMAIL}  /  ${STUDENT_PASSWORD}`);
  console.log("───────────────────────────────────────────────────────────────\n");
  console.log("⚠ WARNING: These credentials are LOCAL DEV ONLY. Never use in production.");
  console.log("⚠ تحذير: هذه البيانات للتطوير المحلي فقط، لا تستخدمها في الإنتاج.\n");

  await mongoose.disconnect();
  console.log("✔ Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
