import { Expense } from "../models/Expense.js";
import { Op } from "sequelize";
import { sequelize } from "../database/database.js";

const getColombiaDate = () => {
  const now = new Date();
  const colombiaOffset = -5 * 60;
  const utcOffset = now.getTimezoneOffset();
  const colombiaTime = new Date(now.getTime() + (utcOffset + colombiaOffset) * 60000);
  const year = colombiaTime.getFullYear();
  const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getColombiaMonth = () => {
  const now = new Date();
  const colombiaOffset = -5 * 60;
  const utcOffset = now.getTimezoneOffset();
  const colombiaTime = new Date(now.getTime() + (utcOffset + colombiaOffset) * 60000);
  const year = colombiaTime.getFullYear();
  const month = colombiaTime.getMonth();
  const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startOfMonth, endOfMonth };
};

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
      category: category || "Servicios",
      date: date || getColombiaDate(),
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
    const todayStr = getColombiaDate();
    const { startOfMonth, endOfMonth } = getColombiaMonth();

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
      "Servicios",
      "Transporte",
      "Alimentos",
      "Proveedores",
      "Mantenimiento",
      "Salarios",
      "Cambios",
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
