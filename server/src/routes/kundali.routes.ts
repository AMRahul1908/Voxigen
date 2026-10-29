import { Router } from 'express';
import { kundaliController } from '../controllers/kundali.controller';
import { kundaliGenerateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/generate', kundaliGenerateLimiter, kundaliController.generate.bind(kundaliController));
router.get('/:id', kundaliController.getById.bind(kundaliController));
router.put('/:id', kundaliController.update.bind(kundaliController));
router.delete('/:id', kundaliController.delete.bind(kundaliController));

export default router;
