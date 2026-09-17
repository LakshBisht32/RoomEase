import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users, Search as SearchIcon, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Label, Input, FieldError } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { extractErrorMessage } from '../api/client';

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Verified listings, owners and roommates' },
  { icon: SearchIcon, text: 'Filter by budget, campus and habits' },
  { icon: Users, text: 'Message owners and matches directly' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-ink-50">
      {/* Brand panel */}
      <div className="relative hidden w-[44%] overflow-hidden bg-brand-900 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 15% 10%, rgba(63,99,144,0.55) 0%, rgba(15,23,42,0) 60%), radial-gradient(55% 45% at 90% 85%, rgba(234,90,55,0.35) 0%, rgba(15,23,42,0) 60%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative px-12 pt-12">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <Logo size={34} showWordmark={false} />
            <span className="font-display text-xl font-extrabold tracking-tight text-white">RoomEase</span>
          </Link>
        </div>

        <div className="relative px-12">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
            Find your next room,
            <br />
            without the guesswork.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">
            Log in to pick up right where you left off — saved searches, conversations and listings, all in one
            place.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
                  <Icon size={16} />
                </span>
                <span className="text-sm font-medium text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative px-12 pb-12">
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-sm italic leading-relaxed text-white/80">
              “Found a verified PG near campus in two days — messaging the owner directly made it so much easier.”
            </p>
            <p className="mt-3 text-xs font-semibold text-white/60">Ananya R. · RoomEase user</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-[56%]">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center lg:hidden">
            <Logo size={34} wordmarkClassName="text-xl" />
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-ink-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-500">Log in to manage listings, roommates and connections.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <FieldError>{error}</FieldError>

            <Button type="submit" className="w-full group" size="lg" loading={loading}>
              Log in
              {!loading && (
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-ink-400">New here</span>
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          <Link
            to="/signup"
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
