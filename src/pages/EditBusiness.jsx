import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload, Loader2, X } from "lucide-react";
import { MAIN_CATEGORIES } from "@/lib/constants";

const LOCATIONS = [
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

const HALAL_OPTIONS = ["Muslim-Owned F&B", "Halal-Certified F&B", "Non F&B"];

export default function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [productPhotos, setProductPhotos] = useState([]);
  const [newProductPhotos, setNewProductPhotos] = useState([]);
  const [menuFile, setMenuFile] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);

      if (!me || (me.role !== "business" && me.role !== "admin")) {
        setUnauthorized(true);
        setFetching(false);
        return;
      }

      const results = await base44.entities.Business.filter({ id });
      const biz = results[0];

      if (!biz) { navigate("/"); return; }

      if (me?.role !== "admin" && biz.submitted_by_email !== me?.email && biz.created_by !== me?.email) {
        setUnauthorized(true);
        setFetching(false);
        return;
      }

      setForm({
        name: biz.name || "",
        is_mama: biz.is_mama ? "Yes" : "No",
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
        halal_status: biz.halal_status || "",
        more_about_us: biz.more_about_us || "",
        logo_url: biz.logo_url || "",
      });
      setProductPhotos(biz.photos || []);
      setFetching(false);
    };
    load();
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      additional_categories: f.additional_categories.includes(cat)
        ? f.additional_categories.filter(c => c !== cat)
        : [...f.additional_categories, cat],
    }));
  };

  const handleProductPhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (productPhotos.length + newProductPhotos.length + files.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }
    setNewProductPhotos([...newProductPhotos, ...files]);
  };

  const removeProductPhoto = (idx) => {
    setProductPhotos(productPhotos.filter((_, i) => i !== idx));
  };

  const removeNewProductPhoto = (idx) => {
    setNewProductPhotos(newProductPhotos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logo_url = form.logo_url;
      if (logoFile) {
        const res = await base44.integrations.Core.UploadFile({ file: logoFile });
        logo_url = res.file_url;
      }

      let menu_url = form.menu_url;
      if (menuFile) {
        const res = await base44.integrations.Core.UploadFile({ file: menuFile });
        menu_url = res.file_url;
      }

      let photos = [...productPhotos];
      for (const file of newProductPhotos) {
        const res = await base44.integrations.Core.UploadFile({ file });
        photos.push(res.file_url);
      }

      await base44.entities.Business.update(id, {
        name: form.name,
        is_mama: form.is_mama === "Yes",
        main_category: form.main_category,
        additional_categories: form.additional_categories,
        description: form.description,
        location: form.location,
        whatsapp: form.whatsapp,
        website: form.website,
        facebook: form.facebook,
        instagram: form.instagram,
        threads: form.threads,
        tiktok: form.tiktok,
        telegram: form.telegram,
        halal_status: form.halal_status,
        more_about_us: form.more_about_us,
        logo_url,
        menu_url,
        photos,
      });

      setLoading(false);
      setSaved(true);
    } catch (err) {
      alert("Error saving form: " + err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-4xl mb-3">🔒</p>
          <h2 className="font-quicksand text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">You don't have permission to edit this listing.</p>
          <Button onClick={() => navigate("/")} variant="outline">Back to Directory</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-quicksand text-2xl font-bold text-foreground mb-2">Changes Saved! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-6">Your listing has been updated successfully.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/business/${id}`)} variant="outline">View Listing</Button>
            <Button onClick={() => setSaved(false)}>Edit Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-quicksand text-3xl font-bold text-foreground">Edit Your HBB Listing</h1>
          <p className="text-muted-foreground text-sm mt-2">Update your business details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1 — Business Info */}
          <Section title="SECTION 1 — Business Info">
            {/* 1.1: HBB Name, Logo, Mamas */}
            <SubSection>
              <Field label="HBB Name *">
                <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your HBB name" required />
              </Field>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-foreground mb-2">HBB Logo <span className="text-gray-400 font-normal">(optional)</span></p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Optional, but good to have as it makes your listing looks beautiful AND customers know who you are.<br />
                  Remember to choose the nicest photo of your logo you have. 🙂
                </p>
                {form.logo_url && !logoFile && (
                  <img src={form.logo_url} alt="Current logo" className="w-20 h-20 rounded-xl object-cover mb-3" />
                )}
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{logoFile ? logoFile.name : "Click to replace logo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files[0])} />
                </label>
              </div>

              <Field label="HBB Mamas? *">
                <Select value={form.is_mama} onValueChange={v => set("is_mama", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Yes or No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SubSection>

            {/* 1.2: Choose your category */}
            <SubSection>
              <p className="text-sm font-semibold text-foreground mb-3">Choose your category</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Choose ONE main category — the one you want customers to recognise you for.
              </p>

              <div className="bg-secondary/20 p-3 rounded-lg mb-4 text-xs text-muted-foreground space-y-2">
                <p><strong>01 Food</strong> → Meals, bentos, lauk, savoury, etc</p>
                <p><strong>02 Desserts & Bakes</strong> → Cakes, brownies, cookies, kuih, etc</p>
                <p><strong>03 Drinks</strong> → Milk tea, coffee, juices, bottled drinks, etc</p>
                <p><strong>04 Beauty & Wellness</strong> → Makeup, skincare, henna, massage, etc</p>
                <p><strong>05 Fashion & Accessories</strong> → Apparels, tudung, bags, jewellery, etc</p>
                <p><strong>06 Home & Lifestyle</strong> → Decor, candles, diffusers, organisers, etc</p>
                <p><strong>07 Gifts & Custom Crafts</strong> → Hampers, personalised items, party packs, etc</p>
                <p><strong>08 Educational & Learning</strong> → Busy books, worksheets, toys, enrichment, etc</p>
                <p><strong>09 Services</strong> → Delivery, personal shopper, mover, design, website, IT, business support, digital creation, etc</p>
                <p><strong>10 Others</strong> → Anything not listed above</p>
              </div>
            </SubSection>

            {/* 1.3: Main Category, Additional Categories, Halal Status */}
            <SubSection>
              <Field label="HBB Main Category *">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  Pick ONE category that best matches your business. This is what you sell the MOST.
                </p>
                <Select value={form.main_category} onValueChange={v => set("main_category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {MAIN_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="HBB Additional Categories (optional)">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  Tick any other categories that also match your business. DO NOT tick the same as your MAIN category above.
                </p>
                <div className="space-y-2">
                  {MAIN_CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={form.additional_categories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                        disabled={cat === form.main_category}
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="F&B Halal Status *">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  Muslim-owned F&B must be responsible for ensuring halal
                </p>
                <Select value={form.halal_status} onValueChange={v => set("halal_status", v)}>
                  <SelectTrigger><SelectValue placeholder="Select halal status" /></SelectTrigger>
                  <SelectContent>
                    {HALAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </SubSection>

            {/* 1.4: Product/Services Details, Photos */}
            <SubSection>
              <Field label="Product/Services Details *">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  A brief description of the products you're selling and or the services you're rendering.
                </p>
                <Textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="A brief description of the products you're selling..."
                  rows={4}
                  required
                />
              </Field>

              <Field label="Upload Product/Services Photos (optional)">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  Image of the products you're selling and or the services you're rendering.
                  <br /><br />
                  <strong>PLEASE TAKE NOTE:</strong> Only FIVE photos can be uploaded.
                </p>
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to add more photos ({productPhotos.length + newProductPhotos.length}/5)</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductPhotoChange} />
                </label>
                {(productPhotos.length > 0 || newProductPhotos.length > 0) && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {productPhotos.map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative">
                        <img src={url} alt={`Product ${idx}`} className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeProductPhoto(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {newProductPhotos.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative">
                        <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-20 object-cover rounded-lg border-2 border-primary" />
                        <button
                          type="button"
                          onClick={() => removeNewProductPhoto(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Location *">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  Don't know which location to choose? The 2-digit number in the brackets [ ] is based on the first two numbers of your postal code.
                </p>
                <Select value={form.location} onValueChange={v => set("location", v)}>
                  <SelectTrigger><SelectValue placeholder="Select your area" /></SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </SubSection>
          </Section>

          {/* SECTION 2 — Contact & Links */}
          <Section title="SECTION 2 — Contact & Links">
            {/* 2.1: WhatsApp Number */}
            <SubSection>
              <Field label="WhatsApp Number *">
                <p className="text-sm text-muted-foreground mb-2">For customers to contact you.</p>
                <Input
                  value={form.whatsapp}
                  onChange={e => set("whatsapp", e.target.value.replace(/\D/g, ""))}
                  placeholder="912345678"
                  maxLength="11"
                  required
                />
              </Field>
            </SubSection>

            {/* 2.2: Website */}
            <SubSection>
              <Field label="Website / Order Form / Shop Link">
                <p className="text-sm text-muted-foreground mb-2">Enter your full link address, including the https://</p>
                <Input
                  value={form.website}
                  onChange={e => set("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>
            </SubSection>

            {/* 2.3: Social Media */}
            <SubSection>
              <Field label="Facebook">
                <p className="text-sm text-muted-foreground mb-2">Only enter the Facebook username handle, no @ or links required</p>
                <Input
                  value={form.facebook}
                  onChange={e => set("facebook", e.target.value)}
                  placeholder="Your Facebook Handle"
                />
              </Field>

              <Field label="Instagram">
                <p className="text-sm text-muted-foreground mb-2">Only enter the Instagram username handle, no @ or links required</p>
                <Input
                  value={form.instagram}
                  onChange={e => set("instagram", e.target.value)}
                  placeholder="Your Instagram Handle"
                />
              </Field>

              <Field label="Threads">
                <p className="text-sm text-muted-foreground mb-2">Only enter the Threads username handle, no @ or links required</p>
                <Input
                  value={form.threads}
                  onChange={e => set("threads", e.target.value)}
                  placeholder="Your Threads Handle"
                />
              </Field>

              <Field label="TikTok">
                <p className="text-sm text-muted-foreground mb-2">Only enter the TikTok username handle, no @ or links required</p>
                <Input
                  value={form.tiktok}
                  onChange={e => set("tiktok", e.target.value)}
                  placeholder="Your Tiktok Handle"
                />
              </Field>

              <Field label="Telegram Channel">
                <p className="text-sm text-muted-foreground mb-2">Only enter the Telegram Channel username, no links required</p>
                <Input
                  value={form.telegram}
                  onChange={e => set("telegram", e.target.value)}
                  placeholder="Your Telegram Channel Username"
                />
              </Field>
            </SubSection>
          </Section>

          {/* SECTION 3 — Menu / Additional Details */}
          <Section title="SECTION 3 — Menu / Additional Details">
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Latest Menu / Price List <span className="text-gray-400">(optional)</span></p>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Optional. Only one PDF/image to be uploaded.
                Remember to choose the nicest photo of your menu/price list you have. 🙂
              </p>
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{menuFile ? menuFile.name : "Click to replace menu"}</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setMenuFile(e.target.files[0])} />
              </label>
            </div>

            <Field label="More About Us">
              <Textarea
                value={form.more_about_us}
                onChange={e => set("more_about_us", e.target.value)}
                placeholder="Anything you want people to know about your beloved home based business?"
                rows={4}
              />
            </Field>
          </Section>

          <Button type="submit" disabled={loading || !form.name || !form.main_category || !form.location || !form.whatsapp || !form.halal_status} className="w-full py-6 text-base font-semibold">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-border rounded-xl p-5 bg-white space-y-6">
      <h3 className="font-quicksand font-bold text-lg text-foreground border-b border-border pb-3">{title}</h3>
      {children}
    </div>
  );
}

function SubSection({ children }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}