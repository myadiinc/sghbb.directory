import { useState } from "react";
import { LOCATION_REGIONS } from "@/lib/constants";

export default function FilterTabLocation({ locationFilter, onLocationChange }) {
  const [activeTab, setActiveTab] = useState(locationFilter || "🌍 All");

  return (
    <div className="flex overflow-x-auto border-b border-border justify-center gap-2 mb-4">
      {LOCATION_REGIONS.map((region) => (
        <button
          key={region}
          onClick={() => {
            setActiveTab(region);
            onLocationChange(region === "🇸🇬 All" ? null : region);
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap
            ${activeTab === region
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-primary"
            }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
