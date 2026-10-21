import { useState } from 'react';
import { budgetCategories, calculateBudget, initialBudgets, type BudgetRates } from '@/data/travelGuide';

const styles = ['mid-range', 'premium'] as const;
const inputClass = 'mt-2 min-h-11 w-full min-w-0 rounded-xl border border-white/15 bg-stone-950 px-3 py-2 text-sm tabular-nums text-white transition-colors hover:border-white/25 focus:border-amber-400';

export function TravelBudget({ days, onDaysChange }: { days: number; onDaysChange: (days: number) => void }) {
  const [people, setPeople] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [rates, setRates] = useState(initialBudgets);
  const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  const update = (style: typeof styles[number], key: keyof BudgetRates, value: string) => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 100000) return;
    setRates(previous => ({ ...previous, [style]: { ...previous[style], [key]: number } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-white">A budget you can make your own</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-400">Compare mid-range and premium travel, including a 10% contingency. All amounts are USD. Starting values are illustrative planning inputs, not researched local averages or live quotes. Replace them with prices for your dates; convert local-currency quotes to USD first.</p>
      </div>
      <div className="grid grid-cols-2 items-end gap-3 rounded-xl border border-white/10 bg-stone-900/30 p-3 sm:grid-cols-3 sm:p-4">
        <label className="col-span-2 min-w-0 text-xs text-stone-300 sm:col-span-1">Trip length
          <select className={inputClass} value={days} onChange={event => onDaysChange(Number(event.target.value))}>
            {[3, 5, 7, 10, 14].map(day => <option key={day} value={day}>{day} days / {day - 1} nights</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs text-stone-300">Travellers
          <select className={inputClass} value={people} onChange={event => setPeople(Number(event.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(count => <option key={count} value={count}>{count}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs text-stone-300">Rooms per night
          <select className={inputClass} value={rooms} onChange={event => setRooms(Number(event.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(count => <option key={count} value={count}>{count}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {styles.map(style => {
          const budget = calculateBudget(rates[style], days, people, rooms);
          return (
            <article key={style} className={`rounded-2xl border p-5 sm:p-6 ${style === 'premium' ? 'border-amber-400/30 bg-amber-400/5' : 'border-white/10 bg-stone-900'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-semibold capitalize text-white">{style}</h4>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${style === 'premium' ? 'bg-amber-400/10 text-amber-300' : 'bg-white/5 text-stone-300'}`}>Illustrative · USD</span>
              </div>
              <p className="mt-1 text-xs text-stone-400">Adjust daily rates to suit your trip</p>
              <div className="mt-5 divide-y divide-white/5">
                {budgetCategories.map(category => (
                  <label key={category.key} className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3 py-2 text-sm text-stone-300">
                    <span>{category.label}<span className="mt-1 block text-xs text-stone-500">USD / {category.unit}</span></span>
                    <input className={`${inputClass} !mt-0 text-right`} aria-label={`${style} ${category.label} USD per ${category.unit}`} type="number" min="0" max="100000" step="1" value={rates[style][category.key]} onChange={event => update(style, category.key, event.target.value)} />
                  </label>
                ))}
              </div>
              <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                {budget.lines.map(line => <div key={line.key} className="flex justify-between gap-3 text-stone-400"><dt>{budgetCategories.find(category => category.key === line.key)?.label} total</dt><dd>{money(line.amount)}</dd></div>)}
                <div className="flex justify-between text-stone-400"><dt>Contingency (10%)</dt><dd>{money(budget.contingency)}</dd></div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white/5 px-3 py-4 font-semibold text-white"><dt className="text-sm">Whole trip</dt><dd aria-live="polite" className="text-2xl tracking-tight tabular-nums">{money(budget.total)}</dd></div>
                <div className="flex justify-between text-amber-300"><dt>Per person / day</dt><dd>{money(budget.total / people / days)}</dd></div>
              </dl>
            </article>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-stone-400">Accommodation uses {days - 1} nights × {rooms} room(s); other categories use {days} days × {people} traveller(s). Check room occupancy yourself. International flights, intercity transfers, visas, insurance, deposits and exceptional activities are excluded. Taxes, seasonality and exchange rates may change the final cost.</p>
      <button type="button" onClick={() => setRates(initialBudgets)} className="text-sm text-amber-300 underline underline-offset-4">Reset illustrative rates</button>
    </div>
  );
}
