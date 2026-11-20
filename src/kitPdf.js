/* PDFs descargables de los kits (ruta del semestre, registro de logros, historia STAR)
 * con la identidad gráfica de Wendy: observatorio, ámbar, marfil y amanecer.
 * jsPDF se carga solo al hacer clic, para no pesar en la carga inicial. */

const C = {
  ivory: [246, 247, 249],
  night: [11, 21, 40],
  blue: [17, 26, 46],
  amber: [227, 154, 45],
  dawn: [247, 230, 220],
  signal: [169, 196, 240],
  wine: [110, 70, 80],
  muted: [84, 92, 110],
  line: [214, 219, 228],
};
const PORTFOLIO = 'https://portafolio-wendyrb.vercel.app/';
const LINKEDIN = 'https://www.linkedin.com/in/wendyrb-ai/';
const SITE = 'https://becalas-observatory.vercel.app/';
const W = 215.9;
const H = 279.4;
const M = 18;

/* Las fuentes estándar de PDF no traen flechas, palomitas ni emojis. */
function clean(text) {
  return String(text ?? '')
    .replace(/→/g, '-')
    .replace(/[✓✔]/g, '')
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .trim();
}

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return d && m && y ? `${d} ${months[m - 1]} ${y}` : iso;
}

async function createDoc({ kicker, title, sub }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const state = { doc, y: 0, kicker };

  const paintPage = (first) => {
    doc.setFillColor(...C.ivory);
    doc.rect(0, 0, W, H, 'F');
    const bandH = first ? 46 : 14;
    doc.setFillColor(...C.night);
    doc.rect(0, 0, W, bandH, 'F');
    // Franja de amanecer: ámbar → vino
    const steps = 24;
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const mix = C.amber.map((a, k) => Math.round(a + (C.wine[k] - a) * t));
      doc.setFillColor(...mix);
      doc.rect((W / steps) * i, bandH, W / steps + 0.2, 1.6, 'F');
    }
    star(doc, W - M - 4, first ? 15 : 7, first ? 3.2 : 2);
    if (first) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...C.amber);
      doc.setCharSpace(0.6);
      doc.text(kicker.toUpperCase(), M, 14);
      doc.setCharSpace(0);
      doc.setFont('times', 'bold');
      doc.setFontSize(25);
      doc.setTextColor(255, 255, 255);
      doc.text(title, M, 27);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...C.signal);
      doc.text(sub, M, 36);
      state.y = 60;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...C.amber);
      doc.text(`${kicker.toUpperCase()} · ${title}`, M, 9);
      state.y = 26;
    }
  };

  state.paintPage = paintPage;
  state.ensure = (needed) => {
    if (state.y + needed > H - 24) {
      doc.addPage();
      paintPage(false);
    }
  };
  paintPage(true);
  return state;
}

function star(doc, cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 8; i += 1) {
    const rad = (Math.PI / 4) * i - Math.PI / 2;
    const len = i % 2 === 0 ? r : r * 0.32;
    pts.push([cx + Math.cos(rad) * len, cy + Math.sin(rad) * len]);
  }
  doc.setFillColor(...C.amber);
  const lines = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  doc.lines(lines, pts[0][0], pts[0][1], [1, 1], 'F', true);
}

function finish(state, filename) {
  const { doc } = state;
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.3);
    doc.line(M, H - 15, W - M, H - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text('Mentoría BécALAS 2026 · Wendy Ramírez Burgos', M, H - 10);
    doc.setTextColor(...C.wine);
    const x1 = 112;
    doc.textWithLink('Portafolio', x1, H - 10, { url: PORTFOLIO });
    doc.setTextColor(...C.muted);
    doc.text('·', x1 + 16, H - 10);
    doc.setTextColor(...C.wine);
    doc.textWithLink('LinkedIn', x1 + 19, H - 10, { url: LINKEDIN });
    doc.setTextColor(...C.muted);
    doc.text('·', x1 + 33, H - 10);
    doc.setTextColor(...C.wine);
    doc.textWithLink('Micrositio', x1 + 36, H - 10, { url: SITE });
    doc.setTextColor(...C.muted);
    doc.text(`${p} / ${pages}`, W - M, H - 10, { align: 'right' });
  }
  doc.save(filename);
}

