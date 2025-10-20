import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ModalConfirmacao } from "../components/modalConfirmation";
import BaiaCanvas from "../components/BaiaCanvas";
import BaiaList from "../components/BaiaList";
import type { Baia, Point } from "../types/baia";

export function ConfigureBaia() {
    const navigate = useNavigate();
    const location = useLocation();
    const { fileUrl, fileInfo } = location.state || {};

    const [baias, setBaias] = useState<Baia[]>([]);
    const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedBaiaId, setSelectedBaiaId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        if (!fileUrl) navigate("/");
    }, [fileUrl, navigate]);

    // BaiaCanvas gerencia vídeo/canvas e os helpers

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

    // salva baias no state e localStorage
    function saveBaias(next: Baia[] | ((prev: Baia[]) => Baia[])) {
        if (typeof next === "function") {
            setBaias((prev) => {
                const updated = (next as ((p: Baia[]) => Baia[]))(prev);
                localStorage.setItem("baiasConfig", JSON.stringify(updated));
                return updated;
            });
        } else {
            setBaias(next);
            localStorage.setItem("baiasConfig", JSON.stringify(next));
        }
    }

    function handleRename(index: number, newId: string) {
        saveBaias((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], id: newId };
            return copy;
        });
        // se a renomeada era a selecionada, atualiza seleção
            // Prevent duplicate ids
            const exists = baias.some((b, i) => i !== index && b.id === newId);
            if (exists) return false; // no change
            const next = baias.map((b, i) => (i === index ? { ...b, id: newId } : b));
            saveBaias(next);
            // Update selection only if name is unique
            const duplicate = baias.some((b, i) => i !== index && b.id === newId);
            if (!duplicate) {
                setSelectedBaiaId(newId);
                return true;
            }
            return false;
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

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Header />

                <div className="p-8 flex justify-between ml-20">
                    <div className="flex flex-col gap-4 ">
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
                        <BaiaCanvas
                            fileUrl={fileUrl}
                            baias={baias}
                            currentPolygon={currentPolygon}
                            setCurrentPolygon={setCurrentPolygon}
                            isDrawing={isDrawing}
                            setIsDrawing={setIsDrawing}
                            selectedBaiaId={selectedBaiaId}
                            setSelectedBaiaId={setSelectedBaiaId}
                            onLoaded={() => {}}
                        />
                        <div className="flex justify-between items-center w-full">
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

                            <button onClick={handleAddBaia} className={`px-6 py-2 rounded-md text-white transition ${currentPolygon.length >= 3 ? "bg-[#081C33] hover:bg-[#0b284a]" : "bg-gray-400 cursor-not-allowed"}`} disabled={currentPolygon.length < 3} > Salvar Baia </button>
                        </div>
                    </div>
                    {/* Painel lateral + botão abaixo */}
                    <div className="w-[28%] flex flex-col items-stretch">
                        <BaiaList baias={baias} onDelete={handleDelete} onSelect={(id) => setSelectedBaiaId(id)} onRename={handleRename} />
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#081C33] text-white font-light py-1 px-4 rounded-md hover:bg-[#0b284a] transition shadow-md"
                            >
                                Finalizar Processo
                            </button>
                        </div>
                        <ModalConfirmacao
                            show={showModal}
                            onClose={() => {
                                setShowModal(false);
                            }}
                            onConfirm={() => {
                                setShowModal(false);
                                navigate("/report"); 
                            }}
                        />
                    </div>


                </div>

            </div>
        </div>
    );
}
