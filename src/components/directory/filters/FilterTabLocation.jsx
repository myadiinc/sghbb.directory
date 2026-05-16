import { useState } from "react";
import { LOCATION_REGIONS } from "@/lib/constants";

export default function FilterTabLocation({ locationFilter, onLocationChange }) {
  const [activeTab, setActiveTab] = useState(locationFilter || "🇸🇬 All");

  return (
    <div className="flex overflow-x-auto justify-center mb-4">
      <div className="flex gap-2 p-1 border border-[#5e2c2c]/40 rounded-xl bg-white shadow-sm">
        {LOCATION_REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => {
              setActiveTab(region);
              onLocationChange(region === "🇸🇬 All" ? null : region);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${
                activeTab === region
                  ? "bg-[#5e2c2c] text-white shadow"
                  : "text-muted-foreground hover:text-[#5e2c2c]"
              }
            `}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}
