import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(pdfPath) {
  try {
    const pdfData = fs.readFileSync(pdfPath);
    const pdfContent = await pdfParse(pdfData);
    return pdfContent.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return null;
  }
}

(async () => {
  const pdfPath = 'data/agreement_1737232136119.txt.pdf';
  const text = await extractTextFromPDF(pdfPath);
  console.log('Extracted text:', text);
})();

