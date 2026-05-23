interface HeroSavingsProps {
  monthlySavings: number;
  annualSavings: number;
}

export function HeroSavings({ monthlySavings, annualSavings }: HeroSavingsProps) {
  return (
    <div className="text-center py-12 px-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
      
      <p className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-sm">Potential Annual Savings</p>
      
      <div className="flex flex-col items-center">
        <h2 className="text-7xl md:text-8xl font-black text-emerald-400 mb-2">
          ${annualSavings.toLocaleString()}
        </h2>
        <p className="text-2xl text-slate-300 font-bold">
          ${monthlySavings.toLocaleString()} / month
        </p>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-bold">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
          <span className="relative inline-flex w-2 h-2 bg-emerald-500 rounded-full"></span>
        </span>
        Audit Complete
      </div>
    </div>
  );
}