function label(state, text) {
  const { doc } = state;
  state.ensure(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.wine);
  doc.setCharSpace(0.5);
  doc.text(clean(text).toUpperCase(), M, state.y);
  doc.setCharSpace(0);
  state.y += 5.5;
}

function paragraph(state, text, { size = 10.5, font = 'helvetica', style = 'normal', color = C.blue, width = W - 2 * M, x = M, gap = 2 } = {}) {
  const { doc } = state;
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(clean(text), width);
  const lh = size * 0.42;
  lines.forEach((ln) => {
    state.ensure(lh + 1);
    doc.text(ln, x, state.y);
    state.y += lh;
  });
  state.y += gap;
}

function highlight(state, title, text, placeholder) {
  const { doc } = state;
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  const body = clean(text) || placeholder;
  const lines = doc.splitTextToSize(body, W - 2 * M - 14);
  const h = 13 + lines.length * 6;
  state.ensure(h + 4);
  doc.setFillColor(...C.dawn);
  doc.roundedRect(M, state.y, W - 2 * M, h, 3, 3, 'F');
  doc.setFillColor(...C.amber);
  doc.rect(M, state.y, 1.6, h, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.wine);
  doc.text(title.toUpperCase(), M + 7, state.y + 7);
  doc.setFont('times', text ? 'italic' : 'normal');
  doc.setFontSize(14);
  doc.setTextColor(...(text ? C.night : C.muted));
  lines.forEach((ln, i) => doc.text(ln, M + 7, state.y + 14 + i * 6));
  state.y += h + 8;
}

function checkbox(doc, x, y, done) {
  doc.setDrawColor(...C.wine);
  doc.setLineWidth(0.4);
  if (done) {
    doc.setFillColor(...C.amber);
    doc.roundedRect(x, y, 4.2, 4.2, 0.8, 0.8, 'FD');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.7);
    doc.line(x + 0.9, y + 2.2, x + 1.8, y + 3.2);
    doc.line(x + 1.8, y + 3.2, x + 3.4, y + 1.1);
  } else {
    doc.roundedRect(x, y, 4.2, 4.2, 0.8, 0.8, 'S');
  }
}

function writeLine(doc, x1, x2, y) {
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.3);
  doc.line(x1, y, x2, y);
}

function stamp(state) {
  const today = new Date().toISOString().slice(0, 10);
  paragraph(state, `Descargada el ${formatDate(today)} desde becalas-observatory.vercel.app`, { size: 8.5, color: C.muted, gap: 0 });
}

/* ═════════ Ruta del semestre ═════════ */
export async function downloadRutaPdf(route, routeRows) {
  const s = await createDoc({ kicker: 'BécALAS 2026 · Kit de la Noche 2', title: 'Mi ruta del semestre', sub: 'Tu meta, tus oportunidades y sus fechas: el mapa de tu semestre' });
  const { doc } = s;
  highlight(s, 'Mi meta', route.meta, 'Escribe aquí tu meta en una frase.');

  label(s, 'Mis oportunidades');
  const colType = M + 10;
  const colWhat = M + 52;
  const colDate = W - M;
  routeRows.forEach(([id, typeLabel, , dateLabel]) => {
    const row = route.rows?.[id] ?? { what: '', date: '', done: false };
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const whatLines = row.what ? doc.splitTextToSize(clean(row.what), colDate - colWhat - 34) : [];
    const h = Math.max(16, 9 + whatLines.length * 4.6 + 5);
    s.ensure(h + 2);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, s.y, W - 2 * M, h, 2.5, 2.5, 'FD');
    checkbox(doc, M + 3.5, s.y + 5, row.done);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.wine);
    doc.text(doc.splitTextToSize(typeLabel, colWhat - colType - 3), colType, s.y + 8);
    if (whatLines.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...C.night);
      whatLines.forEach((ln, i) => doc.text(ln, colWhat, s.y + 8 + i * 4.6));
    } else {
      writeLine(doc, colWhat, colDate - 36, s.y + 9);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text(dateLabel, colDate - 3, s.y + 5.5, { align: 'right' });
    if (row.date) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...C.blue);
      doc.text(formatDate(row.date), colDate - 3, s.y + 10.5, { align: 'right' });
    } else {
      writeLine(doc, colDate - 30, colDate - 3, s.y + 11);
    }
    s.y += h + 2.5;
  });
  s.y += 4;

  label(s, 'Mi revisión semanal');
  if (route.review) paragraph(s, route.review, { size: 11.5, font: 'times', style: 'italic', color: C.night, gap: 5 });
  else { s.ensure(10); writeLine(doc, M, W - M, s.y + 3); s.y += 10; }

  label(s, 'Cómo usarla');
  ['Pégala donde la veas: tu escritorio, tu celular o tu agenda.', 'Cada semana, 15 minutos: marca lo que hiciste y agrega una oportunidad nueva.', 'Guarda la fecha de cierre, no solo el enlace. Filtra todo con tu meta: ¿esto me acerca a ella?'].forEach((t, i) => {
    paragraph(s, `${i + 1}.  ${t}`, { size: 10, color: C.blue, gap: 1 });
  });
  s.y += 4;
  stamp(s);
  finish(s, 'mi-ruta-del-semestre-becalas.pdf');
}

