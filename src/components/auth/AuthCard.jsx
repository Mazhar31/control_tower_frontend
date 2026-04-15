export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
