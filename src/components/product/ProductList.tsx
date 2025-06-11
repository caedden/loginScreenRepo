import React from "react";

/**
 * Componente para exibir uma lista de produtos.
 * @param {Array} products - Lista de produtos vinda da API
 */
export default function ProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Nenhum produto cadastrado.
      </div>
    );
  }

  return (
    <div className="mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.ean}
            className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg text-gray-800">{product.name}</h2>
              <span className="text-sm text-gray-500">{product.ean}</span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{product.description || "Sem descrição"}</p>

            <div className="flex justify-between items-center text-sm text-gray-700">
              <span className="font-medium">Grupo:</span>
              <span>{product.group || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-700">
              <span className="font-medium">Tipo:</span>
              <span>{product.type || "Un"}</span>
            </div>

            <div className="mt-3 flex justify-between items-center font-semibold text-gray-800">
              <span>Qtd:</span>
              <span>{product.quantity}</span>
            </div>

            <div className="flex justify-between items-center font-semibold text-green-700">
              <span>Preço:</span>
              <span>R$ {Number(product.price).toFixed(2)}</span>
            </div>

            {/* Futuras ações */}
            {/* 
            <div className="mt-4 flex justify-end space-x-2">
              <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
              <button className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
            */}
          </div>
        ))}
      </div>
    </div>
  );
}
