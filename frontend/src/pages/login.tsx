import React, { useState } from 'react';
import Logo from '../assets/Logo-MandacaruBranco.png';
export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setError('Todos os campos são obrigatórios!');
      return;
    }
    // Exemplo de validação de credenciais (substitua pela sua lógica/API)
    if (email !== 'fulanodetail@gmail.com' || senha !== '123456') {
      setError('Credenciais inválidas!');
      return;
    }
    setError('');
    alert(`Email: ${email}\nSenha: ${senha}`);
  }
  return (
    <div className="flex h-screen w-full bg-[#081C33]">

      {/* Lado esquerdo - fundo sólido, logo centralizada */}
      <div className="w-1/2  flex items-center justify-center">
        <img src={Logo} alt="Logo" className="w-80" />
      </div>

      {/* Lado direito - gradiente horizontal */}
      <div className="w-1/2 bg-gradient-to-r from-[#C8E6EE]/ to-[#00BBC0]">
        <div className="w-[70%] bg-[#CCCCCC]/34 bg-opacity-10 backdrop-blur-[12px] rounded-[26px] shadow-lg m-[90px] p-[90px]">
          <h2 className="text-[#ffff] text-2xl font-bold mb-6 text-center">ENTRE NA SUA CONTA</h2>
          <form className="space-y-4 text-[#ffff]" onSubmit={handleSubmit}>
             <label htmlFor="email" className="block mt-8">Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-[100%] px-2 py-2 rounded-xl bg-transparent border border-[#C8E6EE] bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00BBC0] mb-[30px] pt-[4px] pb-[4px]"
              />
            </label>
             <label htmlFor="senha" className="block mt-6">Senha
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-[100%] px-2 py-2 rounded-xl bg-transparent border border-[#C8E6EE] bg-opacity-10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00BBC0] mb-[10px] pt-[4px] pb-[4px]"
              />
            </label>
            <div className={`text-[#F60101] text-sm mb-6 min-h-[20px] ${error ? '' : 'opacity-0'}`}>
              {error || 'placeholder'}
            </div>
            <button
              type="submit"
              className="w-[100%] py-2 rounded bg-[#081C33] border-transparent text-[#ffff] font-semibold hover:bg-[#081C33]/30 transition mt-[20px] pt-[4px] pb-[4px]"
            >
              entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}