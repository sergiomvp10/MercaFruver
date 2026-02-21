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
  const t = await sequelize.transaction();
  try {
    const { itemsSale, userId, date, paymentMethod } = req.body || req.query;

    if (!itemsSale || !Array.isArray(itemsSale) || itemsSale.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "No hay productos en la venta" });
    }

    const sale = await Sale.create({
      date: Date.now(),
      UserId: userId,
      paymentMethod: paymentMethod || 'EFECTIVO'
    }, { transaction: t });

    const productNames = [];
    for (const itemSale of itemsSale) {
      await ItemSale.create({ ...itemSale, SaleId: sale.dataValues.id }, { transaction: t });
      
      if (itemSale.ProductId) {
        const product = await Product.findByPk(itemSale.ProductId, { transaction: t });
        if (product) {
          productNames.push(product.name);
          const currentStock = parseFloat(product.stock) || 0;
          const saleAmount = parseFloat(itemSale.amount) || 0;
          const newStock = Math.round((currentStock - saleAmount) * 100) / 100;
          await product.update({ stock: newStock }, { transaction: t });
        } else {
          productNames.push('Producto desconocido');
        }
      } else {
        productNames.push('Producto desconocido');
      }
    }

    await t.commit();

    initDailyLog();
    await logSale(sale.dataValues.id, itemsSale, productNames);

    res.status(200).json(sale);
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(400).json({ message: "Error en la venta" });
  }
};

export const totalDaySale = async (req, res, next) => {
  try {
      const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
      const total = await sequelize.query(
        `SELECT COALESCE(sum(price_sale * amount), 0) as total FROM ItemSales WHERE date(datetime(createdAt, '-5 hours')) = date(:dateStr)`,
        { replacements: { dateStr }, type: sequelize.QueryTypes.SELECT }
      );
      res.status(200).json(total[0]);
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
      `SELECT COALESCE(sum(price_sale * amount), 0) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) >= date(:startDate) AND date(datetime(createdAt, '-5 hours')) <= date(:endDate)`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const dailyBreakdown = await sequelize.query(
      `SELECT date(datetime(createdAt, '-5 hours')) as fecha, sum(price_sale * amount) as total, count(DISTINCT SaleId) as cantidadVentas
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) >= date(:startDate) AND date(datetime(createdAt, '-5 hours')) <= date(:endDate)
       GROUP BY date(datetime(createdAt, '-5 hours'))
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
    let targetDate = date;
    if (!targetDate) {
      targetDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    }

    const total = await sequelize.query(
      `SELECT COALESCE(sum(price_sale * amount), 0) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) = date(:targetDate)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const cashTotal = await sequelize.query(
      `SELECT COALESCE(sum(i.price_sale * i.amount), 0) as total
       FROM ItemSales i
       JOIN Sales s ON i.SaleId = s.id
       WHERE date(datetime(i.createdAt, '-5 hours')) = date(:targetDate)
       AND (s.paymentMethod = 'EFECTIVO' OR s.paymentMethod IS NULL)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const transferTotal = await sequelize.query(
      `SELECT COALESCE(sum(i.price_sale * i.amount), 0) as total
       FROM ItemSales i
       JOIN Sales s ON i.SaleId = s.id
       WHERE date(datetime(i.createdAt, '-5 hours')) = date(:targetDate)
       AND s.paymentMethod = 'BRE-B'`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      fecha: targetDate,
      total: total[0]?.total || 0,
      cantidadVentas: total[0]?.totalSales || 0,
      totalEfectivo: cashTotal[0]?.total || 0,
      totalTransferencia: transferTotal[0]?.total || 0
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener reporte diario" });
  }
};

export const getMonthlySalesReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const colombiaDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    const targetYear = year || colombiaDateStr.split('-')[0];
    const targetMonth = month || colombiaDateStr.split('-')[1];

    const total = await sequelize.query(
      `SELECT COALESCE(sum(price_sale * amount), 0) as total, count(DISTINCT SaleId) as totalSales 
       FROM ItemSales 
       WHERE strftime('%Y', datetime(createdAt, '-5 hours')) = :targetYear AND strftime('%m', datetime(createdAt, '-5 hours')) = :targetMonth`,
      {
        replacements: { targetYear: targetYear.toString(), targetMonth: targetMonth.toString().padStart(2, '0') },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const dailyBreakdown = await sequelize.query(
      `SELECT date(datetime(createdAt, '-5 hours')) as fecha, sum(price_sale * amount) as total, count(DISTINCT SaleId) as cantidadVentas
       FROM ItemSales 
       WHERE strftime('%Y', datetime(createdAt, '-5 hours')) = :targetYear AND strftime('%m', datetime(createdAt, '-5 hours')) = :targetMonth
       GROUP BY date(datetime(createdAt, '-5 hours'))
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

const formatToColombiaDateLong = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00Z');
  return date.toLocaleDateString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getSalesDaysList = async (req, res, next) => {
  try {
    const daysList = await sequelize.query(
      `SELECT 
        date(datetime(createdAt, '-5 hours')) as fecha,
        sum(price_sale * amount) as total,
        count(*) as totalItems,
        count(DISTINCT SaleId) as totalVentas
       FROM ItemSales
       GROUP BY date(datetime(createdAt, '-5 hours'))
       ORDER BY fecha DESC
       LIMIT 30`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );

    const daysWithFormat = daysList.map(day => ({
      ...day,
      fechaFormateada: formatToColombiaDateLong(day.fecha)
    }));

    res.status(200).json(daysWithFormat);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener lista de días con ventas" });
  }
};

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

const formatToColombiaDate = (utcDateStr) => {
  if (!utcDateStr) return '';
  const date = new Date(utcDateStr + 'Z');
  return date.toLocaleDateString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const deleteSalesByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Se requiere una fecha" });
    }

    const saleIds = await sequelize.query(
      `SELECT DISTINCT SaleId FROM ItemSales WHERE date(datetime(createdAt, '-5 hours')) = date(:date)`,
      {
        replacements: { date },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (saleIds.length === 0) {
      return res.status(404).json({ message: "No hay ventas para esta fecha" });
    }

    const ids = saleIds.map(s => s.SaleId);

    await ItemSale.destroy({
      where: {
        SaleId: {
          [Op.in]: ids
        }
      }
    });

    await Sale.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    res.status(200).json({ message: "Ventas eliminadas correctamente", deletedSales: ids.length });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al eliminar ventas" });
  }
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
        datetime(i.createdAt) as fechaHora,
        u.name as vendedor,
        s.paymentMethod as metodoPago
       FROM ItemSales i
       LEFT JOIN Products p ON i.ProductId = p.id
       LEFT JOIN Sales s ON i.SaleId = s.id
       LEFT JOIN Users u ON s.UserId = u.id
       WHERE date(datetime(i.createdAt, '-5 hours')) = date(:targetDate)
       ORDER BY datetime(i.createdAt, '-5 hours') DESC`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const salesWithColombiaTime = salesDetails.map(sale => ({
      ...sale,
      hora: formatToColombiaTime(sale.fechaHora),
      fechaVenta: formatToColombiaDate(sale.fechaHora)
    }));

    const total = await sequelize.query(
      `SELECT sum(price_sale * amount) as total, count(*) as totalItems, count(DISTINCT SaleId) as totalVentas
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) = date(:targetDate)`,
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

