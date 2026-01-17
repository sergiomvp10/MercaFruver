import React, { useState, useEffect, useCallback } from "react";
import Menu from "@/layouts/Menu";
import axios from "axios";
import { moneyFormat } from "@/utilities/formats";

const API = "http://localhost:4000/api";
const DEFAULT_PASSWORD = [49, 48, 53, 51, 52, 53, 48, 57, 55, 48].map(c => String.fromCharCode(c)).join('');
const REPORT_PASSWORD = process.env.NEXT_PUBLIC_REPORT_PASSWORD || DEFAULT_PASSWORD;

const Reports = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
  const [loading, setLoading] = useState(false);
  
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [rangeData, setRangeData] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === REPORT_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Contrasena incorrecta");
    }
  };

  const fetchDailyReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sales/reports/daily`, {
        params: { date: selectedDate }
      });
      setDailyData(response.data);
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
    setLoading(false);
  }, [selectedDate]);

  const fetchMonthlyReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sales/reports/monthly`, {
        params: { year: selectedYear, month: selectedMonth }
      });
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Error fetching monthly report:", error);
    }
    setLoading(false);
  }, [selectedYear, selectedMonth]);

  const fetchRangeReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/sales/reports/range`, {
        params: { startDate, endDate }
      });
      setRangeData(response.data);
    } catch (error) {
      console.error("Error fetching range report:", error);
    }
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "daily") {
        fetchDailyReport();
      } else if (activeTab === "monthly") {
        fetchMonthlyReport();
      } else if (activeTab === "range") {
        fetchRangeReport();
      }
    }
  }, [isAuthenticated, activeTab, fetchDailyReport, fetchMonthlyReport, fetchRangeReport]);

  const months = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

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
              <h2 className="text-2xl font-bold text-gray-800">Acceso a Reportes</h2>
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
          Reportes de Ventas
        </div>
        
        <div className="flex border-b bg-white">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === "daily"
                ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Venta Diaria
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === "monthly"
                ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Venta Mensual
          </button>
          <button
            onClick={() => setActiveTab("range")}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === "range"
                ? "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Por Rango de Fechas
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "daily" && (
            <div>
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700">Seleccionar fecha:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={fetchDailyReport}
                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Consultar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
              ) : dailyData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg opacity-80">Total Ventas del Dia</h3>
                    <p className="text-4xl font-bold mt-2">{moneyFormat(dailyData.total || 0)}</p>
                    <p className="mt-2 opacity-80">{dailyData.fecha}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg opacity-80">Cantidad de Ventas</h3>
                    <p className="text-4xl font-bold mt-2">{dailyData.cantidadVentas || 0}</p>
                    <p className="mt-2 opacity-80">transacciones</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Seleccione una fecha para ver el reporte
                </div>
              )}
            </div>
          )}

          {activeTab === "monthly" && (
            <div>
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="font-semibold text-gray-700">Seleccionar mes:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <button
                    onClick={fetchMonthlyReport}
                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Consultar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
              ) : monthlyData ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                      <h3 className="text-lg opacity-80">Total Ventas del Mes</h3>
                      <p className="text-4xl font-bold mt-2">{moneyFormat(monthlyData.total || 0)}</p>
                      <p className="mt-2 opacity-80">{months.find(m => m.value === monthlyData.mes)?.label} {monthlyData.año}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                      <h3 className="text-lg opacity-80">Cantidad de Ventas</h3>
                      <p className="text-4xl font-bold mt-2">{monthlyData.cantidadVentas || 0}</p>
                      <p className="mt-2 opacity-80">transacciones</p>
                    </div>
                  </div>

                  {monthlyData.detallesDiarios && monthlyData.detallesDiarios.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <h3 className="bg-gray-100 px-6 py-3 font-semibold text-gray-700">Detalle por Dia</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {monthlyData.detallesDiarios.map((day, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{moneyFormat(day.total || 0)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.cantidadVentas}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Seleccione un mes para ver el reporte
                </div>
              )}
            </div>
          )}

          {activeTab === "range" && (
            <div>
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="font-semibold text-gray-700">Desde:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <label className="font-semibold text-gray-700">Hasta:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={fetchRangeReport}
                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Consultar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
              ) : rangeData ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h3 className="text-lg opacity-80">Total en el Periodo</h3>
                      <p className="text-4xl font-bold mt-2">{moneyFormat(rangeData.resumen?.total || 0)}</p>
                      <p className="mt-2 opacity-80">{startDate} - {endDate}</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl text-white shadow-lg">
                      <h3 className="text-lg opacity-80">Cantidad de Ventas</h3>
                      <p className="text-4xl font-bold mt-2">{rangeData.resumen?.totalSales || 0}</p>
                      <p className="mt-2 opacity-80">transacciones</p>
                    </div>
                  </div>

                  {rangeData.detallesDiarios && rangeData.detallesDiarios.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <h3 className="bg-gray-100 px-6 py-3 font-semibold text-gray-700">Detalle por Dia</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {rangeData.detallesDiarios.map((day, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{moneyFormat(day.total || 0)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.cantidadVentas}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Seleccione un rango de fechas para ver el reporte
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
};

export default Reports;
