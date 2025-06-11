import { useState } from "react";
import PedidoDetalhesModal from "./OrderDetailModal";

const PedidoList = ({ pedidos }) => {
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    const handlePedidoClick = (pedido) => {
        setPedidoSelecionado(pedido);
    };

    const handleCloseModal = () => {
        setPedidoSelecionado(null);
    };

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.map((pedido) => (
                <div
                    key={pedido.id}
                    onClick={() => handlePedidoClick(pedido)}
                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
                >
                    <div className="font-bold text-lg text-red-500">
                        {pedido.cliente?.name || "Cliente não informado"}
                    </div>
                    <div className="text-sm text-gray-600">
                        Mesa: {pedido.tableId || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                        Pagamento: {pedido.paymentType || "Não informado"}
                    </div>
                    <div className="text-sm text-gray-600">
                        Status: {pedido.status}
                    </div>
                    <div className="text-sm text-gray-600">
                        Total: R$ {pedido.totalOrder?.toFixed(2) || "0.00"}
                    </div>
                </div>
            ))}
    
            {pedidoSelecionado && (
                <PedidoDetalhesModal
                    pedido={pedidoSelecionado}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default PedidoList;
