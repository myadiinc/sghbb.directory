import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";

export default function Info() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to="/" className="text-sm text-primary hover:underline mb-6 inline-block">← Back to Directory</Link>
        <h1 className="font-quicksand font-bold text-2xl text-primary mb-6">Info</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Welcome to SGHBB.Directory — a community space for Singapore's Muslim home-based businesses.
        </p>
      </div>
      <Footer />
    </div>
  );
}