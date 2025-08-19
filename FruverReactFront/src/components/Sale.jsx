import React, { useState } from "react";
import ItemSale from "./ItemSale";
import { totalSale } from "@/utilities/calculates";
import { moneyFormat } from "@/utilities/formats";
import Link from "next/link";
import { serviceMakeSale } from "@/services/productsApi";

const Sale = ({ itemsSale, deleteItemSale, setPay, setSale }) => {
  const [valuePay, setValuePay] = useState();

  const checkPay = async () => {
    const sale = await serviceMakeSale(itemsSale,1)
    valuePay == undefined ? setPay(totalSale(itemsSale)) : setPay(valuePay);
    setSale(sale.id)
  };

  return (
    <div className="bg-cyan-600 p-4 rounded-lg w-96 flex flex-col justify-between h-138 gap-10">
      <div className="bg-cyan-300 rounded-lg w-full p-2 py-4 text-center font-bold text-lg">
        Venta
      </div>
      <div className="items overflow-y-scroll flex flex-col gap-2">
        {itemsSale.map((item, index) => (
          <ItemSale
            key={index}
            item={item}
            deleteItemSale={deleteItemSale}
          ></ItemSale>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="details flex justify-between bg-cyan-400 p-3 rounded-lg gap-10">
          <div className="bg-cyan-200 rounded-lg p-2 px-3 font-bold">Total</div>
          <div className="bg-cyan-200 rounded-lg p-2">
            <input
              className="w-full"
              type="text"
              placeholder=" Pago"
              value={valuePay}
              onChange={(e) => setValuePay(e.target.value)}
            />
          </div>
          <div className="bg-cyan-200 rounded-lg p-2">
            {moneyFormat(totalSale(itemsSale))}
          </div>
        </div>
        <div>
          <Link href={{pathname:"/bill"}} >
            <button
              onClick={checkPay}
              className="bg-cyan-200 w-full rounded-lg py-2 cursor-pointer hover:scale-105 duration-300 border-4 border-cyan-300 font-bold"
            >
              Imprimir
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
