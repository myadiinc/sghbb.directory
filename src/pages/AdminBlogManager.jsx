import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function AdminBlogManager() {
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", month: "", special_attribute: "", description: "", is_published: false });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: entries = [], refetch: refetchEntries } = useQuery({
    queryKey: ["blogEntries"],
    queryFn: () => base44.entities.BlogEntry.list("-created_date", 50),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => base44.entities.Business.filter({ status: "approved" }, "-created_date", 500),
  });

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.month) return;

    if (editingId) {
      await base44.entities.BlogEntry.update(editingId, form);
      setEditingId(null);
    } else {
      await base44.entities.BlogEntry.create(form);
    }

    setForm({ title: "", month: "", special_attribute: "", description: "", is_published: false });
    refetchEntries();
  };

  const handleEdit = (entry) => {
    setForm(entry);
    setEditingId(entry.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this blog entry?")) {
      await base44.entities.BlogEntry.delete(id);
      refetchEntries();
    }
  };



  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-quicksand font-bold text-2xl text-foreground mb-6">Blog Manager</h1>

        {/* Form */}
        <div className="bg-white border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">{editingId ? "Edit Blog Entry" : "Create New Blog Entry"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., May Spotlight"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Month *</label>
              <Input
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                placeholder="e.g., May"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Spotlight (Special Attribute)</label>
              <Select value={form.special_attribute} onValueChange={(v) => setForm({ ...form, special_attribute: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a spotlight..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  <SelectItem value="April_01">April_01</SelectItem>
                  <SelectItem value="April_02">April_02</SelectItem>
                  <SelectItem value="May">May</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Blog entry content..."
                className="mt-1"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />
              <span className="text-sm font-medium">Publish</span>
            </label>

            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ title: "", month: "", special_attribute: "", description: "", is_published: false });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          <h2 className="font-semibold text-lg mb-4">All Blog Entries</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-border rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                   <p className="font-semibold text-foreground">{entry.title}</p>
                   <p className="text-sm text-muted-foreground">{entry.month}</p>
                   {entry.special_attribute && <p className="text-xs text-accent-foreground mt-1">🌟 {entry.special_attribute}</p>}
                   <p className="text-xs text-muted-foreground mt-1">{entry.is_published ? "Published" : "Draft"}</p>
                 </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(entry)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(entry.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}