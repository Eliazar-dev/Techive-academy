import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { Avatar } from './ui'
import { MAIN_SITE } from '../data'

export default function Layout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const link = ({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-ink text-white' : 'text-zinc-700 hover:bg-zinc-100'}`
  const out = () => { logout(); setOpen(false); nav('/') }
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="Techive" width="900" height="285" className="h-9 w-auto" />
            <span className="rounded-full bg-brand-grad px-2.5 py-1 font-display text-[11px] font-extrabold uppercase tracking-widest text-white">Academy</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <NavLink to="/" end className={link}>Courses</NavLink>
            {user && <NavLink to="/dashboard" className={link}>My learning</NavLink>}
            <NavLink to="/verify" className={link}>Verify certificate</NavLink>
            <a href={MAIN_SITE} className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Techive IT</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (<><Avatar user={user} size={34} /><button onClick={out} className="btn-light !px-4 !py-2"><LogOut size={15} />Log out</button></>) : (
              <><Link to="/auth" className="btn-light !px-4 !py-2">Log in</Link><Link to="/auth?mode=signup" className="btn-grad !px-5 !py-2">Register free</Link></>)}
          </div>
          <button className="rounded-lg p-2 md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="container-x flex flex-col gap-1 border-t border-zinc-200 pb-4 pt-3 md:hidden">
            <NavLink to="/" end className={link} onClick={() => setOpen(false)}>Courses</NavLink>
            {user && <NavLink to="/dashboard" className={link} onClick={() => setOpen(false)}>My learning</NavLink>}
            <NavLink to="/verify" className={link} onClick={() => setOpen(false)}>Verify certificate</NavLink>
            {user ? <button onClick={out} className="btn-light mt-2">Log out</button> : (
              <div className="mt-2 grid grid-cols-2 gap-2"><Link to="/auth" className="btn-light" onClick={() => setOpen(false)}>Log in</Link><Link to="/auth?mode=signup" className="btn-grad" onClick={() => setOpen(false)}>Register free</Link></div>)}
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-zinc-200 bg-white py-8 text-sm text-zinc-600">
        <div className="container-x flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} Techive IT Solutions. Techive Academy.</p>
          <a href={MAIN_SITE} className="font-semibold hover:text-ink">techive.co.ke</a>
        </div>
      </footer>
    </div>
  )
}
