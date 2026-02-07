import express from "express";
import './models/Associations.js';
import { productRouter } from "./routes/product.route.js";
import cors from 'cors'
import { salesController } from "./routes/sale.route.js";
import { expenseRouter } from "./routes/expense.route.js";
import userRouter from "./routes/user.route.js";
import cashCloseRouter from "./routes/cashclose.route.js";
import invoiceRouter from "./routes/invoice.route.js";

export const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/products',productRouter)
app.use("/api/sales", salesController);
app.use("/api/expenses", expenseRouter);
app.use("/api/users", userRouter);
app.use("/api/cashclose", cashCloseRouter);
app.use("/api/invoices", invoiceRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


