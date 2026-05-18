import jsPDF           from 'jspdf';
import autoTable       from 'jspdf-autotable';
import { formatFecha } from './format';

export const generarFacturaPDF = (venta) => {
  const doc = new jsPDF();

  // ─── Colores ───────────────────────────────────────────
  const azul   = [78, 154, 241];
  const oscuro = [26, 31, 46];
  const gris   = [136, 146, 164];

  // ─── Encabezado ────────────────────────────────────────
  doc.setFillColor(...azul);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FARMACIA', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión Farmacéutica', 14, 22);
  doc.text('RUC: 0912345678001', 14, 28);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 196, 15, { align: 'right' });
  doc.setFontSize(11);
  doc.text(venta.numero_factura, 196, 22, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${formatFecha(venta.created_at)}`, 196, 28, { align: 'right' });

  // ─── Datos del cliente ─────────────────────────────────
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 38, 210, 28, 'F');

  doc.setTextColor(...oscuro);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', 14, 47);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gris);
  doc.text('Cliente:', 14, 54);
  doc.text('Cédula/RUC:', 14, 60);
  doc.text('Atendido por:', 110, 54);

  doc.setTextColor(...oscuro);
  doc.setFont('helvetica', 'bold');
  doc.text(venta.cliente?.nombre || 'Consumidor Final', 40, 54);
  doc.text(venta.cliente?.cedula_ruc || '9999999999', 40, 60);
  doc.text(venta.usuario?.nombre || '—', 140, 54);

  // ─── Tabla de productos ────────────────────────────────
  doc.setTextColor(...oscuro);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DE PRODUCTOS', 14, 76);

  autoTable(doc, {
    startY:      80,
    head: [['#', 'Producto', 'Lote', 'Cant.', 'P. Unitario', 'Subtotal']],
    body: venta.detalles?.map((d, i) => [
      i + 1,
      d.producto?.nombre || '—',
      d.lote?.numero_lote || '—',
      d.cantidad,
      `$${parseFloat(d.precio_unitario).toFixed(2)}`,
      `$${parseFloat(d.subtotal).toFixed(2)}`
    ]),
    headStyles: {
      fillColor:  azul,
      textColor:  [255, 255, 255],
      fontStyle:  'bold',
      fontSize:   9
    },
    bodyStyles: {
      fontSize:   9,
      textColor:  oscuro
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });

  // ─── Totales ───────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;

  doc.setFillColor(245, 247, 250);
  doc.rect(120, finalY, 76, 36, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gris);
  doc.text('Subtotal:', 125, finalY + 8);
  doc.text('Descuento:', 125, finalY + 15);
  doc.text('IVA 15%:', 125, finalY + 22);

  doc.setTextColor(...oscuro);
  doc.text(`$${parseFloat(venta.subtotal).toFixed(2)}`,  192, finalY + 8,  { align: 'right' });
  doc.text(`-$${parseFloat(venta.descuento).toFixed(2)}`, 192, finalY + 15, { align: 'right' });
  doc.text(`$${parseFloat(venta.impuesto).toFixed(2)}`,  192, finalY + 22, { align: 'right' });

  // Total
  doc.setFillColor(...azul);
  doc.rect(120, finalY + 27, 76, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', 125, finalY + 34);
  doc.text(`$${parseFloat(venta.total).toFixed(2)}`, 192, finalY + 34, { align: 'right' });

  // ─── Pie de página ─────────────────────────────────────
  const pieY = finalY + 50;
  doc.setDrawColor(...azul);
  doc.setLineWidth(0.5);
  doc.line(14, pieY, 196, pieY);

  doc.setTextColor(...gris);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Gracias por su compra', 105, pieY + 7, { align: 'center' });
  doc.text('Este documento es un comprobante de su compra', 105, pieY + 12, { align: 'center' });

  // ─── Guardar PDF ───────────────────────────────────────
  doc.save(`Factura-${venta.numero_factura}.pdf`);
};