import { Router } from "express";
import { 
  createCashClose, 
  getCashCloses, 
  getCashClosesByDate,
  getDailyCashReport 
} from "../controllers/cashclose.controller.js";

const router = Router();

router.post("/", createCashClose);
router.get("/", getCashCloses);
router.get("/by-date", getCashClosesByDate);
router.get("/daily-report", getDailyCashReport);

export default router;
