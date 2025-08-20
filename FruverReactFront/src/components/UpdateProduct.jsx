import React from "react";
import InputIcon from "./InputIcon";
import { u1F349 } from "react-icons-kit/noto_emoji_regular/u1F349";
import { u1F4C4 } from "react-icons-kit/noto_emoji_regular/u1F4C4";
import { u1F4B5 } from "react-icons-kit/noto_emoji_regular/u1F4B5";
import { u1F4B0 } from "react-icons-kit/noto_emoji_regular/u1F4B0";
import { u1F004 } from "react-icons-kit/noto_emoji_regular/u1F004";
import { u1F4F1 } from "react-icons-kit/noto_emoji_regular/u1F4F1";
import { useState } from "react";
import { serviceUpdateProduct } from "@/services/productsApi";
import Swal from "sweetalert2";

const UpdateProduct = ({
  refetchingProducts,
  handleModal,
  id,
  name,
  description,
  price_purchase,
  price_sale,
  stock,
  barcode,
}) => {
  const [form, setForm] = useState({
    id,
    name,
    description,
    price_purchase,
    price_sale,
    stock,
    barcode,
  });

  const handleForm = (e) => {
    console.log(e.target.name);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProduct = async (e) => {
    await serviceUpdateProduct(form);
    await refetchingProducts();
    handleModal();
    Swal.fire({
      icon: "success",
      title: "Producto actualizado con exito",
      width: 600,
      padding: "3em",
      // color: "#A3E635",
      confirmButtonColor: "#A3E635",
    });
  };

  return (
    <div className="flex h-128 flex-col justify-between">
      <div className="bg-lime-50 rounded-lg p-4 text-center text-2xl font-bold">
        Actualizar Producto
      </div>
      <div className="flex flex-col gap-2">
        <InputIcon
          placeholder={"nombre"}
          icon={u1F349}
          onChange={handleForm}
          name="name"
          value={form.name}
        />
        <InputIcon
          placeholder={"descripcion"}
          icon={u1F4C4}
          onChange={handleForm}
          name="description"
          value={form.description}
        />
        <InputIcon
          placeholder={"precio compra"}
          icon={u1F4B5}
          onChange={handleForm}
          name="price_purchase"
          value={form.price_purchase}
        />
        <InputIcon
          placeholder={"precio venta"}
          icon={u1F4B0}
          onChange={handleForm}
          name="price_sale"
          value={form.price_sale}
        />
        <InputIcon
          placeholder={"stock"}
          icon={u1F004}
          onChange={handleForm}
          name="stock"
          value={form.stock}
        />
        <InputIcon
          placeholder={"código de barras"}
          icon={u1F4F1}
          onChange={handleForm}
          name="barcode"
          value={form.barcode || ''}
        />
      </div>
      <div>
        <button
          onClick={updateProduct}
          className="button w-full p-3 font-bold bg-orange-400 rounded-lg text-lime-50 cursor-pointer hover:scale-110 duration-200"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
