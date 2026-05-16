import { MAIN_CATEGORIES, getCategoryTabLabel } from "@/lib/constants";

export default function FilterTabCategory({
  categoryFilter,
  onCategoryChange,
  categoryCounts,
}) {
  return (
    <div className="flex overflow-x-auto gap-3 p-1 no-scrollbar">
      {MAIN_CATEGORIES.map((cat) => {
        const count = categoryCounts?.[cat] ?? 0;
        const active = categoryFilter === cat;

        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(active ? null : cat)}
            className={`flex flex-col items-start px-4 py-3 rounded-xl min-w-[140px] shadow-sm border transition-all
              ${
                active
                  ? "bg-[#5e2c2c] text-white border-[#5e2c2c]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#5e2c2c]"
              }
            `}
          >
            <span className="text-sm font-semibold">
              {getCategoryTabLabel(cat)}
            </span>

            <span
              className={`text-xs mt-1 ${
                active ? "text-white/80" : "text-gray-500"
              }`}
            >
              {count} HBBs
            </span>
          </button>
        );
      })}
    </div>
  );
}
