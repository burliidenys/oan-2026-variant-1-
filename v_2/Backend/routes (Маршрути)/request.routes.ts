import { Router } from 'express';
import * as ctrl from '../сontrollers (HTTP-запити, req, res)/request.controller';
const router = Router();
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;