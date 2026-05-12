import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MyReviews() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: reviews = [], isLoading, refetch } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      if (!user) return [];
      const all = await base44.entities.Review.list("-created_date", 500);
      return all.filter(r => r.reviewer_email === user.email);
    },
    enabled: !!user,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["businesses-for-reviews"],
    queryFn: () => base44.entities.Business.list("", 500),
  });

  const handleDelete = (reviewId) => {
    if (confirm("Delete this review?")) {
      base44.entities.Review.delete(reviewId).then(() => {
        refetch();
        toast.success("Review deleted.");
      });
    }
  };

  const getBusinessName = (businessId) => {
    return businesses.find(b => b.id === businessId)?.name || "Unknown Business";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-2">My Reviews</h1>
        <p className="text-muted-foreground text-sm mb-8">All reviews you've written</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No reviews yet.</p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">Browse & Review HBBs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/business/${review.business_id}`} className="font-semibold text-primary hover:underline">
                      {getBusinessName(review.business_id)}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                      <span className="text-xs text-muted-foreground">{review.rating} star{review.rating !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                    className="h-8 text-destructive border-destructive/30 gap-1 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(review.created_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}