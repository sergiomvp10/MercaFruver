import { Router } from "express";
import { getSales, newSale, totalDaySale, getSalesByDateRange, getDailySalesReport, getMonthlySalesReport, getSalesWithDetails, getSalesDaysList } from "../controllers/sale.controller.js";

export const salesController = new Router();

salesController.get("/", getSales);
salesController.get("/day", totalDaySale);
salesController.get("/days-list", getSalesDaysList);
salesController.get("/details", getSalesWithDetails);
salesController.get("/reports/range", getSalesByDateRange);
salesController.get("/reports/daily", getDailySalesReport);
salesController.get("/reports/monthly", getMonthlySalesReport);
salesController.post("/", newSale);
