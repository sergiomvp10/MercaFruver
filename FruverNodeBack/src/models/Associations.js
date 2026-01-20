import { Product } from "./Product.js";
import { Sale } from "./Sale.js";
import { ItemSale } from "./ItemSale.js";
import { User } from "./User.js";
import { Role } from "./Role.js";
import { Expense } from "./Expense.js";
import { Shift } from "./Shift.js";

Product.belongsToMany(Sale, {
  through: {
    model: ItemSale,
    unique: false,
  },
});

Role.belongsToMany(User, { through: "RoleUser" });
User.hasMany(Sale);
Sale.belongsTo(User);
User.hasMany(Shift);
Shift.belongsTo(User);
