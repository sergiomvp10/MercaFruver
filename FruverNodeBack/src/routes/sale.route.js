import { Router } from "express";
import { getSales, newSale, totalDaySale, completeSale, dayReport, detailedReport, totalRangeReport } from "../controllers/sale.controller.js";

export const salesController = new Router();

salesController.get("/", getSales);
salesController.get("/day", totalDaySale);
salesController.get("/day-report", dayReport);
salesController.get("/detailed-report", detailedReport);
salesController.get("/total-report", totalRangeReport);
salesController.post("/", newSale);
salesController.put("/complete/:saleId", completeSale);
