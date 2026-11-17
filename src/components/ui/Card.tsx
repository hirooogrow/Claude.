type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function ComingSoonBadge({ label = "準備中" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-600">
      {label}
    </span>
  );
}

export function SectionTitle({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between px-1">
      <h2 className="text-sm font-bold text-ink">{children}</h2>
      {aside}
    </div>
  );
}
