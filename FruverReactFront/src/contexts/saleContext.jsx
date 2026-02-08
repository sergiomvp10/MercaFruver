import React, { createContext, useState } from "react";
import { serviceGetProductByBarcode } from "@/services/productsApi";

export const SaleContext = createContext("hola");

const SaleContextWrap = (props) => {

    const [sale, setSale] = useState()
  const [itemsSale, setItemsSale] = useState([]);
  const [pay, setPay] = useState("")

  const addItemSale = (
    name,
    price_purchase,
    price_sale,
    amount,
    ProductId
  ) => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    setItemsSale(prev => [
      { name, price_purchase, price_sale, amount: parsedAmount, ProductId },
      ...prev,
    ]);
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
      setItemsSale(prev => [
        { name: product.name, price_purchase: product.price_purchase, price_sale: product.price_sale, amount: 1, ProductId: product.id },
        ...prev,
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
