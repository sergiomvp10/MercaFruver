import React, { useState, useContext } from "react";
import Menu from "@/layouts/Menu";
import useFetch from "@/hooks/useFetch";
import { moneyFormat } from "@/utilities/formats";
import axios from "axios";
import { AuthContext } from "@/contexts/authContext";

const API = process.env.NEXT_PUBLIC_API || "http://localhost:4000/api";

const Invoice = () => {
  const { user } = useContext(AuthContext);
  const { data: products, loading } = useFetch({
    endpoint: "products",
    method: "GET",
    body: {},
  });

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const searchFilteredProducts = products && productSearch.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 5)
    : [];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductDropdown(false);
    if (product.price_purchase) {
      setUnitCost(product.price_purchase.toString());
    }
  };

  const handleProductSearchChange = (e) => {
    setProductSearch(e.target.value);
    setSelectedProduct(null);
    setShowProductDropdown(e.target.value.length >= 2);
  };

  const addItem = () => {
    if (!selectedProduct || !quantity || quantity <= 0 || !unitCost || unitCost <= 0) {
      setError("Complete todos los campos del producto");
      return;
    }

    const existingIndex = items.findIndex(item => item.productId === selectedProduct.id);
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += parseInt(quantity);
      updatedItems[existingIndex].totalCost = updatedItems[existingIndex].quantity * updatedItems[existingIndex].unitCost;
      setItems(updatedItems);
    } else {
      setItems([...items, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: parseInt(quantity),
        unitCost: parseFloat(unitCost),
        totalCost: parseInt(quantity) * parseFloat(unitCost)
      }]);
    }

    setSelectedProduct(null);
    setProductSearch("");
    setQuantity("");
    setUnitCost("");
    setError("");
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCost = items.reduce((acc, item) => acc + item.totalCost, 0);

  const handleSubmit = async () => {
    if (!supplier.trim()) {
      setError("Ingrese el nombre del proveedor");
      return;
    }
    if (items.length === 0) {
      setError("Agregue al menos un producto");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      await axios.post(`${API}/invoices`, {
        supplier: supplier.trim(),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost
        })),
        userId: user?.id
      });

      setSuccess(true);
      setSupplier("");
      setItems([]);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al registrar la factura");
      console.error(err);
    }

    setProcessing(false);
  };

  return (
    <Menu>
      <div className="h-full flex flex-col">
        <div className="bg-purple-600 p-4 text-center font-bold text-2xl text-white shadow-md">
          Registrar Factura
        </div>

        <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Factura registrada exitosamente. El stock ha sido actualizado.</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Datos del Proveedor</h3>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Nombre del proveedor"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Agregar Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                <input
                  type="text"
                  value={productSearch}
                  onChange={handleProductSearchChange}
                  onFocus={() => productSearch.length >= 2 && setShowProductDropdown(true)}
                  placeholder="Buscar producto..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {showProductDropdown && searchFilteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchFilteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-sm text-gray-500">Stock: {product.stock || 0} | Costo: {moneyFormat(product.price_purchase || 0)}</div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedProduct && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                    Seleccionado: <strong>{selectedProduct.name}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Costo Unitario</label>
                <input
                  type="number"
                  min="0"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  placeholder="$0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <button
              onClick={addItem}
              disabled={!selectedProduct || !quantity || !unitCost}
              className="mt-4 w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              + Agregar Producto
            </button>
          </div>

          {items.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-100 px-6 py-3">
                <h3 className="text-lg font-bold text-purple-800">Productos en la Factura ({items.length})</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Producto</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">Cantidad</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Costo Unit.</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">Accion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-purple-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{moneyFormat(item.unitCost)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">{moneyFormat(item.totalCost)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-purple-50 px-6 py-4 flex justify-between items-center">
                <span className="text-lg font-bold text-purple-800">TOTAL FACTURA:</span>
                <span className="text-2xl font-bold text-green-600">{moneyFormat(totalCost)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={processing || !supplier || items.length === 0}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando...
              </span>
            ) : (
              "Registrar Factura"
            )}
          </button>
        </div>
      </div>
    </Menu>
  );
};

export default Invoice;
