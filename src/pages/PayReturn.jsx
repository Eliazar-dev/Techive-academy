import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useSEO } from '../components/ui'

// Paystack sends the student back here with ?reference=…  We ask the server to confirm it.
export default function PayReturn() {
  useSEO('Payment', '', undefined, '/logo.png', true)
  const [qs] = useSearchParams()
  const nav = useNavigate()
  const ref = qs.get('reference') || qs.get('trxref')
  const [state, setState] = useState(ref ? 'checking' : 'none')
  useEffect(() => {
    if (!ref) return
    let n = 0, stop = false
    const tick = async () => {
      try {
        const r = await api(`/academy/payments/verify/?reference=${encodeURIComponent(ref)}`)
        if (stop) return
        if (r.status === 'success') { setState('ok'); setTimeout(() => nav(`/learn/${r.course}`, { replace: true }), 1500); return }
        if (r.status === 'failed') return setState('failed')
      } catch { /* retry */ }
      if (++n < 8) setTimeout(tick, 3000); else setState('pending')
    }
    tick()
    return () => { stop = true }
  }, [ref, nav])
  const msg = {
    checking: ['Confirming your payment…', 'Please wait a moment. Do not close this page.'],
    ok: ['Payment received ✔', 'Taking you to your course…'],
    failed: ['Payment was not completed', 'No money was taken. You can try again from your course page.'],
    pending: ['We are still waiting for confirmation', 'If you were charged, your course will unlock automatically within a few minutes.'],
    none: ['No payment found', 'Open your course from My learning.'],
  }[state]
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-extrabold">{msg[0]}</h1><p className="mt-3 text-zinc-600">{msg[1]}</p>
      {state !== 'checking' && state !== 'ok' && <Link to="/dashboard" className="btn-grad mt-8">Go to My learning</Link>}
    </div>
  )
}
