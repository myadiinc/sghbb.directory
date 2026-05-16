/** Main Categories */
export const MAIN_CATEGORIES = [
  "01 Food",
  "02 Desserts & Bakes",
  "03 Drinks",
  "04 Beauty & Wellness",
  "05 Fashion & Accessories",
  "06 Home & Lifestyle",
  "07 Gifts & Custom Crafts",
  "08 Educational & Learning",
  "09 Services",
  "10 Others",
];

const CATEGORY_NUMBER_EMOJI = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

/** Display label for category buttons, e.g. "01 Food" → "1️⃣ Food" */
export function getCategoryTabLabel(category) {
  const match = category.match(/^(\d+)\s+(.+)$/);
  if (!match) return category;
  const num = parseInt(match[1], 10);
  const emoji = CATEGORY_NUMBER_EMOJI[num - 1] ?? match[1];
  return `${emoji} ${match[2]}`;
}

/** Mama Filter */
export const MAMA_FILTER_OPTIONS = [
  { value: "Yes", label: "HBB Mama" },
  { value: "No", label: "Non-HBB Mama" },
];

/** Halal Filter */
export const HALAL_OPTIONS = [
  "Muslim-Owned F&B",
  "Halal-Certified F&B",
  "Non F&B",
];

/** Sort Options */
export const SORT_OPTIONS = ["Oldest", "Newest", "A to Z", "Z to A"];

/** Badges */
export const BADGES = ["HBB Mama", "Non F&B", "F&B"];

/** LOCATION REGIONS (UI Tabs) */
export const LOCATION_REGIONS = [
  "🇸🇬 All",
  "⬆️ North",
  "⬇️ South",
  "➡️ East",
  "⬅️ West",
  "🔄 Central",
  "↗️ North-East",
];

/** LOCATION FILTER */
export function matchesLocationFilter(businessLocation, filterLocation) {
  if (!filterLocation || filterLocation === "🇸🇬 All") return true;
  if (!businessLocation) return false;

  const cleanFilter = filterLocation.replace(/[^a-zA-Z-]/g, "").toLowerCase();

  const regionMatch = businessLocation.match(/\[(.*?)\]/);
  const businessRegion = regionMatch ? regionMatch[1].toLowerCase() : "";

  return businessRegion.includes(cleanFilter);
}
