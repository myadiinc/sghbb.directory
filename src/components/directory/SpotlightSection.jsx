import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const BADGE_STYLES = {
  "HBB Verified": "bg-emerald-100 text-emerald-700",
  "New HBB": "bg-amber-100 text-amber-700",
  "HBB Mama": "bg-pink-100 text-pink-700",
  "Non F&B": "bg-purple-100 text-purple-700",
  "F&B": "bg-orange-100 text-orange-700",
  "HBB Spotlight": "bg-yellow-100 text-yellow-700",
};

export default function SpotlightSection({ allBusinesses }) {
  const { data: spotlights = [] } = useQuery({
    queryKey: ["spotlights-active"],
    queryFn: () => base44.entities.Spotlight.filter({ is_active: true }, "display_order", 10),
  });

  const activeSpotlights = spotlights.filter(s => (s.business_ids || []).length > 0);

  if (activeSpotlights.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
      {activeSpotlights.map(spotlight => {
        const businesses = (spotlight.business_ids || [])
          .map(id => allBusinesses.find(b => b.id === id))
          .filter(Boolean);

        if (businesses.length === 0) return null;

        return (
          <div key={spotlight.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h3 className="font-quicksand font-bold text-base text-foreground">{spotlight.title}</h3>
              {spotlight.description && (
                <span className="text-xs text-muted-foreground">— {spotlight.description}</span>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {businesses.map(biz => (
                <Link
                  key={biz.id}
                  to={`/business/${biz.id}`}
                  className="flex-shrink-0 w-36 border border-border rounded-xl bg-white hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="w-full h-28 bg-muted overflow-hidden">
                    {biz.logo_url ? (
                      <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl bg-secondary">🏠</div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-xs text-foreground line-clamp-1">{biz.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{biz.tagline || biz.main_category}</p>
                    {biz.badges?.slice(0, 1).map(badge => (
                      <span key={badge} className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${BADGE_STYLES[badge] || "bg-muted text-muted-foreground"}`}>{badge}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div className="border-t border-border" />
    </div>
  );
}