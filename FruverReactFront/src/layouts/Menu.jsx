import MenuButton from "@/components/MenuButton";
import React, { useState } from "react";
import { cartPlus } from "react-icons-kit/fa/cartPlus";
import { cube } from "react-icons-kit/fa/cube";
import { circleO } from "react-icons-kit/fa/circleO";
import { navicon } from "react-icons-kit/fa/navicon";
import { motion } from "framer-motion";
import Link from "next/link";

const routes = {
  home: "/",
  products: "/products",
  sales: "/sales",
};

const Menu = (props) => {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="flex h-screen">
      <div
        className={`flex flex-col bg-cyan-700 ${
          showMenu ? "w-60" : "w-auto"
        } h-full`}
      >
        <div className="justify-self-center w-full">
          <MenuButton
            icon={navicon}
            onClick={() => setShowMenu(!showMenu)}
          ></MenuButton>
        </div>

        <div className="flex flex-col justify-center h-full">
          <div>
            <Link href={routes.home}>
              <MenuButton fullContent={showMenu} icon={circleO}>
                Inicio
              </MenuButton>
            </Link>
            <Link href={routes.products}>
              <MenuButton fullContent={showMenu} icon={cube}>
                Productos
              </MenuButton>
            </Link>
            <Link href={routes.sales}>
              <MenuButton fullContent={showMenu} icon={cartPlus}>
                Ventas
              </MenuButton>
            </Link>
          </div>
        </div>
      </div>
      <div className=" flex-1 bg-red-50">{props.children}</div>
    </div>
  );
};

export default Menu;
