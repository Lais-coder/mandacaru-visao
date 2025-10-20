import { SearchBar } from "./SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import type { DateRange } from "react-day-picker";

interface PageHeaderProps {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  onApply: () => void;
}

export function PageHeader({ range, setRange, onApply }: PageHeaderProps) {
  return (
    <div className="absolute top-28 right-12 flex items-center gap-3">
      <label htmlFor="search" className="sr-only">Buscar</label>
      <SearchBar />
      <FilterDropdown range={range} setRange={setRange} onApply={onApply} />
    </div>
  );
}