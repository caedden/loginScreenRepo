import React, { useState, useEffect } from "react";

function EditPedidoModal({ pedido, onClose, onUpdate }) {
  const [status, setStatus] = useState(pedido.status);
  const [paymentType, setPaymentType] = useState(pedido.paymentType);

  useEffect(() => {
    setStatus(pedido.status);
    setPaymentType(pedido.paymentType);
  }, [pedido]);

  const handleSubmit = () => {
    const pedidoAtualizado = {
      ...pedido,
      status,
      paymentType
    };
    onUpdate(pedidoAtualizado);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Pedido</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="pendente">Pendente</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Forma de Pagamento</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="pix">Pix</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default EditPedidoModal;
