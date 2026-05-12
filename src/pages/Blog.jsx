import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blog() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: entries = [] } = useQuery({
    queryKey: ["blogEntries"],
    queryFn: () => base44.entities.BlogEntry.filter({ is_published: true }, "-created_date", 50),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["allBusinesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 500),
  });

  // Get all unique categories (months + special_attributes)
  const categories = useMemo(() => {
    const cats = new Set();
    entries.forEach(entry => {
      if (entry.month) cats.add(entry.month);
      if (entry.special_attribute) cats.add(entry.special_attribute);
    });
    return Array.from(cats).sort();
  }, [entries]);

  // Filter entries by selected category
  const filteredEntries = useMemo(() => {
    if (!selectedCategory) return entries;
    return entries.filter(entry => 
      entry.month === selectedCategory || entry.special_attribute === selectedCategory
    );
  }, [entries, selectedCategory]);

  const getBusiness = (id) => businesses.find(b => b.id === id);

  const getCategoryLabel = (cat) => {
    const hasAsSpecial = entries.some(e => e.special_attribute === cat);
    return hasAsSpecial ? "🌟 Spotlight" : cat;
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-6 text-center">HBB Blog 📝</h1>

        {/* Categories */}
        {categories.length > 0 && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-8">
            <TabsList className="flex flex-wrap gap-0 h-auto p-0 justify-center">
              <TabsTrigger value="" className="text-sm py-2">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-sm py-2">
                  {getCategoryLabel(cat)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No blog entries yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => {
              const isSpotlight = !!entry.special_attribute;

              return (
                <div key={entry.id} className="border border-border rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-quicksand font-bold text-lg text-foreground">{entry.title}</h2>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{entry.month}</span>
                    {isSpotlight && <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">🌟 Spotlight</span>}
                  </div>

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
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}