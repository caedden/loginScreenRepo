import React, { useState, useEffect } from "react";
import { FiFilter, FiSearch, FiXCircle } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";
import PedidoList from "./PedidoList"; // Supondo que você tenha um componente para listar pedidos

export function Pedidos() {
    const [showForm, setShowForm] = useState(false);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pedidoList, setPedidoList] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const token = getAccessToken();

    const statuses = ["finalizado", "pendente"];

    const fetchPedidos = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/pedidos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
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

    const filteredPedidos = pedidoList.filter(pedido => {
        const matchesSearch = pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus ? pedido.status === selectedStatus : true;
        return matchesSearch && matchesStatus;
    });

    const handleEditPedido = (pedido) => {
        setSelectedPedido(pedido);
        setShowForm(true);
    };

    const handleSubmit = async (updatedPedido) => {
        try {
            await fetch(`http://localhost:3000/api/pedido/${updatedPedido.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPedido),
            });
            alert("Pedido atualizado com sucesso!");
            setShowForm(false);
            fetchPedidos();
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            alert("Erro ao atualizar pedido.");
        }
    };

    return (
        <div>
            <div className="m-7">
                <h1 className="text-red-500 font-black text-5xl">PEDIDOS</h1>
                <h3 className="font-bold">Gerencie os pedidos dos clientes.</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />

                <div className="flex mt-4 ml-10 items-center space-x-3">
                    <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
                        <FiSearch size={25} className="text-red-500 ml-2" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="bg-transparent ml-2 w-full outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FiFilter
                            size={25}
                            className="text-red-500 cursor-pointer mt-1 ml-2"
                            onClick={() => setShowFilterOptions(!showFilterOptions)}
                        />
                        {showFilterOptions && (
                            <div className="absolute top-8 right-0 bg-white border rounded shadow-lg p-4 z-50 w-64">
                                <h3 className="font-semibold mb-2">Filtros</h3>
                                <label className="block mb-1 font-medium">Status:</label>
                                <select
                                    className="w-full mb-3 p-1 border rounded"
                                    value={selectedStatus}
                                    onChange={e => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {statuses.map((status, idx) => (
                                        <option key={idx} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                    onClick={() => {
                                        setSelectedStatus("");
                                        setShowFilterOptions(false);
                                    }}
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <PedidoList
                    pedidos={filteredPedidos}
                    onEditPedido={handleEditPedido}
                />
            </div>

            {showForm && selectedPedido && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={() => setShowForm(false)}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Editar Pedido</h2>

                    {/* Formulário de edição do pedido */}
                    <div className="mt-12 space-y-2">
                        <input
                            type="text"
                            placeholder="Cliente"
                            value={selectedPedido.cliente}
                            onChange={e => setSelectedPedido({ ...selectedPedido, cliente: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Valor"
                            value={selectedPedido.valor}
                            onChange={e => setSelectedPedido({ ...selectedPedido, valor: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                        <div className="relative">
                            <button
                                onClick={() => setSelectedPedido({ ...selectedPedido, status: selectedPedido.status === 'finalizado' ? 'pendente' : 'finalizado' })}
                                className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-left text-gray-700"
                            >
                                {selectedPedido.status || "Status"}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSubmit(selectedPedido)}
                        className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 mb-10"
                    >
                        Salvar

                        ::contentReference[oaicite:0]{index = 0}

                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
