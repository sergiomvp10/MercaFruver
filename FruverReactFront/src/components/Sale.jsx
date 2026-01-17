import React, { useState } from "react";
import ItemSale from "./ItemSale";
import { totalSale } from "@/utilities/calculates";
import { moneyFormat } from "@/utilities/formats";
import Link from "next/link";
import { serviceMakeSale } from "@/services/productsApi";

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000];

const Sale = ({ itemsSale, deleteItemSale, setPay, setSale, clearSale }) => {
  const [valuePay, setValuePay] = useState();
  const [showPayModal, setShowPayModal] = useState(false);
  const [denominationCounts, setDenominationCounts] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkPay = async () => {
    const sale = await serviceMakeSale(itemsSale,1)
    valuePay == undefined ? setPay(totalSale(itemsSale)) : setPay(valuePay);
    setSale(sale.id)
  };

  const total = totalSale(itemsSale);

  const calculateTotalPaid = () => {
    return DENOMINATIONS.reduce((sum, denom) => {
      return sum + (denominationCounts[denom] || 0) * denom;
    }, 0);
  };

  const totalPaid = calculateTotalPaid();
  const change = totalPaid - total;

  const incrementDenomination = (denom) => {
    setDenominationCounts(prev => ({
      ...prev,
      [denom]: (prev[denom] || 0) + 1
    }));
  };

  const openPayModal = () => {
    setDenominationCounts({});
    setShowPayModal(true);
  };

  const confirmPayment = async () => {
    if (itemsSale.length === 0) return;
    
    setIsProcessing(true);
    try {
      const sale = await serviceMakeSale(itemsSale, 1);
      setValuePay(totalPaid);
      setPay(totalPaid);
      setSale(sale.id);
      
      setConfirmationData({
        total: total,
        paid: totalPaid,
        change: change
      });
      
      setShowPayModal(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
    setDenominationCounts({});
    if (clearSale) {
      clearSale();
    }
  };

  return (
    <div className="bg-cyan-600 p-4 rounded-lg w-full h-full flex flex-col justify-between gap-4">
      <div className="bg-cyan-300 rounded-lg w-full p-2 py-4 text-center font-bold text-lg">
        Venta
      </div>
      <div className="items flex-1 overflow-y-auto flex flex-col gap-2">
        {itemsSale.map((item, index) => (
          <ItemSale
            key={index}
            item={item}
            deleteItemSale={deleteItemSale}
          ></ItemSale>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="details flex items-center bg-cyan-400 p-3 rounded-lg gap-3">
          <div className="bg-cyan-200 rounded-lg p-2 px-3 font-bold whitespace-nowrap">Total</div>
          <div className="bg-cyan-200 rounded-lg p-2 flex-1">
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Pago"
              value={valuePay}
              onChange={(e) => setValuePay(e.target.value)}
            />
          </div>
          <div className="bg-cyan-200 rounded-lg p-2 whitespace-nowrap">
            {moneyFormat(total)}
          </div>
        </div>
        <div>
          <button
            onClick={openPayModal}
            className="bg-green-400 w-full rounded-lg py-2 cursor-pointer hover:scale-105 duration-300 border-4 border-green-500 font-bold mb-2"
          >
            Pagar
          </button>
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

      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Calcular Pago</h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-cyan-100 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total a pagar:</span>
                <span className="font-bold text-cyan-700">{moneyFormat(total)}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="font-semibold text-gray-700 mb-2">Denominaciones:</p>
              <div className="grid grid-cols-4 gap-2">
                {DENOMINATIONS.map((denom) => (
                  <button
                    key={denom}
                    onClick={() => incrementDenomination(denom)}
                    className="bg-cyan-500 text-white px-3 py-2 rounded font-bold hover:bg-cyan-600 transition text-sm"
                  >
                    {moneyFormat(denom)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-bold text-green-600">{moneyFormat(totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-bold">{moneyFormat(total)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Cambio:</span>
                <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {moneyFormat(Math.abs(change))}
                  {change < 0 && ' (Falta)'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPayment}
                disabled={totalPaid < total || isProcessing || itemsSale.length === 0}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  totalPaid >= total && !isProcessing && itemsSale.length > 0
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && confirmationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">Venta Registrada</h3>
            <p className="text-gray-600 mb-4">La venta se ha registrado exitosamente y el stock ha sido actualizado.</p>
            
            <div className="bg-gray-100 rounded-lg p-4 space-y-2 text-left mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de la venta:</span>
                <span className="font-bold">{moneyFormat(confirmationData.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pago recibido:</span>
                <span className="font-bold text-green-600">{moneyFormat(confirmationData.paid)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Cambio a entregar:</span>
                <span className="font-bold text-cyan-600">{moneyFormat(confirmationData.change)}</span>
              </div>
            </div>
            
            <button
              onClick={closeConfirmation}
              className="w-full px-4 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;
