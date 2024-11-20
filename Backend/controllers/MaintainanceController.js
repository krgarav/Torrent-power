import fs from 'fs';
import path from 'path';
import mysqldump from 'mysqldump';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const deleteDirectoryController = async (req, res) => {
    try {
        const { date, csa } = req.body;

        if (!date || !csa) {
            return res.status(400).json({ error: 'Date and application number are required' });
        }

        // Resolve the absolute path to the folder
        const folderPath = path.join(__dirname, '..', 'pdfs', date, csa);

        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to delete directory', error: err.message });
            }
            res.status(200).json({ success: true, message: 'Folder deleted successfully' });
        });
    } catch (error) {
        console.error('Error in delete directory:', error);
        res.status(500).json({ success: false, message: 'Error in delete directory', error });
    }
}

export const deletePdfController = async (req, res) => {
    try {
        const { date, csa, pdfNames } = req.body;

        if (!date || !csa || !pdfNames || !Array.isArray(pdfNames)) {
            return res.status(400).json({ error: 'Date, application number, and an array of PDF names are required' });
        }

        const deletionPromises = pdfNames.map((pdfName) => {
            return new Promise((resolve, reject) => {
                const pdfPath = path.join(__dirname, '..', 'pdfs', date, csa, pdfName);

                fs.unlink(pdfPath, (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            resolve({ pdfName, status: 'not_found' });
                        } else {
                            reject({ pdfName, status: 'error', error: err.message });
                        }
                    } else {
                        resolve({ pdfName, status: 'deleted' });
                    }
                });
            });
        });

        const results = await Promise.allSettled(deletionPromises);

        const response = results.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return result.reason;
            }
        });

        res.status(200).json({ success: true, message: 'Deletion completed', results: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in delete pdf', error });
    }
};

export const getDetailsController = async (req, res) => {
    try {
        const { date, csa } = req.body;

        if (!date || !csa) {
            return res.status(400).json({ error: 'Date and application number are required' });
        }

        // Resolve the absolute path to the folder
        const folderPath = path.join(__dirname, '..', 'pdfs', date, csa);

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).json({ success: false, message: 'Folder not found' });
                }
                return res.status(500).json({ success: false, message: 'Failed to list files', error: err.message });
            }

            // Filter to include only .pdf files
            const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

            res.status(200).json({ success: true, message: "All file names", pdfFiles });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in Fetch Details', error });
    }
}


export const downloadDatabaseData = async (req, res) => {
    try {
        const dumpPath = path.join(__dirname, 'db-dump.sql');

        // Dump the database
        await mysqldump({
            connection: {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'torrentpower',
            },
            dumpToFile: dumpPath,
        });

        // Send the dump file as a response for download
        res.download(dumpPath, 'database_dump.sql', (err) => {
            if (err) {
                console.error('Error sending dump file:', err);
                res.status(500).send('Error downloading the file.');
            }

            // Optionally, delete the file after download to clean up
            fs.unlinkSync(dumpPath);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in Downloading Data', error });
    }
}