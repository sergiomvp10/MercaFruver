import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALES_LOG_DIR = path.join(__dirname, '../../ventas_logs');

if (!fs.existsSync(SALES_LOG_DIR)) {
  fs.mkdirSync(SALES_LOG_DIR, { recursive: true });
}

const COLOMBIA_TIMEZONE = 'America/Bogota';

const getColombiaDate = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: COLOMBIA_TIMEZONE }));
};

const getLogFileName = () => {
  const today = getColombiaDate();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return path.join(SALES_LOG_DIR, `ventas_${dateStr}.txt`);
};

const formatTime = (date) => {
  return date.toLocaleTimeString('es-CO', { 
    timeZone: COLOMBIA_TIMEZONE,
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
};

const formatDate = (date) => {
  return date.toLocaleDateString('es-CO', { 
    timeZone: COLOMBIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export const logSale = async (saleId, itemsSale, productNames) => {
  try {
    const logFile = getLogFileName();
    const now = new Date();
    const timeStr = formatTime(now);
    
    let logEntry = `\n${'='.repeat(50)}\n`;
    logEntry += `VENTA #${saleId} - ${timeStr}\n`;
    logEntry += `${'='.repeat(50)}\n`;
    
    let totalVenta = 0;
    
    itemsSale.forEach((item, index) => {
      const productName = productNames[index] || 'Producto desconocido';
      const subtotal = item.price_sale * item.amount;
      totalVenta += subtotal;
      
      logEntry += `  Producto: ${productName}\n`;
      logEntry += `  Cantidad: ${item.amount}\n`;
      logEntry += `  Precio unitario: ${formatMoney(item.price_sale)}\n`;
      logEntry += `  Subtotal: ${formatMoney(subtotal)}\n`;
      logEntry += `  ${'-'.repeat(30)}\n`;
    });
    
    logEntry += `  TOTAL VENTA: ${formatMoney(totalVenta)}\n`;
    logEntry += `${'='.repeat(50)}\n`;
    
    fs.appendFileSync(logFile, logEntry, 'utf8');
    
    console.log(`Venta #${saleId} registrada en ${logFile}`);
    return true;
  } catch (error) {
    console.error('Error al registrar venta en archivo:', error);
    return false;
  }
};

export const initDailyLog = () => {
  const logFile = getLogFileName();
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-CO', { 
    timeZone: COLOMBIA_TIMEZONE,
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  if (!fs.existsSync(logFile)) {
    const header = `${'#'.repeat(60)}\n`;
    const title = `#  REGISTRO DE VENTAS - ${dateStr.toUpperCase()}  #\n`;
    const footer = `${'#'.repeat(60)}\n\n`;
    
    fs.writeFileSync(logFile, header + title + footer, 'utf8');
    console.log(`Archivo de ventas creado: ${logFile}`);
  }
  
  return logFile;
};
