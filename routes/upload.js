const express = require('express');
const fs = require('fs');
const PDFParser = require('pdf-parse');
const mammoth = require('mammoth');


// const PDFMerger = require('pdf-merger-js');
const path = require('path');

const router = express.Router();


// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await PDFParser(dataBuffer);
  return data.text;
}


// Function to extract text from DOCX
async function extractTextFromDocx(filePath) {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value;
}

// Function to merge PDFs
async function mergePDFs(pdfPaths, outputPath) {
  const merger = new PDFMerger();
  for (const pdfPath of pdfPaths) {
    await merger.add(pdfPath);
  }
  await merger.save(outputPath);
}

// Upload endpoint
router.post('/', async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const ext = path.extname(file.originalname).toLowerCase();
  let extractedText = '';

  try {
    if (ext === '.pdf') {
      extractedText = await extractTextFromPDF(file.path);
    } else if (ext === '.docx') {
      extractedText = await extractTextFromDocx(file.path);
    } else {
      return res.status(400).send('Unsupported file type.');
    }

    console.log('Extracted Text:', extractedText);
    // Here you can classify the document based on extracted text
    

    res.send('File processed successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file.');
  }
});




module.exports = router;
