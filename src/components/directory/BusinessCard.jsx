import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const BADGE_STYLES = {
  "HBB Verified": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "New HBB": "bg-amber-100 text-amber-700 border border-amber-200",
  "HBB Mama": "bg-pink-100 text-pink-700 border border-pink-200",
  "Non F&B": "bg-purple-100 text-purple-700 border border-purple-200",
  "F&B": "bg-orange-100 text-orange-700 border border-orange-200",
  "HBB Spotlight": "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

const HALAL_TAG_STYLES = {
  "Muslim-Owned F&B": "bg-green-100 text-green-700 border border-green-200",
  "Halal-Certified F&B": "bg-green-100 text-green-700 border border-green-200",
  "Non F&B": "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function BusinessCard({ business }) {
  const waNumber = business.whatsapp?.replace(/\D/g, "");
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="bg-white border-b border-border hover:bg-secondary/30 transition-colors">
      <div className="flex gap-4 px-4 py-5 max-w-4xl mx-auto">
        {/* Thumbnail */}
        <Link to={`/business/${business.id}`} className="flex-shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-muted border border-border">
            {business.logo_url ? (
              <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-secondary">
                🏠
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Link to={`/business/${business.id}`}>
                <h3 className="font-inter font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors leading-tight">
                  {business.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                {business.tagline || business.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {business.is_mama && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-pink-100 text-pink-700 border border-pink-200">
                    HBB Mama
                  </span>
                )}
                {business.halal_status && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${HALAL_TAG_STYLES[business.halal_status] || "bg-muted text-muted-foreground"}`}>
                    {business.halal_status}
                  </span>
                )}
                {business.badges?.length > 0 && business.badges.map((badge) => (
                  <span key={badge} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${BADGE_STYLES[badge] || "bg-muted text-muted-foreground"}`}>
                    {badge}
                  </span>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-2 mt-2.5 items-center">
                {business.instagram && (
                  <a href={business.instagram.startsWith("http") ? business.instagram : `https://instagram.com/${business.instagram}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:opacity-80 transition-opacity">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {business.facebook && (
                  <a href={business.facebook.startsWith("http") ? business.facebook : `https://facebook.com/${business.facebook}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white hover:opacity-80 transition-opacity">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {business.tiktok && (
                  <a href={business.tiktok.startsWith("http") ? business.tiktok : `https://tiktok.com/@${business.tiktok}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:opacity-80 transition-opacity text-xs font-bold">
                    TK
                  </a>
                )}
                {business.threads && (
                  <a href={business.threads.startsWith("http") ? business.threads : `https://threads.net/@${business.threads}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground text-background hover:opacity-80 transition-opacity text-xs font-bold">
                    @
                  </a>
                )}
              </div>
            </div>

            {/* WhatsApp Button */}
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm"
                style={{ background: "hsl(142,71%,40%)" }}>
                WhatsApp
              </a>
            )}
          </div>

          {/* Meta info */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {business.main_category && (
              <>
                <span className="font-medium text-foreground/60">HBB Main Category:</span>
                <span>{business.main_category}</span>
              </>
            )}
            {business.location && (
              <>
                <span className="font-medium text-foreground/60">Location:</span>
                <span>{business.location}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}