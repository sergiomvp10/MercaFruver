import { Router } from "express";
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense, 
  getExpensesByDateRange,
  getExpensesSummary,
  getCategories
} from "../controllers/expense.controller.js";

export const expenseRouter = new Router();

expenseRouter.get("/", getExpenses);
expenseRouter.get("/range", getExpensesByDateRange);
expenseRouter.get("/summary", getExpensesSummary);
expenseRouter.get("/categories", getCategories);
expenseRouter.post("/", createExpense);
expenseRouter.put("/:id", updateExpense);
expenseRouter.delete("/:id", deleteExpense);
