import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload } from "lucide-react";

const REPORT_REASONS = [
  "Wrong information",
  "Duplicate listing",
  "Inappropriate content",
  "Scam / suspicious activity",
  "Harassment / abusive behaviour",
  "Copyright / stolen photos",
  "Fake reviews",
  "Others"
];

export default function ReportHBB() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inDirectory, setInDirectory] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [form, setForm] = useState({
    reporter_name: "",
    reporter_email: "",
    hbb_in_directory: null,
    hbb_directory_id: "",
    hbb_name_not_in_directory: "",
    hbb_facebook: "",
    hbb_instagram: "",
    hbb_threads: "",
    hbb_tiktok: "",
    hbb_other_socials: "",
    report_reason: "",
    report_reason_others: "",
    detailed_report: "",
    additional_info: "",
  });

  const [acknowledgment, setAcknowledgment] = useState({
    accurate: false,
    not_editable: false,
    new_report: false,
    shared_with_owner: false,
    files_secure: false,
    no_guarantee: false,
    false_reports: false,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 200),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (uploadedFiles.length + files.length > 10) {
      alert("Maximum 10 files allowed");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (idx) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allAcknowledged = Object.values(acknowledgment).every(v => v);
    if (!allAcknowledged) {
      alert("Please accept all acknowledgment terms");
      return;
    }

    if (!form.reporter_name || !form.reporter_email) {
      alert("Please fill in your name and email");
      return;
    }

    if (inDirectory === null) {
      alert("Please select whether the HBB is in the directory");
      return;
    }

    if (inDirectory && !form.hbb_directory_id) {
      alert("Please select the HBB from the directory");
      return;
    }

    if (!inDirectory && !form.hbb_name_not_in_directory) {
      alert("Please enter the HBB name");
      return;
    }

    if (!form.report_reason) {
      alert("Please select a reason for the report");
      return;
    }

    if (!form.detailed_report) {
      alert("Please provide detailed information");
      return;
    }

    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file as evidence");
      return;
    }

    setLoading(true);

    try {
      let file_urls = [];
      for (const file of uploadedFiles) {
        const res = await base44.integrations.Core.UploadFile({ file });
        file_urls.push(res.file_url);
      }

      await base44.entities.Report.create({
        reporter_name: form.reporter_name,
        reporter_email: form.reporter_email,
        hbb_in_directory: inDirectory,
        hbb_directory_id: inDirectory ? form.hbb_directory_id : "",
        hbb_name_not_in_directory: !inDirectory ? form.hbb_name_not_in_directory : "",
        hbb_facebook: form.hbb_facebook,
        hbb_instagram: form.hbb_instagram,
        hbb_threads: form.hbb_threads,
        hbb_tiktok: form.hbb_tiktok,
        hbb_other_socials: form.hbb_other_socials,
        report_reason: form.report_reason,
        report_reason_others: form.report_reason_others,
        detailed_report: form.detailed_report,
        file_urls,
        additional_info: form.additional_info,
        status: "pending",
      });

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting report: " + err.message);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background font-nunito">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-quicksand text-2xl font-bold text-foreground mb-2">Report Received! 🙏</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Thank you for helping us keep the directory safe and honest. Our team will review your report shortly.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">Back to Directory</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-nunito">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-quicksand text-3xl font-bold text-foreground">Report an HBB</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Help us keep the directory safe, honest, and trustworthy by reporting any issues.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Details */}
          <Section title="Your Details">
            <SubSection>
              <Field label="Your Name *">
                <Input value={form.reporter_name} onChange={e => set("reporter_name", e.target.value)} placeholder="Your full name" required />
              </Field>

              <Field label="Your Email *">
                <Input value={form.reporter_email} onChange={e => set("reporter_email", e.target.value)} placeholder="your@email.com" type="email" required />
              </Field>
            </SubSection>
          </Section>

          {/* HBB Selection */}
          <Section title="HBB Being Reported">
            <SubSection>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">Is the HBB in the directory? *</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={inDirectory === true} onChange={() => setInDirectory(true)} />
                    <span className="text-sm">Yes, in the directory</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={inDirectory === false} onChange={() => setInDirectory(false)} />
                    <span className="text-sm">No, not in the directory</span>
                  </label>
                </div>
              </div>

              {inDirectory === true && (
                <Field label="Name of the HBB (In Directory) *">
                  <Select value={form.hbb_directory_id} onValueChange={v => set("hbb_directory_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select an HBB" /></SelectTrigger>
                    <SelectContent>
                      {businesses.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}

              {inDirectory === false && (
                <>
                  <Field label="Name of the HBB (Not in Directory) *">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it</p>
                    <Input value={form.hbb_name_not_in_directory} onChange={e => set("hbb_name_not_in_directory", e.target.value)} placeholder="HBB name" required />
                  </Field>

                  <Field label="Their Facebook">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it</p>
                    <Input value={form.hbb_facebook} onChange={e => set("hbb_facebook", e.target.value)} placeholder="Facebook handle" />
                  </Field>

                  <Field label="Their Instagram">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it</p>
                    <Input value={form.hbb_instagram} onChange={e => set("hbb_instagram", e.target.value)} placeholder="Instagram handle" />
                  </Field>

                  <Field label="Their Threads">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it</p>
                    <Input value={form.hbb_threads} onChange={e => set("hbb_threads", e.target.value)} placeholder="Threads handle" />
                  </Field>

                  <Field label="Their TikTok">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it</p>
                    <Input value={form.hbb_tiktok} onChange={e => set("hbb_tiktok", e.target.value)} placeholder="TikTok handle" />
                  </Field>

                  <Field label="Any other social medias">
                    <p className="text-xs text-muted-foreground mb-2">Enter as how the HBB spells it, together with the social media platform</p>
                    <Textarea value={form.hbb_other_socials} onChange={e => set("hbb_other_socials", e.target.value)} placeholder="e.g. YouTube: @mybusiness, LinkedIn: mypage" rows={3} />
                  </Field>
                </>
              )}
            </SubSection>
          </Section>

          {/* Report Details */}
          <Section title="Report Details">
            <SubSection>
              <Field label="Reason for Report *">
                <Select value={form.report_reason} onValueChange={v => set("report_reason", v)}>
                  <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {form.report_reason === "Others" && (
                <Field label="Please specify">
                  <Input value={form.report_reason_others} onChange={e => set("report_reason_others", e.target.value)} placeholder="Describe the issue" />
                </Field>
              )}

              <Field label="Detailed Report *">
                <p className="text-xs text-muted-foreground mb-2">Please give very detailed information.</p>
                <Textarea value={form.detailed_report} onChange={e => set("detailed_report", e.target.value)} placeholder="Provide as much detail as possible..." rows={6} required />
              </Field>

              <Field label="Upload Photos / Screenshots / PDFs *">
                <p className="text-xs text-muted-foreground mb-2">Upload maximum of 10 files (images & PDF) as clear evidence.</p>
                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload files ({uploadedFiles.length}/10)</span>
                  <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="relative bg-secondary/20 rounded-lg p-2 text-xs text-center truncate">
                        <span className="block truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
            </SubSection>
          </Section>

          {/* Additional Info */}
          <Section title="Anything Else?">
            <SubSection>
              <Field label="Additional Information">
                <Textarea value={form.additional_info} onChange={e => set("additional_info", e.target.value)} placeholder="Anything else we should know?" rows={4} />
              </Field>
            </SubSection>
          </Section>

          {/* Acknowledgment */}
          <Section title="Acknowledgment">
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              By submitting this form you acknowledge that: <strong>(all must be checked!)</strong>
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.accurate} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, accurate: v})} />
                <span className="text-sm leading-relaxed">The information you provide must be accurate, honest, and as detailed as possible so that we can review your report fairly.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.not_editable} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, not_editable: v})} />
                <span className="text-sm leading-relaxed">You will not be able to edit your response after submitting.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.new_report} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, new_report: v})} />
                <span className="text-sm leading-relaxed">If you need to add more information later, you may submit a new report.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.shared_with_owner} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, shared_with_owner: v})} />
                <span className="text-sm leading-relaxed">Your report may be shared with the listed business owner if clarification is needed.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.files_secure} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, files_secure: v})} />
                <span className="text-sm leading-relaxed">Any files you upload (photos, screenshots, documents) will be stored securely in our website.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.no_guarantee} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, no_guarantee: v})} />
                <span className="text-sm leading-relaxed">Submitting a report does not guarantee immediate removal or action; each case will be reviewed individually.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={acknowledgment.false_reports} onCheckedChange={(v) => setAcknowledgment({...acknowledgment, false_reports: v})} />
                <span className="text-sm leading-relaxed"><strong>False or malicious reports may result in your future submissions being restricted.</strong></span>
              </label>
            </div>
          </Section>

          <Button type="submit" disabled={loading} className="w-full py-6 text-base font-semibold">
            {loading ? "Submitting..." : "Submit Report"}
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