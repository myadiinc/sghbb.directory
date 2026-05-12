import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
  const [expandedId, setExpandedId] = useState(null);

  const { data: entries = [] } = useQuery({
    queryKey: ["blogEntries"],
    queryFn: () => base44.entities.BlogEntry.filter({ is_published: true }, "-created_date", 50),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["allBusinesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 500),
  });

  const getBusiness = (id) => businesses.find(b => b.id === id);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-8 text-center">HBB Blog 📝</h1>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No blog entries yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-border rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                <h2 className="font-quicksand font-bold text-lg text-foreground">{entry.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{entry.month}</p>

                {entry.description && (
                  <p className="text-sm text-foreground mt-3 leading-relaxed">{entry.description}</p>
                )}

                {entry.featured_hbb_ids?.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {expandedId === entry.id ? "Hide" : "Show"} Featured HBBs ({entry.featured_hbb_ids.length})
                    </button>

                    {expandedId === entry.id && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {entry.featured_hbb_ids.map((id) => {
                          const biz = getBusiness(id);
                          return biz ? (
                            <Link
                              key={id}
                              to={`/business/${id}`}
                              className="flex gap-3 p-3 border border-border rounded-lg bg-secondary/30 hover:bg-secondary transition-colors"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {biz.logo_url ? (
                                  <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl bg-secondary">🏠</div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-foreground truncate">{biz.name}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{biz.description || biz.main_category}</p>
                              </div>
                            </Link>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}