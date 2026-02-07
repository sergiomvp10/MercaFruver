import { Product } from "./Product.js";
import { Sale } from "./Sale.js";
import { ItemSale } from "./ItemSale.js";
import { User } from "./User.js";
import { Role } from "./Role.js";
import { Expense } from "./Expense.js";
import { Shift } from "./Shift.js";
import { CashClose } from "./CashClose.js";
import { Invoice, InvoiceItem } from "./Invoice.js";

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
User.hasMany(CashClose);
CashClose.belongsTo(User);
User.hasMany(Invoice);
Invoice.belongsTo(User);
Invoice.hasMany(InvoiceItem);
InvoiceItem.belongsTo(Invoice);
InvoiceItem.belongsTo(Product);
Product.hasMany(InvoiceItem);
