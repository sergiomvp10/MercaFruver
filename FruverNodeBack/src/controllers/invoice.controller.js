import { Invoice, InvoiceItem } from "../models/Invoice.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { sequelize } from "../database/database.js";

const COLOMBIA_TIMEZONE = 'America/Bogota';

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

export const createInvoice = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { supplier, items, userId, notes } = req.body;

    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ message: "Proveedor y productos son requeridos" });
    }

    const now = new Date();
    let totalCost = 0;

    for (const item of items) {
      totalCost += item.quantity * item.unitCost;
    }

    const invoice = await Invoice.create({
      supplier,
      date: now,
      totalCost,
      notes,
      UserId: userId
    }, { transaction });

    for (const item of items) {
      await InvoiceItem.create({
        InvoiceId: invoice.id,
        ProductId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.quantity * item.unitCost
      }, { transaction });

      await Product.increment(
        { stock: item.quantity },
        { where: { id: item.productId }, transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      id: invoice.id,
      supplier,
      totalCost,
      itemCount: items.length,
      dateFormatted: formatToColombiaDateTime(now),
      message: "Factura registrada exitosamente"
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(400).json({ message: "Error al registrar factura" });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { 
          model: InvoiceItem, 
          include: [{ model: Product, attributes: ['id', 'name'] }]
        }
      ],
      order: [['date', 'DESC']],
      limit: 50
    });

    const formattedInvoices = invoices.map(inv => ({
      ...inv.dataValues,
      dateFormatted: formatToColombiaDateTime(inv.date)
    }));

    res.status(200).json(formattedInvoices);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener facturas" });
  }
};

export const getInvoicesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const invoices = await sequelize.query(
      `SELECT i.*, u.name as userName
       FROM Invoices i
       LEFT JOIN Users u ON i.UserId = u.id
       WHERE date(datetime(i.date, '-5 hours')) = date(:targetDate)
       ORDER BY i.date DESC`,
      {
        replacements: { targetDate },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const formattedInvoices = invoices.map(inv => ({
      ...inv,
      dateFormatted: formatToColombiaDateTime(inv.date)
    }));

    res.status(200).json(formattedInvoices);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener facturas por fecha" });
  }
};
