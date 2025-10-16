import Logo from '../assets/Logo-MandacaruBranco.png';
export function Login() {
  return (
    <div className="flex h-screen w-full bg-[#081C33]">

      {/* Lado esquerdo - fundo sólido, logo centralizada */}
      <div className="w-1/2  flex items-center justify-center">
        <img src={Logo} alt="Logo" className="w-40" />
      </div>

      {/* Lado direito - gradiente horizontal */}
      <div className="w-1/2 bg-gradient-to-r from-[#C8E6EE]/ to-[#00BBC0]">
        <div className="bg-[#CCCCCC]/34 bg-opacity-10 backdrop-blur-[12px] rounded-[26px] shadow-lg m-[70px] p-[60px]">
          <h2 className="text-[#ffff] text-2xl font-bold mb-6 text-center">ENTRE NA SUA CONTA</h2>
          <form className="space-y-4 text-[#ffff]">
            <label htmlFor="">Email
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00BBC0]"
            />
            </label>
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00BBC0]"
            />

            <button
              type="submit"
              className="w-full py-2 rounded bg-[#002D4C] text-white font-semibold hover:bg-[#004C7F] transition"
            >
              entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}