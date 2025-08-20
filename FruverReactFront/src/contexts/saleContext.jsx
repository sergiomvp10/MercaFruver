import React, { createContext, useState } from "react";
import { serviceGetProductByBarcode } from "@/services/productsApi";

export const SaleContext = createContext("hola");

const SaleContextWrap = (props) => {

    const [sale, setSale] = useState()
  const [itemsSale, setItemsSale] = useState([]);
  const [pay, setPay] = useState("")

  const addItemSale = (
    e,
    name,
    price_purchase,
    price_sale,
    amount,
    ProductId
  ) => {
    console.log(e.key);
    if (e.key == "Enter") {
      setItemsSale([
        { name, price_purchase, price_sale, amount, ProductId },
        ...itemsSale,
      ]);
      e.target.value = "";
    }
  };

  const deleteItemSale = (item) => {
    const position = itemsSale.indexOf(item);
    console.log(position);
    const aux = [...itemsSale];
    console.log(aux.splice(position, 1));
    setItemsSale(aux);
  };

  const addItemSaleByBarcode = async (barcode) => {
    try {
      const response = await serviceGetProductByBarcode(barcode);
      const product = response.data;
      setItemsSale([
        { name: product.name, price_purchase: product.price_purchase, price_sale: product.price_sale, amount: 1, ProductId: product.id },
        ...itemsSale,
      ]);
    } catch (error) {
      console.error('Error al buscar producto por código de barras:', error);
    }
  };

  return (
    <SaleContext.Provider value={{itemsSale, setItemsSale, addItemSale, addItemSaleByBarcode, deleteItemSale, pay, setPay, sale,setSale}} >
      {props.children}
    </SaleContext.Provider>
  );
};

export default SaleContextWrap;
