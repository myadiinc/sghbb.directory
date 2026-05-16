import { MAMA_FILTER_OPTIONS } from "@/lib/constants";

export default function FilterTabMama({ mamaFilter, onMamaChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {MAMA_FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onMamaChange(mamaFilter === opt.value ? null : opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            mamaFilter === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}