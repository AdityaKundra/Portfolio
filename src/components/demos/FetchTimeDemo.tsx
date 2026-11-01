export const FetchTimeDemo = () => (
  <div>
    <dl className="space-y-3">
      {[
        { label: 'Before', value: 100, tone: 'bg-line' },
        { label: 'After', value: 60, tone: 'bg-accent' },
      ].map((row) => (
        <div key={row.label} className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
          <dt className="eyebrow">{row.label}</dt>
          <dd className="flex items-center gap-2">
            <span className={`h-6 ${row.tone}`} style={{ width: `${row.value * 0.85}%` }} />
            <span className="font-mono text-xs">{row.value}</span>
          </dd>
        </div>
      ))}
    </dl>
    <p className="mt-3 text-xs text-muted">Relative data fetch time, with the starting point set to 100, showing the 40% reduction.</p>
  </div>
)
