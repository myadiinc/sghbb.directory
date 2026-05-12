import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Map sheet categories to our entity enum values
function mapCategory(cat) {
  if (!cat) return "12 Other";
  const c = cat.trim().toLowerCase();
  if (c.includes("food") || c.includes("f&b") || c.includes("beverage") || c.includes("baking") || c.includes("catering")) return "01 Food & Beverage";
  if (c.includes("fashion") || c.includes("apparel") || c.includes("cloth")) return "02 Fashion & Apparel";
  if (c.includes("beauty") && c.includes("wellness")) return "04 Beauty & Wellness";
  if (c.includes("beauty") || c.includes("personal care") || c.includes("skincare") || c.includes("cosmetic")) return "03 Beauty & Personal Care";
  if (c.includes("home") || c.includes("living") || c.includes("lifestyle")) return "05 Home & Living";
  if (c.includes("educat") || c.includes("learning") || c.includes("tutoring") || c.includes("tutor")) return "06 Education & Tutoring";
  if (c.includes("digital") || c.includes("service") || c.includes("tech")) return "07 Digital Services";
  if (c.includes("event") || c.includes("cater")) return "08 Event & Catering";
  if (c.includes("health") || c.includes("wellness") || c.includes("fitness")) return "09 Health & Wellness";
  if (c.includes("craft") || c.includes("handmade") || c.includes("gift") || c.includes("custom")) return "10 Crafts & Handmade";
  if (c.includes("kid") || c.includes("parent") || c.includes("child")) return "11 Kids & Parenting";
  return "12 Other";
}

function mapHalal(val) {
  if (!val) return null;
  const v = val.trim().toLowerCase();
  if (v.includes("certified")) return "Halal Certified";
  if (v.includes("muslim")) return "Muslim-Owned";
  if (v.includes("ingredient")) return "Halal Ingredients";
  if (v.includes("non f&b") || v.includes("not applicable") || v === "") return "Not Applicable";
  return null;
}

function extractLocation(loc) {
  if (!loc) return "";
  // Extract the main area name from complex strings like "25 [North] Kranji, Woodgrove, Marsiling, Woodlands..."
  const match = loc.match(/\[(.*?)\]/);
  const region = match ? match[1] : "";
  // Get first place name
  const parts = loc.split("]");
  const places = parts.length > 1 ? parts[1].trim().split(",") : [];
  const firstPlace = places.length > 0 ? places[0].trim() : "";
  return firstPlace ? `${firstPlace}${region ? " / " + region : ""}` : loc;
}

function cleanHandle(val) {
  if (!val) return "";
  val = val.trim();
  if (val.startsWith("http")) return val;
  return val;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Admin only" }, { status: 403 });
  }

  const SHEET_ID = "1YGSQedYtuzcqU-y0D71jB14KneHyD5ILcb7UdGgbmQI";
  const GID = "1466663570";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

  const res = await fetch(csvUrl);
  if (!res.ok) {
    return Response.json({ error: `Failed to fetch sheet: ${res.status}` }, { status: 500 });
  }
  const text = await res.text();

  // Parse CSV
  const rows = [];
  const lines = text.split("\n");
  
  // Simple CSV parser that handles quoted fields
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    rows.push(parseCSVLine(lines[i]));
  }

  // Column indices (0-based):
  // 0=Timestamp, 1=HBB Name, 2=HBB Mamas, 3=Main Category, 4=Additional Categories
  // 5=Description, 6=Upload Photos, 7=Location, 8=HBB Logo(Drive), 9=WhatsApp
  // 10=Website, 11=Facebook, 12=Instagram, 13=Thread, 14=TikTok, 15=Telegram
  // 16=Menu/Price, 17=F&B Halal Status, 18=More About Us, 19=Email
  // 20=HBB Mama(processed), 21=Logo Link(ibb), 22=WA Link, 23=Socials
  // 29=Photo1(ibb), 30=Photo2(ibb), 31=Photo3(ibb), 32=Photo4(ibb), 33=Photo5(ibb)
  // 35=Approved, 38=Featured

  const businesses = [];
  for (const row of rows) {
    const name = row[1]?.trim();
    if (!name) continue;

    const approved = row[35]?.trim();
    const status = (approved === "Yes" || approved?.toLowerCase().includes("batch")) ? "approved" : "pending";

    const isMama = row[2]?.trim().toLowerCase().includes("mama") || row[20]?.trim().toLowerCase().includes("mama");

    const logoUrl = row[21]?.trim() || ""; // ibb.co logo link

    const photos = [row[29], row[30], row[31], row[32], row[33]]
      .map(p => p?.trim())
      .filter(p => p && p.startsWith("http"));

    const whatsapp = row[22]?.trim().replace("https://wa.me/", "").replace(/\/$/, "") || row[9]?.trim();

    const fb = row[11]?.trim();
    const ig = row[12]?.trim();
    const threads = row[13]?.trim();
    const tiktok = row[14]?.trim();

    const halalRaw = row[17]?.trim();
    const halal = mapHalal(halalRaw);

    const badges = [];
    if (isMama) badges.push("HBB Mama");
    if (halalRaw?.toLowerCase() === "non f&b") badges.push("Non F&B");
    if (halalRaw?.toLowerCase() === "f&b" || row[3]?.toLowerCase().includes("food")) badges.push("F&B");
    if (row[38]?.trim() === "Yes") badges.push("HBB Spotlight");

    const description = row[18]?.trim() || row[5]?.trim() || "";

    const biz = {
      name,
      main_category: mapCategory(row[3]),
      tagline: row[5]?.trim()?.substring(0, 120) || "",
      description,
      location: extractLocation(row[7]),
      whatsapp: whatsapp || "",
      website: row[10]?.trim() || "",
      facebook: fb ? (fb.startsWith("http") ? fb : `https://facebook.com/${fb}`) : "",
      instagram: ig ? (ig.startsWith("http") ? ig : `https://instagram.com/${ig}`) : "",
      threads: threads ? (threads.startsWith("http") ? threads : `https://threads.net/@${threads}`) : "",
      tiktok: tiktok ? (tiktok.startsWith("http") ? tiktok : `https://tiktok.com/@${tiktok}`) : "",
      email: row[19]?.trim() || "",
      logo_url: logoUrl,
      photos,
      halal_status: halal || undefined,
      is_mama: isMama,
      badges,
      status,
      is_featured: row[38]?.trim() === "Yes",
    };

    // Remove empty string fields
    Object.keys(biz).forEach(k => {
      if (biz[k] === "" || biz[k] === undefined) delete biz[k];
    });

    businesses.push(biz);
  }

  // Bulk insert
  const results = { success: 0, skipped: 0, failed: 0 };
  
  // Get existing names to avoid duplicates
  const existingAll = await base44.asServiceRole.entities.Business.list("-created_date", 1000);
  const existingNames = new Set(existingAll.map(b => b.name?.toLowerCase()));

  for (const biz of businesses) {
    if (existingNames.has(biz.name.toLowerCase())) {
      results.skipped++;
      continue;
    }
    try {
      await base44.asServiceRole.entities.Business.create(biz);
      results.success++;
    } catch (e) {
      results.failed++;
    }
  }

  return Response.json({ imported: results.success, skipped: results.skipped, failed: results.failed, total: businesses.length });
});