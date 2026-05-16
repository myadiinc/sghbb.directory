const HALAL_OPTIONS = [
  { value: "Muslim-Owned F&B", label: "Muslim-Owned F&B" },
  { value: "Halal-Certified F&B", label: "Halal-Certified F&B" },
  { value: "Non F&B", label: "Non F&B" },
];

export default function FilterTabHalal({ halalFilter, onHalalChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {HALAL_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onHalalChange(halalFilter === opt.value ? null : opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            halalFilter === opt.value
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