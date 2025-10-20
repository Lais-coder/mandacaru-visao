import { useEffect, useRef, useState, useCallback } from "react";
import { Sidebar } from "../components/sidebar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SummaryRow = {
    occupied_seconds?: number;
    occupied_percent: number;
    occupied_frames: number;
};

type ReportData = {
    frames: number;
    fps: number;
    summary: Record<string, SummaryRow>;
    timeline: Array<{ occupied: Record<string, number> }>;
};

export function ReportPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasWrapRef = useRef<HTMLDivElement | null>(null);
    const [selectedWs, setSelectedWs] = useState<string | null>(null);
    const navigate = useNavigate();

    // infer video id from location path like /report/:id or query —
    // fallback: try to parse last segment
    const videoId = (() => {
        const parts = window.location.pathname.split("/").filter(Boolean);
        return parts.length ? parts[parts.length - 1] : "";
    })();

    useEffect(() => {
        if (!videoId) {
            setError("ID do vídeo não encontrado na URL");
            setLoading(false);
            return;
        }

        fetch(`/videos/${videoId}/report/data`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d: ReportData) => {
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || String(err));
                setLoading(false);
            });
    }, [videoId]);

    const resizeAndDraw = useCallback(() => {
        const canvas = canvasRef.current;
        const wrap = canvasWrapRef.current;
        if (!canvas || !wrap || !data) return;
        const rect = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const logicalWidth = Math.max(300, Math.floor(rect.width));
        const logicalHeight = 360; // make taller like image
        canvas.width = Math.floor(logicalWidth * dpr);
        canvas.height = Math.floor(logicalHeight * dpr);
        canvas.style.width = logicalWidth + 'px';
        canvas.style.height = logicalHeight + 'px';
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawTimelineResponsive(ctx, canvas.width / dpr, canvas.height / dpr, data.timeline, selectedWs);
    }, [data, selectedWs]);

    useEffect(() => {
        if (!data || !canvasRef.current) return;
        // set default selected
        if (!selectedWs) {
            const keys = Object.keys(data.summary);
            setSelectedWs(keys.length ? keys[0] : null);
        }
        // observe resize and redraw
        const ro = new ResizeObserver(() => resizeAndDraw());
        if (canvasWrapRef.current) ro.observe(canvasWrapRef.current);
        window.addEventListener('resize', resizeAndDraw);
        // initial draw
        resizeAndDraw();
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', resizeAndDraw);
        };
    }, [data, selectedWs, resizeAndDraw]);

    return (
  <div className="h-screen flex bg-gradient-to-b from-sky-50 to-emerald-50 overflow-hidden">
    <Sidebar />

    {/* Conteúdo principal */}
    <div className="flex-1 overflow-y-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition mb-4"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="w-full mx-auto">
        <div className="flex justify-between items-start mt-2 mb-6">
          <h1 className="text-4xl font-bold text-[#081C33] w-60">
            Relatório de Ocupação
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#F3F3F3] text-left text-sm text-[#667085]">
                <th className="p-2">Baia</th>
                <th className="p-2">Tempo ocupado (s)</th>
                <th className="p-2">% do vídeo</th>
                <th className="p-2">Frames ocupados</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                Object.entries(data.summary)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([ws, s]) => (
                    <tr
                      key={ws}
                      className="border-b last:border-b-0 bg-[#1DD7C9] text-[#F6F6FF]"
                    >
                      <td className="p-2 text-sm text-slate-700">{ws}</td>
                      <td className="p-2 text-sm">
                        {(s.occupied_seconds ?? 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-sm">
                        {s.occupied_percent.toFixed(1)}%
                      </td>
                      <td className="p-2 text-sm">{s.occupied_frames}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          {videoId && (
            <a
              className="text-[#808080] text-sm hover:underline mb-2 block"
              href={`/videos/${videoId}/annotated_bays.mp4?force=1`}
            >
              Baixar vídeo com anotação
            </a>
          )}

          <div className="bg-white p-3 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-800">
                Frequência de comportamento
              </h2>
              <select
                className="border rounded px-3 py-2 text-sm"
                value={selectedWs ?? ""}
                onChange={(e) => {
                  setSelectedWs(e.target.value || null);
                  resizeAndDraw();
                }}
              >
                {data &&
                  Object.keys(data.summary).map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
              </select>
            </div>

            <div ref={canvasWrapRef} className="w-full">
              <canvas
                ref={canvasRef}
                id="timeline"
                className="w-full block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

function drawTimelineResponsive(ctx: CanvasRenderingContext2D, width: number, height: number, timeline: Array<{ occupied: Record<string, number> }>, selectedWs: string | null) {
    ctx.clearRect(0, 0, width, height);
    if (!timeline || !timeline.length) return;
    const wsIds = Object.keys(timeline[0].occupied);
    const rowH = Math.floor(height / Math.max(1, wsIds.length));
    const step = Math.max(1, Math.floor(timeline.length / 200));
    ctx.textBaseline = 'top';
    ctx.font = '12px sans-serif';
    wsIds.forEach((ws, row) => {
        const y = row * rowH;
        // highlight selected row
        if (selectedWs && ws === selectedWs) {
            ctx.fillStyle = 'rgba(42,157,143,0.08)';
            ctx.fillRect(0, y, width, rowH);
        }
        ctx.fillStyle = '#374151';
        ctx.fillText(ws, 8, y + 6);
        for (let i = 0, col = 0; i < timeline.length; i += step, col++) {
            const occ = timeline[i].occupied[ws];
            ctx.fillStyle = occ ? '#1fbfa3' : '#f1f5f9';
            ctx.fillRect(140 + col * 4, y + 8, 6, rowH - 16);
        }
    });
}

export default ReportPage;