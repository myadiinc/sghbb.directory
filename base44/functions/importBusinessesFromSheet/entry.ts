import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Location code mapping
const LOCATION_CODES = {
  "01 [Central] Raffles Place, Cecil, Marina, People's Park": "01",
  "02 [South] Anson, Tanjong Pagar": "02",
  "03 [South] Queenstown, Tiong Bahru": "03",
  "04 [South] Telok Blangah, Harbourfront": "04",
  "05 [South] Pasir Panjang, Hong Leong Garden, Clementi New Town": "05",
  "06 [Central] High Street, Beach Road": "06",
  "07 [Central] Middle Road, Golden Mile": "07",
  "08 [Central] Little India": "08",
  "09 [Central] Orchard, Cairnhill, River Valley": "09",
  "10 [Central] Ardmore, Bukit Timah, Holland Road, Tanglin": "10",
  "11 [Central] Watten Estate, Novesta, Thomson": "11",
  "12 [Central] Balestier, Toa Payoh, Serangoon": "12",
  "13 [Central] Macpherson, Braddell": "13",
  "14 [East] Geylang, Eunos": "14",
  "15 [East] Katong, Joo Chiat, Amber Road": "15",
  "16 [East] Bedok, Upper East Coast, Eastwood, Kew Drive": "16",
  "17 [East] Loyang, Changi": "17",
  "18 [East] Tampines, Pasir Ris": "18",
  "19 [North-East] Serangoon Garden, Hougang, Punggol, Sengkang": "19",
  "20 [Central] Bishan, Ang Mo Kio": "20",
  "21 [Central] Upper Bukit Timah, Clementi Park, Ulu Pandan": "21",
  "22 [West] Jurong": "22",
  "23 [West] Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang": "23",
  "24 [West] Lim Chu Kang, Tengah": "24",
  "25 [North] Kranji, Woodgrove, Marsiling, Woodlands, Admiralty": "25",
  "26 [Central] Upper Thomson, Springleaf": "26",
  "27 [North] Yishun, Khatib, Sembawang, Canberra": "27",
  "28 [North] Seletar": "28",
};

// Extract location code from full location string
function getLocationCode(location) {
  if (!location) return "00";
  for (const [key, code] of Object.entries(LOCATION_CODES)) {
    if (location.includes(key) || location.startsWith(key)) {
      return code;
    }
  }
  return "00";
}

// Extract category code from category string
function getCategoryCode(category) {
  if (!category) return "00";
  const match = category.match(/^(\d{2})/);
  return match ? match[1] : "00";
}

// Generate BSN: RRRCCLL where RRR = sequence number, CC = category, LL = location
function generateBSN(sequenceNumber, category, location) {
  const seq = String(sequenceNumber).padStart(3, "0");
  const cc = getCategoryCode(category);
  const ll = getLocationCode(location);
  return `${seq}${cc}${ll}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { businesses } = body;

    if (!Array.isArray(businesses) || businesses.length === 0) {
      return Response.json({ error: "Invalid businesses data" }, { status: 400 });
    }

    // Get next sequence number
    const existingBusinesses = await base44.asServiceRole.entities.Business.list(
      "-created_date",
      1000
    );
    const nextSequence = existingBusinesses.length + 1;

    // Process and import businesses
    const results = [];
    for (let i = 0; i < businesses.length; i++) {
      const biz = businesses[i];
      const sequence = nextSequence + i;
      const bsn = generateBSN(sequence, biz.main_category, biz.location);

      const businessData = {
        name: biz.name || "",
        bsn: bsn,
        is_mama: biz.is_mama === "HBB Mama" || biz.is_mama === true,
        main_category: biz.main_category || "",
        additional_categories: biz.additional_categories || [],
        description: biz.description || "",
        location: biz.location || "",
        whatsapp: biz.whatsapp || "",
        website: biz.website || "",
        facebook: biz.facebook || "",
        instagram: biz.instagram || "",
        threads: biz.threads || "",
        tiktok: biz.tiktok || "",
        telegram: biz.telegram || "",
        halal_status: biz.halal_status || "Non F&B",
        more_about_us: biz.more_about_us || "",
        logo_url: biz.logo_url || "",
        menu_url: biz.menu_url || "",
        photos: biz.photos || [],
        status: biz.status || "pending",
        submitted_by_email: biz.email || "",
        email: biz.email || "",
        is_featured: biz.is_featured || false,
        welcome_email_sent: false,
      };

      const created = await base44.asServiceRole.entities.Business.create(businessData);
      results.push({ bsn, id: created.id, name: biz.name });
    }

    return Response.json({
      success: true,
      imported: results.length,
      results: results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});