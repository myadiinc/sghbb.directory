import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { Trash2, Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function MyLists() {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("lists");

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const { data: lists = [] } = useQuery({
    queryKey: ["saved-lists", user?.email],
    queryFn: () => base44.entities.SavedList.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: likes = [] } = useQuery({
    queryKey: ["my-likes", user?.email],
    queryFn: () => base44.entities.Like.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: allBusinesses = [] } = useQuery({
    queryKey: ["businesses-for-lists"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 500),
    enabled: !!user,
  });

  const bizMap = Object.fromEntries(allBusinesses.map(b => [b.id, b]));

  const deleteListMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedList.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["saved-lists", user?.email] }); toast.success("List deleted."); },
  });

  const unlikeMutation = useMutation({
    mutationFn: (id) => base44.entities.Like.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-likes", user?.email] }); },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔒</p>
          <p className="font-medium text-foreground mb-3">Sign in to see your lists & liked businesses</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const likedBusinesses = likes.map(l => bizMap[l.business_id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-2xl font-bold text-foreground mb-6">My HBB Collection</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button onClick={() => setTab("lists")}
            className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === "lists" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <Bookmark className="w-4 h-4 inline mr-1" />My Lists ({lists.length})
          </button>
          <button onClick={() => setTab("liked")}
            className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === "liked" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <Heart className="w-4 h-4 inline mr-1" />Liked ({likedBusinesses.length})
          </button>
        </div>

        {tab === "lists" && (
          <div className="space-y-4">
            {lists.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No lists yet. Save businesses from their profile pages!</p>
              </div>
            )}
            {lists.map(list => {
              const businesses = (list.business_ids || []).map(id => bizMap[id]).filter(Boolean);
              return (
                <div key={list.id} className="border border-border rounded-xl bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-foreground">{list.list_name}</p>
                      <p className="text-xs text-muted-foreground">{businesses.length} business{businesses.length !== 1 ? "es" : ""}</p>
                    </div>
                    <button onClick={() => deleteListMutation.mutate(list.id)} className="text-destructive hover:opacity-70">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {businesses.length === 0 && (
                    <p className="px-4 py-3 text-xs text-muted-foreground">No businesses saved yet.</p>
                  )}
                  <div className="divide-y divide-border">
                    {businesses.map(b => <BusinessRow key={b.id} business={b} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "liked" && (
          <div className="space-y-2">
            {likedBusinesses.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No liked businesses yet. Tap the heart on any business!</p>
              </div>
            )}
            {likes.map(like => {
              const b = bizMap[like.business_id];
              if (!b) return null;
              return (
                <div key={like.id} className="flex items-center justify-between border border-border rounded-xl bg-white px-4 py-3">
                  <BusinessRow business={b} />
                  <button onClick={() => unlikeMutation.mutate(like.id)} className="ml-3 flex-shrink-0">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500 hover:opacity-70" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function BusinessRow({ business }) {
  return (
    <Link to={`/business/${business.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {business.logo_url
          ? <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-lg bg-secondary">🏠</div>}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{business.name}</p>
        <p className="text-xs text-muted-foreground truncate">{business.main_category}</p>
      </div>
    </Link>
  );
}