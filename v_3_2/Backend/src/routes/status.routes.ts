import { Router } from 'express';
import * as ctrl from '../сontrollers/status.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

export default router;