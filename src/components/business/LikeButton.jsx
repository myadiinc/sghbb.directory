import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function LikeButton({ businessId, user }) {
  const qc = useQueryClient();

  const { data: likes = [] } = useQuery({
    queryKey: ["likes", businessId],
    queryFn: () => base44.entities.Like.filter({ business_id: businessId }),
  });

  const myLike = likes.find(l => l.user_email === user?.email);
  const likeCount = likes.length;

  const likeMutation = useMutation({
    mutationFn: () => base44.entities.Like.create({ business_id: businessId, user_email: user.email }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["likes", businessId] }),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => base44.entities.Like.delete(myLike.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["likes", businessId] }),
  });

  const handleClick = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    if (myLike) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
        myLike
          ? "bg-red-50 border-red-200 text-red-500"
          : "bg-white border-border text-muted-foreground hover:border-red-200 hover:text-red-400"
      }`}
    >
      <Heart className={`w-4 h-4 ${myLike ? "fill-red-500 text-red-500" : ""}`} />
      <span>{likeCount > 0 ? likeCount : ""} {myLike ? "Liked" : "Like"}</span>
    </button>
  );
}