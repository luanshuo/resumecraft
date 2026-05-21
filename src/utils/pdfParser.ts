// ========================================
// PDF 文本提取 — 使用 hasEOL 保持原始换行
// ========================================

let pdfjsLib: any = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  const mod = await import('pdfjs-dist');
  pdfjsLib = mod;
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  return pdfjsLib;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjs = await loadPdfJs();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // 利用 hasEOL 标记恢复原始换行，同时用 Y 坐标检测段落间隙
    const items: any[] = content.items;
    const lines: string[] = [];
    let line = '';
    let lastY: number | null = null;

    for (const item of items) {
      const y = item.transform?.[5] ?? 0;

      // Y 坐标明显跳跃 → 新段落/新行
      if (lastY !== null && Math.abs(y - lastY) > 8) {
        if (line.trim()) lines.push(line.trim());
        line = '';
      }

      line += (line ? ' ' : '') + item.str;

      // hasEOL 标记 → 强制换行
      if (item.hasEOL) {
        if (line.trim()) lines.push(line.trim());
        line = '';
      }

      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());

    pageTexts.push(lines.join('\n'));
  }

  return pageTexts.join('\n');
}
