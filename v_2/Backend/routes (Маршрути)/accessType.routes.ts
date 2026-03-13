import { Router } from 'express';
import * as ctrl from '../сontrollers (HTTP-запити, req, res)/accessType.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);

export default router;