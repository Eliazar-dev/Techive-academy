import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Wallet, Award, Gift } from 'lucide-react'
import { api } from '../lib/api'
import { useSEO } from '../components/ui'
import CourseCard from '../components/CourseCard'

const STEPS = [
  { i: GraduationCap, t: 'Register', d: 'Create your free account in a minute.' },
  { i: Wallet, t: 'Learn', d: 'Videos, live Google Meet classes and practice.' },
  { i: Award, t: 'Get certified', d: 'Pass the quiz and finish a small project.' },
  { i: Gift, t: 'Refer friends', d: 'Earn KES 400 when a friend pays for Computer Packages.' },
]

export default function Home() {
  useSEO('', 'Free certified courses in website development with AI and Python, plus live Computer Packages classes. Techive Academy, Kenya.')
  const [courses, setCourses] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api('/academy/courses/').then((r) => setCourses(Array.isArray(r) ? r : r.results || [])).catch((e) => setErr(e.message)) }, [])
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-cyan/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="container-x relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.2em] text-brand-blue shadow">New · Techive Academy</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Learn real skills. <span className="bg-brand-grad bg-clip-text text-transparent">Get certified.</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">Free certified courses in website development with AI and Python programming, plus live Computer Packages classes. Register, learn and earn your certificate online.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#courses" className="btn-grad">See courses</a><Link to="/auth?mode=signup" className="btn-light">Create free account</Link></div>
          </div>
        </div>
      </section>

      <section id="courses" className="container-x py-16">
        <h2 className="text-3xl font-extrabold">Our courses</h2>
        <p className="mt-2 text-zinc-600">Pick a course and register. Free courses cost nothing to learn. You only pay if you want the certificate.</p>
        {err && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{err}</p>}
        {!courses && !err && <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-zinc-200" />)}</div>}
        {courses && <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{courses.map((c) => <CourseCard key={c.id} c={c} />)}</div>}
        {courses?.length === 0 && <p className="mt-8 text-zinc-600">Courses are being prepared. Please check back soon.</p>}
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="text-3xl font-extrabold">How it works</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ i: I, t, d }, n) => (
              <div key={t} className="rounded-2xl border border-zinc-200 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-grad text-white"><I size={20} /></span>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Step {n + 1}</p>
                <h3 className="text-lg font-extrabold">{t}</h3><p className="mt-1 text-sm text-zinc-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
