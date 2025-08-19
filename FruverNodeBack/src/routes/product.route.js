import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";


export const productRouter = new Router()

productRouter.get('/',getProducts)
productRouter.post('/',createProduct)
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

