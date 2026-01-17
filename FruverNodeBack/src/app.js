import express from "express";
import './models/Associations.js';
import { productRouter } from "./routes/product.route.js";
import cors from 'cors'
import { salesController } from "./routes/sale.route.js";
import { expenseRouter } from "./routes/expense.route.js";

export const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/products',productRouter)
app.use("/api/sales", salesController);
app.use("/api/expenses", expenseRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


