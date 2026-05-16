import { LOCATION_REGIONS, LOCATIONS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterTabLocation({ locationFilter, onLocationChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4 items-center">
      {LOCATION_REGIONS.map((region) => (
        <button
          key={region}
          onClick={() => onLocationChange(locationFilter === region ? null : region)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            locationFilter === region
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
          }`}
        >
          {region}
        </button>
      ))}
      <Select
        value={LOCATIONS.includes(locationFilter) ? locationFilter : ""}
        onValueChange={(val) => onLocationChange(val || null)}
      >
        <SelectTrigger className="h-8 text-xs min-w-[180px] max-w-[240px] bg-white border-border">
          <SelectValue placeholder="Specific location..." />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}