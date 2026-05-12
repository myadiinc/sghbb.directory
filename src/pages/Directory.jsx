import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import HeroSection from "@/components/directory/HeroSection";
import SearchFilters from "@/components/directory/SearchFilters";
import BusinessCard from "@/components/directory/BusinessCard";
import Footer from "@/components/directory/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Directory() {
  const [filters, setFilters] = useState({});
  const [tab, setTab] = useState("directory");

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 200),
  });

  const filtered = useMemo(() => {
    let list = [...businesses];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.tagline?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q)
      );
    }
    if (filters.main_category) {
      list = list.filter(b => b.main_category === filters.main_category);
    }
    if (filters.additional_category) {
      list = list.filter(b => b.badges?.includes(filters.additional_category));
    }
    if (filters.is_mama === "Yes") {
      list = list.filter(b => b.is_mama);
    }
    if (filters.halal_status) {
      list = list.filter(b => b.halal_status === filters.halal_status);
    }
    if (filters.location) {
      list = list.filter(b => b.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.sort === "Name A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "Name Z-A") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sort === "Newest first") {
      list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    return list;
  }, [businesses, filters]);

  const featured = businesses.filter(b => b.is_featured);

  return (
      <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <HeroSection totalCount={businesses.length} />

      {/* Submit CTA below hero */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Come join the <span className="font-bold text-foreground">{businesses.length}</span> HBBs listed ✨
        </p>
        <a
          href="/submit"
          className="inline-block px-8 py-3 rounded-full font-quicksand font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-105 shadow"
          style={{ background: "#5e2c2c" }}>
          SUBMIT YOUR HBB LISTING HERE
        </a>
      </div>

      {/* Discover section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2 text-center">
        <h2 className="font-quicksand text-xl font-bold text-foreground mb-4">
          DISCOVER ✨
        </h2>
        <Tabs value={tab} onValueChange={setTab} className="w-full max-w-sm mx-auto">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="directory">HBB SPOTLIGHT</TabsTrigger>
            <TabsTrigger value="platforms">OTHER HBB PLATFORMS</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "platforms" ? (
        <div className="max-w-4xl mx-auto px-4 py-10 text-center text-muted-foreground">
          <p className="text-sm">Links to other HBB platforms coming soon.</p>
        </div>
      ) : (
        <>
          <SearchFilters filters={filters} onFilterChange={setFilters} />

          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">No HBBs found matching your search.</p>
                <p className="text-sm mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}