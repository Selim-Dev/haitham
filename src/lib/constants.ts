export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const COURSE_LEVELS = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;
export type CourseLevel = (typeof COURSE_LEVELS)[keyof typeof COURSE_LEVELS];

export const COURSE_LEVEL_AR: Record<CourseLevel, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
};

export const VIDEO_PROVIDERS = {
  BUNNY: "BUNNY",
  VDOCIPHER: "VDOCIPHER",
  CLOUDFLARE_STREAM: "CLOUDFLARE_STREAM",
  MUX: "MUX",
} as const;
export type VideoProviderName =
  (typeof VIDEO_PROVIDERS)[keyof typeof VIDEO_PROVIDERS];

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_AR: Record<PaymentStatus, string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "تمت الموافقة",
  REJECTED: "مرفوض",
};

export const PAYMENT_METHOD = {
  WALLET: "WALLET",
  BANK: "BANK",
  PAYPAL: "PAYPAL",
  CRYPTO_SOLANA: "CRYPTO_SOLANA",
  CRYPTO_BINANCE: "CRYPTO_BINANCE",
} as const;
export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_AR: Record<PaymentMethod, string> = {
  WALLET: "محفظة / إنستاباي",
  BANK: "تحويل بنكي",
  PAYPAL: "بطاقة (PayPal)",
  CRYPTO_SOLANA: "كريبتو — Solana",
  CRYPTO_BINANCE: "كريبتو — Binance",
};

export const INTERNATIONAL_METHODS = [
  PAYMENT_METHOD.PAYPAL,
  PAYMENT_METHOD.CRYPTO_SOLANA,
  PAYMENT_METHOD.CRYPTO_BINANCE,
] as const;
export type InternationalMethod = (typeof INTERNATIONAL_METHODS)[number];

export function isInternationalMethod(
  value: string,
): value is InternationalMethod {
  return (INTERNATIONAL_METHODS as readonly string[]).includes(value);
}

export const APPROVAL_STATUS = {
  PENDING_APPLICATION: "PENDING_APPLICATION",
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ApprovalStatus =
  (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];

export const APPROVAL_STATUS_AR: Record<ApprovalStatus, string> = {
  PENDING_APPLICATION: "لم يكمل الاستمارة",
  PENDING_REVIEW: "قيد مراجعة الإدارة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

export const ENROLLMENT_STATUS = {
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
} as const;
export type EnrollmentStatus =
  (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS];

export const ENROLLMENT_STATUS_AR: Record<EnrollmentStatus, string> = {
  ACTIVE: "نشط",
  REVOKED: "تم إلغاء الوصول",
};

export const ACCESS_TYPE = {
  LIFETIME: "LIFETIME",
} as const;
export type AccessType = (typeof ACCESS_TYPE)[keyof typeof ACCESS_TYPE];

export const ACCESS_TYPE_AR: Record<AccessType, string> = {
  LIFETIME: "مدى الحياة",
};

export const DEFAULT_CURRENCY = "EGP";

export const RECEIPT_UPLOAD = {
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ],
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "pdf"],
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
} as const;

export const AUTH = {
  COOKIE_NAME: "ah_session",
  TOKEN_TTL_SECONDS: 60 * 60 * 24 * 7, // 7 days
  PLAYBACK_TOKEN_TTL_SECONDS: 60 * 45, // 45 minutes
} as const;

export const BRAND = {
  NAME_AR: "أحمد هيثم",
  NAME_EN: "Ahmed Haitham",
  TAGLINE_AR: "ادخل عالم التعلم الجاد",
  ACADEMY_AR: "أكاديمية أحمد هيثم",
} as const;

// Seasonal / occasion themes. Driven by the global Settings document
// (services/settings.service.ts) and toggled from /admin/settings. Extend
// this union when you add new themes — every place that branches on theme
// will pick the new option up automatically via the exhaustive type.
export const THEMES = {
  DEFAULT: "DEFAULT",
  EID_AL_ADHA: "EID_AL_ADHA",
} as const;
export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const THEME_AR: Record<Theme, string> = {
  DEFAULT: "افتراضي",
  EID_AL_ADHA: "عيد الأضحى",
};

export const THEME_DESCRIPTION_AR: Record<Theme, string> = {
  DEFAULT: "المظهر العادي للموقع — بدون زخارف موسمية.",
  EID_AL_ADHA: "تهنئة بعيد الأضحى مع شارة احتفالية ولمسات ذهبية على الصفحة الرئيسية.",
};
