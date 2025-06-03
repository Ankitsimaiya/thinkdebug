import express from 'express';
import authentication from '../middleware/auth.middleware.js';
import { getFilesByOrganization } from '../controller/orgFile.controller.js';

const router = express.Router();

router.get('/:orgId/files', authentication, getFilesByOrganization);

export default router;
