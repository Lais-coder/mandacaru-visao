import Logo from "../assets/Logo-MandacaruBranco.png";
import { House, Clock } from "lucide-react";

export function Sidebar() {
  const sidebarItems = [
    { name: "Inicio", href: "/inicio", icon: <House size={20} />, label: "Início" },
    { name: "Historico", href: "/historico", icon: <Clock size={20} />, label: "Histórico" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#081C33] z-40">
      {/* Logo */}
      <div className="flex justify-center items-center p-4">
        <img
          src={Logo}
          alt="Logo"
          className="w-28 md:w-32 h-auto"
        />
      </div>

      {/* Menu */}
      <ul className="mt-4 space-y-2">
        {sidebarItems.map(({ name, href, icon, label }) => (
          <li key={name}>
            <a
              href={href}
              className="flex items-center p-2 pl-6 text-white/90"
            >
              {icon}
              <span className="ml-2">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
