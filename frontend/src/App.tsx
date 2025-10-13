import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mensagem, setMensagem] = useState("Carregando...");

  // Exemplo de conexão com o backend Python
  useEffect(() => {
    fetch("http://localhost:5000/api/mensagem") // substitua pela rota do seu backend
      .then((res) => res.json())
      .then((data) => setMensagem(data.mensagem))
      .catch((err) => setMensagem("Erro ao conectar com o servidor."));
  }, []);

  return (
    <div className="container">
      <h1>Frontend React + Backend Python 🐍⚛️</h1>
      <p>{mensagem}</p>
    </div>
  );
}

export default App;
