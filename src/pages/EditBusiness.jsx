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
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { MAIN_CATEGORIES, HALAL_OPTIONS, BADGES, LOCATIONS } from "@/lib/constants";

export default function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [user, setUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);

      const results = await base44.entities.Business.filter({ id });
      const biz = results[0];

      if (!biz) { navigate("/"); return; }

      // Only owner or admin can edit
      if (me?.role !== "admin" && biz.submitted_by_email !== me?.email && biz.created_by !== me?.email) {
        setUnauthorized(true);
        setFetching(false);
        return;
      }

      setForm({
        name: biz.name || "",
        tagline: biz.tagline || "",
        description: biz.description || "",
        main_category: biz.main_category || "",
        badges: biz.badges || [],
        halal_status: biz.halal_status || "",
        location: biz.location || "",
        hours: biz.hours || "",
        phone: biz.phone || "",
        whatsapp: biz.whatsapp || "",
        email: biz.email || "",
        website: biz.website || "",
        instagram: biz.instagram || "",
        facebook: biz.facebook || "",
        tiktok: biz.tiktok || "",
        threads: biz.threads || "",
        logo_url: biz.logo_url || "",
      });
      setFetching(false);
    };
    load();
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleBadge = (badge) => {
    setForm(f => ({
      ...f,
      badges: f.badges.includes(badge) ? f.badges.filter(b => b !== badge) : [...f.badges, badge],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let logo_url = form.logo_url;
    if (logoFile) {
      const res = await base44.integrations.Core.UploadFile({ file: logoFile });
      logo_url = res.file_url;
    }

    await base44.entities.Business.update(id, {
      ...form,
      logo_url,
      is_mama: form.badges.includes("HBB Mama"),
    });

    setLoading(false);
    setSaved(true);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-quicksand text-3xl font-bold text-foreground">Edit Your HBB Listing</h1>
          <p className="text-muted-foreground text-sm mt-2">Update your business details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Business Details">
            <Field label="Business Name *">
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your HBB name" required />
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline} onChange={e => set("tagline", e.target.value)} placeholder="Short one-liner about your business" />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Tell customers what you offer..." rows={4} />
            </Field>
            <Field label="Main Category *">
              <Select value={form.main_category} onValueChange={v => set("main_category", v)}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {MAIN_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Logo / Profile Image">
            {form.logo_url && !logoFile && (
              <img src={form.logo_url} alt="Current logo" className="w-20 h-20 rounded-xl object-cover mb-2" />
            )}
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{logoFile ? logoFile.name : "Click to replace logo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files[0])} />
            </label>
          </Section>

          <Section title="Tags & Badges">
            <div className="flex flex-wrap gap-2">
              {BADGES.map(badge => (
                <button key={badge} type="button" onClick={() => toggleBadge(badge)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.badges.includes(badge) ? "bg-primary text-primary-foreground border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/40"}`}>
                  {badge}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Location & Hours">
            <Field label="Area / Location">
              <Select value={form.location} onValueChange={v => set("location", v)}>
                <SelectTrigger><SelectValue placeholder="Select your area" /></SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Operating Hours">
              <Input value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="e.g. Mon–Fri 9am–6pm" />
            </Field>
            <Field label="F&B Halal Status">
              <Select value={form.halal_status} onValueChange={v => set("halal_status", v)}>
                <SelectTrigger><SelectValue placeholder="Select halal status" /></SelectTrigger>
                <SelectContent>
                  {HALAL_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Contact Info">
            <Field label="WhatsApp Number">
              <Input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="+65 9123 4567" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+65 9123 4567" />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="hello@yourbusiness.com" />
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" />
            </Field>
          </Section>

          <Section title="Social Media">
            <Field label="Instagram">
              <Input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@yourusername" />
            </Field>
            <Field label="Facebook">
              <Input value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="facebook.com/yourpage" />
            </Field>
            <Field label="TikTok">
              <Input value={form.tiktok} onChange={e => set("tiktok", e.target.value)} placeholder="@yourusername" />
            </Field>
            <Field label="Threads">
              <Input value={form.threads} onChange={e => set("threads", e.target.value)} placeholder="@yourusername" />
            </Field>
          </Section>

          <Button type="submit" disabled={loading || !form.name || !form.main_category} className="w-full py-6 text-base font-semibold">
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
    <div className="border border-border rounded-xl p-5 bg-white space-y-4">
      <h3 className="font-nunito font-semibold text-sm text-foreground border-b border-border pb-2">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}