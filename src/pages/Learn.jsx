import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, Lock, Video, FileText, Download, Award, ExternalLink, Printer } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useContent } from '../lib/content'
import { useSEO } from '../components/ui'
import { videoEmbed } from '../lib/academy'

function LessonView({ lesson, onDone, busy }) {
  const v = videoEmbed(lesson.video_url)
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h3 className="text-xl font-extrabold">{lesson.title}</h3>
      {v?.type === 'iframe' && <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-black"><iframe title={lesson.title} src={v.src} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /></div>}
      {v?.type === 'video' && <video className="mt-4 w-full rounded-xl bg-black" src={v.src} controls />}
      {v?.type === 'link' && <a href={v.src} target="_blank" rel="noreferrer" className="btn-light mt-4"><ExternalLink size={16} />Open video</a>}
      {lesson.body && <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700">{lesson.body}</p>}
      {lesson.file_url && <a href={lesson.file_url} target="_blank" rel="noreferrer" className="btn-light mt-4"><Download size={16} />Download notes</a>}
      <div className="mt-6">{lesson.done ? <p className="font-semibold text-emerald-600">✔ Completed</p> : <button onClick={onDone} disabled={busy} className="btn-grad">{busy ? 'Saving…' : 'Mark as complete'}</button>}</div>
    </div>
  )
}

function QuizBox({ slug, info, reload }) {
  const [qs, setQs] = useState(null)
  const [ans, setAns] = useState({})
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (!info.count) return null
  const start = async () => { setErr(''); try { const r = await api(`/academy/quiz/${slug}/`); setQs(r.questions); setAns({}); setRes(null) } catch (e) { setErr(e.message) } }
  const submit = async () => {
    setBusy(true); setErr('')
    try { setRes(await api(`/academy/quiz/${slug}/`, { method: 'POST', body: { answers: ans } })); setQs(null); reload() } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-xl font-extrabold">Quiz</h2>
      <p className="mt-1 text-sm text-zinc-600">{info.count} questions. Pass mark {info.pass_mark}%. You can retry as many times as you need.{info.best !== null && <> Best score: <b>{info.best}%</b> {info.passed && '✔'}</>}</p>
      {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
      {res && <p className={`mt-4 rounded-xl p-4 font-bold ${res.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{res.passed ? `Passed! ${res.score}%` : `You scored ${res.score}%. Review the lessons and try again.`}</p>}
      {!qs && <button onClick={start} className="btn-dark mt-4">{info.best === null ? 'Start quiz' : 'Retake quiz'}</button>}
      {qs && (
        <div className="mt-5 space-y-6">
          {qs.map((q, n) => (
            <fieldset key={q.id}><legend className="font-bold whitespace-pre-wrap">{n + 1}. {q.text}</legend>
              <div className="mt-2 space-y-2">{q.options.map((o, i) => (
                <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${ans[q.id] === i ? 'border-brand-blue bg-sky-50' : 'border-zinc-200'}`}>
                  <input type="radio" name={`q${q.id}`} checked={ans[q.id] === i} onChange={() => setAns({ ...ans, [q.id]: i })} className="accent-brand-blue" />{o}</label>))}</div></fieldset>))}
          <button onClick={submit} disabled={busy || Object.keys(ans).length < qs.length} className="btn-grad">{busy ? 'Marking…' : 'Submit answers'}</button>
        </div>
      )}
    </section>
  )
}

function ProjectBox({ slug, course, project, reload }) {
  const [f, setF] = useState({ link: project?.link || '', notes: project?.notes || '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (!course.project_brief) return null
  const approved = project?.status === 'approved'
  const send = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await api(`/academy/project/${slug}/`, { method: 'POST', body: f }); reload() } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-xl font-extrabold">Final project</h2>
      <p className="mt-2 whitespace-pre-line text-zinc-700">{course.project_brief}</p>
      {project && <p className={`mt-4 rounded-xl p-3 text-sm font-bold ${approved ? 'bg-emerald-50 text-emerald-700' : project.status === 'changes' ? 'bg-amber-50 text-amber-800' : 'bg-sky-50 text-sky-800'}`}>{approved ? 'Approved ✔' : project.status === 'changes' ? 'Changes requested' : 'Submitted: waiting for review'}</p>}
      {project?.feedback && <p className="mt-2 rounded-xl bg-zinc-50 p-3 text-sm"><b>Tutor feedback:</b> {project.feedback}</p>}
      {!approved && (
        <form onSubmit={send} className="mt-4 space-y-3">
          <input className="input" type="url" placeholder="Link to your project (https://…)" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} />
          <textarea className="input" rows={3} placeholder="Notes for your tutor (optional)" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
          <button disabled={busy} className="btn-dark">{busy ? 'Sending…' : project ? 'Resubmit project' : 'Submit project'}</button>
        </form>
      )}
    </section>
  )
}

