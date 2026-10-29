import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/location.service';

export class LocationController {
  public async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const results = await locationService.searchLocations(q);

      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err) {
      next(err);
    }
  }
}

export const locationController = new LocationController();
