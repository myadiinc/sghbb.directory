import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Eye, Trash2, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const qc = useQueryClient();

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: () => base44.entities.Business.list("-created_date", 500),
  });

  const pending = all.filter(b => b.status === "pending");
  const approved = all.filter(b => b.status === "approved");
  const rejected = all.filter(b => b.status === "rejected");

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Business.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-businesses"] }),
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.Business.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-businesses"] }),
  });

  const approve = (b) => { update.mutate({ id: b.id, data: { status: "approved" } }); toast.success(`${b.name} approved!`); };
  const reject = (b) => { update.mutate({ id: b.id, data: { status: "rejected" } }); toast.error(`${b.name} rejected.`); };
  const toggleFeatured = (b) => { update.mutate({ id: b.id, data: { is_featured: !b.is_featured } }); };
  const del = (b) => { if (confirm(`Delete ${b.name}?`)) { remove.mutate(b.id); toast.success("Deleted."); } };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage business submissions — {pending.length} pending, {approved.length} approved, {rejected.length} rejected
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 rounded-full">{pending.length}</span>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-xs px-1.5 rounded-full">{approved.length}</span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 rounded-full">{rejected.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <BusinessList businesses={pending} onApprove={approve} onReject={reject} onDelete={del} onToggleFeatured={toggleFeatured} showApprove />
            </TabsContent>
            <TabsContent value="approved">
              <BusinessList businesses={approved} onApprove={approve} onReject={reject} onDelete={del} onToggleFeatured={toggleFeatured} showFeatured />
            </TabsContent>
            <TabsContent value="rejected">
              <BusinessList businesses={rejected} onApprove={approve} onReject={reject} onDelete={del} onToggleFeatured={toggleFeatured} showApprove />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function BusinessList({ businesses, onApprove, onReject, onDelete, onToggleFeatured, showApprove, showFeatured }) {
  if (businesses.length === 0) {
    return <p className="text-center text-muted-foreground py-10 text-sm">No listings here.</p>;
  }

  return (
    <div className="space-y-3">
      {businesses.map(b => (
        <div key={b.id} className="bg-white border border-border rounded-xl p-4 flex gap-4 items-start">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {b.logo_url ? (
              <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl bg-secondary">🏠</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-semibold text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.main_category} • {b.location || "No location"}</p>
                {b.tagline && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.tagline}</p>}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {b.badges?.map(badge => (
                    <span key={badge} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{badge}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {showApprove && (
                  <>
                    <Button size="sm" onClick={() => onApprove(b)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(b)} className="h-8 text-destructive border-destructive/30 gap-1">
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </Button>
                  </>
                )}
                {!showApprove && (
                  <Button size="sm" variant="outline" onClick={() => onReject(b)} className="h-8 text-destructive border-destructive/30 gap-1">
                    <XCircle className="w-3.5 h-3.5" />Reject
                  </Button>
                )}
                {showFeatured && (
                  <Button size="sm" variant="outline" onClick={() => onToggleFeatured(b)} className="h-8 gap-1">
                    {b.is_featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                    {b.is_featured ? "Unfeature" : "Feature"}
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onDelete(b)} className="h-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <a href={`/business/${b.id}`} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="h-8"><Eye className="w-3.5 h-3.5" /></Button>
                </a>
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {b.whatsapp && <span>📱 {b.whatsapp}</span>}
              {b.email && <span>✉️ {b.email}</span>}
              {b.instagram && <span>📸 {b.instagram}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}