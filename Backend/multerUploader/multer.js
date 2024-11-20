import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Define the path for the uploads directory
const uploadDir = path.join(process.cwd(), 'uploads');

// Function to ensure the uploads directory exists
async function ensureUploadDirExists() {
    try {
        await fs.access(uploadDir);
    } catch (error) {
        // Directory does not exist, create it
        await fs.mkdir(uploadDir, { recursive: true });
    }
}

// Ensure the directory exists when this module is loaded
await ensureUploadDirExists();

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        req['file_name'] = file.originalname;
        callback(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
