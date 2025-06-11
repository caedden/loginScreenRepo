import { X } from "lucide-react";

interface Item {
    nome: string;
    quantidade: number;
    preco: number;
}

interface Cliente {
    name: string;
}

interface Pedido {
    id: string;
    cliente?: Cliente;
    mesa?: string;
    metodoPagamento?: string;
    status: string;
    total?: number;
    itens?: Item[];
}

interface PedidoDetalhesModalProps {
    pedido: Pedido;
    onClose: () => void;
}

const PedidoDetalhesModal: React.FC<PedidoDetalhesModalProps> = ({ pedido, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-red-500 mb-4">Detalhes do Pedido</h2>

                {/* Cabeçalho */}
                <div className="mb-4 space-y-1">
                    <div><strong>Cliente:</strong> {pedido.cliente?.name || "N/A"}</div>
                    <div><strong>Mesa:</strong> {pedido.mesa || "N/A"}</div>
                    <div><strong>Método de Pagamento:</strong> {pedido.metodoPagamento || "N/A"}</div>
                    <div><strong>Status:</strong> {pedido.status}</div>
                    <div><strong>Total:</strong> R$ {pedido.total?.toFixed(2) || "0.00"}</div>
                </div>

                {/* Itens */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                    {pedido.itens && pedido.itens.length > 0 ? (
                        <ul className="space-y-2">
                            {pedido.itens.map((item, index) => (
                                <li key={index} className="border p-2 rounded-md">
                                    <div><strong>Produto:</strong> {item.nome}</div>
                                    <div><strong>Quantidade:</strong> {item.quantidade}</div>
                                    <div><strong>Preço:</strong> R$ {item.preco?.toFixed(2)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum item encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalhesModal;
