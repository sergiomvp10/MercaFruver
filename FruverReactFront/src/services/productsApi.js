import axios from "axios"

const API = "/api";

export const serviceCreateProduct = async ({name,description,price_purchase,price_sale,stock,barcode,pesable,unit,min_stock})=>{
    const data = await axios.post(`${API}/products`, {
      name,
      description,
      price_purchase,
      price_sale,
      stock,
      barcode,
      pesable,
      unit,
      min_stock,
    });
    return data.data
}

export const serviceUpdateProduct = async ({
    id,
  name,
  description,
  price_purchase,
  price_sale,
  stock,
  barcode,
  pesable,
  unit,
  min_stock,
}) => {
  const data = await axios.put(`${API}/products/${id}`, {
    name,
    description,
    price_purchase,
    price_sale,
    stock,
    barcode,
    pesable,
    unit,
    min_stock,
  });
  return data.data;
};

export const serviceDeleteProduct = async ({
  id
}) => {
const data = await axios.delete(`${API}/products/${id}`, {
 
});
return data.data;
};

export const serviceMakeSale = async (itemsSale, userId, paymentMethod = 'EFECTIVO')=>{
  const sale = await axios.post(`${API}/sales/`,{
    itemsSale, userId, paymentMethod
  });
  return sale.data
}

export const serviceGetProductByBarcode = async (barcode) => {
    const data = await axios.get(`${API}/products/barcode/${barcode}`);
    return data;
}

export const serviceGetLowStockProducts = async () => {
    const data = await axios.get(`${API}/products/low-stock`);
    return data.data;
}
