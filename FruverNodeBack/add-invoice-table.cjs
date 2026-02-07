const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite');
});

const createInvoicesTable = `
  CREATE TABLE IF NOT EXISTS Invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier TEXT NOT NULL,
    date DATETIME NOT NULL,
    totalCost DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    UserId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id)
  )
`;

const createInvoiceItemsTable = `
  CREATE TABLE IF NOT EXISTS InvoiceItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantity INTEGER NOT NULL,
    unitCost DECIMAL(12,2) NOT NULL,
    totalCost DECIMAL(12,2) NOT NULL,
    InvoiceId INTEGER,
    ProductId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InvoiceId) REFERENCES Invoices(id),
    FOREIGN KEY (ProductId) REFERENCES Products(id)
  )
`;

db.serialize(() => {
  db.run(createInvoicesTable, (err) => {
    if (err) {
      console.error('Error al crear tabla Invoices:', err.message);
    } else {
      console.log('Tabla Invoices creada exitosamente');
    }
  });

  db.run(createInvoiceItemsTable, (err) => {
    if (err) {
      console.error('Error al crear tabla InvoiceItems:', err.message);
    } else {
      console.log('Tabla InvoiceItems creada exitosamente');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Migracion completada exitosamente');
  }
});
