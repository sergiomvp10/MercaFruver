import { Expense } from "../models/Expense.js";
import { Op } from "sequelize";
import { sequelize } from "../database/database.js";

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener gastos" });
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { description, amount, category, date } = req.body || req.query;
    const expense = await Expense.create({
      description,
      amount,
      category: category || "General",
      date: date || new Date().toISOString().split('T')[0],
    });
    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al crear gasto" });
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body || req.query;
    const expense = await Expense.update(update, { where: { id: id } });
    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al actualizar gasto" });
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id: id } });
    res.status(200).json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al eliminar gasto" });
  }
};

export const getExpensesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Se requieren fechas de inicio y fin" });
    }

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    const total = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

    res.status(200).json({
      expenses,
      total,
      count: expenses.length
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener gastos por rango de fechas" });
  }
};

export const getExpensesSummary = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const totalToday = await sequelize.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM Expenses WHERE date = :today`,
      {
        replacements: { today: todayStr },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const totalMonth = await sequelize.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM Expenses WHERE date >= :startDate AND date <= :endDate`,
      {
        replacements: { startDate: startOfMonth, endDate: endOfMonth },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const byCategory = await sequelize.query(
      `SELECT category, SUM(amount) as total, COUNT(*) as count 
       FROM Expenses 
       WHERE date >= :startDate AND date <= :endDate
       GROUP BY category
       ORDER BY total DESC`,
      {
        replacements: { startDate: startOfMonth, endDate: endOfMonth },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      today: totalToday[0]?.total || 0,
      month: totalMonth[0]?.total || 0,
      byCategory
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener resumen de gastos" });
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await sequelize.query(
      `SELECT DISTINCT category FROM Expenses ORDER BY category`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    const defaultCategories = [
      "General",
      "Servicios",
      "Transporte",
      "Alimentos",
      "Suministros",
      "Mantenimiento",
      "Salarios",
      "Otros"
    ];
    const existingCategories = categories.map(c => c.category);
    const allCategories = [...new Set([...defaultCategories, ...existingCategories])];
    res.status(200).json(allCategories);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener categorías" });
  }
};
