import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { serviceDayReport, serviceDetailedReport, serviceTotalReport } from "@/services/productsApi";
import { moneyFormat } from "@/utilities/formats";

const Sales = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("day");
  
  const [dayDate, setDayDate] = useState(new Date());
  const [dayReport, setDayReport] = useState(null);
  const [dayLoading, setDayLoading] = useState(false);
  
  const [detailedDate, setDetailedDate] = useState(new Date());
  const [detailedReport, setDetailedReport] = useState(null);
  const [detailedLoading, setDetailedLoading] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalReport, setTotalReport] = useState(null);
  const [totalLoading, setTotalLoading] = useState(false);

  const handleLogin = () => {
    if (password === "Melendez") {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDayReport = async () => {
    setDayLoading(true);
    try {
      const result = await serviceDayReport(formatDate(dayDate));
      setDayReport(result);
    } catch (error) {
      console.error("Error obteniendo reporte del día:", error);
      alert("Error obteniendo reporte del día");
    }
    setDayLoading(false);
  };

  const handleDetailedReport = async () => {
    setDetailedLoading(true);
    try {
      const result = await serviceDetailedReport(formatDate(detailedDate));
      setDetailedReport(result);
    } catch (error) {
      console.error("Error obteniendo reporte detallado:", error);
      alert("Error obteniendo reporte detallado");
    }
    setDetailedLoading(false);
  };

  const handleTotalReport = async () => {
    setTotalLoading(true);
    try {
      const result = await serviceTotalReport(formatDate(startDate), formatDate(endDate));
      setTotalReport(result);
    } catch (error) {
      console.error("Error obteniendo reporte total:", error);
      alert("Error obteniendo reporte total");
    }
    setTotalLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Acceso a Reportes de Ventas
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-500"
              placeholder="Ingrese la contraseña"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition duration-300"
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Reportes de Ventas
          </h1>
          
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("day")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "day" 
                    ? "bg-cyan-500 text-white" 
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                Venta del Día
              </button>
              <button
                onClick={() => setActiveTab("detailed")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "detailed" 
                    ? "bg-cyan-500 text-white" 
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                Venta Detallada
              </button>
              <button
                onClick={() => setActiveTab("total")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "total" 
                    ? "bg-cyan-500 text-white" 
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                Venta Total
              </button>
            </div>
          </div>

          {activeTab === "day" && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Venta del Día</h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-gray-700 font-medium">Seleccionar fecha:</label>
                <DatePicker
                  selected={dayDate}
                  onChange={(date) => setDayDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleDayReport}
                  disabled={dayLoading}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition duration-300 disabled:opacity-50"
                >
                  {dayLoading ? "Cargando..." : "Generar Reporte"}
                </button>
              </div>
              {dayReport && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">
                    Reporte del {formatDate(dayDate)}
                  </h3>
                  <p className="text-2xl font-bold text-cyan-600">
                    Total: {moneyFormat(dayReport.total || 0)}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "detailed" && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Venta Detallada</h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-gray-700 font-medium">Seleccionar fecha:</label>
                <DatePicker
                  selected={detailedDate}
                  onChange={(date) => setDetailedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleDetailedReport}
                  disabled={detailedLoading}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition duration-300 disabled:opacity-50"
                >
                  {detailedLoading ? "Cargando..." : "Generar Reporte"}
                </button>
              </div>
              {detailedReport && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4">
                    Reporte Detallado del {formatDate(detailedDate)}
                  </h3>
                  {detailedReport.details && detailedReport.details.length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-700 mb-2">Productos vendidos:</p>
                        <div className="space-y-2">
                          {detailedReport.details.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                              <span>{item.quantity} ({item.name})</span>
                              <span className="font-medium">{moneyFormat(item.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-xl font-bold text-cyan-600">
                          Total: {moneyFormat(detailedReport.total)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay ventas registradas para esta fecha.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "total" && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Venta Total</h2>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium">Fecha inicio:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium">Fecha fin:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={handleTotalReport}
                  disabled={totalLoading}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition duration-300 disabled:opacity-50"
                >
                  {totalLoading ? "Cargando..." : "Generar Reporte"}
                </button>
              </div>
              {totalReport && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">
                    Reporte Total del {totalReport.startDate} al {totalReport.endDate}
                  </h3>
                  <p className="text-2xl font-bold text-cyan-600">
                    Total: {moneyFormat(totalReport.total || 0)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
