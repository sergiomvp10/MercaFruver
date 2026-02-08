import React from "react";
import InputIcon from "./InputIcon";
import { u1F349 } from "react-icons-kit/noto_emoji_regular/u1F349";
import { u1F4C4 } from "react-icons-kit/noto_emoji_regular/u1F4C4";
import { u1F4B5 } from "react-icons-kit/noto_emoji_regular/u1F4B5";
import { u1F4B0 } from "react-icons-kit/noto_emoji_regular/u1F4B0";
import { u1F004 } from "react-icons-kit/noto_emoji_regular/u1F004";
import { u1F4F1 } from "react-icons-kit/noto_emoji_regular/u1F4F1";
import { useState } from "react";
import {serviceCreateProduct} from '../services/productsApi'
import Swal from "sweetalert2";

const CreateProduct = ({refetchingProducts, handleModal}) => {
  const [form, setForm] = useState({});
  
  const handleForm = (e) => {
    console.log(e.target.name)
    setForm({...form,[e.target.name]:e.target.value})
  };

  const createProduct = async(e) =>{
    await serviceCreateProduct(form);
    await refetchingProducts()
    handleModal()
    Swal.fire({
      icon:'success',
      title: "Producto creado con exito",
      width: 600,
      padding: "3em",
      // color: "#A3E635",
      confirmButtonColor: "#A3E635",

    });
  }

  return (
    <div className="flex h-128 flex-col justify-between">
      <div className="bg-lime-50 rounded-lg p-4 text-center text-2xl font-bold">
        Crear Producto
      </div>
      <div className="flex flex-col gap-2">
        <InputIcon
          placeholder={"nombre"}
          icon={u1F349}
          onChange={handleForm}
          name="name"
        />
        <InputIcon
          placeholder={"descripcion"}
          icon={u1F4C4}
          onChange={handleForm}
          name="description"
        />
        <InputIcon
          placeholder={"precio compra"}
          icon={u1F4B5}
          onChange={handleForm}
          name="price_purchase"
        />
        <InputIcon
          placeholder={"precio venta"}
          icon={u1F4B0}
          onChange={handleForm}
          name="price_sale"
        />
        <InputIcon
          placeholder={"stock"}
          icon={u1F004}
          onChange={handleForm}
          name="stock"
        />
        <InputIcon
          placeholder={"código de barras"}
          icon={u1F4F1}
          onChange={handleForm}
          name="barcode"
        />
        <div className="flex items-center gap-3 bg-lime-50 rounded-lg p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pesable || false}
              onChange={(e) => setForm({ ...form, pesable: e.target.checked, unit: e.target.checked ? 'kg' : 'unidad' })}
              className="w-5 h-5 accent-orange-400"
            />
            <span className="font-bold text-sm">Pesable</span>
          </label>
          {form.pesable && (
            <select
              value={form.unit || 'kg'}
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
      <div>
        <button onClick={createProduct} className="button w-full p-3 font-bold bg-orange-400 rounded-lg text-lime-50 cursor-pointer hover:scale-110 duration-200">
          Crear
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
