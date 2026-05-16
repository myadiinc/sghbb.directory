import { MAIN_CATEGORIES, getCategoryTabLabel } from "@/lib/constants";

export default function FilterTabCategory({ categoryFilter, onCategoryChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {MAIN_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(categoryFilter === cat ? null : cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            categoryFilter === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
          }`}
        >
          {getCategoryTabLabel(cat)}
        </button>
      ))}
    </div>
  );
}