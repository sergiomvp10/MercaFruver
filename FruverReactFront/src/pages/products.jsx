"use client";

import React, { useEffect, useRef, useState } from "react";
import Menu from "@/layouts/Menu";
import ItemProduct from "@/components/ItemProduct";
import { plus } from "react-icons-kit/entypo/plus";
import Icon from "react-icons-kit";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import CreateProduct from "@/components/CreateProduct";
import useFetch from "@/hooks/useFetch";
import InputIcon from "@/components/InputIcon";
import { u1F50D } from "react-icons-kit/noto_emoji_regular/u1F50D";

const Products = () => {

  const { data, refetching, loading, error } = useFetch({
    endpoint: "products",
    method: "GET",
    body: {},
  });
  const ref = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue,setSearchValue] = useState('')

  console.log(loading,data)

  const handleCreateProduct = () => {
    setOpenModal(!openModal);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    console.log(e.target.value)
  }

  useEffect(() => {
    ref.current = document.querySelector("#portal");
  }, []);

  return (
    <Menu>
      {ref?.current != null &&
        openModal &&
        createPortal(
          <Modal handleModal={() => setOpenModal(!openModal)}>
            <CreateProduct
              refetchingProducts={refetching}
              handleModal={() => setOpenModal(!openModal)}
            />
          </Modal>,
          ref.current
        )}
      <div className="h-full flex flex-col relative">
        <div className="bg-lime-400 p-4 text-center font-bold text-2xl">
          Productos
        </div>
        <div className="h-full grid gap-10 place-content-center">
          <div className="bg-lime-400 p-3 rounded-lg">
            <InputIcon
              value={searchValue}
              placeholder={"Search..."}
              icon={u1F50D}
              onChange={handleSearch}
            ></InputIcon>
          </div>
          <div className="flex flex-col gap-2 overflow-y-scroll max-h-128 bg-lime-400 p-5 rounded-lg">
            {!loading && data &&
              data
                .filter(
                  (product) =>
                    product.name
                      .toLowerCase()
                      .indexOf(searchValue.toLowerCase()) > -1
                )
                .map((product) => (
                  <ItemProduct
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price_sale={product.price_sale}
                    stock={product.stock}
                    price_purchase={product.price_purchase}
                    actions={{ delete: true, edit: true }}
                    refetchingProducts={refetching}
                  ></ItemProduct>
                ))}
          </div>
        </div>
        <div className="absolute right-20 bottom-20 shadow-2xl w-16 h-16 rounded-full">
          <button
            onClick={handleCreateProduct}
            className="group rounded-full ease-in bg-lime-400 w-16 h-16 shadow-2xl hover:scale-125 duration-300 hover:bg-orange-400"
          >
            <Icon icon={plus} size={20}></Icon>
            <span
              className="group-hover:opacity-100 ease-in delay-100 transition-opacity bg-gray-800 px-1 text-xs text-gray-100 rounded-md absolute left-1/2 
            -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
            >
              Crear Producto
            </span>
          </button>
        </div>
      </div>
    </Menu>
  );
};

export default Products;
