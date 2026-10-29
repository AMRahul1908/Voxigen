import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { KundaliChartData } from '../types';
import { apiFetch } from '../utils/api';
import { exportKundaliPDF } from '../utils/pdfGenerator';
import { ChartSwitcher } from '../components/charts/ChartSwitcher';
import { PlanetaryTable } from '../components/PlanetaryTable';
import { DashaTimeline } from '../components/DashaTimeline';
import { YogasCard } from '../components/YogasCard';
import { InterpretationsSection } from '../components/InterpretationsSection';
import { EditBirthDetailsModal } from '../components/EditBirthDetailsModal';
import {
  Download,
  Printer,
  Share2,
  Edit3,
  Home,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Compass,
  Moon,
  Sun,
  Star,
  Check,
  AlertTriangle
} from 'lucide-react';

export const KundaliPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chart, setChart] = useState<KundaliChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch chart by ID on mount or ID change
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    apiFetch<{ success: boolean; data: KundaliChartData }>(`/kundali/${id}`)
      .then(res => {
        if (isMounted) {
          if (res.success && res.data) {
            setChart(res.data);
          } else {
            setError('Could not retrieve chart record');
          }
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to fetch Kundali:', err);
          setError(err.message || 'Unable to retrieve Kundali record');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Share Link
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Voxigen Vedic Kundali — ${chart?.name}`,
          text: `Explore the Vedic birth chart of ${chart?.name} on Voxigen.`,
          url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    // Clipboard fallback
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-cosmic-gold/30 border-t-cosmic-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cosmic-gold animate-pulse" />
          </div>
        </div>
        <h2 className="font-display text-2xl font-semibold text-cosmic-gold mb-2">
          Retrieving Your Janam Kundali…
        </h2>
        <p className="text-xs text-cosmic-lavender/70">
          Loading calculated planetary positions, Lagna, and Vimshottari Dasha periods.
        </p>
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-cosmic-ivory mb-2">
          Chart Record Not Found
        </h2>
        <p className="text-xs text-cosmic-lavender/70 mb-6 font-sans">
          {error || 'This birth chart ID could not be located in our database.'}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full font-semibold text-xs bg-cosmic-gold text-cosmic-navy hover:bg-[#E8CF8C] transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Action Bar & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cosmic-border-subtle no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle text-cosmic-lavender hover:text-cosmic-gold hover:border-cosmic-gold/50 transition-colors"
            title="Return to Home"
          >
            <Home className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold text-cosmic-ivory">
              {chart.name}’s Janam Kundali
            </h1>
            <span className="text-[11px] text-cosmic-lavender/60">
              Chart ID: <span className="font-mono text-cosmic-gold">{chart.chartId}</span> • Provider:{' '}
              <span className="capitalize">{chart.calculationProvider.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Birth Details */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-cosmic-surface/80 border border-cosmic-border-subtle hover:border-cosmic-gold/50 text-cosmic-lavender hover:text-cosmic-ivory transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-cosmic-gold" />
            <span>Edit Details</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-cosmic-surface/80 border border-cosmic-border-subtle hover:border-cosmic-gold/50 text-cosmic-lavender hover:text-cosmic-ivory transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cosmic-gold" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-cosmic-surface/80 border border-cosmic-border-subtle hover:border-cosmic-gold/50 text-cosmic-lavender hover:text-cosmic-ivory transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-cosmic-gold" />
            <span>Print</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={() => exportKundaliPDF(chart)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cosmic-gold text-cosmic-navy hover:bg-[#E8CF8C] shadow-gold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Native Details Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-cosmic-card/80 backdrop-blur-md border border-cosmic-border shadow-cosmic-card grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 text-xs">
        <div className="min-w-0 space-y-1">
          <span className="text-[11px] text-cosmic-lavender/60 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cosmic-gold" /> Date of Birth
          </span>
          <p className="font-semibold text-cosmic-ivory text-sm">{chart.birthDate}</p>
        </div>

        <div className="min-w-0 space-y-1">
          <span className="text-[11px] text-cosmic-lavender/60 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cosmic-gold" /> Time of Birth
          </span>
          <p className="font-semibold text-cosmic-ivory text-sm">
            {chart.birthTimeUnknown ? 'Time Unknown (Noon Std)' : chart.birthTime}
          </p>
        </div>

        <div className="min-w-0 space-y-1">
          <span className="text-[11px] text-cosmic-lavender/60 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cosmic-gold" /> City of Birth
          </span>
          <p className="font-semibold text-cosmic-ivory text-sm break-words">
            {chart.birthPlace}
          </p>
          <p className="text-[10.5px] text-cosmic-lavender/50">
            UTC {chart.timeZone >= 0 ? `+${chart.timeZone}` : chart.timeZone}
          </p>
        </div>
      </div>

      {/* 4 Primary Astrological Badges (Lagna, Rashi, Sun Sign, Nakshatra) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lagna */}
        <div className="p-4 rounded-xl bg-cosmic-surface/70 border border-cosmic-border-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-purple/40 text-cosmic-gold flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-cosmic-lavender/60 uppercase tracking-wider block">
              Ascendant (Lagna)
            </span>
            <strong className="text-base text-cosmic-gold font-display font-semibold block">
              {chart.ascendant.sign}
            </strong>
            <span className="text-[10.5px] text-cosmic-lavender/70 font-mono">
              {chart.ascendant.degreeFormatted}
            </span>
          </div>
        </div>

        {/* Moon Sign */}
        <div className="p-4 rounded-xl bg-cosmic-surface/70 border border-cosmic-border-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-purple/40 text-cosmic-gold flex items-center justify-center font-bold">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-cosmic-lavender/60 uppercase tracking-wider block">
              Moon Sign (Rashi)
            </span>
            <strong className="text-base text-cosmic-gold font-display font-semibold block">
              {chart.moonSign.sign}
            </strong>
            <span className="text-[10.5px] text-cosmic-lavender/70 font-mono">
              Lord: {chart.moonSign.nakshatraLord}
            </span>
          </div>
        </div>

        {/* Sun Sign */}
        <div className="p-4 rounded-xl bg-cosmic-surface/70 border border-cosmic-border-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-purple/40 text-cosmic-gold flex items-center justify-center font-bold">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-cosmic-lavender/60 uppercase tracking-wider block">
              Sun Sign (Surya)
            </span>
            <strong className="text-base text-cosmic-gold font-display font-semibold block">
              {chart.sunSign.sign}
            </strong>
            <span className="text-[10.5px] text-cosmic-lavender/70 font-mono">
              House {chart.planetaryPositions.Sun?.house || 1}
            </span>
          </div>
        </div>

        {/* Janma Nakshatra */}
        <div className="p-4 rounded-xl bg-cosmic-surface/70 border border-cosmic-border-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-purple/40 text-cosmic-gold flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-cosmic-lavender/60 uppercase tracking-wider block">
              Janma Nakshatra
            </span>
            <strong className="text-base text-cosmic-gold font-display font-semibold block">
              {chart.janmaNakshatra.name}
            </strong>
            <span className="text-[10.5px] text-cosmic-lavender/70 font-mono">
              Pada {chart.janmaNakshatra.pada} • {chart.janmaNakshatra.deity}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Kundali Chart Switcher + Key Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive SVG Chart */}
        <div className="lg:col-span-6 space-y-6">
          <ChartSwitcher data={chart} />
        </div>

        {/* Right Side: Planetary Positions Table */}
        <div className="lg:col-span-6 space-y-6">
          <PlanetaryTable planets={chart.planetaryPositions} />
        </div>
      </div>

      {/* Vimshottari Dasha Timeline */}
      <DashaTimeline dasha={chart.dashaPeriods} />

      {/* Vedic Yogas & Drishti */}
      <YogasCard yogas={chart.yogas} aspects={chart.aspects} />

      {/* Comprehensive Interpretations Section */}
      <InterpretationsSection data={chart} />

      {/* Edit Details Modal */}
      <EditBirthDetailsModal
        chart={chart}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={updated => setChart(updated)}
      />
    </div>
  );
};
