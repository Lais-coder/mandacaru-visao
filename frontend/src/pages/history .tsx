import { useEffect, useRef, useState } from "react";
import { Sidebar } from '../components/sidebar';
import { SlidersHorizontal } from "lucide-react";
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export function History() {
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const filterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setShowFilter(false);
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useEffect(() => {
        if (range?.from) setStartDate(range.from.toISOString().slice(0, 10)); else setStartDate('');
        if (range?.to) setEndDate(range.to.toISOString().slice(0, 10)); else setEndDate('');
        if (range?.from && range?.to) setShowFilter(false);
    }, [range]);

    function applyFilter() {
        console.log('Apply filter', { startDate, endDate, range });
        setShowFilter(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex flex-col flex-1">
                    <div className="relative h-screen bg-gradient-to-b from-[#C8E6EE] to-[#00BBC0]">
                        <h1 className="w-60 absolute top-6 left-6 text-[#081C33] text-4xl font-bold">
                            Histórico dos arquivos
                        </h1>

                        <div className="absolute top-28 right-12 flex items-center gap-3">
                            <label htmlFor="search" className="sr-only">Buscar</label>

                            <div className="flex items-center bg-white/90 rounded-lg shadow px-3 py-2 w-64">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                                </svg>
                                <input
                                    id="search"
                                    type="search"
                                    placeholder="Busque pelo nome do arquivo"
                                    className="ml-3 w-full bg-transparent outline-none text-sm text-[#081C33]"
                                />
                            </div>

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
                                    <div className="absolute right-0 mt-4 bg-white rounded-lg shadow-lg pl-2 pr-2 pb-2 pt-2 z-50 w-[300px]"
                                    translate="no"
                                    >
                                        <DayPicker
                                            mode="range"
                                            selected={range}
                                            onSelect={setRange}
                                            locale={ptBR}
                                        />
                                        <button
                                            onClick={applyFilter}
                                            className="mt-4 w-full bg-[#081C33] text-white py-2 rounded hover:bg-[#0b284a] transition"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
