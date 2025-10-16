import { Sidebar } from '../components/sidebar';

export function History() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
            <div className="flex min-h-screen">
                <Sidebar />

                {/* Conteúdo principal */}
                <div className="flex flex-col flex-1">
                    {/* Área central */}
                    <div className="relative h-screen bg-gradient-to-b from-[#C8E6EE] to-[#00BBC0]">
                        <h1 className="w-60 absolute top-6 left-6 text-[#081C33] text-4xl font-bold">
                            Histórico dos arquivos
                        </h1>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-[#C8E6EE] to-[#A0D9E6] rounded-full px-4 py-2 flex items-center shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Busque pelo nome do arquivo"
                                className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}