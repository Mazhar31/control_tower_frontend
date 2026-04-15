export default function FormField({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-slate-400 text-xs uppercase tracking-wider">{label}</label>
      <input
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
