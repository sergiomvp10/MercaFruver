import express from "express";
import './models/Associations.js';
import { productRouter } from "./routes/product.route.js";
import cors from 'cors'
import { salesController } from "./routes/sale.route.js";

export const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/products',productRouter)
app.use("/api/sales", salesController);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


