import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Productos } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Obtener la fecha actual
const fechaActual = new Date();

// Formatear la fecha (opcional)
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
const año = fechaActual.getFullYear();

const fechaFormateada = `${dia}_${mes}_${año}`;
export const generarPDF = async (req, res) => {
  try {
    const productos = await Productos.findAll();
    const fechaFormateada = new Date().toISOString().split('T')[0];

    const docsPath = path.join(__dirname, '../public/docs');
    if (!fs.existsSync(docsPath)) fs.mkdirSync(docsPath, { recursive: true });

    const pdfPath = path.join(docsPath, `productos_reporte_${fechaFormateada}.pdf`);
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Título
    doc.fontSize(20).fillColor('#7952b3').text('Reporte de Productos', { align: 'center' });
    doc.moveDown(1.5);

    // Encabezados de tabla
    const headers = [
      '#', 'Nombre', 'P. Compra', 'P. Venta', 'Ganancia', 'Vendidos', 'Actual', 'Total', 'Status'
    ];
    const columnWidths = [20, 100, 60, 60, 60, 60, 60, 60, 50];
    const startX = 40;
    let y = doc.y;

    // Dibujar encabezados
    headers.forEach((header, i) => {
      doc.fontSize(10).fillColor('#ffffff').rect(startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], 20).fill('#7952b3');
      doc.fillColor('#ffffff').text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, y + 5, {
        width: columnWidths[i] - 4,
        align: 'center'
      });
    });

    y += 22;

    // Dibujar filas de productos
    productos.forEach((prod, i) => {
      const values = [
        i + 1,
        prod.nombre,
        `$${prod.precio_compra}`,
        `$${prod.precio_venta}`,
        `$${prod.ganancia}`,
        prod.cantidad_vendida,
        prod.cantidad_actual,
        `$${prod.total}`,
        prod.status
      ];

      values.forEach((value, j) => {
        doc
          .fontSize(9)
          .fillColor('#000')
          .text(value.toString(), startX + columnWidths.slice(0, j).reduce((a, b) => a + b, 0) + 2, y + 4, {
            width: columnWidths[j] - 4,
            align: 'center'
          });
      });

      // Línea divisoria
      y += 22;
      if (y >= doc.page.height - 40) {
        doc.addPage();
        y = 40;
      }
    });

    doc.end();
    res.download(pdfPath);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar PDF');
  }
};

  export const generarExcel = async (req, res) => {
    try {
      const productos = await Productos.findAll();
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Productos');
  
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 25 },
        { header: 'Precio Compra', key: 'precio_compra', width: 15 },
        { header: 'Precio Venta', key: 'precio_venta', width: 15 },
        { header: 'Ganancia', key: 'ganancia', width: 15 },
        { header: 'Cantidad Vendida', key: 'cantidad_vendida', width: 20 },
        { header: 'Cantidad Actual', key: 'cantidad_actual', width: 20 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Categoría ID', key: 'categoria_id', width: 15 },
      ];
  
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF7952B3' },
      };
  
      productos.forEach(prod => {
        worksheet.addRow({
          id: prod.id,
          nombre: prod.nombre,
          precio_compra: prod.precio_compra,
          precio_venta: prod.precio_venta,
          ganancia: prod.ganancia,
          cantidad_vendida: prod.cantidad_vendida,
          cantidad_actual: prod.cantidad_actual,
          total: prod.total,
          status: prod.status,
          categoria_id: prod.categoria_id
        });
      });
  
      const docsPath = path.join(__dirname, '../public/docs');
      if (!fs.existsSync(docsPath)) fs.mkdirSync(docsPath, { recursive: true });
  
      const excelPath = path.join(docsPath, `productos_reporte_${fechaFormateada}.xlsx`);
      await workbook.xlsx.writeFile(excelPath);
  
      res.download(excelPath);
    } catch (error) {
      console.error('Error al generar Excel:', error);
      res.status(500).send('Error al generar Excel');
    }
  };