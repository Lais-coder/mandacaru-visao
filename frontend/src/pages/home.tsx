import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

export function Home() {
  return (
    <div className="flex min-h-screen bg-[#FAF9F4]">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Área principal (Header + Conteúdo) */}
      <div className="flex flex-col flex-1">
        <Header />
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#081C33]">
            Bem-vindo à Página Inicial
          </h1>
          <p className="mt-2 text-[#081C33]">
            Aqui você pode ver um resumo das suas atividades recentes.
          </p>
        </div>
      </div>
    </div>
  );
}
