import React, { useState } from 'react';
import { KundaliChartData, DivisionalChart } from '../../types';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import { EastIndianChart } from './EastIndianChart';
import { Compass, Sparkles } from 'lucide-react';

interface ChartSwitcherProps {
  data: KundaliChartData;
}

export type ChartStyle = 'north' | 'south' | 'east';
export type VargaCode = 'd1' | 'd9' | 'd10';

export const ChartSwitcher: React.FC<ChartSwitcherProps> = ({ data }) => {
  const [style, setStyle] = useState<ChartStyle>('north');
  const [varga, setVarga] = useState<VargaCode>('d1');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const activeChart: DivisionalChart = data.divisionalCharts[varga];

  return (
    <div className="bg-cosmic-card backdrop-blur-md rounded-2xl border border-cosmic-border p-5 md:p-6 shadow-cosmic-card">
      {/* Top Header: Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cosmic-border-subtle pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cosmic-gold" />
            <h3 className="text-xl font-display font-semibold text-cosmic-ivory">
              Vedic Kundali Chart
            </h3>
          </div>
          <p className="text-xs text-cosmic-lavender/70 mt-1">
            {activeChart.title} — {activeChart.description}
          </p>
        </div>

        {/* Divisional Charts Selector (D1 / D9 / D10) */}
        <div className="flex items-center bg-cosmic-navy/80 rounded-xl p-1 border border-cosmic-border-subtle">
          <button
            type="button"
            onClick={() => { setVarga('d1'); setSelectedHouse(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              varga === 'd1'
                ? 'bg-cosmic-gold text-cosmic-navy shadow-sm'
                : 'text-cosmic-lavender/80 hover:text-cosmic-ivory'
            }`}
          >
            D1 Rashi
          </button>
          <button
            type="button"
            onClick={() => { setVarga('d9'); setSelectedHouse(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              varga === 'd9'
                ? 'bg-cosmic-gold text-cosmic-navy shadow-sm'
                : 'text-cosmic-lavender/80 hover:text-cosmic-ivory'
            }`}
          >
            D9 Navamsa
          </button>
          <button
            type="button"
            onClick={() => { setVarga('d10'); setSelectedHouse(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              varga === 'd10'
                ? 'bg-cosmic-gold text-cosmic-navy shadow-sm'
                : 'text-cosmic-lavender/80 hover:text-cosmic-ivory'
            }`}
          >
            D10 Dashamsa
          </button>
        </div>
      </div>

      {/* Style Selector Tabs (North / South / East) */}
      <div className="flex items-center justify-between mt-4 mb-6">
        <span className="text-xs font-medium text-cosmic-lavender/70 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cosmic-gold" />
          Chart Style:
        </span>
        <div className="flex gap-2">
          {(['north', 'south', 'east'] as ChartStyle[]).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-all border ${
                style === s
                  ? 'border-cosmic-gold bg-cosmic-purple/40 text-cosmic-gold shadow-sm'
                  : 'border-transparent text-cosmic-lavender/60 hover:text-cosmic-ivory'
              }`}
            >
              {s} Indian
            </button>
          ))}
        </div>
      </div>

      {/* Render Selected Chart */}
      <div className="py-2 flex justify-center">
        {style === 'north' && (
          <NorthIndianChart
            chart={activeChart}
            highlightHouse={selectedHouse}
            onSelectHouse={setSelectedHouse}
          />
        )}
        {style === 'south' && (
          <SouthIndianChart
            chart={activeChart}
            highlightHouse={selectedHouse}
            onSelectHouse={setSelectedHouse}
          />
        )}
        {style === 'east' && (
          <EastIndianChart
            chart={activeChart}
            highlightHouse={selectedHouse}
            onSelectHouse={setSelectedHouse}
          />
        )}
      </div>

      {/* Selected House Details Drawer / Callout */}
      {selectedHouse && (
        <div className="mt-4 p-3.5 rounded-xl bg-cosmic-indigo/40 border border-cosmic-border-subtle flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-cosmic-gold/20 text-cosmic-gold flex items-center justify-center font-bold text-sm">
              H{selectedHouse}
            </span>
            <div>
              <p className="text-xs font-semibold text-cosmic-ivory">
                {data.houses[selectedHouse - 1]?.bhavaName || `House ${selectedHouse}`}
              </p>
              <p className="text-[11px] text-cosmic-lavender/70">
                Sign: {data.houses[selectedHouse - 1]?.signName} (Lord: {data.houses[selectedHouse - 1]?.signLord})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedHouse(null)}
            className="text-xs text-cosmic-lavender/60 hover:text-cosmic-gold px-2 py-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-cosmic-border-subtle flex flex-wrap items-center justify-between text-[11px] text-cosmic-lavender/60">
        <span>Ascendant (Lagna): <strong className="text-cosmic-gold">{activeChart.lagnaSignName}</strong></span>
        <span>Ayanamsha: <strong className="text-cosmic-ivory">{data.ayanamsha} ({data.ayanamshaDegree}°)</strong></span>
        <span>System: <strong className="text-cosmic-ivory">Whole Sign (Parashari)</strong></span>
      </div>
    </div>
  );
};
