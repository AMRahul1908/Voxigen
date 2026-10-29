import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { LocationItem } from '../types';
import { apiFetch } from '../utils/api';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectLocation: (loc: LocationItem) => void;
  error?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  onSelectLocation,
  error
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal query when value prop changes externally (e.g. edit mode)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiFetch<{ success: boolean; data: LocationItem[] }>(
          `/locations/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.success && res.data) {
          setResults(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Failed to search locations', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationItem) => {
    const formatted = loc.displayName || `${loc.city}, ${loc.country}`;
    setQuery(formatted);
    onChange(formatted);
    onSelectLocation(loc);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-medium text-cosmic-lavender mb-1.5">
        Place of Birth <span className="text-cosmic-gold">*</span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-gold/80">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="e.g. New Delhi, Mumbai, London, New York"
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-3 bg-cosmic-surface/90 border rounded-xl text-sm text-cosmic-ivory placeholder-cosmic-lavender/40 focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50 transition-all ${
            error ? 'border-red-400/80 ring-1 ring-red-400/50' : 'border-cosmic-border-subtle focus:border-cosmic-gold/80'
          }`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-cosmic-lavender/50">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cosmic-gold" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-300 mt-1 font-medium">{error}</p>}

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-cosmic-indigo/95 backdrop-blur-xl border border-cosmic-border rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-fadeIn">
          {results.map((loc, idx) => (
            <button
              key={`${loc.city}-${loc.latitude}-${idx}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-2.5 hover:bg-cosmic-purple/40 border-b border-cosmic-border-subtle last:border-none flex items-start gap-2.5 transition-colors group"
            >
              <MapPin className="w-4 h-4 text-cosmic-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cosmic-ivory truncate">
                  {loc.city} {loc.state ? `, ${loc.state}` : ''}
                </p>
                <p className="text-xs text-cosmic-lavender/60 truncate">
                  {loc.country} • UTC {loc.timeZone >= 0 ? `+${loc.timeZone}` : loc.timeZone}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
