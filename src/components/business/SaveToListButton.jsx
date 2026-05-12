import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Bookmark, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SaveToListButton({ businessId, user }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { data: lists = [] } = useQuery({
    queryKey: ["saved-lists", user?.email],
    queryFn: () => base44.entities.SavedList.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const isSavedInAny = lists.some(l => l.business_ids?.includes(businessId));

  const updateListMutation = useMutation({
    mutationFn: ({ id, business_ids }) => base44.entities.SavedList.update(id, { business_ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-lists", user?.email] });
      toast.success("List updated!");
    },
  });

  const createListMutation = useMutation({
    mutationFn: (name) => base44.entities.SavedList.create({
      user_email: user.email,
      list_name: name,
      business_ids: [businessId],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-lists", user?.email] });
      setNewListName("");
      toast.success("Saved to new list!");
    },
  });

  const handleToggle = (list) => {
    const ids = list.business_ids || [];
    const updated = ids.includes(businessId)
      ? ids.filter(id => id !== businessId)
      : [...ids, businessId];
    updateListMutation.mutate({ id: list.id, business_ids: updated });
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createListMutation.mutate(newListName.trim());
  };

  if (!user) {
    return (
      <button
        onClick={() => base44.auth.redirectToLogin()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground hover:border-primary/40 transition-all"
      >
        <Bookmark className="w-4 h-4" />
        Save
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
          isSavedInAny
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-white border-border text-muted-foreground hover:border-primary/40"
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isSavedInAny ? "fill-primary text-primary" : ""}`} />
        {isSavedInAny ? "Saved" : "Save"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-40 w-56 bg-white border border-border rounded-xl shadow-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Save to list</p>

            {lists.length > 0 && (
              <div className="space-y-1 mb-3">
                {lists.map(list => {
                  const saved = list.business_ids?.includes(businessId);
                  return (
                    <button key={list.id} onClick={() => handleToggle(list)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary text-sm text-foreground">
                      <span className="truncate">{list.list_name}</span>
                      {saved && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleCreateList} className="flex gap-1.5">
              <Input
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="New list name..."
                className="h-7 text-xs"
              />
              <Button type="submit" size="sm" className="h-7 px-2">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}