import MenuButton from "@/components/MenuButton";
import React, { useState, useContext, useEffect } from "react";
import { apiFetch } from '@/utils/apiFetch';
import { exclamationTriangle } from "react-icons-kit/fa/exclamationTriangle";
import { cartPlus } from "react-icons-kit/fa/cartPlus";
import { cube } from "react-icons-kit/fa/cube";
import { home } from "react-icons-kit/fa/home";
import { navicon } from "react-icons-kit/fa/navicon";
import { barChart } from "react-icons-kit/fa/barChart";
import { archive } from "react-icons-kit/fa/archive";
import { money } from "react-icons-kit/fa/money";
import { cog } from "react-icons-kit/fa/cog";
import { signOut } from "react-icons-kit/fa/signOut";
import { calculator } from "react-icons-kit/fa/calculator";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/authContext";

const routes = {
  home: "/",
  products: "/products",
  inventory: "/inventory",
  invoice: "/invoice",
  expenses: "/expenses",
  sales: "/sales",
  reports: "/reports",
  stockAlerts: "/stock-alerts",
  config: "/config",
};

const CASH_DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];

const Menu = (props) => {
  const [showMenu, setShowMenu] = useState(true);
  const [showCashClose, setShowCashClose] = useState(false);
  const [cashCounts, setCashCounts] = useState({});
  const [cashCloseResult, setCashCloseResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const router = useRouter();
  const { user, logout, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await apiFetch('/api/products/low-stock');
        const data = await res.json();
        setLowStockCount(data.length);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 60000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => router.pathname === path;

  const calculateCashTotal = () => {
    return CASH_DENOMINATIONS.reduce((sum, denom) => {
      return sum + (parseInt(cashCounts[denom]) || 0) * denom;
    }, 0);
  };

  const openCashClose = () => {
    setCashCounts({});
    setCashCloseResult(null);
    setShowCashClose(true);
  };

  const handleCashCountChange = (denom, value) => {
    setCashCounts(prev => ({
      ...prev,
      [denom]: value
    }));
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

    const handleCashCloseSubmit = async () => {
      if (!user) return;
      setIsSubmitting(true);
      try {
        const response = await apiFetch('/api/cashclose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            cashTotal: calculateCashTotal(),
            denominations: cashCounts
          })
        });
        const data = await response.json();
        setCashCloseResult(data);
        setTimeout(async () => {
          await logout();
          router.push('/login');
        }, 2000);
      } catch (error) {
        alert('Error al registrar cierre de caja');
      }
      setIsSubmitting(false);
    };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ width: showMenu ? 240 : "auto" }}
        animate={{ width: showMenu ? 240 : "auto" }}
        transition={{ duration: 0.3 }}
        className="flex flex-col bg-gradient-to-b from-cyan-700 to-cyan-800 h-full shadow-lg"
      >
        <div className="flex items-center justify-between p-3 border-b border-cyan-600">
          {showMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex justify-center"
            >
              <img src="/images/logo-mercafruver.png" alt="MercaFruver" className="h-16 object-contain" />
            </motion.div>
          )}
          <MenuButton
            icon={navicon}
            onClick={() => setShowMenu(!showMenu)}
          ></MenuButton>
        </div>

        <nav className="flex flex-col flex-1 py-2 justify-evenly">
          <div className="flex flex-col justify-evenly flex-1">
            <Link href={routes.home}>
              <div className={isActive(routes.home) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                <MenuButton fullContent={showMenu} icon={home}>
                  Inicio
                </MenuButton>
              </div>
            </Link>
            {isAdmin() && (
              <Link href={routes.products}>
                <div className={isActive(routes.products) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                  <MenuButton fullContent={showMenu} icon={cube}>
                    Productos
                  </MenuButton>
                </div>
              </Link>
            )}
            <Link href={isAdmin() ? routes.inventory : routes.invoice}>
              <div className={isActive(isAdmin() ? routes.inventory : routes.invoice) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                <MenuButton fullContent={showMenu} icon={archive}>
                  {isAdmin() ? 'Inventario' : 'Registrar Factura'}
                </MenuButton>
              </div>
            </Link>
                        <div onClick={openCashClose} className="cursor-pointer">
                          <MenuButton fullContent={showMenu} icon={calculator}>
                            Cerrar Caja
                          </MenuButton>
                        </div>
                        {isAdmin() && (
              <>
                <Link href={routes.expenses}>
                  <div className={isActive(routes.expenses) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                    <MenuButton fullContent={showMenu} icon={money}>
                      Gastos
                    </MenuButton>
                  </div>
                </Link>
                <Link href={routes.sales}>
                  <div className={isActive(routes.sales) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                    <MenuButton fullContent={showMenu} icon={cartPlus}>
                      Ventas
                    </MenuButton>
                  </div>
                </Link>
                <Link href={routes.reports}>
                  <div className={isActive(routes.reports) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                    <MenuButton fullContent={showMenu} icon={barChart}>
                      Reportes
                    </MenuButton>
                  </div>
                </Link>
                <Link href={routes.stockAlerts}>
                  <div className={isActive(routes.stockAlerts) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                    <MenuButton fullContent={showMenu} icon={exclamationTriangle}>
                      Alerta Stock{lowStockCount > 0 && showMenu ? ` (${lowStockCount})` : ''}
                    </MenuButton>
                  </div>
                </Link>
                <Link href={routes.config}>
                  <div className={isActive(routes.config) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                    <MenuButton fullContent={showMenu} icon={cog}>
                      Configuracion
                    </MenuButton>
                  </div>
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="border-t border-cyan-600 p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
          >
            <MenuButton icon={signOut} />
            {showMenu && <span className="text-sm">{user?.name || 'Cerrar Sesion'} - Salir</span>}
          </button>
        </div>
      </motion.div>
      <div className="flex-1 bg-gray-50 overflow-auto">{props.children}</div>

      {showCashClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-h-[90vh] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Cerrar Caja</h3>
              <button
                onClick={() => setShowCashClose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

                        {!cashCloseResult ? (
                          <>
                            <div className="flex-1 overflow-y-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-cyan-100">
                                    <th className="p-2 text-left">Denominación</th>
                                    <th className="p-2 text-center w-24">Cantidad</th>
                                    <th className="p-2 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {CASH_DENOMINATIONS.map((denom) => (
                                    <tr key={denom} className="border-b">
                                      <td className="p-2 font-medium">{formatMoney(denom)}</td>
                                      <td className="p-2">
                                        <input
                                          type="number"
                                          min="0"
                                          value={cashCounts[denom] || ''}
                                          onChange={(e) => handleCashCountChange(denom, e.target.value)}
                                          className="w-full p-2 border rounded text-center"
                                          placeholder="0"
                                        />
                                      </td>
                                      <td className="p-2 text-right font-medium">
                                        {formatMoney((parseInt(cashCounts[denom]) || 0) * denom)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between items-center text-xl">
                                <span className="font-bold">TOTAL EN CAJA:</span>
                                <span className="font-bold text-green-600 text-2xl">{formatMoney(calculateCashTotal())}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="font-bold text-xl text-green-700 mb-2">Cierre de Caja Exitoso</h4>
                            <p className="text-green-600">El cierre de caja ha sido registrado correctamente.</p>
                          </div>
                        )}

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setShowCashClose(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition font-medium"
                    >
                      Cerrar
                    </button>
                    {!cashCloseResult && (
                      <button
                        onClick={handleCashCloseSubmit}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registrando...' : 'Confirmar Cierre'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default Menu;
