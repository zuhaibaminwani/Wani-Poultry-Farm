import React, { useState } from 'react';
import { INITIAL_BREEDS } from '../data/poultryData';
import { Calendar, Clock, Thermometer, Droplets, Eye, AlertTriangle, CheckCircle, Sparkles, Printer } from 'lucide-react';

export const IncubationCalculator: React.FC = () => {
  const [settingDate, setSettingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBreedId, setSelectedBreedId] = useState<string>('wyandotte');

  const selectedBreed = INITIAL_BREEDS.find(b => b.id === selectedBreedId) || INITIAL_BREEDS[0];

  const startDate = new Date(settingDate);

  const addDays = (date: Date, days: number): Date => {
    const res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const milestones = [
    {
      day: 0,
      title: 'Egg Setting & Warm-Up',
      date: addDays(startDate, 0),
      temp: '37.5°C (99.5°F)',
      humidity: '50% – 55%',
      turning: 'Rest 2h after setting, then turn 3–5x daily',
      notes: 'Allow eggs to reach room temperature before loading into pre-warmed incubator. Place pointy end down.',
      icon: '🥚',
    },
    {
      day: 7,
      title: 'First Candling Inspection',
      date: addDays(startDate, 7),
      temp: '37.5°C (99.5°F)',
      humidity: '50% – 55%',
      turning: 'Continue turning 3–5x daily',
      notes: 'Dark room inspection: look for spider-like blood vein network and embryo dot. Discard infertile/clear eggs.',
      icon: '🔍',
    },
    {
      day: 14,
      title: 'Second Candling Inspection',
      date: addDays(startDate, 14),
      temp: '37.5°C (99.5°F)',
      humidity: '50% – 55%',
      turning: 'Continue turning 3–5x daily',
      notes: 'Embryo fills over half of the egg; air cell should have expanded clearly at the blunt end.',
      icon: '🔎',
    },
    {
      day: 18,
      title: 'Lockdown Phase (Crucial)',
      date: addDays(startDate, 18),
      temp: '37.2°C – 37.5°C',
      humidity: '65% – 70% (High)',
      turning: 'STOP ALL TURNING COMPLETELY',
      notes: 'Remove automatic turning cradles. Place eggs on non-slip hatching mat. Do NOT open incubator lid unnecessarily.',
      icon: '🔒',
    },
    {
      day: 21,
      title: 'Expected Hatch Day! 🐣',
      date: addDays(startDate, 21),
      temp: '37.2°C (99.0°F)',
      humidity: '65% – 70%',
      turning: 'No turning',
      notes: 'Chicks internally pip, then break shell (external pip). Let chicks dry and fluff up before moving to brooder.',
      icon: '🐣',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="incubation-tool" className="py-20 bg-[#fbf9f4] text-[#1c2e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow border border-red-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advanced Incubation Planner</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-red-950 mb-3">
            21-Day Hatching Schedule Generator
          </h2>

          <p className="text-stone-600 text-sm sm:text-base">
            Select the day you set your fertile eggs from Wani Poultry Farm to generate an exact date-by-date incubator schedule, candling milestones, and lockdown alerts.
          </p>
        </div>

        {/* Control Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 mb-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            
            {/* Setting Date Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                1. Incubation Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-red-800 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={settingDate}
                  onChange={(e) => setSettingDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>
            </div>

            {/* Breed Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                2. Select Fertile Egg Breed
              </label>
              <select
                value={selectedBreedId}
                onChange={(e) => setSelectedBreedId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-red-700 cursor-pointer"
              >
                {INITIAL_BREEDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Fertile: ₹{b.fertileEggPrice})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-red-900 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>Target Hatch Date: <strong>{formatDate(addDays(startDate, 21))}</strong></span>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Milestone Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {milestones.map((m, idx) => (
            <div
              key={m.day}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                m.day === 21
                  ? 'bg-gradient-to-b from-amber-50 to-amber-100/60 border-amber-300 shadow-lg scale-102 ring-2 ring-amber-400/50'
                  : m.day === 18
                  ? 'bg-gradient-to-b from-red-50 to-red-100/50 border-red-200 shadow-md'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div>
                {/* Day Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md ${
                    m.day === 21
                      ? 'bg-amber-400 text-red-950 font-bold'
                      : m.day === 18
                      ? 'bg-red-800 text-white'
                      : 'bg-gradient-to-r from-red-900 to-red-950 text-amber-300'
                  }`}>
                    DAY {m.day}
                  </span>
                  <span className="text-xl">{m.icon}</span>
                </div>

                {/* Calendar Date */}
                <p className="text-xs font-bold text-stone-900 mb-1">
                  {formatDate(m.date)}
                </p>

                <h4 className="font-display font-bold text-sm text-red-950 mb-3">
                  {m.title}
                </h4>

                {/* Parameters */}
                <div className="space-y-1.5 text-[11px] bg-stone-50/90 p-2.5 rounded-xl border border-stone-200/80 mb-3">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Thermometer className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{m.temp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{m.humidity}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-stone-600 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-tight">{m.turning}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {m.notes}
                </p>
              </div>

              {m.day === 21 && (
                <div className="mt-4 pt-3 border-t border-amber-300/80 text-center">
                  <span className="text-[11px] font-bold text-red-950 block">
                    🐣 Welcome Chicks!
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
