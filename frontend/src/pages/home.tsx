import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { Upload } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1">
          <Header />
          {/* Área central */}
          <div className="flex flex-1 items-center justify-center m-10">
            {/* Card de upload */} 
            <div className="bg-[#FFFFFF] rounded-[10px] p-[15px] w-[60%]">
              <h2 className="text-2xl font-bold text-[#081C33]">Upload</h2>
              <p className="text-[#7D7D7D] mb-3">
                Escolha um arquivo de vídeo e carregue-o
              </p>

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
                  className="mt-5 cursor-pointer border border-gray-300 text-[#081C33] py-1 px-4 rounded-md transition hover:bg-gray-50"
                >
                  Selecionar
                </label>
                <input id="file-upload" type="file" className="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
