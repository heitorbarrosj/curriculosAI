import PDFDocument from "pdfkit";
import JSZip from "jszip";
import { resumeService } from "./resume.service.js";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function paragraph(text: string, bold = false) {
  const runProps = bold ? "<w:rPr><w:b/></w:rPr>" : "";
  return `<w:p><w:r>${runProps}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

async function buildDocx(title: string, text: string) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.folder("word")?.file("document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraph(title, true)}
    ${text.split("\n").map((line) => paragraph(line)).join("\n")}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>`);
  return zip.generateAsync({ type: "nodebuffer" });
}

export const exportService = {
  async pdf(userId: string, resumeId: string) {
    const resume = await resumeService.getOwned(resumeId, userId);
    const text = resume.optimizedText ?? resume.cleanedText;
    const doc = new PDFDocument({ margin: 48 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.fontSize(20).text(resume.candidateName ?? resume.title, { underline: true });
    doc.moveDown();
    doc.fontSize(11).text(text, { lineGap: 4 });
    doc.end();
    await new Promise((resolve) => doc.on("end", resolve));
    return Buffer.concat(chunks);
  },

  async docx(userId: string, resumeId: string) {
    const resume = await resumeService.getOwned(resumeId, userId);
    return buildDocx(resume.candidateName ?? resume.title, resume.optimizedText ?? resume.cleanedText);
  }
};
