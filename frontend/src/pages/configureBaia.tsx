import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Error from "../assets/error.png";

type Point = { x: number; y: number };
type Baia = { id: string; polygon: Point[] };

const colors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#C77DFF",
  "#3FC1C9",
  "#FF9F1C",
];

export function ConfigureBaia() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileUrl, fileInfo } = location.state || {};

  const [baias, setBaias] = useState<Baia[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [selectedBaiaId, setSelectedBaiaId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!fileUrl) navigate("/");
  }, [fileUrl, navigate]);

  // Ajusta o canvas quando o vídeo é carregado
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Use a resolução natural do vídeo para o buffer do canvas
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;

      // Mantenha o tamanho visual igual ao vídeo exibido (CSS pixels)
      canvas.style.width = `${video.clientWidth}px`;
      canvas.style.height = `${video.clientHeight}px`;

      ctxRef.current = canvas.getContext("2d");
      setVideoReady(true);
      draw();
    }
  };

  // Clique sobre o vídeo (canvas sobreposto)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoReady) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    if (isDrawing) {
      setCurrentPolygon((prev) => [...prev, { x, y }]);
      return;
    }

    // se não estiver desenhando, checar se clicou dentro de alguma baia
    let foundId: string | null = null;
    for (const b of baias) {
      if (pointInPolygon({ x, y }, b.polygon)) {
        foundId = b.id;
        break;
      }
    }
    setSelectedBaiaId(foundId);
  };

  // redesenha quando muda algo
  useEffect(() => {
    console.log("🔍 fileUrl recebido:", fileUrl);
    console.log("📁 fileInfo recebido:", fileInfo);
  }, [fileUrl, fileInfo]);


  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // desenha baias salvas
    baias.forEach((b, i) => {
      const color = colors[i % colors.length];
      // destaque se selecionada
      if (b.id === selectedBaiaId) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color + "55";
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.fillStyle = color + "33";
      }

      drawPolygon(ctx, b.polygon);

      // desenha rótulo no centro com fundo para legibilidade
      const cx = b.polygon.reduce((sum, p) => sum + p.x, 0) / b.polygon.length;
      const cy = b.polygon.reduce((sum, p) => sum + p.y, 0) / b.polygon.length;

      const label = b.id;
      ctx.font = "16px Arial";
      const textWidth = ctx.measureText(label).width;
      const padding = 6;
      const rectX = cx - textWidth / 2 - padding / 2;
      const rectY = cy - 12 - padding / 2;

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(rectX, rectY, textWidth + padding, 20);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(label, cx, cy);
    });

    // baia atual em desenho
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#5555";
    drawPolygon(ctx, currentPolygon);
  }, [baias, currentPolygon, selectedBaiaId]);

  // algoritmo básico ray-casting para detectar ponto dentro de polígono
  function pointInPolygon(point: Point, polygon: Point[]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function drawPolygon(ctx: CanvasRenderingContext2D, poly: Point[]) {
    if (poly.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
    // Só fecha/preenche se houver ao menos 3 pontos
    if (poly.length >= 3) {
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    } else {
      ctx.stroke();
    }

    // desenha pontinhos
    poly.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  function handleAddBaia() {
    if (currentPolygon.length < 3) {
      alert("A baia precisa de pelo menos 3 pontos!");
      return;
    }

    const id = `Baia-${baias.length + 1}`;
    setBaias((prev) => [...prev, { id, polygon: currentPolygon }]);
    setCurrentPolygon([]);
    setIsDrawing(false);
  }

  function handleUndo() {
    setCurrentPolygon((prev) => prev.slice(0, -1));
  }

  function handleDelete(index: number) {
    setBaias((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    localStorage.setItem("baiasConfig", JSON.stringify(baias));
    alert("Baias salvas com sucesso!");
  }

  function handleLoad() {
    const saved = localStorage.getItem("baiasConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Baia[];
        setBaias(parsed);
      } catch (err) {
        console.error("Falha ao parsear baiasConfig do localStorage", err);
      }
    }
  }

  useEffect(() => {
    handleLoad();
  }, []);

  // redesenha quando as baias, polígono atual, seleção ou estado do vídeo mudarem
  useEffect(() => {
    if (!videoReady) return;
    draw();
  }, [draw, videoReady]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="p-8 flex justify-between">
          {/* Área principal */}
          <div className="flex flex-col gap-4 w-[70%]">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl text-[#081C33]">
                Informações do Arquivo:
              </h2>
            </div>

            <div className="flex gap-4">
              <div className="bg-white shadow-sm border rounded-lg p-3 w-40 text-center">
                <p className="text-lg">{fileInfo?.date || "—"}</p>
                <p className="text-sm text-gray-500">Data</p>
              </div>

              <div className="bg-white shadow-sm border rounded-lg p-3 w-40 text-center">
                <p className="text-lg">{fileInfo?.size} MB</p>
                <p className="text-sm text-gray-500">Tamanho</p>
              </div>

              <div className="bg-white shadow-sm border rounded-lg p-3 w-40 text-center">
                <p className="text-lg">{fileInfo?.duration || "—"}</p>
                <p className="text-sm text-gray-500">Duração</p>
              </div>
            </div>

            {/* 🎥 vídeo + camada de marcação */}
            <div className="relative flex justify-center mt-6">
              <video
                ref={videoRef}
                src={fileUrl}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                className="w-[550px] rounded-lg shadow-md"
              />
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`absolute top-0 left-0 rounded-lg cursor-crosshair ${
                  isDrawing ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              {!isDrawing ? (
                <button
                  onClick={() => setIsDrawing(true)}
                  className="bg-[#081C33] text-white px-6 py-2 rounded-md hover:bg-[#0b284a] transition"
                >
                  Configurar Baia
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddBaia}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Salvar Baia
                  </button>
                  <button
                    onClick={handleUndo}
                    className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
                  >
                    Desfazer
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPolygon([]);
                      setIsDrawing(false);
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancelar
                  </button>
                </>
              )}
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Salvar Configuração
              </button>
            </div>
          </div>

          {/* Painel lateral */}
          <div className="bg-white w-[28%] rounded-xl p-5 shadow-md flex flex-col ">
            <h3 className="text-lg font-semibold text-[#081C33] mb-3">
              Baias salvas:
            </h3>

            {baias.length === 0 ? (
              <div className="flex flex-col items-center text-gray-500 mt-20">
                <img src={Error} alt="Error" className="w-16 mb-2" />
                <p>Nenhuma baia adicionada</p>
              </div>
            ) : (
              <ul className="w-full">
                {baias.map((baia, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b py-2 text-sm"
                  >
                    <span>{baia.id}</span>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
