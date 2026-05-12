import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import HeroSection from "@/components/directory/HeroSection";
import SearchFilters from "@/components/directory/SearchFilters";
import BusinessCard from "@/components/directory/BusinessCard";
import Footer from "@/components/directory/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpotlightSection from "@/components/directory/SpotlightSection";

export default function Directory() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 200),
  });

  const { data: userBusiness, isLoading: businessLoading } = useQuery({
    queryKey: ["userBusiness", currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return null;
      const businesses = await base44.entities.Business.filter({ submitted_by_email: currentUser.email });
      return businesses.length > 0 ? businesses[0] : null;
    },
    enabled: !!currentUser?.email,
    retry: false
  });

  const isBusiness = currentUser && currentUser.role === "business";
  const hasUserBusiness = isBusiness && !businessLoading && userBusiness;
  const submitPath = hasUserBusiness ? `/edit-business/${userBusiness.id}` : "/submit";
  const submitLabel = hasUserBusiness ? "EDIT YOUR HBB LISTING HERE" : "SUBMIT YOUR HBB LISTING HERE";

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
      list = list.filter(b => b.is_mama === true);
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const featured = businesses.filter(b => b.is_featured);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
          href={submitPath}
          className="inline-block px-8 py-3 rounded-full font-quicksand font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-105 shadow"
          style={{ background: "#5e2c2c" }}>
          {submitLabel}
        </a>
      </div>

      <SpotlightSection allBusinesses={businesses} />

      {/* Discover section */}
       <div className="max-w-4xl mx-auto px-4 pt-8 pb-8 text-center">
         <h2 className="font-quicksand text-xl font-bold text-foreground mb-6">
           DISCOVER ✨
         </h2>

         {/* Discover Buttons */}
         <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-2xl mx-auto mb-6">
           <a
             href="/blog"
             className="px-6 py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow"
           >
             HBB SPOTLIGHT 📸
           </a>
           <a
             href="https://directories.sghbb.directory"
             target="_blank"
             rel="noopener noreferrer"
             className="px-6 py-3 rounded-lg font-semibold text-sm border border-primary text-primary hover:bg-accent transition-all"
           >
             OTHER HBB PLATFORMS 🔗
           </a>
         </div>

         {/* Location Filter Tabs */}
         <Tabs value={filters.location || ""} onValueChange={(v) => setFilters(f => ({ ...f, location: v }))} className="w-full">
           <TabsList className="grid grid-cols-6 w-full max-w-2xl mx-auto gap-0">
             <TabsTrigger value="" className="text-xs py-2">All</TabsTrigger>
             <TabsTrigger value="North" className="text-xs py-2">North</TabsTrigger>
             <TabsTrigger value="South" className="text-xs py-2">South</TabsTrigger>
             <TabsTrigger value="East" className="text-xs py-2">East</TabsTrigger>
             <TabsTrigger value="West" className="text-xs py-2">West</TabsTrigger>
             <TabsTrigger value="Central" className="text-xs py-2">Central</TabsTrigger>
           </TabsList>
         </Tabs>
       </div>

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
            <>
              <div className="divide-y divide-border">
                {paginatedItems.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8 px-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    ← Previous
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      <Footer />
    </div>
  );
}