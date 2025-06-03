import express from 'express';

import authentication, { authorizeAdmin } from '../middleware/auth.middleware.js';
import auditController from '../controller/audit.controller.js';


const router = express.Router();

router.get('/', authentication, authorizeAdmin,auditController );

export default router;
