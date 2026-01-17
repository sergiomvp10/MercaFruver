import React, { useState } from "react";
import Menu from "@/layouts/Menu";
import useFetch from "@/hooks/useFetch";
import InputIcon from "@/components/InputIcon";
import { u1F50D } from "react-icons-kit/noto_emoji_regular/u1F50D";
import { moneyFormat } from "@/utilities/formats";

const Inventory = () => {
  const { data, loading } = useFetch({
    endpoint: "products",
    method: "GET",
    body: {},
  });

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredProducts = data
    ? data.filter(
        (product) =>
          product.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      )
    : [];

  const totalStock = filteredProducts.reduce(
    (acc, product) => acc + (product.stock || 0),
    0
  );

  const totalValue = filteredProducts.reduce(
    (acc, product) => acc + (product.stock || 0) * (product.price_sale || 0),
    0
  );

  return (
    <Menu>
      <div className="h-full flex flex-col">
        <div className="bg-orange-500 p-4 text-center font-bold text-2xl text-white shadow-md">
          Inventario
        </div>

        <div className="flex-1 flex flex-col gap-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white shadow-lg">
              <h3 className="text-sm opacity-80">Total Productos</h3>
              <p className="text-2xl font-bold mt-1">{filteredProducts.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white shadow-lg">
              <h3 className="text-sm opacity-80">Unidades en Stock</h3>
              <p className="text-2xl font-bold mt-1">{totalStock}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg">
              <h3 className="text-sm opacity-80">Valor del Inventario</h3>
              <p className="text-2xl font-bold mt-1">{moneyFormat(totalValue)}</p>
            </div>
          </div>

          <div className="bg-orange-400 p-3 rounded-lg">
            <InputIcon
              value={searchValue}
              placeholder={"Buscar producto..."}
              icon={u1F50D}
              onChange={handleSearch}
            />
          </div>

          <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <table className="w-full">
                <thead className="bg-orange-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Precio Compra</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Precio Venta</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-orange-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {moneyFormat(product.price_purchase || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                        {moneyFormat(product.price_sale || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                        {moneyFormat((product.stock || 0) * (product.price_sale || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg">No hay productos en el inventario</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Menu>
  );
};

export default Inventory;
