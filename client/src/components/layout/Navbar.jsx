import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Users, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import toast from 'react-hot-toast';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-brand-700'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
  }`;

function initials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 shadow-sm shadow-ink-900/[0.03] backdrop-blur-lg">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 transition-transform hover:scale-[1.02]">
          <Logo size={34} wordmarkClassName="text-xl" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink-200/70 bg-ink-50/60 p-1 md:flex">
          <NavLink to="/search" className={navLinkClass}>Browse Rooms</NavLink>
          <NavLink to="/roommates" className={navLinkClass}>Find Your Roomies</NavLink>
          {user?.role === 'owner' && <NavLink to="/dashboard/listings/new" className={navLinkClass}>List a Property</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-white">
                  {initials(user.name) || <LayoutDashboard size={14} />}
                </span>
                <span className="group-hover:text-brand-700">{user.name?.split(' ')[0]}</span>
              </Link>
              <span className="h-6 w-px bg-ink-200" />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700">
                Log in
              </Link>
              <Button as={Link} to="/signup" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 text-ink-600 transition-colors hover:bg-ink-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200/70 bg-white/95 px-4 pb-4 pt-3 shadow-lg backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink onClick={() => setOpen(false)} to="/search" className={mobileLinkClass}>
              <Search size={16} /> Browse Rooms
            </NavLink>
            <NavLink onClick={() => setOpen(false)} to="/roommates" className={mobileLinkClass}>
              <Users size={16} /> Find Your Roomies
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink onClick={() => setOpen(false)} to="/admin" className={mobileLinkClass}>
                <ShieldCheck size={16} /> Admin
              </NavLink>
            )}
            {user ? (
              <>
                <div className="my-1 h-px bg-ink-100" />
                <NavLink onClick={() => setOpen(false)} to="/dashboard" className={mobileLinkClass}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                    {initials(user.name)}
                  </span>
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button as={Link} to="/login" variant="secondary" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Log in
                </Button>
                <Button as={Link} to="/signup" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
