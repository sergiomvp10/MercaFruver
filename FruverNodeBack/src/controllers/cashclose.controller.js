import { CashClose } from "../models/CashClose.js";
import { User } from "../models/User.js";
import { sequelize } from "../database/database.js";

const COLOMBIA_TIMEZONE = 'America/Bogota';

const formatToColombiaDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatToColombiaDateTime = (date) => {
  return new Date(date).toLocaleString('es-CO', {
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const createCashClose = async (req, res) => {
  try {
    const { userId, cashTotal, denominations, notes } = req.body;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA', { timeZone: COLOMBIA_TIMEZONE });

    const systemTotal = await sequelize.query(
      `SELECT COALESCE(sum(price_sale * amount), 0) as total
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) = date(:dateStr)`,
      {
        replacements: { dateStr },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const systemSalesTotal = systemTotal[0]?.total || 0;
    const difference = cashTotal - systemSalesTotal;

    const cashClose = await CashClose.create({
      date: now,
      cashTotal,
      systemTotal: systemSalesTotal,
      difference,
      denominations: JSON.stringify(denominations),
      notes,
      UserId: userId
    });

    res.status(201).json({
      ...cashClose.dataValues,
      systemTotal: systemSalesTotal,
      difference,
      dateFormatted: formatToColombiaDateTime(now)
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al crear cierre de caja" });
  }
};

export const getCashCloses = async (req, res) => {
  try {
    const cashCloses = await CashClose.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
      limit: 30
    });

    const formattedCloses = cashCloses.map(close => ({
      ...close.dataValues,
      dateFormatted: formatToColombiaDateTime(close.date),
      denominations: close.denominations ? JSON.parse(close.denominations) : null
    }));

    res.status(200).json(formattedCloses);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener cierres de caja" });
  }
};

export const getCashClosesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toLocaleDateString('en-CA', { timeZone: COLOMBIA_TIMEZONE });

    const cashCloses = await sequelize.query(
      `SELECT c.*, u.name as userName
       FROM CashCloses c
       LEFT JOIN Users u ON c.UserId = u.id
       WHERE date(datetime(c.date, '-5 hours')) = date(:targetDate)
       ORDER BY c.date DESC`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const formattedCloses = cashCloses.map(close => ({
      ...close,
      dateFormatted: formatToColombiaDateTime(close.date),
      denominations: close.denominations ? JSON.parse(close.denominations) : null
    }));

    res.status(200).json(formattedCloses);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener cierres de caja por fecha" });
  }
};

export const getDailyCashReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toLocaleDateString('en-CA', { timeZone: COLOMBIA_TIMEZONE });

    const systemSales = await sequelize.query(
      `SELECT 
        COALESCE(sum(price_sale * amount), 0) as totalVentas,
        count(DISTINCT SaleId) as cantidadVentas
       FROM ItemSales 
       WHERE date(datetime(createdAt, '-5 hours')) = date(:targetDate)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const cashSales = await sequelize.query(
      `SELECT COALESCE(sum(i.price_sale * i.amount), 0) as totalEfectivo
       FROM ItemSales i
       JOIN Sales s ON i.SaleId = s.id
       WHERE date(datetime(i.createdAt, '-5 hours')) = date(:targetDate)
       AND (s.paymentMethod = 'EFECTIVO' OR s.paymentMethod IS NULL)`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const transferSales = await sequelize.query(
      `SELECT COALESCE(sum(i.price_sale * i.amount), 0) as totalTransferencia
       FROM ItemSales i
       JOIN Sales s ON i.SaleId = s.id
       WHERE date(datetime(i.createdAt, '-5 hours')) = date(:targetDate)
       AND s.paymentMethod = 'BRE-B'`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const cashCloses = await sequelize.query(
      `SELECT c.*, u.name as userName
       FROM CashCloses c
       LEFT JOIN Users u ON c.UserId = u.id
       WHERE date(datetime(c.date, '-5 hours')) = date(:targetDate)
       ORDER BY c.date DESC`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const formattedCloses = cashCloses.map(close => ({
      ...close,
      dateFormatted: formatToColombiaDateTime(close.date),
      denominations: close.denominations ? JSON.parse(close.denominations) : null
    }));

    res.status(200).json({
      fecha: targetDate,
      ventas: {
        totalVentas: systemSales[0]?.totalVentas || 0,
        cantidadVentas: systemSales[0]?.cantidadVentas || 0,
        totalEfectivo: cashSales[0]?.totalEfectivo || 0,
        totalTransferencia: transferSales[0]?.totalTransferencia || 0
      },
      cierresCaja: formattedCloses
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener reporte diario de caja" });
  }
};
