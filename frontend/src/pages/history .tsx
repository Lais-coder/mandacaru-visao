import { Sidebar } from '../components/sidebar';

export function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF9FB] via-[#E6F4FB] to-[#1dd7c7c3]">
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1">
          {/* Área central */}
          <div className="flex flex-1 items-center justify-center m-10"></div>
        </div>
      </div>
    </div>
         );
}