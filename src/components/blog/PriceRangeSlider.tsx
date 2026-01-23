'use client';

import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function PriceRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceRangeSliderProps) {
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="relative h-8 py-2 price-range-slider">
      {/* Track Background */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-200 rounded-full -translate-y-1/2" />
      
      {/* Active Range */}
      <div 
        className="absolute top-1/2 h-2 bg-[#606C38] rounded-full -translate-y-1/2"
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`
        }}
      />
      
      {/* Min Handle Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={minValue}
        onChange={(e) => {
          const newMin = Number(e.target.value);
          if (newMin <= maxValue) {
            onMinChange(newMin);
          }
        }}
        className="absolute w-full h-4 bg-transparent appearance-none cursor-pointer z-10"
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      />
      
      {/* Max Handle Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={maxValue}
        onChange={(e) => {
          const newMax = Number(e.target.value);
          if (newMax >= minValue) {
            onMaxChange(newMax);
          }
        }}
        className="absolute w-full h-4 bg-transparent appearance-none cursor-pointer z-20"
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      />
      
    </div>
  );
}
