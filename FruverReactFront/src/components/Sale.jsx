import React, { useState, useContext, useRef } from "react";
import ItemSale from "./ItemSale";
import { totalSale } from "@/utilities/calculates";
import { moneyFormat } from "@/utilities/formats";
import Link from "next/link";
import { serviceMakeSale } from "@/services/productsApi";
import { AuthContext } from "@/contexts/authContext";

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];

const Sale = ({ itemsSale, deleteItemSale, setPay, setSale, clearSale, onSaleComplete }) => {
  const [valuePay, setValuePay] = useState();
  const [showPayModal, setShowPayModal] = useState(false);
    const [denominationCounts, setDenominationCounts] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('EFECTIVO');
    const [saleConfirmed, setSaleConfirmed] = useState(false);
    const processingLockRef = useRef(false);
  const { user } = useContext(AuthContext);

  const prepareForPrint = () => {
    valuePay == undefined ? setPay(totalSale(itemsSale)) : setPay(valuePay);
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
      setSelectedPaymentMethod('EFECTIVO');
      setShowPayModal(true);
    };

    const confirmPayment = async () => {
      if (itemsSale.length === 0 || processingLockRef.current) return;
      processingLockRef.current = true;
    
      setIsProcessing(true);
      try {
        const sale = await serviceMakeSale(itemsSale, user?.id || 1, selectedPaymentMethod);
      const paidAmount = selectedPaymentMethod === 'BRE-B' ? total : totalPaid;
      setValuePay(paidAmount);
      setPay(paidAmount);
      setSale(sale.id);
      
      setSaleConfirmed(true);
      setConfirmationData({
        total: total,
        paid: paidAmount,
        change: selectedPaymentMethod === 'BRE-B' ? 0 : change,
        paymentMethod: selectedPaymentMethod
      });
      
      setShowPayModal(false);
      setShowConfirmation(true);
                } catch (error) {
                  console.error('Error al registrar la venta:', error);
                  processingLockRef.current = false;
                } finally {
      setIsProcessing(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
    setDenominationCounts({});
    setSaleConfirmed(false);
    processingLockRef.current = false;
    if (clearSale) {
      clearSale();
    }
    if (onSaleComplete) {
      onSaleComplete();
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-700 to-cyan-800 p-4 rounded-lg w-full h-full flex flex-col justify-between gap-4">
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
            disabled={saleConfirmed || itemsSale.length === 0}
            className={`w-full rounded-lg py-2 cursor-pointer hover:scale-105 duration-300 border-4 font-bold mb-2 ${saleConfirmed || itemsSale.length === 0 ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-green-400 border-green-500'}`}
          >
            Pagar
          </button>
          <Link href={{pathname:"/bill"}} >
            <button
              onClick={prepareForPrint}
              disabled={!saleConfirmed}
              className={`w-full rounded-lg py-2 cursor-pointer hover:scale-105 duration-300 border-4 font-bold ${!saleConfirmed ? 'bg-gray-300 border-gray-400 cursor-not-allowed' : 'bg-cyan-200 border-cyan-300'}`}
            >
              Imprimir
            </button>
          </Link>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col w-full sm:w-[95%] sm:max-w-md" style={{maxHeight: 'calc(100vh - 10px)', maxHeight: 'calc(100dvh - 10px)'}}>
            <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0">
              <h3 className="text-base font-bold text-gray-800">Calcular Pago</h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2" style={{minHeight: 0}}>
              <div className="bg-cyan-100 rounded-lg p-2 mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs">Total a pagar:</span>
                  <span className="font-bold text-cyan-700 text-base">{moneyFormat(total)}</span>
                </div>
              </div>

              <p className="font-semibold text-gray-700 text-xs mb-1">Denominaciones:</p>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {DENOMINATIONS.map((denom) => (
                  <button
                    key={denom}
                    onClick={() => incrementDenomination(denom)}
                    className="bg-cyan-500 text-white px-1 py-1.5 rounded-md font-bold hover:bg-cyan-600 transition text-[11px]"
                  >
                    {moneyFormat(denom)}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedPaymentMethod(selectedPaymentMethod === 'BRE-B' ? 'EFECTIVO' : 'BRE-B')}
                  className={`px-1 py-1.5 rounded-md font-bold transition text-[11px] ${
                    selectedPaymentMethod === 'BRE-B'
                      ? 'bg-purple-700 text-white ring-2 ring-purple-300'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  BRE-B
                </button>
              </div>

              <div className="bg-gray-100 rounded-lg p-2 space-y-0.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total pagado:</span>
                  <span className="font-bold text-green-600">
                    {selectedPaymentMethod === 'BRE-B' ? moneyFormat(total) : moneyFormat(totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="font-bold">{moneyFormat(total)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs">{selectedPaymentMethod === 'BRE-B' ? 'Método:' : 'Cambio:'}</span>
                  <span className={`font-bold text-sm ${selectedPaymentMethod === 'BRE-B' ? 'text-purple-600' : (change >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                    {selectedPaymentMethod === 'BRE-B' ? 'Transferencia' : (
                      <>
                        {moneyFormat(Math.abs(change))}
                        {change < 0 && ' (Falta)'}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-3 py-2 border-t flex-shrink-0">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 px-2 py-2 bg-red-100 border border-red-300 rounded-lg text-red-600 hover:bg-red-200 transition font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPayment}
                disabled={(selectedPaymentMethod === 'EFECTIVO' && totalPaid < total) || isProcessing || saleConfirmed || itemsSale.length === 0}
                className={`flex-1 px-2 py-2 rounded-lg font-medium transition text-sm ${
                  ((selectedPaymentMethod === 'BRE-B') || (selectedPaymentMethod === 'EFECTIVO' && totalPaid >= total)) && !isProcessing && !saleConfirmed && itemsSale.length > 0
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
                        <p className="text-gray-600 mb-4">
                          La venta se ha registrado exitosamente y el stock ha sido actualizado.
                          {confirmationData.paymentMethod === 'BRE-B' && (
                            <span className="block mt-2 text-purple-600 font-semibold">Pago por transferencia (BRE-B)</span>
                          )}
                        </p>
            
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
            
            <div className="flex gap-2">
              <Link href={{pathname:"/bill"}}>
                <button
                  onClick={() => { prepareForPrint(); closeConfirmation(); }}
                  className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
                >
                  Imprimir
                </button>
              </Link>
              <button
                onClick={closeConfirmation}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sale;
