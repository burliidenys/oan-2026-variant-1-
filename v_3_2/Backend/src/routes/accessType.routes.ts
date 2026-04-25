import { Router } from 'express';
import * as ctrl from '../сontrollers/accessType.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);

export default router;