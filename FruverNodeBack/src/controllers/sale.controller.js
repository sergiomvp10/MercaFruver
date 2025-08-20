import { where } from "sequelize";
import { ItemSale } from "../models/ItemSale.js";
import { Sale } from "../models/Sale.js";
import { sequelize } from "../database/database.js";

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

    itemsSale.forEach(async (itemSale) => {
        console.log(itemSale)
      await ItemSale.create({ 
        price_purchase: itemSale.price_purchase,
        price_sale: itemSale.price_sale,
        amount: itemSale.amount,
        ProductId: itemSale.ProductId,
        SaleId: sale.dataValues.id 
      });
    });
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

