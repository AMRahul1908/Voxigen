import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Clock, User, ShieldCheck, HelpCircle } from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';
import { LocationItem } from '../types';
import { apiFetch } from '../utils/api';

const birthFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name (at least 2 characters)'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid birth date (YYYY-MM-DD)'),
  birthTime: z.string().optional().default('12:00'),
  birthTimeUnknown: z.boolean().default(false),
  birthPlace: z.string().trim().min(2, 'Please enter and select your place of birth'),
  latitude: z.number({ required_error: 'Please pick a birthplace from the list to resolve coordinates' }),
  longitude: z.number({ required_error: 'Please pick a birthplace from the list to resolve coordinates' }),
  timeZone: z.number({ required_error: 'Timezone offset is required' }),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).default('prefer_not_to_say')
});

type BirthFormData = z.infer<typeof birthFormSchema>;

interface BirthFormProps {
  initialValues?: Partial<BirthFormData>;
  buttonText?: string;
  onSuccess?: (chartId: string) => void;
  className?: string;
}

export const BirthForm: React.FC<BirthFormProps> = ({
  initialValues,
  buttonText = 'Generate My Kundali',
  onSuccess,
  className = ''
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BirthFormData>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      birthDate: initialValues?.birthDate || '1995-08-15',
      birthTime: initialValues?.birthTime || '14:30',
      birthTimeUnknown: initialValues?.birthTimeUnknown || false,
      birthPlace: initialValues?.birthPlace || 'New Delhi, Delhi, India',
      latitude: initialValues?.latitude || 28.6139,
      longitude: initialValues?.longitude || 77.2090,
      timeZone: initialValues?.timeZone || 5.5,
      gender: initialValues?.gender || 'prefer_not_to_say'
    }
  });

  const isUnknownTime = watch('birthTimeUnknown');

  const onSubmit = async (data: BirthFormData) => {
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTimeUnknown ? '12:00' : (data.birthTime || '12:00'),
        birthTimeUnknown: Boolean(data.birthTimeUnknown),
        birthPlace: data.birthPlace,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        timeZone: Number(data.timeZone),
        gender: data.gender
      };

      const res = await apiFetch<{ success: boolean; chartId: string }>(
        '/kundali/generate',
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      if (res.success && res.chartId) {
        if (onSuccess) {
          onSuccess(res.chartId);
        } else {
          navigate(`/kundali/${res.chartId}`);
        }
      } else {
        throw new Error('Unable to retrieve chart record');
      }
    } catch (err: any) {
      console.error('Kundali generation error:', err);
      setApiError(err.message || 'Failed to calculate Kundali. Please check your birth details.');
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
    <div className={`relative bg-cosmic-card/90 backdrop-blur-xl border border-cosmic-border rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-cosmic-card ${className}`}>
      {/* Decorative Gold Top Accent */}
      <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-36 h-[2px] bg-gradient-to-r from-transparent via-cosmic-gold to-transparent" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-cosmic-navy/90 backdrop-blur-md rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-cosmic-gold/30 border-t-cosmic-gold animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-cosmic-purple/40 border-b-cosmic-lavender animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cosmic-gold animate-pulse" />
            </div>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-cosmic-gold mb-2">
            Voxigen is calculating your Janam Kundali…
          </h3>
          <p className="text-sm text-cosmic-lavender/80 max-w-md">
            Computing planetary longitudes, Lahiri Ayanamsha, Lagna cusps, D1, D9 Navamsa, and 120-year Vimshottari Dasha timeline.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-cosmic-ivory">
          Enter Your Birth Details
        </h2>
        <p className="text-xs md:text-sm text-cosmic-lavender/70 mt-1">
          Precision astronomical calculations grounded in ancient Vedic Jyotish wisdom.
        </p>
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs md:text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">
            Full Name <span className="text-cosmic-gold">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-gold/80">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Aryabhata Sharma"
              className={`w-full pl-10 pr-4 py-3 bg-cosmic-surface/90 border rounded-xl text-sm text-cosmic-ivory placeholder-cosmic-lavender/40 focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 transition-all ${
                errors.name ? 'border-red-400/80 ring-1 ring-red-400/50' : 'border-cosmic-border-subtle focus:border-cosmic-gold/80'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-300 mt-1 font-medium">{errors.name.message}</p>}
        </div>

        {/* Date of Birth & Time of Birth Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">
              Date of Birth <span className="text-cosmic-gold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-gold/80">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                {...register('birthDate')}
                className={`w-full pl-10 pr-4 py-3 bg-cosmic-surface/90 border rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 transition-all ${
                  errors.birthDate ? 'border-red-400/80 ring-1 ring-red-400/50' : 'border-cosmic-border-subtle focus:border-cosmic-gold/80'
                }`}
              />
            </div>
            {errors.birthDate && <p className="text-xs text-red-300 mt-1 font-medium">{errors.birthDate.message}</p>}
          </div>

          {/* Time of Birth */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-cosmic-lavender">
                Time of Birth {!isUnknownTime && <span className="text-cosmic-gold">*</span>}
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-cosmic-lavender/80 hover:text-cosmic-gold">
                <input
                  type="checkbox"
                  {...register('birthTimeUnknown')}
                  className="rounded border-cosmic-border-subtle bg-cosmic-surface text-cosmic-gold focus:ring-cosmic-gold"
                />
                <span>Time unknown?</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-gold/80">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="time"
                disabled={isUnknownTime}
                {...register('birthTime')}
                className={`w-full pl-10 pr-4 py-3 bg-cosmic-surface/90 border rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  errors.birthTime ? 'border-red-400/80 ring-1 ring-red-400/50' : 'border-cosmic-border-subtle focus:border-cosmic-gold/80'
                }`}
              />
            </div>
            {isUnknownTime && (
              <p className="text-[11px] text-cosmic-lavender/60 mt-1 italic">
                Will calculate using Surya/Chandra Lagna analysis (noon standard).
              </p>
            )}
            {errors.birthTime && <p className="text-xs text-red-300 mt-1 font-medium">{errors.birthTime.message}</p>}
          </div>
        </div>

        {/* Place of Birth Autocomplete */}
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

        {/* Gender (Optional) */}
        <div>
          <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">
            Gender (Optional)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'male', label: 'Male' },
              { id: 'female', label: 'Female' },
              { id: 'other', label: 'Other' },
              { id: 'prefer_not_to_say', label: 'Skip' }
            ].map(g => (
              <label
                key={g.id}
                className="flex items-center justify-center p-2.5 rounded-xl border border-cosmic-border-subtle bg-cosmic-surface/50 text-xs font-medium text-cosmic-lavender/80 cursor-pointer hover:border-cosmic-gold/50 has-[:checked]:border-cosmic-gold has-[:checked]:bg-cosmic-purple/30 has-[:checked]:text-cosmic-gold transition-all"
              >
                <input
                  type="radio"
                  value={g.id}
                  {...register('gender')}
                  className="sr-only"
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl font-display font-semibold text-sm md:text-base tracking-wide bg-gradient-to-r from-cosmic-gold via-[#E8CF8C] to-cosmic-gold text-cosmic-navy shadow-gold hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>{buttonText}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-cosmic-lavender/50">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cosmic-gold" /> Lahiri Sidereal Ephemeris
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-cosmic-gold" /> 100% Free & Confidential
          </span>
        </div>
      </form>
    </div>
  );
};
