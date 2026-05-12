import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function SpotlightManager() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { data: spotlights = [] } = useQuery({
    queryKey: ["spotlights-admin"],
    queryFn: () => base44.entities.Spotlight.list("display_order", 100),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["admin-businesses-all"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "name", 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Spotlight.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spotlights-admin"] });
      setCreating(false);
      setNewTitle("");
      setNewDesc("");
      toast.success("Spotlight created!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Spotlight.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["spotlights-admin"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Spotlight.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spotlights-admin"] });
      toast.success("Deleted.");
    },
  });

  const toggleBusiness = (spotlight, bizId) => {
    const ids = spotlight.business_ids || [];
    const updated = ids.includes(bizId) ? ids.filter(i => i !== bizId) : [...ids, bizId];
    updateMutation.mutate({ id: spotlight.id, data: { business_ids: updated } });
  };

  const toggleActive = (spotlight) => {
    updateMutation.mutate({ id: spotlight.id, data: { is_active: !spotlight.is_active } });
    toast.success(spotlight.is_active ? "Spotlight hidden." : "Spotlight now live!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{spotlights.length} spotlight collection(s)</p>
        <Button size="sm" onClick={() => setCreating(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> New Spotlight
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="border border-border rounded-xl p-4 bg-white space-y-3">
          <Input placeholder="Spotlight title (e.g. April Picks)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <Textarea placeholder="Optional description..." value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} />
          <div className="flex gap-2">
            <Button size="sm" disabled={!newTitle} onClick={() => createMutation.mutate({ title: newTitle, description: newDesc, business_ids: [], is_active: true, display_order: spotlights.length })}>
              Create
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Spotlight list */}
      {spotlights.map(spotlight => (
        <div key={spotlight.id} className="border border-border rounded-xl bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-secondary/30">
            <div>
              <p className="font-semibold text-sm text-foreground">{spotlight.title}</p>
              {spotlight.description && <p className="text-xs text-muted-foreground mt-0.5">{spotlight.description}</p>}
              <p className="text-xs text-muted-foreground mt-0.5">{(spotlight.business_ids || []).length} HBBs selected</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => toggleActive(spotlight)} className={`gap-1.5 h-8 text-xs ${spotlight.is_active ? "text-emerald-700 border-emerald-300" : "text-muted-foreground"}`}>
                {spotlight.is_active ? <><Eye className="w-3.5 h-3.5" /> Live</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(editingId === spotlight.id ? null : spotlight.id)} className="h-8">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${spotlight.title}"?`)) deleteMutation.mutate(spotlight.id); }} className="h-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Business picker */}
          {editingId === spotlight.id && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">Select HBBs for this spotlight (click to toggle):</p>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {businesses.map(biz => {
                  const selected = (spotlight.business_ids || []).includes(biz.id);
                  return (
                    <button
                      key={biz.id}
                      onClick={() => toggleBusiness(spotlight, biz.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${selected ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50"}`}
                    >
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {biz.logo_url ? <img src={biz.logo_url} alt={biz.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🏠</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{biz.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{biz.main_category}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      {spotlights.length === 0 && !creating && (
        <p className="text-center text-muted-foreground text-sm py-10">No spotlights yet. Create one to get started!</p>
      )}
    </div>
  );
}