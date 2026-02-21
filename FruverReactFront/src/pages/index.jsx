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

  const scanBufferRef = useRef('');
  const scanTimerRef = useRef(null);
  const lastScanKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastScanKeyTimeRef.current;

      if (/^\d$/.test(e.key)) {
        if (timeDiff < 100 || scanBufferRef.current.length === 0) {
          scanBufferRef.current += e.key;
        } else {
          scanBufferRef.current = e.key;
        }
        lastScanKeyTimeRef.current = now;

        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => {
          scanBufferRef.current = '';
        }, 300);
      } else if (e.key === 'Enter' && /^\d{8,13}$/.test(scanBufferRef.current)) {
        e.preventDefault();
        e.stopPropagation();
        const barcode = scanBufferRef.current;
        scanBufferRef.current = '';
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

        const active = document.activeElement;
        if (active && active.tagName === 'INPUT') {
          active.value = '';
        }
        setSearchValue('');

        contextSale.addItemSaleByBarcode(barcode);
      } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
        scanBufferRef.current = '';
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [contextSale]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = searchValue.trim();
      if (/^\d{4,13}$/.test(val)) {
        e.preventDefault();
        contextSale.addItemSaleByBarcode(val);
        setSearchValue('');
      }
    }
  }

  const handleAddItem = (e, product) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.target.value;
      if (/^\d{8,}$/.test(val)) {
        e.target.value = '';
        return;
      }
      const amount = product.pesable ? parseFloat(val) : parseInt(val);
      if (!amount || amount <= 0) {
        e.target.value = '';
        return;
      }
      e.target.value = '';
      contextSale.addItemSale(
        product.name,
        product.price_purchase,
        product.price_sale,
        amount,
        product.id
      );
      setSearchValue('');
    }
  }


  return (
    <Menu>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="bg-gradient-to-b from-cyan-700 to-cyan-800 p-4 text-center font-bold text-2xl text-white flex-shrink-0">
                Inicio
              </div>
              <div className="flex flex-1 w-full gap-4 p-4 overflow-hidden">
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  <div className="p-3 flex-shrink-0">
                    <InputIcon
                      value={searchValue}
                      placeholder={"Search..."}
                      icon={u1F50D}
                      onChange={handleSearch}
                      onKeyDown={handleSearchKeyDown}
                    ></InputIcon>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-2">
                    <div className="grid grid-cols-7 gap-10 max-w-2xl min-w-full items-center text-center px-2 py-2 text-white bg-cyan-600 rounded-lg font-semibold">
                      <div className="col-span-2 text-left">Articulo</div>
                      <div>Categoria</div>
                      <div>Precio</div>
                      <div>Stock</div>
                      <div className="col-span-2"></div>
                    </div>
                    {!loading && data &&
                      data
                        .filter(
                          (product) =>
                            product.name
                              .toLowerCase()
                              .indexOf(searchValue.toLowerCase()) > -1 ||
                            (product.barcode && product.barcode.indexOf(searchValue) > -1)
                        )
                        .map((product) => (
                          <ItemProduct
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price_sale={product.price_sale}
                            stock={product.stock}
                            price_purchase={product.price_purchase}
                            barcode={product.barcode}
                            pesable={product.pesable}
                            unit={product.unit}
                            actions={{ input: true, edit: false }}
                            refetchingProducts={refetching}
                            onKeyDown={(e) => handleAddItem(e, product)}
                          ></ItemProduct>
                        ))}
                  </div>
                </div>
                <div className="w-80 flex-shrink-0">
                  <Sale itemsSale={contextSale.itemsSale} deleteItemSale={contextSale.deleteItemSale} setPay={contextSale.setPay} setSale={contextSale.setSale} clearSale={() => contextSale.setItemsSale([])} onSaleComplete={refetching}></Sale>
                </div>
              </div>
            </div>
    </Menu>
  );
}
