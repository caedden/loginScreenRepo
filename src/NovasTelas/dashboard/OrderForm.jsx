import React, { useState, useEffect } from "react";
import { getAccessToken } from "../../utils/tokenStorage";

const OrderForm = ({ onSubmit }) => {
  const [products, setProducts] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState([]);

  const token = getAccessToken();
  const api = "http://localhost:3000";

  const [formData, setFormData] = useState({
    items: [{ id: "", quantity: 1, price: 0 }],
    totalOrder: 0,
    paymentType: "dinheiro",
    status: "pendente",
    tableId: "",
    clientId: "",
    couponCode: ""
  });

  // Busca produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${api}/api/produtos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchProducts();
  }, [api, token]);

  // Busca clientes conforme digita
  useEffect(() => {
    const fetchClients = async () => {
      if (clientSearch.trim().length < 2) return;

      try {
        const response = await fetch(`${api}/api/clientes/search?name=${(clientSearch)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const responseData = await response.json();
        setClientSuggestions(responseData.data); 

      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, [clientSearch, api, token]);

  // Recalcula o total do pedido
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0);
  };

  // Atualiza formData genérico (tableId, paymentType, status, couponCode)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza item específico no array (produto, quantidade, preço)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Se mudar produto, atualiza preço padrão do produto
    if (field === "id") {
      const product = products.find(p => p.id === value);
      updatedItems[index].price = product ? product.price : 0;
    }

    // Converte quantity e price para números seguros
    updatedItems[index].quantity = Number(updatedItems[index].quantity) || 1;
    updatedItems[index].price = Number(updatedItems[index].price) || 0;

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalOrder: calculateTotal(updatedItems)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: "", quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems,
        totalOrder: calculateTotal(updatedItems)
      }));
    }
  };

  // Seleciona cliente da lista de sugestões
  const handleClientSelect = (client) => {
    setFormData(prev => ({ ...prev, clientId: client.id }));
    setClientSearch(client.name);
    setClientSuggestions([]);
  };

  // Envia o pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      alert("Por favor, selecione um cliente válido.");
      return;
    }

    const payload = {
      ...formData,
      tableId: parseInt(formData.tableId, 10),
      items: formData.items.map(item => ({
        id: item.id,
        quantity: parseInt(item.quantity, 10),
        price: parseFloat(item.price)
      })),
      totalOrder: parseFloat(formData.totalOrder)
    };

    try {
      const response = await fetch(`${api}/api/pedido`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Pedido enviado com sucesso!");
        onSubmit && onSubmit(payload);
        // Reseta form após envio (opcional)
        setFormData({
          items: [{ id: "", quantity: 1, price: 0 }],
          totalOrder: 0,
          paymentType: "dinheiro",
          status: "pendente",
          tableId: "",
          clientId: "",
          couponCode: ""
        });
        setClientSearch("");
      } else {
        alert("Erro ao enviar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro ao enviar o pedido.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente - busca por nome */}
        <div className="relative">
          <label className="block text-sm font-medium">Cliente</label>
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              setFormData(prev => ({ ...prev, clientId: "" }));
            }}
            placeholder="Digite o nome do cliente..."
            className="w-full px-3 py-2 border rounded-md"
            autoComplete="off"
          />
          {clientSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
              {clientSuggestions.map(client => (
                <li
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {client.name} (ID: {client.id})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Número da mesa */}
        <div>
          <label className="block text-sm font-medium">Número da Mesa</label>
          <input
            type="number"
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Itens do pedido */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Itens do Pedido</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Adicionar Item
          </button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="p-4 border rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Produto */}
              <div>
                <label className="block text-sm font-medium">Produto</label>
                <select
                  value={item.id}
                  onChange={(e) => handleItemChange(index, "id", e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium">Quantidade</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10) || 1)}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Preço editável */}
              <div>
                <label className="block text-sm font-medium">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>

              {/* Remover item */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-md"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagamento e outros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Forma de Pagamento</label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="pix">PIX</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em Progresso</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Cupom de Desconto</label>
          <input type="text" name="couponCode" value={formData.couponCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
      {/* Total e submit */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-xl font-bold">
          Total: R$ {formData.totalOrder.toFixed(2)}
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          Enviar Pedido
        </button>
      </div>
    </form>
  );
};
export default OrderForm;


