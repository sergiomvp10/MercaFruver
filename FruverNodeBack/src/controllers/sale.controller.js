import { where, Op } from "sequelize";
import { ItemSale } from "../models/ItemSale.js";
import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";
import { sequelize } from "../database/database.js";
import { logSale, initDailyLog } from "../utils/salesLogger.js";

export const getSales = async (req, res, next) => {
  try {
    const sales = await Sale.findAll();
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error en las ventas" });
  }
};

export const newSale = async (req, res, next) => {
  try {
    const { itemsSale, userId, date } = req.body || req.query;
    const sale = await Sale.create({
      date: Date.now(),
      UserId: userId
    });

    initDailyLog();

    const productNames = [];
    for (const itemSale of itemsSale) {
      console.log(itemSale);
      await ItemSale.create({ ...itemSale, SaleId: sale.dataValues.id });
      
      if (itemSale.ProductId) {
        const product = await Product.findByPk(itemSale.ProductId);
        productNames.push(product ? product.name : 'Producto desconocido');
      } else {
        productNames.push('Producto desconocido');
      }
    }

    await logSale(sale.dataValues.id, itemsSale, productNames);

    res.status(200).json(sale);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error en la venta" });
  }
};

export const totalDaySale = async (req, res, next) => {
  try {
      const total = await sequelize.query("select sum(price_sale *amount) as total  from ItemSales where strftime('%Y-%m-%d', createdAt) = date('now')")
      res.status(200).json(total[0][0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al mostrar la venta del dia" });
  }
};

export const getSalesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Se requieren fechas de inicio y fin" });
    }

    const total = await sequelize.query(
      `SELECT sum(price_sale * amount) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE date(createdAt) >= date(:startDate) AND date(createdAt) <= date(:endDate)`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const dailyBreakdown = await sequelize.query(
      `SELECT date(createdAt) as fecha, sum(price_sale * amount) as total, count(DISTINCT SaleId) as cantidadVentas
       FROM ItemSales 
       WHERE date(createdAt) >= date(:startDate) AND date(createdAt) <= date(:endDate)
       GROUP BY date(createdAt)
       ORDER BY fecha DESC`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      resumen: total[0] || { total: 0, totalSales: 0 },
      detallesDiarios: dailyBreakdown
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener ventas por rango de fechas" });
  }
};

export const getDailySalesReport = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const total = await sequelize.query(
      `SELECT sum(price_sale * amount) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE date(createdAt) = date(:targetDate)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      fecha: targetDate,
      total: total[0]?.total || 0,
      cantidadVentas: total[0]?.totalSales || 0
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener reporte diario" });
  }
};

export const getMonthlySalesReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const total = await sequelize.query(
      `SELECT sum(price_sale * amount) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE strftime('%Y', createdAt) = :targetYear AND strftime('%m', createdAt) = :targetMonth`,
      {
        replacements: { targetYear: targetYear.toString(), targetMonth: targetMonth.toString().padStart(2, '0') },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const dailyBreakdown = await sequelize.query(
      `SELECT date(createdAt) as fecha, sum(price_sale * amount) as total, count(DISTINCT SaleId) as cantidadVentas
       FROM ItemSales 
       WHERE strftime('%Y', createdAt) = :targetYear AND strftime('%m', createdAt) = :targetMonth
       GROUP BY date(createdAt)
       ORDER BY fecha DESC`,
      {
        replacements: { targetYear: targetYear.toString(), targetMonth: targetMonth.toString().padStart(2, '0') },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      año: targetYear,
      mes: targetMonth,
      total: total[0]?.total || 0,
      cantidadVentas: total[0]?.totalSales || 0,
      detallesDiarios: dailyBreakdown
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener reporte mensual" });
  }
};

const COLOMBIA_TIMEZONE = 'America/Bogota';

const formatToColombiaTime = (utcDateStr) => {
  if (!utcDateStr) return '';
  const date = new Date(utcDateStr + 'Z');
  return date.toLocaleTimeString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const getSalesWithDetails = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const salesDetails = await sequelize.query(
      `SELECT 
        i.id,
        i.SaleId,
        p.name as producto,
        i.amount as cantidad,
        i.price_sale as precioVenta,
        (i.price_sale * i.amount) as subtotal,
        datetime(i.createdAt) as fechaHora
       FROM ItemSales i
       LEFT JOIN Products p ON i.ProductId = p.id
       WHERE date(i.createdAt) = date(:targetDate)
       ORDER BY i.createdAt DESC`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const salesWithColombiaTime = salesDetails.map(sale => ({
      ...sale,
      hora: formatToColombiaTime(sale.fechaHora)
    }));

    const total = await sequelize.query(
      `SELECT sum(price_sale * amount) as total, count(*) as totalItems, count(DISTINCT SaleId) as totalVentas
       FROM ItemSales 
       WHERE date(createdAt) = date(:targetDate)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      fecha: targetDate,
      total: total[0]?.total || 0,
      totalItems: total[0]?.totalItems || 0,
      totalVentas: total[0]?.totalVentas || 0,
      detalles: salesWithColombiaTime
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener detalles de ventas" });
  }
};

