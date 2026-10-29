import { Router } from 'express';
import { locationController } from '../controllers/location.controller';

const router = Router();

router.get('/search', locationController.search.bind(locationController));

export default router;
