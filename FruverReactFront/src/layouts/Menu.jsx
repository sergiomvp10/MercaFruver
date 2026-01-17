import MenuButton from "@/components/MenuButton";
import React, { useState } from "react";
import { cartPlus } from "react-icons-kit/fa/cartPlus";
import { cube } from "react-icons-kit/fa/cube";
import { home } from "react-icons-kit/fa/home";
import { navicon } from "react-icons-kit/fa/navicon";
import { barChart } from "react-icons-kit/fa/barChart";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const routes = {
  home: "/",
  products: "/products",
  sales: "/sales",
  reports: "/reports",
};

const Menu = (props) => {
  const [showMenu, setShowMenu] = useState(true);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

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
          </div>
        </nav>

        {showMenu && (
          <div className="p-4 border-t border-cyan-600">
            <p className="text-cyan-200 text-xs text-center">
              Sistema de Ventas
            </p>
          </div>
        )}
      </motion.div>
      <div className="flex-1 bg-gray-50 overflow-auto">{props.children}</div>
    </div>
  );
};

export default Menu;
