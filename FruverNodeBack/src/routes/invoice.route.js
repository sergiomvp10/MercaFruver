import { Router } from "express";
import { createInvoice, getInvoices, getInvoicesByDate } from "../controllers/invoice.controller.js";

const router = Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/by-date", getInvoicesByDate);

export default router;
