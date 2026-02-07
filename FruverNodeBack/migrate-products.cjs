const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const oldDbPath = path.join(__dirname, 'database_old.db');
const newDbPath = path.join(__dirname, 'database.db');

console.log('=== Migracion de Productos ===\n');

const oldDb = new sqlite3.Database(oldDbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
});

const newDb = new sqlite3.Database(newDbPath);

oldDb.all('SELECT name, description, price_purchase, price_sale, stock FROM Products', [], (err, products) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  console.log('Encontrados ' + products.length + ' productos.\n');
  let imported = 0, skipped = 0, processed = 0;

  products.forEach((p) => {
    newDb.get('SELECT id FROM Products WHERE name = ?', [p.name], (err, exists) => {
      if (exists) {
        skipped++;
      } else {
        const now = new Date().toISOString();
        newDb.run('INSERT INTO Products (name, description, price_purchase, price_sale, stock, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.description, p.price_purchase, p.price_sale, p.stock, now, now],
          (err) => { if (!err) imported++; }
        );
      }
      processed++;
      if (processed === products.length) {
        setTimeout(() => {
          console.log('Importados: ' + imported + ' | Omitidos: ' + skipped);
          oldDb.close();
          newDb.close();
        }, 1000);
      }
    });
  });
});