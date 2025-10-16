import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { FileUpload } from "../components/fileUpload";

export function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // Simula upload individual
  useEffect(() => {
    files.forEach((file) => {
      const progress = progressMap[file.name] ?? 0;
      if (progress < 100) {
        const interval = setInterval(() => {
          setProgressMap((prev) => {
            const newProgress = (prev[file.name] ?? 0) + 5;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...prev, [file.name]: 100 };
            }
            return { ...prev, [file.name]: newProgress };
          });
        }, 300);
        return () => clearInterval(interval);
      }
    });
  }, [files]);

  const handleFileChange = (file: File) => {
    setFiles((prev) =>
      prev.some((f) => f.name === file.name) ? prev : [...prev, file]
    );
    setProgressMap((prev) => ({ ...prev, [file.name]: 0 }));
  };

  const handleRemove = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setProgressMap((prev) => {
      const { [fileName]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3] flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex flex-1 items-center justify-center m-10">
          <div className="bg-white rounded-lg p-8 w-[60%] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-[#081C33] mb-1">Upload</h2>
            <p className="text-[#7D7D7D] mb-6">Escolha um arquivo de vídeo e carregue-o</p>

            <FileUpload
              files={files}
              progressMap={progressMap}
              onFileChange={handleFileChange}
              onRemove={handleRemove}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
