import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Icon from "react-icons-kit";

const MenuButton = (props) => {
  return (
    <motion.div
      transition={0.5}
      className="flex gap-5 items-center  text-cyan-50 py-2 px-4 hover:bg-cyan-500 cursor-pointer"
      onClick={props.onClick}
    >
      <div className="flex items-center justify-center content-center gap-2 w-full">
        <Icon icon={props.icon} size={20} />
        {props.fullContent && <div>{props.children}</div>}
      </div>
    </motion.div>
  );
};

export default MenuButton;
