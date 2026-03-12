import express, { Request, Response } from 'express';
import 'multer';
import { upload } from '../../middleware/upload.middleware';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Allow single file upload
router.post('/', authenticate, requireAdmin, upload.single('image'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Construct the accessible URL for the uploaded file
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error: any) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: error.message || 'Error uploading file' });
    }
});

// Allow multiple file uploads (e.g., for Campsite images)
router.post('/multiple', authenticate, requireAdmin, upload.array('images', 10), (req: Request, res: Response) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        
        const files = req.files as Express.Multer.File[];
        const fileUrls = files.map(file => `${protocol}://${host}/uploads/${file.filename}`);

        res.status(200).json({
            message: 'Files uploaded successfully',
            urls: fileUrls
        });
    } catch (error: any) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: error.message || 'Error uploading files' });
    }
});

export default router;
