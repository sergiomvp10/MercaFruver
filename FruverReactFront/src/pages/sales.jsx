import React from "react";
import Menu from "@/layouts/Menu";
import useFetch from "@/hooks/useFetch";
import { moneyFormat } from "@/utilities/formats";

const Sales = () => {
  const { data, refetching, loading, error } = useFetch({
    endpoint: "sales/day",
    method: "GET",
    body: {},
  });

  console.log(data);

  return (
    <Menu>
      <div className="flex justify-center items-center h-full ">
        <div className="flex flex-col text-center bg-cyan-100 w-6/12 h-2/5 rounded-3xl justify-center items-center overflow-hidden hover:scale-110 cursor-pointer duration-200">
          <div
            className="text-white flex h-1/4 items-center justify-center font-bold bg-cyan-600 w-full text-2xl
          "
          >
            VENTA DEL DIA
          </div>
          <div className="flex justify-center items-center h-full text-xl">
            {/*data && data.total != null
              ? moneyFormat(data.total)
  : moneyFormat(0)*/}
          </div>
        </div>
      </div>
    </Menu>
  );
};

export default Sales;
