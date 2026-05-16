import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import HeroSection from "@/components/directory/HeroSection";
import BusinessCard from "@/components/directory/BusinessCard";
import Footer from "@/components/directory/Footer";
import SpotlightSection from "@/components/directory/SpotlightSection";
import FilterTabLocation from "@/components/directory/filters/FilterTabLocation";
import FilterTabCategory from "@/components/directory/filters/FilterTabCategory";
import FilterTabMama from "@/components/directory/filters/FilterTabMama";
import FilterTabHalal from "@/components/directory/filters/FilterTabHalal";
import FilterSearch from "@/components/directory/filters/FilterSearch";
import FilterSort from "@/components/directory/filters/FilterSort";
import { matchesLocationFilter, MAIN_CATEGORIES } from "@/lib/constants";

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

   // ⭐ STEP 1 — Count how many HBBs per category
  const categoryCounts = useMemo(() => {
    return MAIN_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = businesses.filter(b => b.main_category === cat).length;
      return acc;
    }, {});
  }, [businesses]);
  
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

  const isAdmin = currentUser && currentUser.role === "admin";
  const isBusiness = currentUser && currentUser.role === "business";
  const canEditBusiness = (isBusiness || isAdmin) && !businessLoading && userBusiness;
  const submitPath = canEditBusiness ? `/edit-business/${userBusiness.id}` : "/submit";
  const submitLabel = canEditBusiness ? "EDIT YOUR HBB LISTING HERE" : "SUBMIT YOUR HBB LISTING HERE";

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
    if (filters.is_mama === "Yes") {
      list = list.filter(b => b.is_mama === true);
    } else if (filters.is_mama === "No") {
      list = list.filter(b => !b.is_mama);
    }
    if (filters.halal_status) {
      list = list.filter(b => b.halal_status === filters.halal_status);
    }
    if (filters.location) {
      list = list.filter(b => matchesLocationFilter(b.location, filters.location));
    }
    if (filters.sort === "A to Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "Z to A") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sort === "Newest") {
      list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (filters.sort === "Oldest") {
      list.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
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

         {/* FILTER PANEL */}
<div className="max-w-4xl mx-auto px-4 pt-8 pb-8">
  <div className="bg-white rounded-2xl shadow-sm border border-border p-5 space-y-6">

    {/* Location Tabs */}
    <FilterTabLocation
      locationFilter={filters.location}
      onLocationChange={(location) =>
        setFilters((f) => {
          const next = { ...f };
          if (location) next.location = location;
          else delete next.location;
          return next;
        })
      }
    />

    {/* Category Cards */}
    <FilterTabCategory
      categoryFilter={filters.main_category}
      onCategoryChange={(category) =>
        setFilters((f) => {
          const next = { ...f };
          if (category) next.main_category = category;
          else delete next.main_category;
          return next;
        })
      }
      categoryCounts={categoryCounts}
    />

    {/* Mama + Halal Chips */}
    <div className="flex flex-wrap gap-3 justify-center">
      <FilterTabMama
        mamaFilter={filters.is_mama}
        onMamaChange={(isMama) =>
          setFilters((f) => {
            const next = { ...f };
            if (isMama) next.is_mama = isMama;
            else delete next.is_mama;
            return next;
          })
        }
      />

      <FilterTabHalal
        halalFilter={filters.halal_status}
        onHalalChange={(halal) =>
          setFilters((f) => {
            const next = { ...f };
            if (halal) next.halal_status = halal;
            else delete next.halal_status;
            return next;
          })
        }
      />
    </div>

    {/* Search + Sort */}
    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-2">

      <div className="w-full sm:flex-1">
        <FilterSearch
          search={filters.search}
          onSearchChange={(search) =>
            setFilters((f) => {
              const next = { ...f };
              if (search) next.search = search;
              else delete next.search;
              return next;
            })
          }
        />
      </div>

      <div className="w-full sm:w-auto sm:min-w-[160px]">
        <FilterSort
          sort={filters.sort}
          onSortChange={(sort) =>
            setFilters((f) => ({ ...f, sort }))
          }
        />
      </div>

    </div>

  </div>
</div>

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