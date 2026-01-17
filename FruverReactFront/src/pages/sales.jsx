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
  const [daysList, setDaysList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === SALES_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Contrasena incorrecta");
    }
  };

  const fetchDaysList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sales/days-list`);
      setDaysList(response.data);
    } catch (error) {
      console.error("Error fetching days list:", error);
    }
    setLoading(false);
  }, []);

  const fetchDayDetails = useCallback(async (fecha) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`${API}/sales/details`, {
        params: { date: fecha }
      });
      setDayDetails(response.data);
    } catch (error) {
      console.error("Error fetching day details:", error);
    }
    setLoadingDetails(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDaysList();
    }
  }, [isAuthenticated, fetchDaysList]);

  const handleDayDoubleClick = (day) => {
    setSelectedDay(day);
    fetchDayDetails(day.fecha);
  };

  const handleBackToList = () => {
    setSelectedDay(null);
    setDayDetails(null);
  };

  const handleDeleteClick = (e, day) => {
    e.stopPropagation();
    setDeleteConfirm(day);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/sales/by-date`, {
        params: { date: deleteConfirm.fecha }
      });
      setDaysList(daysList.filter(d => d.fecha !== deleteConfirm.fecha));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting sales:", error);
    }
    setDeleting(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const formatDateForName = (fecha) => {
    if (!fecha) return '';
    const parts = fecha.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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

  if (selectedDay && dayDetails) {
    return (
      <Menu>
        <div className="h-full flex flex-col">
          <div className="bg-cyan-600 p-4 text-center font-bold text-2xl text-white shadow-md">
            VENTA_DETALLADA_{formatDateForName(selectedDay.fecha)}
          </div>

          <div className="bg-white p-4 shadow-sm">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a la lista
            </button>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {loadingDetails ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Cargando detalles...</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg opacity-80">Total del Dia</h3>
                    <p className="text-3xl font-bold mt-2">{moneyFormat(dayDetails.total || 0)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg opacity-80">Productos Vendidos</h3>
                    <p className="text-3xl font-bold mt-2">{dayDetails.totalItems || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg opacity-80">Total Transacciones</h3>
                    <p className="text-3xl font-bold mt-2">{dayDetails.totalVentas || 0}</p>
                  </div>
                </div>

                {dayDetails.detalles && dayDetails.detalles.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <h3 className="bg-gray-100 px-6 py-3 font-semibold text-gray-700">
                      Productos Vendidos - {selectedDay.fechaFormateada}
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
                          {dayDetails.detalles.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {item.hora}
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
                    <p className="text-gray-500 text-lg">No hay productos vendidos este dia</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Menu>
    );
  }

  return (
    <Menu>
      <div className="h-full flex flex-col">
        <div className="bg-cyan-600 p-4 text-center font-bold text-2xl text-white shadow-md">
          Ventas Detalladas
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando...</p>
            </div>
          ) : daysList.length > 0 ? (
            <div className="space-y-3">
              {daysList.map((day, index) => (
                <div
                  key={index}
                  onDoubleClick={() => handleDayDoubleClick(day)}
                  className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:bg-cyan-50 transition-all border-l-4 border-cyan-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          VENTA_DETALLADA_{formatDateForName(day.fecha)}
                        </h3>
                        <p className="text-gray-500 text-sm">{day.fechaFormateada}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{moneyFormat(day.total || 0)}</p>
                        <p className="text-gray-500 text-sm">{day.totalVentas} ventas - {day.totalItems} productos</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteClick(e, day)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                        title="Eliminar reporte"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">No hay ventas registradas</p>
            </div>
          )}
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Eliminar Reporte</h3>
                <p className="text-gray-600 mb-6">
                  Esta seguro que desea eliminar <span className="font-semibold">VENTA_DETALLADA_{formatDateForName(deleteConfirm.fecha)}</span>? Esta accion no se puede deshacer.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Eliminando...
                      </>
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default Sales;
