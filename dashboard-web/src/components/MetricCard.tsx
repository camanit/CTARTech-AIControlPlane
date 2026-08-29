interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  colorClass?: string;
}

export default function MetricCard({ label, value, subtext, colorClass = "text-emerald-400" }: MetricCardProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl glass-panel">
      <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">{label}</h3>
      <p className={`text-3xl font-extrabold font-mono ${colorClass}`}>{value}</p>
      <span className="text-xs text-slate-500 mt-1 block font-medium">{subtext}</span>
    </div>
  );
}
