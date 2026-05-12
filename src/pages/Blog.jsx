import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/directory/Navbar";
import Footer from "@/components/directory/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Blog() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSpotlight, setSelectedSpotlight] = useState("");

  const { data: entries = [] } = useQuery({
    queryKey: ["blogEntries"],
    queryFn: () => base44.entities.BlogEntry.filter({ is_published: true }, "-created_date", 50),
  });

  // Get unique months and special attributes
  const months = useMemo(() => {
    const m = new Set();
    entries.forEach(e => e.month && m.add(e.month));
    return Array.from(m).sort();
  }, [entries]);

  const spotlights = useMemo(() => {
    const s = new Set();
    entries.forEach(e => e.special_attribute && s.add(e.special_attribute));
    return Array.from(s).sort();
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchMonth = !selectedMonth || entry.month === selectedMonth;
      const matchSpotlight = !selectedSpotlight || entry.special_attribute === selectedSpotlight;
      return matchMonth && matchSpotlight;
    });
  }, [entries, selectedMonth, selectedSpotlight]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <h1 className="font-quicksand font-bold text-3xl text-foreground mb-8 text-center">HBB Blog 📝</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {months.length > 0 && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue placeholder="Filter by Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {spotlights.length > 0 && (
            <Select value={selectedSpotlight} onValueChange={setSelectedSpotlight}>
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue placeholder="Filter by Spotlight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Spotlights</SelectItem>
                {spotlights.map((spot) => (
                  <SelectItem key={spot} value={spot}>
                    🌟 {spot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No blog entries matching filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => {
              return (
                <div key={entry.id} className="border border-border rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-quicksand font-bold text-lg text-foreground">{entry.title}</h2>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{entry.month}</span>
                    {entry.special_attribute && <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">🌟 {entry.special_attribute}</span>}
                  </div>

                  {entry.description && (
                    <p className="text-sm text-foreground mt-3 leading-relaxed">{entry.description}</p>
                  )}
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