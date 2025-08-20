import { where } from "sequelize";
import { ItemSale } from "../models/ItemSale.js";
import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";
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
    
    const { User } = await import("../models/User.js");
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        name: "Usuario Default",
        username: "admin",
        email: "admin@mercafruver.com",
        phone_number: "1234567890",
        password: "admin123"
      });
    }
    
    for (const itemSale of itemsSale) {
      const product = await Product.findByPk(itemSale.ProductId);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${itemSale.ProductId} no encontrado` });
      }
      if (product.stock < itemSale.amount) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${itemSale.amount}` 
        });
      }
    }

    const sale = await Sale.create({
      date: Date.now(),
      UserId: user.id
    });

    for (const itemSale of itemsSale) {
      console.log(itemSale);
      
      await ItemSale.create({ 
        price_purchase: itemSale.price_purchase,
        price_sale: itemSale.price_sale,
        amount: itemSale.amount,
        ProductId: itemSale.ProductId,
        SaleId: sale.dataValues.id 
      });

      await Product.decrement('stock', {
        by: itemSale.amount,
        where: { id: itemSale.ProductId }
      });
    }
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

