import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { PageHeader } from "../components/PageHeader";
import { FileTable } from "../components/FileTable";
import type { DateRange } from "react-day-picker";

export function History() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (range?.from) setStartDate(range.from.toISOString().slice(0, 10)); else setStartDate("");
    if (range?.to) setEndDate(range.to.toISOString().slice(0, 10)); else setEndDate("");
  }, [range]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch("http://localhost:3000/api/files");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
      }
    }
    fetchFiles();
  }, []);

  function applyFilter() {
    console.log("Filtro aplicado", { startDate, endDate, range });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-col flex-1 relative bg-gradient-to-b from-[#C8E6EE] to-[#00BBC0]">
          <h1 className="w-60 absolute top-6 left-6 text-[#081C33] text-4xl font-bold">
            Histórico dos arquivos
          </h1>

          <PageHeader range={range} setRange={setRange} onApply={applyFilter} />
          <FileTable files={files} />
        </div>
      </div>
    </div>
  );
}