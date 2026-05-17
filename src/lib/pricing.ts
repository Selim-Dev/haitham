export function isEgyptianCountry(code?: string | null): boolean {
  return (code ?? "").toUpperCase() === "EG";
}

export type PickedPrice = {
  amount: number;
  currency: string;
  isInternational: boolean;
};

export function pickPriceForCountry(
  course: { price: number; currency?: string; priceUsd?: number | null },
  countryCode?: string | null,
): PickedPrice {
  if (isEgyptianCountry(countryCode) || !countryCode) {
    return {
      amount: course.price,
      currency: (course.currency || "EGP").toUpperCase(),
      isInternational: false,
    };
  }
  if (typeof course.priceUsd === "number" && course.priceUsd > 0) {
    return { amount: course.priceUsd, currency: "USD", isInternational: true };
  }
  return {
    amount: course.price,
    currency: (course.currency || "EGP").toUpperCase(),
    isInternational: false,
  };
}
