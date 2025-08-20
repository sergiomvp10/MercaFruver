import React, { useContext, useEffect, useRef, useState } from "react";
import Menu from "@/layouts/Menu";
import ItemProduct from "@/components/ItemProduct";
import useFetch from "@/hooks/useFetch";
import InputIcon from "@/components/InputIcon";
import { u1F50D } from "react-icons-kit/noto_emoji_regular/u1F50D";
import Sale from "@/components/Sale";
import { SaleContext } from "@/contexts/saleContext";


export default function Home() {
   const { data, refetching, loading, error } = useFetch({
    endpoint: "products",
    method: "GET",
    body: {},
  });


  const contextSale = useContext(SaleContext);
  const [searchValue,setSearchValue] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')

  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      if (barcodeInput.length === 13) {
        contextSale.addItemSaleByBarcode(barcodeInput);
        setBarcodeInput('');
      }
    } else if (e.key.length === 1 && /\d/.test(e.key)) {
      setBarcodeInput(prev => prev + e.key);
    }
  };


  console.log("Este es",contextSale)
  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    console.log(e.target.value)
  }


  return (
    <Menu>
      <input
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        onKeyDown={handleBarcodeInput}
        autoFocus
      />
      <div className="h-full flex flex-col relative">
        <div className="bg-cyan-400 p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <img src="/images/logo.jpg" alt="MY FRUVER" className="h-12 w-auto object-contain" />
            <h1 className="font-bold text-2xl text-white">Inicio</h1>
          </div>
        </div>
        <div className="flex h-full w-full justify-evenly">
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
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      price_sale={product.price_sale}
                      stock={product.stock}
                      price_purchase={product.price_purchase}
                      barcode={product.barcode}
                      actions={{ input: true, edit: true }}
                      refetchingProducts={refetching}
                      onKeyDown={(e) =>
                        contextSale.addItemSale(
                          e,
                          product.name,
                          product.price_purchase,
                          product.price_sale,
                          e.target.value,
                          product.id
                        )
                      }
                    ></ItemProduct>
                  ))}
            </div>
          </div>
          <div className="grid place-content-center">
            <Sale itemsSale={contextSale.itemsSale} deleteItemSale={contextSale.deleteItemSale} setPay={contextSale.setPay} setSale={contextSale.setSale}></Sale>
          </div>
        </div>
      </div>
    </Menu>
  );
}
