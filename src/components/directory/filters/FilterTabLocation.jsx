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
      </div>
  );
}