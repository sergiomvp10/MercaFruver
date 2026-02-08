import React, { useState, useEffect } from "react";
import Menu from "@/layouts/Menu";
import { serviceGetLowStockProducts } from "@/services/productsApi";

const StockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const data = await serviceGetLowStockProducts();
      setLowStockProducts(data);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const getStockLevel = (product) => {
    if (product.stock === 0) return "out";
    if (product.stock <= product.min_stock * 0.5) return "critical";
    return "low";
  };

  return (
    <Menu>
      <div className="h-full flex flex-col">
        <div className="bg-red-500 p-4 text-center font-bold text-2xl text-white">
          Alerta de Stock
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-lg">Cargando...</div>
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">Todos los productos tienen stock suficiente</p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {lowStockProducts.length}
                  </div>
                  <div>
                    <p className="font-bold text-red-700 text-lg">Productos con stock bajo</p>
                    <p className="text-red-500 text-sm">Estos productos necesitan ser reabastecidos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Producto</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Stock Actual</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Stock Minimo</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Estado</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Pedir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => {
                      const level = getStockLevel(product);
                      const needed = product.min_stock - product.stock;
                      return (
                        <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500">{product.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold text-lg ${level === 'out' ? 'text-red-600' : level === 'critical' ? 'text-orange-500' : 'text-yellow-500'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-medium text-gray-600">{product.min_stock}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {level === 'out' && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">AGOTADO</span>
                            )}
                            {level === 'critical' && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">CRITICO</span>
                            )}
                            {level === 'low' && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">BAJO</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              +{needed > 0 ? needed : 0} {product.pesable ? product.unit : 'und'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-bold text-blue-700 mb-2">Lista de pedido:</p>
                <ul className="space-y-1">
                  {lowStockProducts.map((product) => {
                    const needed = product.min_stock - product.stock;
                    return (
                      <li key={product.id} className="flex justify-between text-sm text-blue-800 bg-white rounded-lg px-3 py-2">
                        <span className="font-medium">{product.name}</span>
                        <span className="font-bold">Pedir: {needed > 0 ? needed : 0} {product.pesable ? product.unit : 'unidades'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          <div className="mt-4 flex justify-center">
            <button
              onClick={fetchLowStock}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium shadow"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </Menu>
  );
};

export default StockAlerts;
