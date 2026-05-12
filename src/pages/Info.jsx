import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Info() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-8">About This Directory ℹ️</h1>

        <div className="space-y-6">
          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">What is SGHBB.Directory?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              SGHBB.Directory is a community-driven platform created to support and celebrate Muslim home-based businesses (HBBs) in Singapore. 
              It's a simple space where HBB owners can showcase their products and services, and customers can discover quality local businesses.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">Who created this?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              This directory was created by a Muslim HBB mama, for Muslim HBBs and all local home-based businesses. 
              It's built with love and a mission to help small businesses thrive in our community.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">Is this free?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Yes! Listing your HBB is completely free. We believe in supporting our community without barriers.
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">How can I support this directory?</h2>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              This directory is community-driven and free to use. If you'd like to support its growth, you can contribute via:
            </p>
            <ul className="text-sm text-foreground space-y-2 ml-4">
              <li>• PayNow (QR code available in the footer)</li>
              <li>• Ko-Fi (link available in the footer)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Even small contributions help keep this directory running and growing!
            </p>
          </section>

          <section className="border border-border rounded-xl p-6 bg-white">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-3">Categories Supported</h2>
            <p className="text-sm text-foreground leading-relaxed">
              We welcome all types of home-based businesses including Food, Desserts & Bakes, Drinks, Beauty & Wellness, 
              Fashion & Accessories, Home & Lifestyle, Gifts & Custom Crafts, Educational & Learning, Services, and more.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}