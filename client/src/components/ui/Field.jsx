import { Children, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
      {children}
    </label>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, value, onChange, id, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef(null);

  const options = Children.toArray(children)
    .filter((child) => child.type === 'option')
    .map((child) => ({ value: child.props.value, label: child.props.children }));
  const selectedIndex = options.findIndex((o) => String(o.value) === String(value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const commit = (val) => {
    onChange?.({ target: { value: val } });
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(options.length - 1, h + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(0, h - 1)); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (highlighted >= 0) commit(options[highlighted].value); }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-left text-sm text-ink-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        <span className={`truncate ${selected ? '' : 'text-ink-400'}`}>{selected ? selected.label : placeholder || ''}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-60 w-full min-w-max overflow-auto rounded-lg border border-ink-200 bg-white p-1 text-sm shadow-lg shadow-ink-900/10"
        >
          {options.map((o, i) => {
            const isSelected = String(o.value) === String(value);
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => commit(o.value)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 transition-colors ${
                  i === highlighted ? 'bg-brand-50' : ''
                } ${isSelected ? 'font-semibold text-brand-700' : 'text-ink-700'}`}
              >
                {o.label}
                {isSelected && <Check size={14} className="text-brand-600" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      {...props}
    />
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{children}</p>;
}
