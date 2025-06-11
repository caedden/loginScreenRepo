import { useState, useEffect } from "react";
import { FiFilter, FiSearch, FiXCircle } from "react-icons/fi";
import ProductList from "./ProductList";
import { getAccessToken } from "../../utils/tokenStorage";

export function Produtos() {
    const [showForm, setShowForm] = useState(false);
    const [showGroupOptions, setShowGroupOptions] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    // Novos estados para filtro geral
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterGroup, setFilterGroup] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const token = getAccessToken();

    const [ean, setEan] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [productList, setProductList] = useState([]);

    const groups = [
        "Drinks", "Cervejas", "Vinhos", "Não Alcoólicos", "Porções", "Doses", "Garrafas", "Combos"
    ];

    const types = ["Kg", "Un"];
    const statuses = ["active", "inactive"];

    const handleUpdateProduct = (updatedProduct) => {
        setProductList((prevList) =>
            prevList.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const toggleForm = () => setShowForm(!showForm);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/produtos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProductList(data);
            } else {
                console.error("Erro ao buscar produtos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        if (!ean || !name || !price || !quantity) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (isNaN(ean) || ean.trim() === "") {
            alert("Código EAN inválido.");
            return;
        }

        try {
            const getResponse = await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (getResponse.ok) {
                const data = await getResponse.json();
                const updatedProduct = {
                    ...data,
                    quantity: data.quantity + parseInt(quantity),
                };

                await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProduct),
                });
                alert("Produto já cadastrado. Quantidade atualizada!");
            } else if (getResponse.status === 404) {
                const newProduct = {
                    ean: ean.trim(),
                    name,
                    description,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    group: selectedGroup,
                    type: selectedType,
                };

                await fetch("http://localhost:3000/api/produto", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newProduct),
                });
                alert("Produto cadastrado com sucesso!");
            } else {
                alert("Erro ao acessar o produto.");
            }

            clearForm();
            toggleForm();
            fetchProducts();
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao processar a requisição.");
        }
    };

    const clearForm = () => {
        setEan("");
        setName("");
        setQuantity("");
        setPrice("");
        setDescription("");
        setSelectedGroup("");
        setSelectedType("");
    };

    // Filtrar produtos conforme busca e filtros ativos
    const filteredProducts = productList.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup ? product.group === filterGroup : true;
        const matchesType = filterType ? product.type === filterType : true;
        const matchesStatus = filterStatus ? product.status === filterStatus : true;
        return matchesSearch && matchesGroup && matchesType && matchesStatus;
    });

    return (
        <div>
            <div className="m-7">
                <h1 className="text-red-500 font-black text-5xl ">PRODUTOS</h1>
                <h3 className="font-bold">Crie e gerencie os dados de seus produtos.</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />

                <div className="flex mt-4 ml-10 items-center space-x-3">
                    {/* Busca */}
                    <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
                        <FiSearch size={25} className="text-red-500 ml-2" />
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            className="bg-transparent ml-2 w-full outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Ícone Filtro */}
                    <div className="relative">
                        <FiFilter
                            size={25}
                            className="text-red-500 cursor-pointer mt-1 ml-2"
                            onClick={() => setShowFilterOptions(!showFilterOptions)}
                        />
                        {showFilterOptions && (
                            <div className="absolute top-8 right-0 bg-white border rounded shadow-lg p-4 z-50 w-64">
                                <h3 className="font-semibold mb-2">Filtros</h3>

                                {/* Filtrar por Grupo */}
                                <label className="block mb-1 font-medium">Grupo:</label>
                                <select
                                    className="w-full mb-3 p-1 border rounded"
                                    value={filterGroup}
                                    onChange={e => setFilterGroup(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {groups.map((group, idx) => (
                                        <option key={idx} value={group}>{group}</option>
                                    ))}
                                </select>

                                {/* Filtrar por Tipo */}
                                <label className="block mb-1 font-medium">Tipo:</label>
                                <select
                                    className="w-full mb-3 p-1 border rounded"
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {types.map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </select>

                                {/* Filtrar por Status */}
                                <label className="block mb-1 font-medium">Status:</label>
                                <select
                                    className="w-full mb-3 p-1 border rounded"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {statuses.map((status, idx) => (
                                        <option key={idx} value={status}>{status}</option>
                                    ))}
                                </select>

                                {/* Botão limpar filtros */}
                                <button
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                    onClick={() => {
                                        setFilterGroup("");
                                        setFilterType("");
                                        setFilterStatus("");
                                        setShowFilterOptions(false);
                                    }}
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botão Adicionar */}
                    <div>
                        <button
                            className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 transition-colors duration-300 ease-in-out hover:bg-green-500"
                            onClick={toggleForm}
                        >
                            +ADICIONAR
                        </button>
                    </div>
                </div>

                {/* Lista de produtos filtrada */}
                <ProductList
                    products={filteredProducts}
                    onUpdateProduct={handleUpdateProduct}
                />
            </div>

            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold flex justify-center m-2">Adicionar Produto</h2>

                    <div className="mt-12 space-y-2">
                        <input
                            type="number"
                            placeholder="EAN"
                            value={ean}
                            onChange={e => setEan(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Nome do Produto"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <div className="flex justify-between space-x-2">
                            <input
                                type="number"
                                placeholder="Qtd.:"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                placeholder="Preço:"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Descrição:"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />

                        <div className="flex space-x-2">
                            <div className="w-1/2">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowGroupOptions(!showGroupOptions)}
                                        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-left text-gray-700"
                                    >
                                        {selectedGroup || "Grupo"}
                                    </button>
                                    {showGroupOptions && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {groups.map((group, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedGroup(group);
                                                        setShowGroupOptions(false);
                                                    }}
                                                    className="px-4 py-1 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {group}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="w-1/2">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowTypeOptions(!showTypeOptions)}
                                        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-left text-gray-700"
                                    >
                                        {selectedType || "Tipo"}
                                    </button>
                                    {showTypeOptions && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {types.map((type, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedType(type);
                                                        setShowTypeOptions(false);
                                                    }}
                                                    className="px-4 py-1 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {type}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 mb-10"
                    >
                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
