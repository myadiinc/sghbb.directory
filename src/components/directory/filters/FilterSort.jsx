import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/constants";

export default function FilterSort({ sort, onSortChange }) {
  return (
    <Select value={sort || ""} onValueChange={onSortChange}>
      <SelectTrigger className="h-8 text-xs min-w-[130px] max-w-[160px] bg-white border-border">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}