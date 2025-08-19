import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    email: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
    password: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  }
);
