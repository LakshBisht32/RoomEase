export default function PageBackdrop({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-50 ${className}`}>
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent-200/50 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}
