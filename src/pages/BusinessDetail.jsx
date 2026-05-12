import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import ReviewSection from "@/components/business/ReviewSection";
import LikeButton from "@/components/business/LikeButton";
import SaveToListButton from "@/components/business/SaveToListButton";
import { ArrowLeft, MapPin, Clock, Globe, Instagram, Facebook, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const BADGE_STYLES = {
  "HBB Verified": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "New HBB": "bg-amber-100 text-amber-700 border border-amber-200",
  "HBB Mama": "bg-pink-100 text-pink-700 border border-pink-200",
  "Non F&B": "bg-purple-100 text-purple-700 border border-purple-200",
  "F&B": "bg-orange-100 text-orange-700 border border-orange-200",
  "HBB Spotlight": "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

export default function BusinessDetail() {
  const { id } = useParams();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: business, isLoading } = useQuery({
    queryKey: ["business", id],
    queryFn: () => base44.entities.Business.filter({ id }),
    select: (data) => data[0],
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", business?.main_category],
    queryFn: () => base44.entities.Business.filter({ status: "approved", main_category: business.main_category }, "-created_date", 6),
    enabled: !!business?.main_category,
    select: (data) => data.filter(b => b.id !== id).slice(0, 4),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">Business not found.</p>
          <Link to="/" className="text-primary text-sm mt-2 inline-block hover:underline">← Back to Directory</Link>
        </div>
      </div>
    );
  }

  const allPhotos = [business.logo_url, ...(business.photos || [])].filter(Boolean);
  const waNumber = business.whatsapp?.replace(/\D/g, "");
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        {/* Photo carousel */}
        {allPhotos.length > 0 && (
          <div className="relative rounded-xl overflow-hidden bg-muted mb-5 aspect-video">
            <img src={allPhotos[photoIndex]} alt={business.name} className="w-full h-full object-cover" />
            {allPhotos.length > 1 && (
              <>
                <button onClick={() => setPhotoIndex((photoIndex - 1 + allPhotos.length) % allPhotos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">‹</button>
                <button onClick={() => setPhotoIndex((photoIndex + 1) % allPhotos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">›</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allPhotos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIndex ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* WhatsApp CTA + action buttons */}
        <div className="flex gap-2 mb-4">
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: "hsl(142,71%,40%)" }}>
              💬 WhatsApp
            </a>
          )}
          <LikeButton businessId={id} user={user} />
          <SaveToListButton businessId={id} user={user} />
        </div>

        {/* Back breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Link to="/" className="hover:text-primary">← Back</Link>
        </div>

        {/* Badges */}
        {business.badges?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {business.badges.map((badge) => (
              <span key={badge} className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_STYLES[badge] || "bg-muted text-muted-foreground"}`}>
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Name & tagline */}
        <h1 className="font-quicksand font-bold text-2xl text-foreground">{business.name}</h1>
        {business.tagline && <p className="text-muted-foreground text-sm mt-1">{business.tagline}</p>}

        {/* Social icons */}
        <div className="flex gap-2 mt-3">
          {business.instagram && (
            <a href={business.instagram.startsWith("http") ? business.instagram : `https://instagram.com/${business.instagram}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:opacity-80">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {business.facebook && (
            <a href={business.facebook.startsWith("http") ? business.facebook : `https://facebook.com/${business.facebook}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-600 text-white hover:opacity-80">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {business.tiktok && (
            <a href={business.tiktok.startsWith("http") ? business.tiktok : `https://tiktok.com/@${business.tiktok}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black text-white hover:opacity-80 text-xs font-bold">TK</a>
          )}
          {business.threads && (
            <a href={business.threads.startsWith("http") ? business.threads : `https://threads.net/@${business.threads}`}
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground text-background hover:opacity-80 text-sm font-bold">@</a>
          )}
        </div>

        {/* Description */}
        {business.description && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{business.description}</p>
        )}

        {/* Details grid */}
        <div className="mt-5 space-y-2 text-sm border rounded-xl p-4 bg-secondary/30">
          {business.main_category && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">HBB Main Category</span>
              <span className="font-medium">{business.main_category}</span>
            </div>
          )}
          {business.location && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Location</span>
              <span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{business.location}</span>
            </div>
          )}
          {business.hours && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Hours</span>
              <span className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{business.hours}</span>
            </div>
          )}
          {business.halal_status && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Halal Status</span>
              <span className="font-medium">{business.halal_status}</span>
            </div>
          )}
          {business.website && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Website</span>
              <a href={business.website} target="_blank" rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-1">
                <Globe className="w-3 h-3" />Visit Website
              </a>
            </div>
          )}
          {business.email && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Email</span>
              <a href={`mailto:${business.email}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />{business.email}
              </a>
            </div>
          )}
          {business.phone && (
            <div className="flex gap-3">
              <span className="text-muted-foreground w-32 flex-shrink-0">Phone</span>
              <a href={`tel:${business.phone}`} className="font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />{business.phone}
              </a>
            </div>
          )}
        </div>

        {/* Reviews */}
        <ReviewSection businessId={id} user={user} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="font-quicksand font-bold text-lg text-foreground mb-4 text-center">
              See More Related HBBs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((b) => (
                <Link key={b.id} to={`/business/${b.id}`}
                  className="flex gap-3 p-3 border border-border rounded-xl bg-white hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-secondary">🏠</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{b.tagline || b.description}</p>
                    {b.badges?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {b.badges.slice(0, 2).map(badge => (
                          <span key={badge} className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE_STYLES[badge] || "bg-muted text-muted-foreground"}`}>{badge}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}