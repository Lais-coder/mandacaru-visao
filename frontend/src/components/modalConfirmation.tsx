type ModalConfirmacaoProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ModalConfirmacao({ show, onClose, onConfirm }: ModalConfirmacaoProps) {
  if (!show) return null;

  return (
    <div
      // overlay: captura clique fora do conteúdo
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        // Se o clique foi no próprio overlay (fora do conteúdo), fecha o modal.
        // stopPropagation evita que o clique "vaze" para elementos abaixo no DOM.
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        // conteúdo do modal: impedimos que cliques aqui subam até o overlay
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-xl w-[35%] text-center"
      >
        <h2 className="text-[20px] font-bold text-[#081C33] mb-4">
          Deseja verificar o relatório?
        </h2>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-[#979797] text-white p-2 rounded-md hover:bg-gray-400 transition"
          >
            Voltar para tela inicial
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-[#081C33] text-white p-2 rounded-md hover:bg-[#0b284a] transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
