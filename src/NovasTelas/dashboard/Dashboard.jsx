import React, { useState, useEffect } from "react";
import { Search, Filter, List, PlusCircle, X } from "lucide-react";
import OrderForm from "./OrderForm";
import PedidoList from "./orderList/orderList";
import EditPedidoModal from "./orderList/editOrderModal"; // Certifique-se de que esse caminho está correto

export function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [pedidoList, setPedidoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenEditModal = (pedido) => {
        setPedidoSelecionado(pedido);
        setEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setPedidoSelecionado(null);
        setEditModalOpen(false);
    };

    const fetchPedidos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/pedidos");
            if (response.ok) {
                const data = await response.json();
                setPedidoList(data);
            } else {
                console.error("Erro ao buscar pedidos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    const handleOrderSubmit = async (orderData) => {
        try {
            const response = await fetch("http://localhost:3000/api/pedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert("Pedido enviado com sucesso!");
                handleCloseModal();
                fetchPedidos();
            } else {
                alert("Erro ao enviar o pedido.");
            }
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Erro ao enviar o pedido.");
        }
    };

    const handlePedidoUpdate = async (pedidoAtualizado) => {
        try {
            const response = await fetch(`http://localhost:3000/api/pedido/${pedidoAtualizado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoAtualizado),
            });

            if (response.ok) {
                alert("Pedido atualizado com sucesso!");
                handleCloseEditModal();
                fetchPedidos();
            } else {
                alert("Erro ao atualizar o pedido.");
            }
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            alert("Erro ao atualizar o pedido.");
        }
    };

    const pedidosFiltrados = pedidoList.filter((pedido) =>
        pedido.cliente?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalFinalizados = pedidoList.filter(p => p.status === "finalizado").length;
    const totalPendentes = pedidoList.filter(p => p.status === "pendente").length;

    return (
        <div className="m-7">
            <div>
                <h1 className="text-red-500 font-black text-5xl mt-4">DASHBOARD</h1>
                <h3 className="font-bold">Olá, Seja Bem-Vindo!</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />
            </div>

            <div className="flex flex-wrap mt-4 ml-2 md:ml-10 gap-2">
                <div className="bg-gray-200 w-full sm:w-4/5 p-1 rounded-2xl flex items-center">
                    <Search size={25} className="text-red-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Pesquisar por cliente..."
                        className="bg-transparent w-full ml-2 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 ml-2">
                    <Filter size={25} className="text-red-500 cursor-pointer" />
                    <List size={25} className="text-red-500 cursor-pointer" />
                    <button
                        onClick={handleOpenModal}
                        className="bg-green-400 p-2 pl-4 pr-4 rounded-2xl font-bold ml-2 flex items-center hover:bg-green-500 transition-colors"
                    >
                        <PlusCircle size={20} className="mr-2" /> Adicionar Pedido
                    </button>
                </div>
            </div>

            <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl flex flex-col md:flex-row justify-evenly gap-4 relative">
                <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg flex items-center justify-center">
                    <h1>FINALIZADOS: {totalFinalizados}</h1>
                </div>

                <div className="hidden md:block border-l-2 border-gray-600"></div>

                <div className="bg-gray-400 h-16 p-4 pl-7 pr-7 rounded-3xl font-bold text-lg flex items-center justify-center">
                    <h1>PENDENTES: {totalPendentes}</h1>
                </div>
            </div>

            <PedidoList pedidos={pedidosFiltrados} onEditPedido={handleOpenEditModal} />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl relative animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-red-500">Novo Pedido</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-600 hover:text-black transition p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <OrderForm onSubmit={handleOrderSubmit} />
                    </div>
                </div>
            )}

            {editModalOpen && pedidoSelecionado && (
                <EditPedidoModal
                    pedido={pedidoSelecionado}
                    onClose={handleCloseEditModal}
                    onUpdate={handlePedidoUpdate}
                />
            )}
        </div>
    );
}

export default Dashboard;
