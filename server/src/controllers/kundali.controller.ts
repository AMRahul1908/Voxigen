import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { generateKundaliSchema, updateKundaliSchema } from '../validators/kundali.validator';
import { astrologyService } from '../services/astrology.service';
import { chartRepository } from '../repositories/chart.repository';
import { BirthDetailsInput } from '../types/astrology.types';

export class KundaliController {
  /**
   * POST /api/kundali/generate
   */
  public async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = generateKundaliSchema.parse(req.body);

      // Generate a collision-resistant unique chart ID (e.g. "vox_9f81a7b2")
      const chartId = `vox_${crypto.randomBytes(6).toString('hex')}`;

      // Calculate chart via Astrology Service (Navamsha API or Vedic Astronomy Engine)
      const chartData = await astrologyService.generateKundali(validatedInput as BirthDetailsInput, chartId);

      // Persist in database
      const savedChart = await chartRepository.create(chartData);

      res.status(201).json({
        success: true,
        message: 'Kundali calculated successfully',
        chartId: savedChart.chartId,
        data: savedChart
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/kundali/:id
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'Chart ID is required' });
        return;
      }

      const chart = await chartRepository.findByChartId(id);
      if (!chart) {
        res.status(404).json({
          success: false,
          message: `Kundali record not found for ID '${id}'. It may have expired or been deleted.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: chart
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/kundali/:id
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const existing = await chartRepository.findByChartId(id);
      if (!existing) {
        res.status(404).json({ success: false, message: `Kundali record '${id}' not found` });
        return;
      }

      const updates = updateKundaliSchema.parse(req.body);

      // Merge updated birth details
      const mergedInput: BirthDetailsInput = {
        name: updates.name ?? existing.name,
        birthDate: updates.birthDate ?? existing.birthDate,
        birthTime: updates.birthTime ?? existing.birthTime,
        birthTimeUnknown: updates.birthTimeUnknown ?? existing.birthTimeUnknown,
        birthPlace: updates.birthPlace ?? existing.birthPlace,
        latitude: updates.latitude ?? existing.latitude,
        longitude: updates.longitude ?? existing.longitude,
        timeZone: updates.timeZone ?? existing.timeZone,
        gender: updates.gender ?? (existing.gender as any)
      };

      // Recalculate chart with updated inputs
      const recalculated = await astrologyService.generateKundali(mergedInput, id);
      const updated = await chartRepository.updateByChartId(id, recalculated);

      res.status(200).json({
        success: true,
        message: 'Kundali updated and recalculated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/kundali/:id
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const success = await chartRepository.deleteByChartId(id);

      if (!success) {
        res.status(404).json({ success: false, message: `Kundali record '${id}' not found` });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Kundali record '${id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

export const kundaliController = new KundaliController();
