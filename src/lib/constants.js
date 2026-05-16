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

export const MAMA_FILTER_OPTIONS = [
  { value: "Yes", label: "HBB Mama" },
  { value: "No", label: "Non-HBB Mama" },
];

export const HALAL_OPTIONS = ["Muslim-Owned", "Non F&B"];

export const SORT_OPTIONS = ["Oldest", "Newest", "A to Z", "Z to A"];

export const BADGES = ["HBB Mama", "Non F&B", "F&B"];

export const LOCATION_REGIONS = [
  "🇸🇬 All",
  "⬆️ North",
  "⬇️ South",
  "➡️ East",
  "⬅️ West",
  "🔄 Central",
  "↗️ North-East",
];


/** Region from a location string, e.g. "25 [North] ..." → "North" */
export function getLocationRegion(location) {
  if (!location) return null;
  const match = location.match(/\[(North-East|North|South|East|West|Central)\]/i);
  return match ? match[1] : null;
}

export const LOCATIONS = [
  "01 [Central] Raffles Place, Cecil, Marina, People's Park",
  "02 [South] Anson, Tanjong Pagar",
  "03 [South] Queenstown, Tiong Bahru",
  "04 [South] Telok Blangah, Harbourfront",
  "05 [South] Pasir Panjang, Hong Leong Garden, Clementi New Town",
  "06 [Central] High Street, Beach Road",
  "07 [Central] Middle Road, Golden Mile",
  "08 [Central] Little India",
  "09 [Central] Orchard, Cairnhill, River Valley",
  "10 [Central] Ardmore, Bukit Timah, Holland Road, Tanglin",
  "11 [Central] Watten Estate, Novena, Thomson",
  "12 [Central] Balestier, Toa Payoh, Serangoon",
  "13 [Central] Macpherson, Braddell",
  "14 [East] Geylang, Eunos",
  "15 [East] Katong, Joo Chiat, Amber Road",
  "16 [East] Bedok, Upper East Coast, Eastwood, Kew Drive",
  "17 [East] Loyang, Changi",
  "18 [East] Tampines, Pasir Ris",
  "19 [North-East] Serangoon Garden, Hougang, Punggol, Sengkang",
  "20 [Central] Bishan, Ang Mo Kio",
  "21 [Central] Upper Bukit Timah, Clementi Park, Ulu Pandan",
  "22 [West] Jurong",
  "23 [West] Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang",
  "24 [West] Lim Chu Kang, Tengah",
  "25 [North] Kranji, Woodgrove, Marsiling, Woodlands, Admiralty",
  "26 [Central] Upper Thomson, Springleaf",
  "27 [North] Yishun, Khatib, Sembawang, Canberra",
  "28 [North] Seletar",
];

/** Match tab region or exact dropdown location */
export function matchesLocationFilter(businessLocation, filterLocation) {
  if (!filterLocation) return true;
  if (!businessLocation) return false;
  if (LOCATIONS.includes(filterLocation)) {
    return businessLocation === filterLocation;
  }
  const escaped = filterLocation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\[${escaped}\\]`, "i").test(businessLocation);
}
