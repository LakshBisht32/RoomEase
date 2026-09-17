import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Label, Input, FieldError } from '../components/ui/Field';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { extractErrorMessage } from '../api/client';

const HIGHLIGHTS = [
  { icon: Sparkles, text: 'Set up your profile in under two minutes' },
  { icon: ShieldCheck, text: 'Verified listings and roommate profiles' },
  { icon: MessageCircle, text: 'Message owners and matches directly' },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created!');
      navigate('/dashboard');
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
            Join thousands finding
            <br />
            rooms and roommates.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">
            Create your account to save searches, list a property, or get matched with roommates near your college.
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
              “Signed up, listed my flat the same evening, and had verified student inquiries by morning.”
            </p>
            <p className="mt-3 text-xs font-semibold text-white/60">Rohan K. · Property owner</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-[56%]">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center lg:hidden">
            <Logo size={34} wordmarkClassName="text-xl" />
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-ink-900">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-500">Join as a student looking for a room, or an owner listing one.</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              { value: 'student', label: 'I’m a Student', icon: GraduationCap },
              { value: 'owner', label: 'I’m an Owner', icon: Building2 },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  form.role === value
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-500 hover:border-brand-200'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  className="pl-10"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Sharma"
                />
              </div>
            </div>
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
              <Label htmlFor="phone">Phone (optional)</Label>
              <div className="relative">
                <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <Input
                  id="phone"
                  autoComplete="tel"
                  className="pl-10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
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
                  minLength={8}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
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
              Create account
              {!loading && (
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Already a member</span>
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          <Link
            to="/login"
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
