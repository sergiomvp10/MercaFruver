import MenuButton from "@/components/MenuButton";
import React, { useState, useContext } from "react";
import { cartPlus } from "react-icons-kit/fa/cartPlus";
import { cube } from "react-icons-kit/fa/cube";
import { home } from "react-icons-kit/fa/home";
import { navicon } from "react-icons-kit/fa/navicon";
import { barChart } from "react-icons-kit/fa/barChart";
import { archive } from "react-icons-kit/fa/archive";
import { money } from "react-icons-kit/fa/money";
import { cog } from "react-icons-kit/fa/cog";
import { signOut } from "react-icons-kit/fa/signOut";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/authContext";

const routes = {
  home: "/",
  products: "/products",
  inventory: "/inventory",
  expenses: "/expenses",
  sales: "/sales",
  reports: "/reports",
  config: "/config",
};

const Menu = (props) => {
  const [showMenu, setShowMenu] = useState(true);
  const router = useRouter();
  const { user, logout, isAdmin } = useContext(AuthContext);

  const isActive = (path) => router.pathname === path;

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
        <div className="flex items-center justify-between p-4 border-b border-cyan-600">
          {showMenu && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold text-lg"
            >
              MercaFruver
            </motion.span>
          )}
          <MenuButton
            icon={navicon}
            onClick={() => setShowMenu(!showMenu)}
          ></MenuButton>
        </div>

        <nav className="flex flex-col flex-1 py-4">
          <div className="space-y-1">
            <Link href={routes.home}>
              <div className={isActive(routes.home) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                <MenuButton fullContent={showMenu} icon={home}>
                  Inicio
                </MenuButton>
              </div>
            </Link>
            <Link href={routes.products}>
              <div className={isActive(routes.products) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                <MenuButton fullContent={showMenu} icon={cube}>
                  Productos
                </MenuButton>
              </div>
            </Link>
            <Link href={routes.inventory}>
              <div className={isActive(routes.inventory) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                <MenuButton fullContent={showMenu} icon={archive}>
                  Inventario
                </MenuButton>
              </div>
            </Link>
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
            {isAdmin() && (
              <Link href={routes.config}>
                <div className={isActive(routes.config) ? "bg-cyan-600 rounded-r-lg mr-2" : ""}>
                  <MenuButton fullContent={showMenu} icon={cog}>
                    Configuracion
                  </MenuButton>
                </div>
              </Link>
            )}
          </div>
        </nav>

        <div className="border-t border-cyan-600">
          {showMenu && user && (
            <div className="p-4 pb-2">
              <p className="text-white font-semibold text-sm">{user.name}</p>
              <p className="text-cyan-300 text-xs">{user.role === 'admin' ? 'Administrador' : 'Empleado'}</p>
            </div>
          )}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-2 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            >
              <MenuButton icon={signOut} />
              {showMenu && <span className="text-sm">Cerrar Sesion</span>}
            </button>
          </div>
        </div>
      </motion.div>
      <div className="flex-1 bg-gray-50 overflow-auto">{props.children}</div>
    </div>
  );
};

export default Menu;
