import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Wallet, Award, Gift, MessageCircle } from 'lucide-react'
import { api } from '../lib/api'
import { useContent } from '../lib/content'
import { useSEO } from '../components/ui'
import CourseCard from '../components/CourseCard'

const ICONS = { Register: GraduationCap, Learn: Wallet, 'Get certified': Award, 'Refer friends': Gift }

export default function Home() {
  const c = useContent('academy_site')
  useSEO('', 'Free certified courses in website development with AI and Python, plus live Computer Packages classes. Techive Academy, Kenya.')
  const [courses, setCourses] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api('/academy/courses/').then((r) => setCourses(Array.isArray(r) ? r : r.results || [])).catch((e) => setErr(e.message)) }, [])
  return (
    <>
      {c.announcement?.text && (
        <div className="bg-brand-blue text-center text-sm font-semibold text-white py-2 px-4">
          {c.announcement.text}
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="container-x relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.2em] text-brand-blue shadow">{c.hero.badge}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">{c.hero.title_line1} <span className="bg-brand-grad bg-clip-text text-transparent">{c.hero.title_line2}</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">{c.hero.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#courses" className="btn-grad">See courses</a>
              <Link to="/auth?mode=signup" className="btn-light">Create free account</Link>
              {c.whatsapp?.url && (
                <a href={c.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn-light inline-flex items-center gap-2">
                  <MessageCircle size={18} />
                  {c.whatsapp.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="container-x py-16">
        <h2 className="text-3xl font-extrabold">{c.courses_section.title}</h2>
        <p className="mt-2 text-zinc-600">{c.courses_section.text}</p>
        {err && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{err}</p>}
        {!courses && !err && <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-zinc-200" />)}</div>}
        {courses && <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{courses.map((c) => <CourseCard key={c.id} c={c} />)}</div>}
        {courses?.length === 0 && <p className="mt-8 text-zinc-600">Courses are being prepared. Please check back soon.</p>}
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="text-3xl font-extrabold">How it works</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.steps.map((step, n) => {
              const Icon = ICONS[step.title] || GraduationCap
              return (
                <div key={step.title} className="rounded-2xl border border-zinc-200 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-grad text-white"><Icon size={20} /></span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Step {n + 1}</p>
                  <h3 className="text-lg font-extrabold">{step.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
