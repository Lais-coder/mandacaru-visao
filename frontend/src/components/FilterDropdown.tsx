import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import 'react-day-picker/dist/style.css';

interface FilterDropdownProps {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  onApply: () => void;
}

export function FilterDropdown({ range, setRange, onApply }: FilterDropdownProps) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <button
        type="button"
        aria-label="Filtro"
        onClick={() => setShowFilter(prev => !prev)}
        className="flex items-center gap-2 bg-[#081C33] text-white rounded-lg px-4 py-2 shadow hover:bg-[#0b284a] transition"
        translate="no"
      >
        <span className="text-sm">Filtro - Data</span>
        <SlidersHorizontal size={16} className="ml-2" />
      </button>

      {showFilter && (
        <div className="absolute right-0 mt-4 bg-white rounded-lg shadow-lg p-3 z-50 w-[300px]" translate="no">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={ptBR}
          />
          <button
            onClick={() => {
              onApply();
              setShowFilter(false);
            }}
            className="mt-4 w-full bg-[#081C33] text-white py-2 rounded hover:bg-[#0b284a] transition"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}