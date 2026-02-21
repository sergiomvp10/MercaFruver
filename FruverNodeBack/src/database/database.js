import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
});

(async () => {
  await sequelize.sync({ force: false });

  try {
    const [tableInfo] = await sequelize.query("PRAGMA table_info('ItemSales')");
    const amountCol = tableInfo.find(c => c.name === 'amount');
    if (amountCol && amountCol.type === 'INTEGER') {
      await sequelize.query(`CREATE TABLE ItemSales_tmp (id INTEGER PRIMARY KEY, price_purchase INTEGER NOT NULL, price_sale INTEGER NOT NULL, amount REAL NOT NULL, createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL, ProductId INTEGER REFERENCES Products(id), SaleId INTEGER REFERENCES Sales(id) ON DELETE CASCADE ON UPDATE CASCADE)`);
      await sequelize.query(`INSERT INTO ItemSales_tmp SELECT * FROM ItemSales`);
      await sequelize.query(`DROP TABLE ItemSales`);
      await sequelize.query(`ALTER TABLE ItemSales_tmp RENAME TO ItemSales`);
      console.log('Migrated ItemSales.amount from INTEGER to REAL');
    }
  } catch (e) {
    console.log('Migration check:', e.message);
  }

  try {
    await sequelize.query(`UPDATE Products SET stock = 0 WHERE stock IS NULL OR typeof(stock) = 'text' OR CAST(stock AS REAL) != CAST(stock AS REAL)`);
    console.log('Fixed NaN stock values');
  } catch (e) {
    console.log('Stock fix:', e.message);
  }
})();