function CertBox({ slug, data, pay, busy, reload, user, content }) {
  const c = data.certificate
  const [err, setErr] = useState('')
  const claim = async () => { setErr(''); try { await api(`/academy/certificate/${slug}/`, { method: 'POST' }); reload() } catch (e) { setErr(e.message) } }
  const steps = [
    ['Pass the quiz', c.quiz_passed], ['Project approved', c.project_approved],
    ...(c.fee > 0 ? [[`Pay certificate fee (KES ${c.fee})`, c.fee_paid]] : []),
  ]
  if (c.code) {
    const name = `${user.first_name} ${user.last_name}`.trim() || user.email
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div id="cert" className="rounded-2xl border-4 border-double border-violet-300 bg-gradient-to-br from-sky-50 to-violet-50 p-8 text-center">
          <img src="/logo.png" alt="Techive" className="mx-auto h-10 w-auto" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[.3em] text-zinc-500">Certificate of completion</p>
          <p className="mt-4 text-sm text-zinc-600">This certifies that</p>
          <p className="font-display text-3xl font-extrabold">{name}</p>
          <p className="mt-3 text-sm text-zinc-600">{content.certificate.wording}</p>
          <p className="font-display text-xl font-extrabold">{data.course.name}</p>
          {content.certificate.signed_by && <p className="mt-4 text-sm text-zinc-600">Signed by {content.certificate.signed_by}</p>}
          <p className="mt-5 text-xs text-zinc-500">Issued {new Date(c.issued_at).toLocaleDateString('en-KE', { dateStyle: 'long' })} · Code {c.code}</p>
          <p className="text-xs text-zinc-500">Verify at {window.location.origin}/verify/{c.code}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-zinc-500">{content.certificate.issuer}</p>
        </div>
        <button onClick={() => window.print()} className="btn-dark mt-4 print:hidden"><Printer size={16} />Print / save as PDF</button>
      </section>
    )
  }
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="flex items-center gap-2 text-xl font-extrabold"><Award className="text-brand-violet" />Your certificate</h2>
      <ul className="mt-4 space-y-2 text-sm">{steps.map(([t, ok]) => <li key={t} className="flex items-center gap-2">{ok ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-zinc-300" />}{t}</li>)}</ul>
      {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        {c.fee > 0 && !c.fee_paid && <button onClick={() => pay('certificate')} disabled={busy} className="btn-grad">{busy ? 'Opening Paystack…' : `Pay KES ${c.fee} for certificate`}</button>}
        <button onClick={claim} disabled={!c.eligible} className="btn-dark">Get my certificate</button>
      </div>
    </section>
  )
}

export default function Learn() {
  const { slug } = useParams()
  const { user } = useAuth()
  const content = useContent('academy_site')
  const [d, setD] = useState(null)
  const [err, setErr] = useState(null)
  const [cur, setCur] = useState(null)
  const [busy, setBusy] = useState(false)
  const [payErr, setPayErr] = useState('')
  useSEO(d?.course.name || 'Learn')

  const load = useCallback(() => api(`/academy/learn/${slug}/`).then(setD).catch(setErr), [slug])
  useEffect(() => { load() }, [load])

  const lessons = d ? d.modules.flatMap((m) => m.lessons) : []
  useEffect(() => { if (d && !cur && !d.locked) setCur((lessons.find((l) => !l.done) || lessons[0] || {}).id || null) }, [d]) // eslint-disable-line react-hooks/exhaustive-deps

  async function pay(purpose) {
    setBusy(true); setPayErr('')
    try { const r = await api('/academy/payments/checkout/', { method: 'POST', body: { course: slug, purpose } }); window.location.href = r.authorization_url } catch (e) { setPayErr(e.message); setBusy(false) }
  }
  async function complete(id) {
    setBusy(true)
    try { await api(`/academy/lessons/${id}/complete/`, { method: 'POST' }); await load() } finally { setBusy(false) }
  }

  if (err) return (
    <div className="container-x py-24 text-center"><h1 className="text-2xl font-extrabold">{err.status === 403 ? 'You are not registered for this course' : 'Could not load the course'}</h1>
      <p className="mt-2 text-zinc-600">{err.message}</p><Link to={`/c/${slug}`} className="btn-grad mt-6">View course</Link></div>)
  if (!d) return <div className="container-x py-12"><div className="h-64 animate-pulse rounded-2xl bg-zinc-200" /></div>

  const lesson = lessons.find((l) => l.id === cur)
  const c = d.course
  return (
    <div className="container-x py-10">
      <Link to="/dashboard" className="text-sm font-semibold text-zinc-500 hover:text-ink">← My learning</Link>
      <h1 className="mt-3 text-3xl font-extrabold">{c.name}</h1>
      <div className="mt-4 max-w-md"><div className="h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-brand-grad" style={{ width: `${d.registration.progress}%` }} /></div><p className="mt-1 text-sm text-zinc-600">{d.registration.progress}% complete</p></div>

      {d.locked && (
        <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Lock size={20} />Pay the course fee to unlock</h2>
          <p className="mt-2 text-zinc-700">Course fee: <b>KES {Number(c.price).toLocaleString('en-KE')}</b>. {content.payments.note}</p>
          {c.payment_plan && <p className="mt-2 whitespace-pre-line text-sm text-zinc-600">{c.payment_plan}</p>}
          {payErr && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{payErr}</p>}
          <button onClick={() => pay('enrollment')} disabled={busy} className="btn-grad mt-5">{busy ? 'Opening Paystack…' : `Pay KES ${Number(c.price).toLocaleString('en-KE')}`}</button>
        </div>
      )}

      {d.sessions.length > 0 && (
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Video className="text-brand-cyan" />Live classes (Google Meet)</h2>
          <ul className="mt-4 divide-y divide-zinc-100">
            {d.sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div><p className="font-bold">{s.title}</p><p className="text-sm text-zinc-600">{new Date(s.starts_at).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' })}</p>{s.notes && <p className="text-sm text-zinc-500">{s.notes}</p>}</div>
                <div className="flex gap-2">
                  {s.meet_url && <a href={s.meet_url} target="_blank" rel="noreferrer" className="btn-grad !px-4 !py-2">Join Meet</a>}
                  {s.recording_url && <a href={s.recording_url} target="_blank" rel="noreferrer" className="btn-light !px-4 !py-2">Recording</a>}
                </div>
              </li>))}
          </ul>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <nav aria-label="Lessons" className="h-fit rounded-2xl border border-zinc-200 bg-white p-4">
          {d.modules.length === 0 && <p className="p-2 text-sm text-zinc-500">Lessons are being added.</p>}
          {d.modules.map((m) => (
            <div key={m.id} className="mb-3 last:mb-0">
              <p className="px-2 text-xs font-bold uppercase tracking-widest text-zinc-400">{m.title}</p>
              {m.lessons.map((l) => (
                <button key={l.id} disabled={d.locked} onClick={() => setCur(l.id)} className={`mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition disabled:opacity-50 ${cur === l.id ? 'bg-sky-50 font-bold' : 'hover:bg-zinc-50'}`}>
                  {d.locked ? <Lock size={16} className="shrink-0 text-zinc-300" /> : l.done ? <CheckCircle2 size={16} className="shrink-0 text-emerald-500" /> : l.kind === 'video' ? <Video size={16} className="shrink-0 text-zinc-400" /> : <FileText size={16} className="shrink-0 text-zinc-400" />}
                  <span>{l.title}</span></button>))}
            </div>))}
        </nav>
        <div className="space-y-6">
          {lesson ? <LessonView key={lesson.id} lesson={lesson} busy={busy} onDone={() => complete(lesson.id)} /> : !d.locked && <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">Select a lesson to begin.</p>}
          {!d.locked && <>
            <QuizBox slug={slug} info={d.quiz} reload={load} />
            <ProjectBox key={d.project?.status} slug={slug} course={c} project={d.project} reload={load} />
            <CertBox slug={slug} data={d} pay={pay} busy={busy} reload={load} user={user} content={content} />
            {payErr && <p role="alert" className="text-sm font-semibold text-red-600">{payErr}</p>}
          </>}
          {d.next_course && d.certificate.code && (
            <section className="rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 p-6"><h2 className="text-xl font-extrabold">Keep going</h2><p className="mt-1 text-zinc-700">Next: <b>{d.next_course.name}</b></p><Link to={`/c/${d.next_course.slug}`} className="btn-grad mt-4">See the advanced course</Link></section>)}
        </div>
      </div>
    </div>
  )
}
