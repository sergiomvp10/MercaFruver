const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('Agregando tabla CashCloses a la base de datos existente...');

db.serialize(() => {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CashCloses'", (err, row) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    
    if (row) {
      console.log('La tabla CashCloses ya existe. No se necesita migracion.');
      checkProducts();
    } else {
      db.run(`
        CREATE TABLE CashCloses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date DATETIME NOT NULL,
          cashTotal DECIMAL(12,2) NOT NULL,
          systemTotal DECIMAL(12,2) NOT NULL,
          difference DECIMAL(12,2) NOT NULL,
          denominations TEXT,
          notes TEXT,
          UserId INTEGER,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creando tabla:', err.message);
        } else {
          console.log('Tabla CashCloses creada exitosamente.');
        }
        checkProducts();
      });
    }
  });
});

function checkProducts() {
  db.get("SELECT COUNT(*) as count FROM Products", (err, row) => {
    if (err) {
      console.log('No se pudo contar productos:', err.message);
    } else {
      console.log('\nProductos existentes:', row.count);
    }
    
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (!err) {
        console.log('\nTablas en la base de datos:');
        rows.forEach(r => console.log('  -', r.name));
      }
      console.log('\nMigracion completada. Tus productos estan intactos.');
      db.close();
    });
  });
}
