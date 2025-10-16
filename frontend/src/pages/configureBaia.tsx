import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Trash, Trash2 } from "lucide-react";
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

    // ✅ NOVA VERSÃO: vídeo e canvas sincronizados (ResizeObserver)
    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const updateCanvasSize = () => {
            const rect = video.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            draw();
        };

        const observer = new ResizeObserver(() => updateCanvasSize());
        observer.observe(video);

        updateCanvasSize();
        setVideoReady(true);

        return () => {
            observer.disconnect();
        };
    };

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

        let foundId: string | null = null;
        for (const b of baias) {
            if (pointInPolygon({ x, y }, b.polygon)) {
                foundId = b.id;
                break;
            }
        }
        setSelectedBaiaId(foundId);
    };

    const draw = useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        baias.forEach((b, i) => {
            const color = colors[i % colors.length];
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

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#555";
        ctx.fillStyle = "#5555";
        drawPolygon(ctx, currentPolygon);
    }, [baias, currentPolygon, selectedBaiaId]);

    function pointInPolygon(point: Point, polygon: Point[]) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
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
        if (poly.length >= 3) {
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.stroke();
        }
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

    function handleDelete(index: number) {
        setBaias((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSave() {
        localStorage.setItem("baiasConfig", JSON.stringify(baias));
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

    useEffect(() => {
        if (!videoReady) return;
        draw();
    }, [draw, videoReady]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Header />

                <div className="p-8 flex justify-between ml-20">
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
                        <div className="relative inline-block w-full max-w-[600px]">
                            <video
                                ref={videoRef}
                                src={fileUrl}
                                controls
                                onLoadedMetadata={handleLoadedMetadata}
                                className="w-full h-auto rounded-lg shadow-md block"
                            />
                            <canvas
                                ref={canvasRef}
                                onClick={handleCanvasClick}
                                className={`absolute top-0 left-0 rounded-lg cursor-crosshair ${isDrawing ? "opacity-100" : "pointer-events-none opacity-0"
                                    }`}
                            />
                            <div className="flex justify-between items-center w-full mt-4">
                                <button
                                    onClick={() => setIsDrawing(true)}
                                    className={`px-6 py-2 rounded-md text-white transition  ${isDrawing
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#081C33] hover:bg-[#0b284a]"
                                        }`}
                                    disabled={isDrawing}
                                >
                                    Configurar Baia
                                </button>

                                <button
                                    onClick={handleAddBaia}
                                    className={`px-6 py-2 rounded-md text-white transition  ${currentPolygon.length >= 3
                                            ? "bg-[#081C33] hover:bg-[#0b284a]"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={currentPolygon.length < 3}
                                >
                                    Salvar Baia
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Painel lateral */}
                    <div className="bg-white w-[28%] rounded-xl p-5 shadow-md flex flex-col">
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
                                        <Trash2
                                            onClick={() => handleDelete(index)}
                                            className="text-[#F60101] text-sm"
                                        >
                                            Excluir
                                        </Trash2>
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
