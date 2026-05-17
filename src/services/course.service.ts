import { connectDB } from "@/lib/db";
import { CourseModel, type ICourse } from "@/models/Course";
import { LessonModel } from "@/models/Lesson";
import type { CourseListQuery } from "@/validators/course.validator";
import type { CourseCardData } from "@/components/courses/course-card";
import type { CourseLevel } from "@/lib/constants";

type CourseFilter = Record<string, unknown>;
type SortSpec = Record<string, 1 | -1>;

function mapCourseToCard(c: ICourse): CourseCardData {
  return {
    id: String(c._id),
    slug: c.slug,
    title: c.title,
    shortDescription: c.shortDescription,
    thumbnailUrl: c.thumbnailUrl,
    category: c.category,
    level: c.level as CourseLevel,
    lessonsCount: c.lessonsCount,
    durationLabel: c.durationLabel,
    price: c.price,
    currency: c.currency,
    priceUsd: c.priceUsd,
    featured: c.featured,
  };
}

export async function listPublishedCourses(
  query: Partial<CourseListQuery> = {},
): Promise<{ items: CourseCardData[]; total: number }> {
  try {
    await connectDB();
  } catch {
    return { items: [], total: 0 };
  }

  const filter: CourseFilter = { isPublished: true };
  if (query.category) filter.category = query.category;
  if (query.level) filter.level = query.level;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const priceFilter: { $gte?: number; $lte?: number } = {};
    if (query.minPrice !== undefined) priceFilter.$gte = query.minPrice;
    if (query.maxPrice !== undefined) priceFilter.$lte = query.maxPrice;
    filter.price = priceFilter;
  }
  if (query.search?.trim()) {
    const re = new RegExp(query.search.trim(), "i");
    filter.$or = [{ title: re }, { description: re }, { category: re }];
  }

  const sort: SortSpec =
    query.sort === "price-low"
      ? { price: 1 }
      : query.sort === "price-high"
        ? { price: -1 }
        : { createdAt: -1 };

  const limit = query.limit ?? 12;
  const page = query.page ?? 1;
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    CourseModel.find(filter).sort(sort).skip(skip).limit(limit).lean<ICourse[]>(),
    CourseModel.countDocuments(filter),
  ]);

  return { items: docs.map(mapCourseToCard), total };
}

export async function getFeaturedCourses(
  limit: number = 3,
): Promise<CourseCardData[]> {
  try {
    await connectDB();
  } catch {
    return [];
  }
  const docs = await CourseModel.find({ isPublished: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ICourse[]>();

  if (docs.length < limit) {
    const fill = await CourseModel.find({
      isPublished: true,
      _id: { $nin: docs.map((d) => d._id) },
    })
      .sort({ createdAt: -1 })
      .limit(limit - docs.length)
      .lean<ICourse[]>();
    return [...docs, ...fill].map(mapCourseToCard);
  }

  return docs.map(mapCourseToCard);
}

export type CourseDetail = CourseCardData & {
  description: string;
  lessons: Array<{
    id: string;
    title: string;
    description?: string;
    order: number;
    durationSeconds: number;
    isPreview: boolean;
  }>;
};

export async function getCourseBySlug(
  slug: string,
): Promise<CourseDetail | null> {
  try {
    await connectDB();
  } catch {
    return null;
  }
  const course = await CourseModel.findOne({
    slug,
    isPublished: true,
  }).lean<ICourse>();
  if (!course) return null;

  const lessons = await LessonModel.find({
    courseId: course._id,
    isPublished: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return {
    ...mapCourseToCard(course),
    description: course.description,
    lessons: lessons.map((l) => ({
      id: String(l._id),
      title: l.title,
      description: l.description,
      order: l.order,
      durationSeconds: l.durationSeconds,
      isPreview: l.isPreview,
    })),
  };
}

export async function getDistinctCategories(): Promise<string[]> {
  try {
    await connectDB();
  } catch {
    return [];
  }
  return CourseModel.distinct("category", { isPublished: true });
}
