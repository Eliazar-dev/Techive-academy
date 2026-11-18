import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Clock, Award, Gift, Check } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useSEO } from '../components/ui'
import { priceLabel } from '../lib/academy'
import NotFound from './NotFound'

export default function Course() {
  const { slug } = useParams()
  const [qs] = useSearchParams()
  const { user, ready } = useAuth()
  const nav = useNavigate()
  const [c, setC] = useState(null)
  const [missing, setMissing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  useSEO(c?.name || 'Course', c?.description, c?.slug ? `https://academy.techiveitsolution.co.ke/c/${c.slug}` : 'https://academy.techiveitsolution.co.ke/')
  useEffect(() => { api(`/academy/courses/${slug}/`).then(setC).catch(() => setMissing(true)) }, [slug])

  async function join() {
    if (!user) return nav(`/auth?mode=signup&next=${encodeURIComponent(`/c/${slug}?go=1`)}`)
    setBusy(true); setErr('')
    try { await api('/academy/registrations/', { method: 'POST', body: { course: slug } }); nav(`/learn/${slug}`) } catch (e) { setErr(e.message); setBusy(false) }
  }
  // coming back from sign-up with ?go=1 → register straight away
  useEffect(() => { if (ready && user && c && qs.get('go') === '1' && c.status === 'open') join() }, [ready, user, c]) // eslint-disable-line react-hooks/exhaustive-deps

  if (missing) return <NotFound />
  if (!c) return <div className="container-x py-24"><div className="h-64 animate-pulse rounded-2xl bg-zinc-200" /></div>
  const open = c.status === 'open'
  const free = c.is_free
  return (
    <div className="container-x py-12">
      <Link to="/" className="text-sm font-semibold text-zinc-500 hover:text-ink">← All courses</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${free ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>{free ? 'Free to learn' : 'Paid course'}</span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{c.name}</h1>
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-zinc-700">{c.description}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.duration && <li className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"><Clock className="text-brand-cyan" />{c.duration}</li>}
            <li className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"><Check className="text-emerald-500" />{c.lessons} lessons</li>
            <li className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"><Award className="text-brand-blue" />{c.certificate_fee > 0 ? `Certificate: KES ${c.certificate_fee}` : 'Certificate included'}</li>
            {c.referral_reward > 0 && <li className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"><Gift className="text-brand-violet" />Refer a friend, earn KES {c.referral_reward}</li>}
          </ul>
          <p className="mt-6 text-sm text-zinc-600">To earn the certificate you pass a short quiz and submit a small project.</p>
        </div>
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-black/5 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{free ? 'Learning is' : 'Course fee'}</p>
          <p className={`font-display text-5xl font-extrabold ${free ? 'text-emerald-600' : ''}`}>{priceLabel(c)}</p>
          {free && c.certificate_fee > 0 && <p className="mt-1 text-sm text-zinc-600">Certificate: KES {c.certificate_fee} (only if you want it)</p>}
          {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
          {open ? <button onClick={join} disabled={busy} className="btn-grad mt-6 w-full">{busy ? 'Please wait…' : user ? 'Register for this course' : 'Sign up & register'}</button>
            : <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">Registration opens soon.</p>}
          {!user && open && <p className="mt-3 text-center text-sm text-zinc-600">Have an account? <Link className="font-bold underline" to={`/auth?next=${encodeURIComponent(`/c/${slug}?go=1`)}`}>Log in</Link></p>}
          {c.next_course_slug && <p className="mt-5 border-t border-zinc-100 pt-4 text-sm text-zinc-600">Next step after this: <Link className="font-bold text-brand-blue" to={`/c/${c.next_course_slug}`}>advanced course →</Link></p>}
        </aside>
      </div>
    </div>
  )
}
