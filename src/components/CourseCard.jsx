import { Link } from 'react-router-dom'
import { Clock, Award, Gift, Video } from 'lucide-react'
import { priceLabel } from '../lib/academy'

export default function CourseCard({ c }) {
  const free = c.is_free
  const soon = c.status !== 'open'
  return (
    <Link to={`/c/${c.slug}`} className="card group flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${free ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>{free ? 'Free to learn' : c.price ? 'Live classes' : 'Advanced'}</span>
        {soon && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Coming soon</span>}
      </div>
      <h3 className="mt-4 text-xl font-extrabold leading-snug">{c.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">{c.description}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-zinc-700">
        {c.duration && <li className="flex items-center gap-2"><Clock size={15} className="text-brand-cyan" />{c.duration}</li>}
        {c.mode && <li className="flex items-center gap-2"><Video size={15} className="text-brand-violet" />{c.mode === 'online' ? 'Online' : c.mode}</li>}
        {c.certificate_fee > 0 && free && <li className="flex items-center gap-2"><Award size={15} className="text-brand-blue" />Certificate: KES {c.certificate_fee}</li>}
        {c.referral_reward > 0 && <li className="flex items-center gap-2"><Gift size={15} className="text-brand-violet" />Refer a friend, earn KES {c.referral_reward}</li>}
      </ul>
      <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-4">
        <span className={`font-display text-2xl font-extrabold ${free ? 'text-emerald-600' : ''}`}>{priceLabel(c)}</span>
        <span className="text-sm font-semibold text-brand-blue group-hover:underline">View course →</span>
      </div>
    </Link>
  )
}
