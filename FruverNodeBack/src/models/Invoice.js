import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Invoice = sequelize.define(
  "Invoice",
  {
    supplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {}
);

export const InvoiceItem = sequelize.define(
  "InvoiceItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    }
  },
  {}
);
