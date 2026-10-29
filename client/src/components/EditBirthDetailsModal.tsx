import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, User, Sparkles } from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';
import { KundaliChartData, LocationItem } from '../types';
import { apiFetch } from '../utils/api';

const editSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required'),
  birthTime: z.string().optional(),
  birthTimeUnknown: z.boolean().default(false),
  birthPlace: z.string().trim().min(2, 'Place of birth is required'),
  latitude: z.number(),
  longitude: z.number(),
  timeZone: z.number()
});

type EditFormData = z.infer<typeof editSchema>;

interface EditBirthDetailsModalProps {
  chart: KundaliChartData;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (newChart: KundaliChartData) => void;
}

export const EditBirthDetailsModal: React.FC<EditBirthDetailsModalProps> = ({
  chart,
  isOpen,
  onClose,
  onUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: chart.name,
      birthDate: chart.birthDate,
      birthTime: chart.birthTime || '12:00',
      birthTimeUnknown: chart.birthTimeUnknown || false,
      birthPlace: chart.birthPlace,
      latitude: chart.latitude,
      longitude: chart.longitude,
      timeZone: chart.timeZone
    }
  });

  const isUnknown = watch('birthTimeUnknown');

  if (!isOpen) return null;

  const onSubmit = async (data: EditFormData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch<{ success: boolean; data: KundaliChartData }>(
        `/kundali/${chart.chartId}`,
        {
          method: 'PUT',
          body: JSON.stringify(data)
        }
      );

      if (res.success && res.data) {
        onUpdated(res.data);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update Kundali record');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (loc: LocationItem) => {
    setValue('birthPlace', loc.displayName || `${loc.city}, ${loc.country}`, { shouldValidate: true });
    setValue('latitude', loc.latitude, { shouldValidate: true });
    setValue('longitude', loc.longitude, { shouldValidate: true });
    setValue('timeZone', loc.timeZone, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-cosmic-card border border-cosmic-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-cosmic-border-subtle">
          <h3 className="font-display text-xl font-bold text-cosmic-ivory flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cosmic-gold" />
            Edit Birth Details & Recalculate
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-cosmic-lavender/60 hover:text-cosmic-ivory hover:bg-cosmic-surface/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-cosmic-gold/80" />
              <input
                type="text"
                {...register('name')}
                className="w-full pl-10 pr-4 py-2.5 bg-cosmic-surface border border-cosmic-border-subtle rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50"
              />
            </div>
            {errors.name && <p className="text-xs text-red-300 mt-1">{errors.name.message}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-cosmic-gold/80" />
                <input
                  type="date"
                  {...register('birthDate')}
                  className="w-full pl-10 pr-3 py-2.5 bg-cosmic-surface border border-cosmic-border-subtle rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-cosmic-lavender">Time of Birth</label>
                <label className="flex items-center gap-1 text-[11px] text-cosmic-lavender/70 cursor-pointer">
                  <input type="checkbox" {...register('birthTimeUnknown')} className="rounded" />
                  <span>Unknown?</span>
                </label>
              </div>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-cosmic-gold/80" />
                <input
                  type="time"
                  disabled={isUnknown}
                  {...register('birthTime')}
                  className="w-full pl-10 pr-3 py-2.5 bg-cosmic-surface border border-cosmic-border-subtle rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Place of Birth */}
          <Controller
            name="birthPlace"
            control={control}
            render={({ field }) => (
              <CityAutocomplete
                value={field.value}
                onChange={field.onChange}
                onSelectLocation={handleLocationSelect}
                error={errors.birthPlace?.message}
              />
            )}
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-cosmic-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-cosmic-lavender/80 hover:text-cosmic-ivory hover:bg-cosmic-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-cosmic-gold text-cosmic-navy hover:bg-[#E8CF8C] transition-all disabled:opacity-50"
            >
              {loading ? 'Recalculating…' : 'Save & Recalculate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
