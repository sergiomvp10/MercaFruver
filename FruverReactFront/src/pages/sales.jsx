import React, { useState, useEffect, useCallback } from "react";
import Menu from "@/layouts/Menu";
import axios from "axios";
import { moneyFormat } from "@/utilities/formats";

const API = "http://localhost:4000/api";
const DEFAULT_PASSWORD = [49, 48, 53, 51, 52, 53, 48, 57, 55, 48].map(c => String.fromCharCode(c)).join('');
const SALES_PASSWORD = process.env.NEXT_PUBLIC_SALES_PASSWORD || DEFAULT_PASSWORD;

const Sales = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === SALES_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Contrasena incorrecta");
    }
  };

  const fetchSalesDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sales/details`, {
        params: { date: selectedDate }
      });
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales details:", error);
    }
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSalesDetails();
    }
  }, [isAuthenticated, fetchSalesDetails]);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr;
  };

  if (!isAuthenticated) {
    return (
      <Menu>
        <div className="flex justify-center items-center h-full bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Acceso a Ventas</h2>
              <p className="text-gray-500 mt-2">Ingrese la contrasena para continuar</p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contrasena"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition duration-200"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </Menu>
    );
  }

  return (
    <Menu>
      <div className="h-full flex flex-col">
        <div className="bg-cyan-600 p-4 text-center font-bold text-2xl text-white shadow-md">
          Ventas del Dia
        </div>

        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4 justify-center">
            <label className="font-semibold text-gray-700">Fecha:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={fetchSalesDetails}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition"
            >
              Consultar
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando...</p>
            </div>
          ) : salesData ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="text-lg opacity-80">Total del Dia</h3>
                  <p className="text-3xl font-bold mt-2">{moneyFormat(salesData.total || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="text-lg opacity-80">Productos Vendidos</h3>
                  <p className="text-3xl font-bold mt-2">{salesData.totalItems || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="text-lg opacity-80">Total Ventas</h3>
                  <p className="text-3xl font-bold mt-2">{salesData.totalVentas || 0}</p>
                </div>
              </div>

              {salesData.detalles && salesData.detalles.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <h3 className="bg-gray-100 px-6 py-3 font-semibold text-gray-700">
                    Detalle de Productos Vendidos - {salesData.fecha}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venta #</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {salesData.detalles.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {formatTime(item.hora)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.producto || 'Producto desconocido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.cantidad}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {moneyFormat(item.precioVenta || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {moneyFormat(item.subtotal || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              #{item.SaleId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 text-lg">No hay ventas registradas para esta fecha</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Seleccione una fecha para ver las ventas
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
};

export default Sales;
