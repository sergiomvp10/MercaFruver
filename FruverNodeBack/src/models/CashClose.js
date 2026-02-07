import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const CashClose = sequelize.define(
  "CashClose",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cashTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    systemTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    difference: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    denominations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {}
);
