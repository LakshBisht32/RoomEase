import { useEffect, useRef, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { createCollege } from '../../api/colleges';
import { extractErrorMessage } from '../../api/client';
import Button from './Button';

// A type-to-filter college picker: falls back to a small "add your college"
// form (name + city, since colleges.city is required) when nothing in the
// seeded list matches what was typed, instead of leaving people stuck with
// only a handful of pre-loaded colleges to choose from.
export default function CollegeCombobox({
  colleges,
  value,
  onChange,
  onCollegeCreated,
  id,
  placeholder = 'Search colleges…',
  className = '',
  allowCreate = true,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(-1);
  const [addingCity, setAddingCity] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const rootRef = useRef(null);

  const selected = colleges.find((c) => String(c.id) === String(value));
  const q = query.trim().toLowerCase();
  const filtered = q ? colleges.filter((c) => c.name.toLowerCase().includes(q)) : colleges;
  const exactMatch = colleges.some((c) => c.name.trim().toLowerCase() === q);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setAddingCity(false);
      setNewCity('');
      setCreateError('');
    }
  }, [open]);

  const selectExisting = (c) => {
    onChange?.({ target: { value: String(c.id) } });
    setQuery(c.name);
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!newCity.trim()) {
      setCreateError('City is required.');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const college = await createCollege(query.trim(), newCity.trim());
      onCollegeCreated?.(college);
      onChange?.({ target: { value: String(college.id) } });
      setQuery(college.name);
      setOpen(false);
    } catch (err) {
      setCreateError(extractErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setOpen(true);
        setQuery(selected?.name || '');
      }
      return;
    }
    if (e.key === 'Escape') { setOpen(false); return; }
    if (addingCity) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(filtered.length - 1, h + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(0, h - 1)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) {
        selectExisting(filtered[highlighted]);
      } else if (allowCreate && query.trim() && !exactMatch) {
        setAddingCity(true);
        setNewCity('');
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={open ? query : (selected?.name || '')}
        onFocus={() => { setOpen(true); setQuery(selected?.name || ''); setHighlighted(-1); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); setAddingCity(false); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${className}`}
      />

      {open && (
        <ul role="listbox" className="absolute z-30 mt-1.5 max-h-60 w-full min-w-max overflow-auto rounded-lg border border-ink-200 bg-white p-1 text-sm shadow-lg shadow-ink-900/10">
          {filtered.map((c, i) => {
            const isSelected = String(c.id) === String(value);
            return (
              <li
                key={c.id}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => selectExisting(c)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 transition-colors ${
                  i === highlighted ? 'bg-brand-50' : ''
                } ${isSelected ? 'font-semibold text-brand-700' : 'text-ink-700'}`}
              >
                <span className="truncate">{c.name}<span className="ml-1.5 text-xs font-normal text-ink-400">{c.city}</span></span>
                {isSelected && <Check size={14} className="shrink-0 text-brand-600" />}
              </li>
            );
          })}

          {filtered.length === 0 && (!q || !allowCreate) && (
            <li className="px-3 py-2 text-ink-400">{q ? 'No matches.' : 'No colleges yet.'}</li>
          )}

          {allowCreate && q && !exactMatch && (
            addingCity ? (
              <li className="border-t border-ink-100 p-2">
                <p className="px-1 pb-1.5 text-xs text-ink-500">
                  Add "<span className="font-semibold text-ink-700">{query.trim()}</span>" as a new college
                </p>
                <div className="flex gap-1.5 px-1">
                  <input
                    autoFocus
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); handleCreate(); }
                      if (e.key === 'Escape') setAddingCity(false);
                    }}
                    placeholder="City"
                    className="w-0 flex-1 rounded-md border border-ink-200 px-2 py-1.5 text-xs outline-none focus:border-brand-500"
                  />
                  <Button type="button" size="sm" className="px-2.5 py-1.5 text-xs" loading={creating} onClick={handleCreate}>
                    Add
                  </Button>
                </div>
                {createError && <p className="mt-1 px-1 text-xs text-red-600">{createError}</p>}
              </li>
            ) : (
              <li
                role="option"
                onClick={() => { setAddingCity(true); setNewCity(''); }}
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-brand-700 hover:bg-brand-50"
              >
                <Plus size={14} /> Add "{query.trim()}" as a new college
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
