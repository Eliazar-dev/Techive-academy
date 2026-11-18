import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { api } from '../lib/api'
import { useSEO } from '../components/ui'

export default function Verify() {
  useSEO('Verify a certificate', 'Verify the authenticity of a Techive Academy certificate using its code.', 'https://academy.techiveitsolution.co.ke/verify')
  const { code } = useParams()
  const nav = useNavigate()
  const [input, setInput] = useState(code || '')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    setRes(null); setErr('')
    if (code) api(`/certificates/${encodeURIComponent(code)}/`).then(setRes).catch((e) => setErr(e.message))
  }, [code])
  return (
    <div className="container-x max-w-xl py-16">
      <h1 className="text-3xl font-extrabold">Verify a certificate</h1>
      <p className="mt-2 text-zinc-600">Enter the code printed on a Techive Academy certificate.</p>
      <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (input.trim()) nav(`/verify/${encodeURIComponent(input.trim())}`) }}>
        <input className="input" placeholder="TCH-XXXX-XXXX" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Certificate code" />
        <button className="btn-dark">Check</button>
      </form>
      {err && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{err}</p>}
      {res && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="flex items-center gap-2 font-extrabold text-emerald-700"><BadgeCheck />Valid certificate</p>
          <p className="mt-3 text-sm text-zinc-600">Awarded to</p><p className="text-2xl font-extrabold">{res.name}</p>
          <p className="mt-3 text-sm text-zinc-600">Course</p><p className="font-bold">{res.course}</p>
          <p className="mt-3 text-sm text-zinc-600">Issued {new Date(res.issued_at).toLocaleDateString('en-KE', { dateStyle: 'long' })} · {res.code}</p>
        </div>
      )}
    </div>
  )
}
