import express from 'express';
import authentication from '../middleware/auth.middleware.js';
import { downloadFile,  fileState,  upload , uploadFile } from '../controller/file.controller.js';


const router = express.Router();

router.post('/upload', authentication, upload.single('file'), uploadFile);
router.get('/download/:id', authentication, downloadFile);
router.get('/stats',authentication,fileState)

export default router;
