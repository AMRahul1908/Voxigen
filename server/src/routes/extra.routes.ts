import { Router } from 'express';
import { extraController } from '../controllers/extra.controller';
import { requireAccount, requireServiceEntitlement } from './account.routes';

const router = Router();

router.get('/panchang/today', extraController.getPanchang.bind(extraController));
router.get('/horoscope/daily', requireAccount, requireServiceEntitlement('horoscope'), extraController.getHoroscope.bind(extraController));
router.post('/compatibility/calculate', extraController.calculateCompatibility.bind(extraController));

export default router;
