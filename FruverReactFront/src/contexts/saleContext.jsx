import React, { createContext, useState } from "react";

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

  return (
    <SaleContext.Provider value={{itemsSale, setItemsSale, addItemSale, deleteItemSale, pay, setPay, sale,setSale}} >
      {props.children}
    </SaleContext.Provider>
  );
};

export default SaleContextWrap;
