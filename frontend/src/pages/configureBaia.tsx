import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";   
import { ArrowLeft } from "lucide-react";
import Error from "../assets/error.png";

type Point = { x: number; y: number };
type Baia = { id: string; polygon: Point[] };

export function ConfigureBaia() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileUrl, fileInfo } = location.state || {};

  const [baias, setBaias] = useState<Baia[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

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
    if (!isDrawing || !videoReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Converta coordenadas do evento (CSS pixels) para pixels do canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    setCurrentPolygon((prev) => [...prev, { x, y }]);
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
      ctx.strokeStyle = color;
      ctx.fillStyle = color + "33";
      drawPolygon(ctx, b.polygon);

      // desenha rótulo no centro
      const cx =
        b.polygon.reduce((sum, p) => sum + p.x, 0) / b.polygon.length;
      const cy =
        b.polygon.reduce((sum, p) => sum + p.y, 0) / b.polygon.length;

      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(b.id, cx, cy);
    });

    // baia atual
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#5555";
    drawPolygon(ctx, currentPolygon);
  }, [baias, currentPolygon]);

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

  // redesenha sempre que as baias, polígono atual ou estado do vídeo mudarem
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
                <p className="text-lg">{fileInfo?.size ?? "—"} MB</p>
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
                    key={baia.id}
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
