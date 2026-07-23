import fs from "node:fs";
import path from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

class CanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext("2d") };
  }
  reset(target, width, height) {
    target.canvas.width = width;
    target.canvas.height = height;
  }
  destroy(target) {
    target.canvas.width = 0;
    target.canvas.height = 0;
    target.canvas = null;
    target.context = null;
  }
}

const input = path.resolve("tmp/pdfs/catalogo.pdf");
const outputDir = path.resolve("tmp/pdfs/rendered");
fs.mkdirSync(outputDir, { recursive: true });

const data = new Uint8Array(fs.readFileSync(input));
const pdf = await getDocument({ data, CanvasFactory }).promise;
const extracted = [];

for (let number = 1; number <= pdf.numPages; number += 1) {
  const page = await pdf.getPage(number);
  const viewport = page.getViewport({ scale: 1.6 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  fs.writeFileSync(path.join(outputDir, `pagina-${String(number).padStart(2, "0")}.png`), canvas.toBuffer("image/png"));
  const text = await page.getTextContent();
  extracted.push(`--- PÁGINA ${number} ---\n${text.items.map(item => item.str).join(" ")}`);
  console.log(`Renderizada ${number}/${pdf.numPages}`);
}

fs.writeFileSync(path.join(outputDir, "texto.txt"), extracted.join("\n\n"), "utf8");

const previewWidth = 420;
const previewHeight = 594;
const gap = 18;
const sheet = createCanvas(previewWidth * 4 + gap * 5, previewHeight * 2 + gap * 3);
const sheetContext = sheet.getContext("2d");
sheetContext.fillStyle = "#d8d5d0";
sheetContext.fillRect(0, 0, sheet.width, sheet.height);
for (let index = 0; index < pdf.numPages; index += 1) {
  const image = await loadImage(path.join(outputDir, `pagina-${String(index + 1).padStart(2, "0")}.png`));
  const x = gap + (index % 4) * (previewWidth + gap);
  const y = gap + Math.floor(index / 4) * (previewHeight + gap);
  sheetContext.drawImage(image, x, y, previewWidth, previewHeight);
}
fs.writeFileSync(path.join(outputDir, "contato.png"), sheet.toBuffer("image/png"));
console.log(`Total de páginas: ${pdf.numPages}`);