/* ═════════ Registro de logros ═════════ */
export async function downloadLogrosPdf(list) {
  const s = await createDoc({ kicker: 'BécALAS 2026 · Kit de la Noche 2', title: 'Mi registro de logros', sub: 'Lo que hiciste y lo que cambió: la base de tu CV y tus historias STAR' });
  const { doc } = s;
  paragraph(s, `${list.length} ${list.length === 1 ? 'logro registrado' : 'logros registrados'}. Ni minimizar ni inflar: solo lo que pasó, con datos.`, { size: 10.5, color: C.muted, gap: 6 });
  list.forEach((a) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const what = doc.splitTextToSize(clean(a.what), W - 2 * M - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const res = a.result ? doc.splitTextToSize(`Resultado: ${clean(a.result)}`, W - 2 * M - 12) : [];
    const h = 12 + what.length * 4.8 + res.length * 4.4 + 3;
    s.ensure(h + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, s.y, W - 2 * M, h, 2.5, 2.5, 'FD');
    const area = clean(a.area).toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const pw = doc.getTextWidth(area) + 5;
    doc.setFillColor(...C.dawn);
    doc.roundedRect(M + 6, s.y + 3.5, pw, 5, 2.4, 2.4, 'F');
    doc.setTextColor(...C.wine);
    doc.text(area, M + 8.5, s.y + 7);
    doc.setFontSize(11);
    doc.setTextColor(...C.night);
    what.forEach((ln, i) => doc.text(ln, M + 6, s.y + 14 + i * 4.8));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...C.blue);
    res.forEach((ln, i) => doc.text(ln, M + 6, s.y + 14 + what.length * 4.8 + i * 4.4));
    s.y += h + 3;
  });
  s.y += 4;
  label(s, 'Para la Noche 3');
  paragraph(s, 'Elige tus 3 logros con mejor resultado: uno va a tu perfil, todos a tu CV y uno se vuelve tu historia STAR.', { size: 10, gap: 6 });
  stamp(s);
  finish(s, 'mi-registro-de-logros-becalas.pdf');
}

/* ═════════ Historia STAR ═════════ */
export async function downloadStarPdf(star, fields, cheat) {
  const s = await createDoc({ kicker: 'BécALAS 2026 · Kit de la Noche 3', title: 'Mi historia STAR', sub: 'Titular, situación, tarea, acción, resultado y aprendizaje' });
  const v = (k) => clean(star[k]);
  highlight(s, 'Mi titular', v('headline'), 'El resultado en una oración.');
  fields.filter(([k]) => k !== 'headline').forEach(([key, title, q]) => {
    label(s, title);
    if (v(key)) paragraph(s, v(key), { size: 11, color: C.night, gap: 5 });
    else { paragraph(s, q, { size: 9.5, color: C.muted, gap: 1 }); s.ensure(10); writeLine(s.doc, M, W - M, s.y + 3); s.y += 9; }
  });
  if (cheat) {
    label(s, 'Mi acordeón');
    cheat.split('\n').slice(1).forEach((ln) => paragraph(s, ln, { size: 10.5, color: C.blue, gap: 1 }));
    s.y += 4;
  }
  paragraph(s, 'Léela en voz alta: debe durar entre 1:30 y 2 minutos. Memoriza solo la primera frase, 4 palabras clave y el cierre.', { size: 9.5, color: C.muted, gap: 6 });
  stamp(s);
  finish(s, 'mi-historia-star-becalas.pdf');
}
