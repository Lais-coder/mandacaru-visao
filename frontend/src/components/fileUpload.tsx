import { Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FileUploadProps = {
    files: File[];
    progressMap: Record<string, number>;
    onFileChange: (file: File) => void;
    onRemove: (fileName: string) => void;
};

export function FileUpload({
    files,
    progressMap,
    onFileChange,
    onRemove,
}: FileUploadProps) {
    const navigate = useNavigate();

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            onFileChange(selected);
            e.target.value = ""; // permite reenviar o mesmo arquivo se quiser
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Área de upload (sempre visível) */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-[#00AEB4] transition">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-[#081C33] font-medium">
                    Selecione o arquivo de vídeo
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Formatos MP4, AVI, MOV e MKV, até 50 MB
                </p>

                <label
                    htmlFor="file-upload"
                    className="mt-5 cursor-pointer border border-gray-300 text-[#081C33] py-1 px-5 rounded-md transition hover:bg-gray-50"
                >
                    Selecionar
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={handleSelectFile}
                    className="hidden"
                />
            </div>

            {/* Lista de arquivos enviados */}
            {files.length > 0 && (
                <div>
                    <h3 className="text-[#081C33] mb-2 font-semibold">Arquivo enviado</h3>

                    {files.map((file) => {
                        const progress = progressMap[file.name] ?? 0;
                        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

                        return (
                            <div
                                key={file.name}
                                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-2"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-[#081C33]">
                                        {file.name}
                                    </span>

                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${progress < 100 ? "bg-[#00AEB4]" : "bg-green-500"
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {sizeMB}MB • {progress}%{" "}
                                        {progress < 100 ? (
                                            <span className="text-[#00AEB4]">Carregando...</span>
                                        ) : (
                                            <span className="text-green-600 font-medium">
                                                ✔ Carregado com sucesso
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {progress === 100 && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() =>
                                                    navigate("/configure-baia", {
                                                        state: {
                                                            fileUrl: URL.createObjectURL(file),
                                                            fileInfo: {
                                                                name: file.name,
                                                                size: (file.size / (1024 * 1024)).toFixed(1),
                                                                duration: "54.07 s" // depois vamos calcular automaticamente
                                                            },
                                                        },
                                                    })
                                                }
                                                className="bg-[#081C33] text-white px-6 py-2 rounded-md hover:bg-[#0b284a] transition"
                                            >
                                                Configurar Baia
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => onRemove(file.name)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
