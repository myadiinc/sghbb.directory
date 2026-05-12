import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAIN_CATEGORIES = [
  "01 Food & Beverage",
  "02 Fashion & Apparel",
  "03 Beauty & Personal Care",
  "04 Beauty & Wellness",
  "05 Home & Living",
  "06 Education & Tutoring",
  "07 Digital Services",
  "08 Event & Catering",
  "09 Health & Wellness",
  "10 Crafts & Handmade",
  "11 Kids & Parenting",
  "12 Other",
];

const ADDITIONAL_CATEGORIES = ["Non F&B", "F&B", "HBB Mama", "HBB Spotlight"];
const HOURS = ["Open Now", "Weekdays", "Weekends", "24/7"];
const HALAL_STATUS = ["Halal Certified", "Muslim-Owned", "Halal Ingredients", "Not Applicable"];
const LOCATIONS = [
  "North", "South", "East", "West", "Central",
  "Yishun", "Tampines", "Jurong", "Bedok", "Woodlands",
  "Ang Mo Kio", "Bukit Timah", "Punggol", "Sengkang", "Hougang",
];
const SORT_OPTIONS = ["Default order", "Newest first", "Name A-Z", "Name Z-A"];

export default function SearchFilters({ filters, onFilterChange }) {
  return (
    <div className="w-full px-4 py-4 bg-white border-b border-border sticky top-0 z-20 shadow-sm">
      {/* Search */}
      <div className="relative mb-3 max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Type here to find a particular HBB"
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-2 justify-center">
        <FilterSelect
          label="HBB Main Category"
          value={filters.main_category}
          options={MAIN_CATEGORIES}
          onChange={(v) => onFilterChange({ ...filters, main_category: v })}
        />
        <FilterSelect
          label="HBB Additional Cat..."
          value={filters.additional_category}
          options={ADDITIONAL_CATEGORIES}
          onChange={(v) => onFilterChange({ ...filters, additional_category: v })}
        />
        <FilterSelect
          label="HBB Mama"
          value={filters.is_mama}
          options={["Yes", "No"]}
          onChange={(v) => onFilterChange({ ...filters, is_mama: v })}
        />
        <FilterSelect
          label="F&B Halal Status"
          value={filters.halal_status}
          options={HALAL_STATUS}
          onChange={(v) => onFilterChange({ ...filters, halal_status: v })}
        />
        <FilterSelect
          label="Location"
          value={filters.location}
          options={LOCATIONS}
          onChange={(v) => onFilterChange({ ...filters, location: v })}
        />
        <FilterSelect
          label="Default order"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(v) => onFilterChange({ ...filters, sort: v })}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <Select value={value || ""} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
      <SelectTrigger className="h-8 text-xs min-w-[130px] max-w-[160px] bg-white border-border">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}