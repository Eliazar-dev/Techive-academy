import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Download, Gift } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useSEO } from '../components/ui'

// Draws the shareable referral card as a PNG (no external service).
function drawCard(canvas, name, code, link) {
  const W = 1080, H = 1080, g = canvas.getContext('2d')
  canvas.width = W; canvas.height = H
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#e0f7ff'); bg.addColorStop(1, '#efe5ff')
  g.fillStyle = bg; g.fillRect(0, 0, W, H)
  const grad = g.createLinearGradient(0, 0, W, 0); grad.addColorStop(0, '#06c3ff'); grad.addColorStop(.6, '#7c5cff'); grad.addColorStop(1, '#a855f7')
  g.fillStyle = grad; g.fillRect(0, 0, W, 18)
  g.fillStyle = '#0a0a0b'; g.font = '800 40px sans-serif'; g.fillText('TECHIVE ACADEMY', 72, 120)
  g.font = '800 104px sans-serif'; g.fillText('Learn with me,', 72, 330); g.fillStyle = '#7c5cff'; g.fillText('get certified.', 72, 440)
  g.fillStyle = '#3f3f46'; g.font = '500 38px sans-serif'
  g.fillText(`${name} invites you to Techive Academy.`, 72, 540)
  g.fillText('Free certified courses + live Computer Packages.', 72, 595)
  g.fillStyle = '#fff'; g.beginPath(); g.roundRect(72, 680, 936, 220, 36); g.fill()
  g.fillStyle = '#71717a'; g.font = '700 30px sans-serif'; g.fillText('USE MY REFERRAL CODE', 112, 745)
  g.fillStyle = grad; g.font = '800 100px sans-serif'; g.fillText(code, 112, 850)
  g.fillStyle = '#0a0a0b'; g.font = '600 32px sans-serif'; g.fillText(link.replace(/^https?:\/\//, ''), 72, 975)
}

function Referral() {
  const { user } = useAuth()
  const [r, setR] = useState(null)
  const [copied, setCopied] = useState(false)
  const cv = useRef(null)
  useEffect(() => { api('/academy/referrals/').then(setR).catch(() => {}) }, [])
  if (!r) return null
  const copy = async () => { try { await navigator.clipboard.writeText(r.link); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ } }
  const download = () => {
    drawCard(cv.current, user?.first_name || 'A friend', r.code, r.link)
    const a = document.createElement('a'); a.download = `techive-referral-${r.code}.png`; a.href = cv.current.toDataURL('image/png'); a.click()
  }
  const share = `https://wa.me/?text=${encodeURIComponent(`Join me at Techive Academy! Register with my link: ${r.link}`)}`
  return (
    <section className="mt-12 rounded-3xl bg-gradient-to-br from-sky-100 to-violet-100 p-6 sm:p-8">
      <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-grad text-white"><Gift size={20} /></span><div><h2 className="text-xl font-extrabold">Refer a friend</h2><p className="text-sm text-zinc-600">Earn when a friend you referred pays for a paid course (e.g. KES 400 for Computer Packages).</p></div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Your code</p><p className="font-display text-3xl font-extrabold">{r.code}</p></div>
        <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Friends joined</p><p className="font-display text-3xl font-extrabold">{r.referred_count}</p></div>
        <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Earned / paid out</p><p className="font-display text-3xl font-extrabold">KES {r.earned + r.paid}<span className="text-base font-semibold text-zinc-500"> / {r.paid}</span></p></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3"><code className="min-w-0 flex-1 break-all text-sm">{r.link}</code>
        <button onClick={copy} className="btn-light !px-4 !py-2"><Copy size={15} />{copied ? 'Copied' : 'Copy'}</button></div>
      <div className="mt-4 flex flex-wrap gap-3"><a href={share} target="_blank" rel="noreferrer" className="btn-grad">Share on WhatsApp</a><button onClick={download} className="btn-light"><Download size={16} />Download referral card</button></div>
      {r.rewards.length > 0 && <ul className="mt-5 divide-y divide-white/70 rounded-2xl bg-white/70 text-sm">{r.rewards.map((x) => <li key={x.id} className="flex justify-between gap-3 px-4 py-3"><span>{x.friend} · {x.course}</span><b>KES {x.amount} <span className={x.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>({x.status === 'paid' ? 'paid out' : 'earned'})</span></b></li>)}</ul>}
      <canvas ref={cv} className="hidden" />
    </section>
  )
}

export default function Dashboard() {
  useSEO('My learning')
  const { user } = useAuth()
  const [regs, setRegs] = useState(null)
  useEffect(() => { api('/academy/registrations/').then((r) => setRegs(Array.isArray(r) ? r : r.results || [])).catch(() => setRegs([])) }, [])
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-extrabold">Hi {user?.first_name || 'there'} 👋</h1>
      <p className="mt-1 text-zinc-600">Continue where you left off.</p>
      {!regs && <div className="mt-8 h-32 animate-pulse rounded-2xl bg-zinc-200" />}
      {regs?.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center"><p className="font-semibold">You have not registered for a course yet.</p><Link to="/" className="btn-grad mt-5">Browse courses</Link></div>}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {regs?.map((r) => {
          const locked = r.course.price > 0 && r.payment_status !== 'paid'
          return (
            <div key={r.id} className="card">
              <h3 className="text-lg font-extrabold">{r.course.name}</h3>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-brand-grad" style={{ width: `${r.progress}%` }} /></div>
              <p className="mt-2 text-sm text-zinc-600">{r.status === 'completed' ? 'Completed 🎉' : `${r.progress}% complete`}{locked && ' · payment needed'}</p>
              <Link to={`/learn/${r.course.slug}`} className="btn-dark mt-5">{locked ? 'Pay & start' : r.progress ? 'Continue' : 'Start learning'}</Link>
            </div>
          )
        })}
      </div>
      <Referral />
    </div>
  )
}
