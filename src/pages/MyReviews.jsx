import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function MyReviews() {
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

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

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment || "");
    setEditRating(review.rating);
  };

  const saveEdit = () => {
    base44.entities.Review.update(editingId, { 
      pending_comment: editComment,
      requires_approval: true,
      rating: editRating
    }).then(() => {
      refetch();
      setEditingId(null);
      toast.success("Review edit submitted for approval.");
    });
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
                {editingId === review.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Rating</label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            onMouseEnter={() => {}}
                            className={`text-2xl transition-all cursor-pointer ${star <= editRating ? 'text-yellow-500 scale-125' : 'text-gray-300 hover:text-yellow-300'}`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{editRating} star{editRating !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Comment</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full mt-2 p-2 border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button size="sm" onClick={saveEdit} className="bg-primary hover:bg-primary/90">Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(review)}
                          className="h-8 gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(review.id)}
                          className="h-8 text-destructive border-destructive/30 gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                    )}
                    {review.requires_approval && (
                      <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">⏳ Pending approval</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.created_date).toLocaleDateString()}
                    </p>
                  </>
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