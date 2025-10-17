import type { Baia } from "../types/baia";
import Error from "../assets/error.png";
import { Trash2, Edit3, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  baias: Baia[];
  onDelete: (index: number) => void;
  onSelect: (id: string) => void;
  onRename: (index: number, newId: string) => boolean;
};

export function BaiaList({ baias, onDelete, onSelect, onRename }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(baias[index].id);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const submitEdit = (index: number) => {
    const v = editingValue.trim();
    if (v === "") return;
    const ok = onRename(index, v);
    if (ok === false) {
      setEditError("Nome já existe");
      return;
    }
    setEditError(null);
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-[#081C33] mb-3">Baias salvas:</h3>
      {baias.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-20">
            <img src={Error} alt="Nenhuma baia adicionada" />
          <p>Nenhuma baia adicionada</p>
        </div>
      ) : (
        <ul className="w-full">
           {baias.map((baia, index) => (
             <li
               key={baia.id}
               className={`flex justify-between items-center ${editingIndex === index ? "py-2 text-sm" : "border-b py-2 text-sm"}`}
             >
              {editingIndex === index ? (
                <div className="flex items-center gap-2 w-full">
                   <input
                     className="border rounded px-3 py-2 flex-1 text-sm"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitEdit(index);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                   <div className="flex items-center gap-3 mr-2">
                    <CheckCircle
                      onClick={() => submitEdit(index)}
                      className="text-[#081C33] cursor-pointer"
                      size={18}
                      aria-label="Salvar"
                    />
                    <XCircle
                      onClick={cancelEdit}
                      className="text-gray-500 cursor-pointer"
                      size={18}
                      aria-label="Cancelar"
                    />
                  </div>
                  {editError && editingIndex === index && (
                    <div className="text-sm text-red-500 mt-1">{editError}</div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => onSelect(baia.id)} className="flex-1 text-left">{baia.id}</button>
                  <div className="flex items-center gap-3">
                    <Edit3 onClick={() => startEdit(index)} className="text-[#0b284a] cursor-pointer" size={16} />
                    <Trash2 onClick={() => onDelete(index)} className="text-[#F60101] text-sm cursor-pointer" />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BaiaList;
