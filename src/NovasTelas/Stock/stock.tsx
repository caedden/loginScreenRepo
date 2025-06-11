import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/tokenStorage";

export function Estoque() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);
    const [porPagina] = useState(5);
    const [estoqueEditado, setEstoqueEditado] = useState({});
    const token = getAccessToken();
    const [salvando, setSalvando] = useState({});

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            const formatado = data.map(p => ({
                ...p,
                estoque: p.quantity,
                nome: p.name,
            }));
            setProdutos(formatado);

            // Inicializa os valores no input editável
            const valoresIniciais = {};
            formatado.forEach(p => {
                valoresIniciais[p.id] = p.estoque;
            });
            setEstoqueEditado(valoresIniciais);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    const atualizarEstoque = async (id, novoEstoque) => {
        setSalvando(prev => ({ ...prev, [id]: true }));
        const startTime = Date.now();

        try {
            const response = await fetch(`http://localhost:3000/api/estoque/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: novoEstoque }),
            });

            if (response.ok) {
                setProdutos(prev =>
                    prev.map(produto =>
                        produto.id === id ? { ...produto, estoque: novoEstoque } : produto
                    )
                );
            } else {
                alert("Erro ao atualizar estoque.");
            }
        } catch (error) {
            console.error("Erro na atualização:", error);
        } finally {
            // Garante que o loading fique no mínimo 1 segundo
            const elapsed = Date.now() - startTime;
            const delay = Math.max(0, 1000 - elapsed);

            setTimeout(() => {
                setSalvando(prev => ({ ...prev, [id]: false }));
            }, delay);
        }
    };


    const handleInputChange = (id, valor) => {
        const parsed = parseInt(valor);
        if (!isNaN(parsed) && parsed >= 0) {
            setEstoqueEditado(prev => ({ ...prev, [id]: parsed }));
        }
    };

    const handleSalvar = (id) => {
        const novoEstoque = estoqueEditado[id];
        atualizarEstoque(id, novoEstoque);
    };

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const inicio = (pagina - 1) * porPagina;
    const fim = inicio + porPagina;
    const produtosPaginados = produtosFiltrados.slice(inicio, fim);
    const totalPaginas = Math.ceil(produtosFiltrados.length / porPagina);

    return (
        <div className="m-7">
            <h1 className="text-red-500 font-black text-4xl mb-4">Controle de Estoque</h1>

            <input
                type="text"
                placeholder="Buscar produto..."
                className="mb-4 px-4 py-2 border rounded w-full md:w-1/2"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {produtosPaginados.map((produto) => (
                            <div key={produto.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-lg">{produto.nome}</h2>
                                    <p className="text-gray-600 text-sm">{produto.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label>Estoque:</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="border px-2 py-1 rounded w-20 text-center"
                                        value={estoqueEditado[produto.id] ?? produto.estoque}
                                        onChange={(e) => handleInputChange(produto.id, e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSalvar(produto.id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                                        disabled={salvando[produto.id]}
                                    >
                                        {salvando[produto.id] ? "Salvando..." : "Salvar"}
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            disabled={pagina === 1}
                            onClick={() => setPagina(pagina - 1)}
                        >
                            Anterior
                        </button>
                        <span className="px-3 py-1">{pagina} / {totalPaginas}</span>
                        <button
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            disabled={pagina === totalPaginas}
                            onClick={() => setPagina(pagina + 1)}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
