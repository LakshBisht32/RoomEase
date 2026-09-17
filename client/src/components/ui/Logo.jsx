// A minimal house mark: roofline + walls in one continuous weight, with a
// single accent-colored door. Reads clearly at any size, no clutter.
function Mark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" className="fill-brand-600" />
      <path
        d="M8.5 17.5 16 10l7.5 7.5M11 16.5v7.5h10v-7.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="14.4" y="18.5" width="3.2" height="5.5" rx="0.6" className="fill-accent-400" />
    </svg>
  );
}

export default function Logo({ size = 36, showWordmark = true, wordmarkClassName = 'text-xl' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} />
      {showWordmark && (
        <span className={`font-display font-extrabold tracking-tight text-ink-900 ${wordmarkClassName}`}>
          RoomEase
        </span>
      )}
    </span>
  );
}
