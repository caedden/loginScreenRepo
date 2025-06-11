import React, { useState } from "react";
import { FiXCircle } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";

export default function ProductList({ products, onUpdateProduct }) {
    const api = 'http://localhost:3000'
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 18;
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        ean: "",
        description: "",
        group: "",
        type: "",
        status: "active",
        price: 0,
        quantity: 0
    });

    const token = getAccessToken();
    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const toggleForm = () => setShowForm(!showForm);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            ean: product.ean,
            description: product.description,
            group: product.group,
            type: product.type,
            status: product.status,
            price: product.price,
            quantity: product.quantity
        });
    };



    const handleCloseSidebar = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="relative bg-gray-200 h-full mt-4 p-4 rounded-2xl">
            {currentProducts.length > 0 ? (
                <>
                    <ul className="grid grid-cols-6 gap-4">
                        {currentProducts.map((product) => (
                            <li
                                key={product.id}
                                className="bg-gray-400 p-4 rounded-xl shadow-md cursor-pointer hover:bg-gray-500 transition"
                                onClick={() => handleProductClick(product)}
                            >
                                <p><strong>Nome:</strong> {product.name}</p>
                                <p><strong>EAN:</strong> {product.ean}</p>
                                <p><strong>Preço:</strong> R$ {product.price}</p>
                                <p><strong>Quantidade:</strong> {product.quantity}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center mt-6 space-x-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-500'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p>Nenhum produto cadastrado.</p>
            )}
            {selectedProduct && (
                <div className="fixed top-0 right-0 h-full w-96 bg-gray-300 shadow-2xl p-6 z-50 flex flex-col">
                    <button className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={handleCloseSidebar}>
                        <FiXCircle size={30} />
                    </button>

                    <h2 className="text-2xl font-bold flex justify-center m-2">Editar Produto</h2>

                    <form
                        className="bg-gray-400 p-4 rounded-xl shadow-md mt-6 space-y-4 overflow-y-auto"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const response = await fetch(api + `/api/produto/${formData.id}`, {
                                    method: "PUT",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(formData)
                                });

                                if (!response.ok) throw new Error("Erro ao atualizar produto");

                                alert("Produto atualizado com sucesso!");
                                const data = await response.json();
                                const updatedProduct = data.product;  // Pega o produto dentro do objeto retornado

                                console.log(updatedProduct)
                                onUpdateProduct(updatedProduct); // ← envia para o componente pai
                                handleCloseSidebar();
                            } catch (err) {
                                alert(err.message);
                            }
                        }}

                    >
                        <div>
                            <label className="font-bold">Nome</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold">EAN</label>
                            <input
                                type="text"
                                value={formData.ean}
                                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold">Descrição</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold">Grupo</label>
                            <select
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            >
                                <option value="">Selecione um grupo</option>
                                {[
                                    "Drinks", "Cervejas", "Vinhos", "Não Alcoólicos",
                                    "Porções", "Doses", "Garrafas", "Combos"
                                ].map((group) => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-bold">Tipo</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            >
                                <option value="">Selecione um tipo</option>
                                {["Kg", "Un"].map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-bold">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-2 rounded"
                                required
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold">Preço</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold">Quantidade</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full p-2 rounded"
                                required
                            />
                        </div>

                        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded w-full font-bold">
                            Salvar Alterações
                        </button>
                    </form>


                </div>
            )}

        </div>
    );
}
