interface File {
  nome: string;
  data: string;
  tamanho: string;
  duracao: string;
  tipo: string;
}

interface FileTableProps {
  files: File[];
}

export function FileTable({ files }: FileTableProps) {
  return (
    <div className="mt-64 px-16">
      <div className="mb-2 text-[#081C33]">
        Contagem total: {files.length}
      </div>

      <table className="w-full text-sm text-left text-[#667085] font-semibold bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-[#EAF9FB] text-[#667085]">
          <tr>
            <th className="px-4 py-3">Nome do arquivo</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Tamanho</th>
            <th className="px-4 py-3">Duração</th>
            <th className="px-4 py-3">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-3">{file.nome}</td>
              <td className="px-4 py-3">{file.data}</td>
              <td className="px-4 py-3">{file.tamanho}</td>
              <td className="px-4 py-3">{file.duracao}</td>
              <td className="px-4 py-3">
                <span className="bg-[#00BBC0] text-white px-3 py-1 rounded-full text-xs font-medium">
                  {file.tipo}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}