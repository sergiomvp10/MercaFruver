import { Router } from "express";
import { getSales, newSale, totalDaySale, getSalesByDateRange, getDailySalesReport, getMonthlySalesReport, getSalesWithDetails } from "../controllers/sale.controller.js";

export const salesController = new Router();

salesController.get("/", getSales);
salesController.get("/day", totalDaySale);
salesController.get("/details", getSalesWithDetails);
salesController.get("/reports/range", getSalesByDateRange);
salesController.get("/reports/daily", getDailySalesReport);
salesController.get("/reports/monthly", getMonthlySalesReport);
salesController.post("/", newSale);
