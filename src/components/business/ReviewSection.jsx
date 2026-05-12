import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ businessId, user }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", businessId],
    queryFn: () => base44.entities.Review.filter({ business_id: businessId }, "-created_date", 50),
  });

  const myReview = reviews.find(r => r.reviewer_email === user?.email);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.Review.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", businessId] });
      setShowForm(false);
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Review.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", businessId] });
      toast.success("Review deleted.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating.");
    submitMutation.mutate({
      business_id: businessId,
      rating,
      comment,
      reviewer_name: user.full_name || user.email.split("@")[0],
      reviewer_email: user.email,
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-playfair font-bold text-lg text-foreground">Reviews</h2>
          {avgRating && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-sm font-semibold text-foreground">{avgRating}</span>
              <span className="text-xs text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
          )}
        </div>
        {user && !myReview && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
        {!user && (
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="text-xs text-primary underline"
          >
            Sign in to review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && user && !myReview && (
        <form onSubmit={handleSubmit} className="border border-border rounded-xl p-4 bg-secondary/20 mb-4 space-y-3">
          <p className="text-sm font-medium">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
          <Textarea
            placeholder="Share your experience (optional)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* My review notice */}
      {myReview && (
        <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-primary font-medium mb-1">Your review</p>
              <StarRating value={myReview.rating} readonly />
              {myReview.comment && <p className="text-sm text-foreground mt-2">{myReview.comment}</p>}
            </div>
            <button onClick={() => deleteMutation.mutate(myReview.id)} className="text-xs text-destructive hover:underline">Delete</button>
          </div>
        </div>
      )}

      {/* All reviews */}
      {reviews.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
      )}
      <div className="space-y-3">
        {reviews.filter(r => r.reviewer_email !== user?.email).map(r => (
          <div key={r.id} className="border border-border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-foreground">{r.reviewer_name || "Anonymous"}</span>
              <span className="text-xs text-muted-foreground">{new Date(r.created_date).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <StarRating value={r.rating} readonly />
            {r.comment && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}