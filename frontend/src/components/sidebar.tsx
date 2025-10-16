import Logo from "../assets/Logo-MandacaruBranco.png";
import { House, Clock } from "lucide-react";

export function Sidebar() {
  const sidebarItems = [
    { name: "Inicio", href: "/home", icon: <House size={20} />, label: "Início" },
    { name: "Histórico", href: "/history", icon: <Clock size={20} />, label: "Histórico" },
  ];

  return (
    <div className=" top-0 left-0 h-screen w-64 bg-[#081C33]">
      <div className="flex justify-center items-center p-4">
        <img
          src={Logo}
          alt="Logo"
        />
      </div>
      <ul className="mt-4 list-none">
        {sidebarItems.map(({ name, href, icon, label }) => (
          <li key={name} className="mb-4 px-6 bg-[#081C33] hover:bg-[#0b284a] py-3"
          >
            <a href={href}
              className="flex items-center text-[#FAF9F4] no-underline bg-transparent hover:text-white rounded-lg p-3 transition opacity-30"
            >{icon}
              <span className="ml-8">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
