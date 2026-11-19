/* Descarga la meta SMART como .docx con la identidad de Cognitive Observatory.
 * La librería se carga solo al hacer clic, para no pesar en la carga inicial. */

const PLUM = '3B1F4A';
const LILAC = '4E3592';
const MUTED = '3C4555';
const PAPER = 'F0EAE1';
const LINE = 'C9B4F7';
const SERIF = 'Georgia';
const SANS = 'Arial';

const LINKEDIN = 'https://linkedin.com/in/wendyRB-ai';

export async function downloadSmartDocx(smart, fields) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
    BorderStyle, ShadingType, Footer, ExternalHyperlink, AlignmentType,
  } = await import('docx');

  const value = (key) => (smart[key] ?? '').trim();
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const soft = { style: BorderStyle.SINGLE, size: 6, color: LINE };

  const rows = fields.map(([key, title, question]) => new TableRow({
    children: [
      new TableCell({
        width: { size: 3200, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: PAPER, color: 'auto' },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        borders: { top: soft, bottom: soft, left: none, right: none },
        children: [
          new Paragraph({ children: [new TextRun({ text: title.replace(/👣/gu, '').trim(), bold: true, font: SANS, size: 22, color: LILAC })] }),
          new Paragraph({ children: [new TextRun({ text: question, font: SANS, size: 19, color: MUTED })] }),
        ],
      }),
      new TableCell({
        width: { size: 6160, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 200, right: 160 },
        borders: { top: soft, bottom: soft, left: none, right: none },
        children: [new Paragraph({ children: [new TextRun({ text: value(key) || '—', font: SANS, size: 23, color: PLUM })] })],
      }),
    ],
  }));

  const goal = value('goal');
  const deadline = value('deadline');
  const sentence = goal ? `${goal}${deadline ? `, a más tardar el ${deadline}` : ''}.` : '';

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 8 } },
        children: [
          new TextRun({ text: 'Wendy Ramírez', bold: true, font: SANS, size: 18, color: PLUM }),
          new TextRun({ text: '  ·  Mentora BécALAS  ·  ', font: SANS, size: 18, color: MUTED }),
          new ExternalHyperlink({ link: LINKEDIN, children: [new TextRun({ text: 'linkedin.com/in/wendyRB-ai', font: SANS, size: 18, color: LILAC, underline: {} })] }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Poético en la superficie, científico en la estructura.', italics: true, font: SERIF, size: 20, color: LILAC })],
      }),
    ],
  });

  const doc = new Document({
    creator: 'Mentorías BécALAS · Cognitive Observatory',
    title: 'Mi meta SMART',
    styles: { default: { document: { run: { font: SANS, size: 22, color: PLUM } } } },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
      footers: { default: footer },
      children: [
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '✦  Bitácora · Mentorías BécALAS 2026', font: SANS, size: 19, color: LILAC })] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: 'Mi meta SMART', font: SERIF, size: 56, color: PLUM })] }),
        new Paragraph({ spacing: { after: 280 }, children: [new TextRun({ text: 'Una estrella lejana se vuelve alcanzable al enfocarla.', italics: true, font: SERIF, size: 26, color: MUTED })] }),
        ...(sentence ? [new Paragraph({
          spacing: { after: 320 },
          shading: { type: ShadingType.CLEAR, fill: PAPER, color: 'auto' },
          border: { top: { style: BorderStyle.DASHED, size: 8, color: LILAC, space: 8 }, bottom: { style: BorderStyle.DASHED, size: 8, color: LILAC, space: 8 }, left: { style: BorderStyle.DASHED, size: 8, color: LILAC, space: 8 }, right: { style: BorderStyle.DASHED, size: 8, color: LILAC, space: 8 } },
          children: [
            new TextRun({ text: 'Mi meta: ', bold: true, font: SANS, size: 26, color: LILAC }),
            new TextRun({ text: sentence, font: SERIF, size: 28, color: PLUM }),
          ],
        })] : []),
        new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [3200, 6160], rows }),
        new Paragraph({ spacing: { before: 360, after: 80 }, children: [new TextRun({ text: 'Notas de avance', font: SERIF, size: 30, color: PLUM })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [0, 1, 2, 3].map(() => new TableRow({
            height: { value: 520, rule: 'atLeast' },
            children: [new TableCell({ width: { size: 9360, type: WidthType.DXA }, borders: { top: none, left: none, right: none, bottom: soft }, children: [new Paragraph('')] })],
          })),
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi-meta-smart-becalas.docx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
