import { SaleContext } from "@/contexts/saleContext";
import { moneyFormat } from "@/utilities/formats";
import React, { useContext, useEffect, useState } from "react";
import { totalSale } from "@/utilities/calculates";

const Bill = () => {
  const contextSale = useContext(SaleContext);
  const [items, setItems] = useState(contextSale.itemsSale);

  useEffect(() => {
    contextSale.setItemsSale([]);
    contextSale.pay == "" && contextSale.setPay(totalSale(items));
  }, []);
  console.log(contextSale);
  console.log(items);

  return (
    <div className="w-72 pr-2">
      <section className="w-4/5 flex flex-col justify-center items-center">
        <img className="scale-150" src="/images/logofactura.png" alt="" />
        <br />
        <br />
        <div>Nayibe Alarcon Parada</div>
        <div>C.C 46454129</div>
        <div>Calle 16 # 12 -26</div>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <div>
          {" "}
          <span className="font-bold">FECHA:</span>{" "}
          {new Date(Date.now()).toLocaleString()}
        </div>
        <div>
          <span className="font-bold">CLIENTE:</span>{" "}
          <input type="" placeholder="Ventas D." />{" "}
        </div>
        <div>
          <span className="font-bold">NIT/CC:</span>{" "}
          <input type="" placeholder="N/A" />{" "}
        </div>
        <div>
          <span className="font-bold">DIR:</span>{" "}
          <input type="" placeholder="N/A" />{" "}
        </div>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <ul className="w-4/5">
          <li>
            <div className="grid grid-cols-3">
              <div className="font-bold">Producto</div>
              <div className="font-bold text-center">Cantidad</div>
              <div className="font-bold text-right">Total</div>
            </div>
          </li>
          {items.map((item) => (
            <li>
              <div className="grid grid-cols-3 gap-r align-middle">
                <div className="">{item.name}</div>
                <div className="text-center">{item.amount}</div>
                <div className="text-right">
                  {moneyFormat(item.amount * item.price_sale)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <div className="w-4/5 grid grid-cols-2 grid-rows-3">
          <div className="text-right font-bold">Valor Total : </div>{" "}
          <div className="text-right">{moneyFormat(totalSale(items))}</div>
          <div className="text-right font-bold">Cancelo : </div>{" "}
          <div className="text-right">
            {moneyFormat(parseInt(contextSale.pay))}
          </div>
          <div className="text-right font-bold">Cambio : </div>{" "}
          <div className="text-right">
            {moneyFormat(contextSale.pay - totalSale(items))}
          </div>
        </div>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <div>
          <span className="font-bold">CAJA No.</span> 1
        </div>
        <div>
          <span className="font-bold">CAJER@:</span> Adiela Alarcon
        </div>
        <div>
          <span className="font-bold">OBSERVACION:</span> N/A
        </div>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <div className="w-4/5 font-bold text-3xl text-center">
          GRACIAS POR TU COMPRA!!!
        </div>
      </section>
    </div>
  );
};

export default Bill;
