import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const optimizeImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .resize({ width: 1200 }) // Adjust as needed
            .jpeg({ quality: 80 })   // Adjust quality as needed
            .toFile(outputPath);
    } catch (error) {
        throw new Error(`Error optimizing image: ${error.message}`);
    }
};

// Create or append to PDF function
export const createOrAppendPdfWithImages = async (imageNames, pdfPath) => {
    let pdfDoc;

    if (fs.existsSync(pdfPath)) {
        // If the PDF already exists, load it
        const existingPdfBytes = fs.readFileSync(pdfPath);
        pdfDoc = await PDFDocument.load(existingPdfBytes, {
            updateMetadata: false
        });
    } else {
        // If the PDF does not exist, create a new one
        pdfDoc = await PDFDocument.create();
    }

    for (const imageName of imageNames) {
        const imagePath = path.join(__dirname, '..', imageName);
        const optimizedImagePath = `${imagePath}.optimized`;

        // Optimize the image
        await optimizeImage(imagePath, optimizedImagePath);

        const imageBytes = fs.readFileSync(optimizedImagePath);
        const image = await pdfDoc.embedJpg(imageBytes);
        const { width, height } = image.scale(1);

        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width,
            height,
        });

        console.log(`Added image to PDF: ${imageName}`);
    }

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(pdfPath, pdfBytes);

    console.log(`PDF created or updated successfully: ${pdfPath}`);
};

export const createPdfWithImages = async (imageNames, pdfPath) => {
    const pdfDoc = await PDFDocument.create();

    for (const imageName of imageNames) {
        const imagePath = path.join(__dirname, '..', imageName);
        const optimizedImagePath = `${imagePath}.optimized`;

        // Optimize the image
        await optimizeImage(imagePath, optimizedImagePath);

        const imageBytes = fs.readFileSync(optimizedImagePath);
        const image = await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);
};


export const compressPdf = async (inputPdfPath, outputPdfPath) => {
    try {
        const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPdfPath), {
            updateMetadata: false
        });

        // Save the PDF with optimization
        const pdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            usePDF2: true,
            compress: true
        });

        fs.writeFileSync(outputPdfPath, pdfBytes);

        return outputPdfPath;
    } catch (error) {
        throw new Error(`Error compressing PDF: ${error.message}`);
    }
};