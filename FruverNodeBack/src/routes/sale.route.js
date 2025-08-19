import { Router } from "express";
import { getSales, newSale, totalDaySale } from "../controllers/sale.controller.js";

export const salesController = new Router();

salesController.get("/", getSales);
salesController.get("/day", totalDaySale);
salesController.post("/", newSale);
