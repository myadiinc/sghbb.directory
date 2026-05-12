import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-8">Help & Info</h1>

        <div className="space-y-4">
          <details className="border border-border rounded-xl p-6 bg-white group cursor-pointer">
            <summary className="font-quicksand font-bold text-lg text-foreground hover:text-primary transition-colors">How to Use the Directory</summary>
            <div className="text-sm text-foreground leading-relaxed mt-4 space-y-3">
              <p><strong>1. Browse by category</strong><br />
                Explore listings grouped by services such as food, retail, digital products, and more.</p>
              <p><strong>2. Browse by location</strong><br />
                Filter businesses based on the area they operate in.</p>
              <p><strong>3. Use the search bar</strong><br />
                Type keywords (e.g., "bakes", "gifts", "cleaning") to find specific services quickly.</p>
              <p><strong>4. Click to view details</strong><br />
                Each listing includes business info, photos, and links provided directly by the business owner.</p>
              <p><strong>5. Click to contact the business</strong><br />
                Each listing includes links to their website, online shop, or social media so you can reach out directly.</p>
            </div>
          </details>

          <details className="border border-border rounded-xl p-6 bg-white group cursor-pointer">
            <summary className="font-quicksand font-bold text-lg text-foreground hover:text-primary transition-colors">Submission Guidelines</summary>
            <div className="text-sm text-foreground leading-relaxed mt-4 space-y-3">
              <p>To keep the directory organised and easy to browse:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide accurate and up‑to‑date information.</li>
                <li>Upload a clear logo or photo (if applicable).</li>
                <li>Choose the correct category and location.</li>
                <li>Keep your description short and easy to understand.</li>
                <li>Do not submit duplicate listings.</li>
                <li>Do not submit content that is illegal, harmful, or inappropriate.</li>
                <li>Only submit your own business or one you have permission to represent.</li>
              </ul>
              <p>Listings that do not follow these guidelines may be edited or removed.</p>
              <p><strong>Google Indexing Disclaimer</strong><br />
                Search engines may index your listing. If you prefer not to be indexed, contact us to remove your listing.</p>
            </div>
          </details>

          <details className="border border-border rounded-xl p-6 bg-white group cursor-pointer">
            <summary className="font-quicksand font-bold text-lg text-foreground hover:text-primary transition-colors">FAQs</summary>
            <div className="text-sm text-foreground leading-relaxed mt-4 space-y-3">
              <p><strong>1. Who can list their business?</strong><br />
                Muslim HBB mamas and all local Muslim home‑based business owners are welcome to list their services.</p>
              <p><strong>2. Is it free to list?</strong><br />
                Yes. The directory is a free community resource.</p>
              <p><strong>3. How long does approval take?</strong><br />
                There is no approval process. Listings appear once submitted.<br />
                However, the directory may review listings periodically to ensure accuracy and appropriateness.</p>
              <p><strong>4. Can non‑Muslim HBBs join?</strong><br />
                This directory is specifically for Muslim‑run home‑based businesses in Singapore.</p>
              <p><strong>5. Why isn't my listing showing up?</strong><br />
                Listings appear once submitted. If yours is not showing, it may be incomplete, duplicated, or removed during periodic checks.</p>
              <p><strong>6. Can I edit my listing after submitting?</strong><br />
                Yes. After submitting the form, you will receive an email from Google Forms with a link to edit your response anytime.<br />
                However, only text can be edited.<br /><br />
                <strong>You will not be able to delete any photos uploaded.</strong><br />
                Email <a href="mailto:hello@sghbb.directory" className="text-primary hover:underline">hello@sghbb.directory</a> to delete your old photo & reupload again.</p>
              <p><strong>7. What if I don't have a logo?</strong><br />
                A logo is recommended but not required. You may upload a clear product photo instead.</p>
              <p><strong>8. Is this a marketplace?</strong><br />
                No. This is not a marketplace. All transactions happen directly between buyers and sellers.</p>
              <p><strong>9. Can I submit someone else's business?</strong><br />
                Listings are submitted through a Google Form, which requires you to log in with your Google account.<br />
                <strong>Only submit a business you own or have permission to represent.</strong><br />
                This login requirement helps prevent duplicate or unauthorised submissions.</p>
              <p><strong>10. How do I remove my listing?</strong><br />
                Email <a href="mailto:hello@sghbb.directory" className="text-primary hover:underline">hello@sghbb.directory</a> with your removal request.</p>
            </div>
          </details>

          <details className="border border-border rounded-xl p-6 bg-white group cursor-pointer">
            <summary className="font-quicksand font-bold text-lg text-foreground hover:text-primary transition-colors">Terms & Conditions</summary>
            <div className="text-sm text-foreground leading-relaxed mt-4 space-y-3">
              <p>By using this directory, you agree that:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>All listings are user-submitted.</li>
                <li>The directory does not verify accuracy of any information.</li>
                <li>The directory is not involved in any transactions or disputes.</li>
                <li>Users are responsible for ensuring their information is correct, lawful, and up to date.</li>
                <li>Listings may be edited or removed if they are inappropriate, misleading, or harmful.</li>
                <li>The directory does not guarantee visibility, traffic, or sales for any business.</li>
                <li>By submitting a listing, you consent to your information being displayed publicly on the website.</li>
              </ol>
              <p>This directory is provided as a free community resource.<br />
                Please use it at your own discretion.</p>
            </div>
          </details>

          <details className="border border-border rounded-xl p-6 bg-white group cursor-pointer">
            <summary className="font-quicksand font-bold text-lg text-foreground hover:text-primary transition-colors">Privacy Notice</summary>
            <div className="text-sm text-foreground leading-relaxed mt-4 space-y-3">
              <p>This directory collects information only through the submission form provided.</p>
              <p>The information you submit is used solely for displaying your listing.</p>
              <p>We do not:<br />
                - sell your data<br />
                - share your data with third parties<br />
                - use your data for advertising<br />
                - collect additional personal information beyond what you submit</p>
              <p>You may request to update or remove your listing at any time.</p>
            </div>
          </details>
        </div>
      </div>

      <Footer />
    </div>
  );
}