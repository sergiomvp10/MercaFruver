import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Shift = sequelize.define(
  "Shift",
  {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalSales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    // Other model options go here
  }
);
