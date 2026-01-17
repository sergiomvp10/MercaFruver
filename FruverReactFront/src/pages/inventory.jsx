import React, { useState } from "react";
import Menu from "@/layouts/Menu";
import useFetch from "@/hooks/useFetch";
import InputIcon from "@/components/InputIcon";
import { u1F50D } from "react-icons-kit/noto_emoji_regular/u1F50D";
import { moneyFormat } from "@/utilities/formats";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API || "http://localhost:4000/api";

const Inventory = () => {
  const { data, loading, refetching } = useFetch({
    endpoint: "products",
    method: "GET",
    body: {},
  });

  const [searchValue, setSearchValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showIngreso, setShowIngreso] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [processing, setProcessing] = useState(false);

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

  const handleIngreso = async () => {
    if (!selectedProduct || !quantity || quantity <= 0) return;
    setProcessing(true);
    try {
      const product = data.find(p => p.id === parseInt(selectedProduct));
      if (product) {
        const newStock = (product.stock || 0) + parseInt(quantity);
        await axios.put(`${API}/products/${selectedProduct}`, { stock: newStock });
        refetching();
      }
      setShowIngreso(false);
      setSelectedProduct("");
      setQuantity("");
    } catch (error) {
      console.error("Error al ingresar stock:", error);
    }
    setProcessing(false);
  };

  const handleSalida = async () => {
    if (!selectedProduct || !quantity || quantity <= 0) return;
    setProcessing(true);
    try {
      const product = data.find(p => p.id === parseInt(selectedProduct));
      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - parseInt(quantity));
        await axios.put(`${API}/products/${selectedProduct}`, { stock: newStock });
        refetching();
      }
      setShowSalida(false);
      setSelectedProduct("");
      setQuantity("");
    } catch (error) {
      console.error("Error al retirar stock:", error);
    }
    setProcessing(false);
  };

  const openIngreso = () => {
    setShowMenu(false);
    setShowIngreso(true);
  };

  const openSalida = () => {
    setShowMenu(false);
    setShowSalida(true);
  };

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

        <div className="absolute right-6 bottom-6">
          {showMenu && (
            <div className="absolute bottom-20 right-0 bg-white rounded-xl shadow-2xl p-2 min-w-40 border border-gray-200">
              <button
                onClick={openIngreso}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Ingreso</span>
              </button>
              <button
                onClick={openSalida}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Salida</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              <circle cx="18" cy="14" r="4" fill="white" stroke="currentColor" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14l1 1 2-2" />
            </svg>
          </button>
        </div>

        {showIngreso && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ingreso de Stock</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Seleccionar producto...</option>
                    {data && data.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock actual: {product.stock || 0})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a ingresar</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Cantidad"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowIngreso(false); setSelectedProduct(""); setQuantity(""); }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                  disabled={processing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleIngreso}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                  disabled={processing || !selectedProduct || !quantity}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSalida && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Salida de Stock</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Seleccionar producto...</option>
                    {data && data.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock actual: {product.stock || 0})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a retirar</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Cantidad"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowSalida(false); setSelectedProduct(""); setQuantity(""); }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                  disabled={processing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalida}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                  disabled={processing || !selectedProduct || !quantity}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    'Retirar'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default Inventory;
