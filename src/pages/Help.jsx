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

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-8">Help & Support 🤝</h1>

        <div className="space-y-6">
          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">How do I submit my HBB?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Click on "SUBMIT YOUR HBB LISTING HERE" button on the main page, fill in your business details, and submit. Your listing will be reviewed and published once approved.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">Can I edit my listing?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Yes! Click on your business listing and select "Edit Listing" if you are the owner or admin. You can update photos, contact information, and other details anytime.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">How do I filter by location?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Use the location buttons below "DISCOVER" (North, South, East, West, Central) or search by specific area in the search bar.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">What does HBB Mama mean?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              HBB Mama refers to a home-based business owned and operated by a mama (mother). This badge celebrates female entrepreneurs running their own businesses.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">Questions or Issues?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Please reach out via our social media channels on Instagram, Facebook, TikTok, or Threads @sghbb.directory
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}