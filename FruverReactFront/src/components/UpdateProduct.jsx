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
  pesable,
  unit,
  min_stock,
}) => {
  const [form, setForm] = useState({
    id,
    name,
    description,
    price_purchase,
    price_sale,
    stock,
    barcode,
    pesable: pesable || false,
    unit: unit || 'unidad',
    min_stock: min_stock || 0,
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
    <div className="flex flex-col gap-3 p-2">
      <div className="bg-gradient-to-r from-lime-400 to-lime-500 rounded-xl p-3 text-center text-xl font-bold text-white shadow">
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
        <div className="grid grid-cols-2 gap-2">
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
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputIcon
            placeholder={"stock"}
            icon={u1F004}
            onChange={handleForm}
            name="stock"
            value={form.stock}
          />
          <div className="flex gap-2 bg-lime-50 px-3 py-2 rounded-lg items-center hover:scale-105">
            <span className="text-orange-400 font-bold text-sm">Min</span>
            <input
              name="min_stock"
              value={form.min_stock}
              className="focus:outline-none bg-transparent px-1 caret-black w-full"
              placeholder="stock minimo"
              type="number"
              min="0"
              onChange={handleForm}
            />
          </div>
        </div>
        <InputIcon
          placeholder={"codigo de barras"}
          icon={u1F4F1}
          onChange={handleForm}
          name="barcode"
          value={form.barcode || ''}
        />
        <div className="flex items-center gap-3 bg-lime-50 rounded-lg p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pesable}
              onChange={(e) => setForm({ ...form, pesable: e.target.checked, unit: e.target.checked ? 'kg' : 'unidad' })}
              className="w-5 h-5 accent-orange-400"
            />
            <span className="font-bold text-sm">Pesable</span>
          </label>
          {form.pesable && (
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="border rounded-lg border-black px-2 py-1 text-sm"
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="lb">Libras (lb)</option>
              <option value="gr">Gramos (gr)</option>
            </select>
          )}
        </div>
      </div>
      <button
        onClick={updateProduct}
        className="w-full p-3 font-bold bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl text-white cursor-pointer hover:scale-105 duration-200 shadow-lg"
      >
        Actualizar
      </button>
    </div>
  );
};

export default UpdateProduct;
