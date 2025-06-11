import { useState, useEffect } from "react";
import { FiFilter, FiSearch, FiXCircle } from "react-icons/fi";
import ProductList from "./ProductList";

const GROUPS = [
  "Drinks", "Cervejas", "Vinhos", "Não Alcoólicos", "Porções", "Doses", "Garrafas", "Combos"
];
const TYPES = ["Kg", "Un"];

export function Produtos() {
  const [showForm, setShowForm] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [productList, setProductList] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  // Buscar produtos da API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/produtos",{
          method: "GET",
          headers: { "Content-Type": "application/json" }        });
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

  // Validação simples do EAN: apenas números e tamanho esperado
  const isValidEan = (value) => /^\d+$/.test(value.trim());

  const handleSubmit = async () => {
    if (!ean || !name || !price || !quantity) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!isValidEan(ean)) {
      alert("Código EAN inválido.");
      return;
    }

    setLoadingSave(true);
    try {
      const response = await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`);

      if (response.ok) {
        const data = await response.json();
        const updatedProduct = {
          ...data,
          quantity: data.quantity + parseInt(quantity, 10),
        };

        await fetch(`http://localhost:3000/api/produto/ean/${ean.trim()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        });
        alert("Produto já cadastrado. Quantidade atualizada!");
      } else if (response.status === 404) {
        const newProduct = {
          ean: ean.trim(),
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          group: selectedGroup,
          type: selectedType,
        };

        await fetch("http://localhost:3000/api/produto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    } finally {
      setLoadingSave(false);
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

  return (
    <div>
      <div className="m-7">
        <h1 className="text-red-500 font-black text-5xl">PRODUTOS</h1>
        <h3 className="font-bold">Crie e gerencie os dados de seus produtos.</h3>
        <hr className="border-y-2 w-full mt-2 border-gray-200" />

        <div className="flex mt-4 ml-10">
          <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
            <FiSearch size={25} className="text-red-500 ml-2" />
            {/* Aqui você pode colocar um input para pesquisar */}
            {/* <input type="text" placeholder="Buscar..." className="ml-2 flex-grow bg-transparent outline-none" /> */}
          </div>
          <div>
            <FiFilter size={25} className="text-red-500 mt-1 ml-2 cursor-pointer" />
            {/* Poderia abrir um menu para filtros */}
          </div>
          <div>
            <button
              className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 transition-colors duration-300 ease-in-out hover:bg-green-500"
              onClick={toggleForm}
            >
              +ADICIONAR
            </button>
          </div>
        </div>

        <ProductList products={productList} />
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
              <div className="w-1/2 relative">
                <button
                  onClick={() => setShowGroupOptions(!showGroupOptions)}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-left text-gray-700"
                  type="button"
                >
                  {selectedGroup || "Grupo"}
                </button>
                {showGroupOptions && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                    {GROUPS.map((group, index) => (
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

              <div className="w-1/2 relative">
                <button
                  onClick={() => setShowTypeOptions(!showTypeOptions)}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-left text-gray-700"
                  type="button"
                >
                  {selectedType || "Tipo"}
                </button>
                {showTypeOptions && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                    {TYPES.map((type, index) => (
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

          <button
            onClick={handleSubmit}
            disabled={loadingSave}
            className={`text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 mb-10 ${
              loadingSave ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"
            }`}
          >
            {loadingSave ? "Salvando..." : "Salvar"}
          </button>
        </div>
      )}
    </div>
  );
}
