import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();
