import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    description: {
      type: DataTypes.STRING,
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
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  }
);


