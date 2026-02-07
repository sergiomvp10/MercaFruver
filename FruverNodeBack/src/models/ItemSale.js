import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const ItemSale = sequelize.define(
  "ItemSale",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement:true,
      primaryKey:true
      // allowNull defaults to true
    },
    price_purchase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
    price_sale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  }
);
