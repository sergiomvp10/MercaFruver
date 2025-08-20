import axios from "axios"

const API = "http://localhost:4000/api";

export const serviceCreateProduct = async ({name,description,price_purchase,price_sale,stock,barcode})=>{
    const data = await axios.post(`${API}/products`, {
      name,
      description,
      price_purchase,
      price_sale,
      stock,
      barcode,
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
}) => {
  const data = await axios.put(`${API}/products/${id}`, {
    name,
    description,
    price_purchase,
    price_sale,
    stock,
    barcode,
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

export const serviceMakeSale = async (itemsSale, userId)=>{
  const sale = await axios.post(`${API}/sales/`,{
    itemsSale, userId
  });
  return sale.data
}

export const serviceCompleteSale = async (saleId) => {
  const response = await axios.put(`${API}/sales/complete/${saleId}`);
  return response.data;
}

export const serviceDayReport = async (date) => {
  const response = await axios.get(`${API}/sales/day-report?date=${date}`);
  return response.data;
}

export const serviceDetailedReport = async (date) => {
  const response = await axios.get(`${API}/sales/detailed-report?date=${date}`);
  return response.data;
}

export const serviceTotalReport = async (startDate, endDate) => {
  const response = await axios.get(`${API}/sales/total-report?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
}

export const serviceGetProductByBarcode = async (barcode) => {
    const data = await axios.get(`${API}/products/barcode/${barcode}`);
    return data;
}
