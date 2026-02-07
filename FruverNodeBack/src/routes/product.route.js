import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct, getProductByBarcode } from "../controllers/product.controller.js";


export const productRouter = new Router()

productRouter.get('/',getProducts)
productRouter.get('/barcode/:barcode', getProductByBarcode)
productRouter.post('/',createProduct)
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

