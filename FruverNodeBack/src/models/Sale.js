import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Sale = sequelize.define(
  "Sale",
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    // Other model options go here
  }
);
