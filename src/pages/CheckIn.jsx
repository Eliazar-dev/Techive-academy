import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../lib/api'
import { useSEO } from '../components/ui'

export default function CheckIn() {
  useSEO('Check in', 'Check in for your live class session.', 'https://academy.techiveitsolution.co.ke/checkin')
  const { token } = useParams()
  const nav = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid check-in link.')
      return
    }
    api(`/academy/checkin/${token}/`, { method: 'POST' })
      .then((r) => {
        setStatus('success')
        setMessage(r.detail || 'Checked in successfully!')
        setSession(r)
      })
      .catch((e) => {
        setStatus('error')
        setMessage(e.data?.detail || e.message || 'Check-in failed.')
      })
  }, [token])

  return (
    <div className="container-x max-w-md py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        {status === 'loading' && <p className="text-zinc-500">Checking in…</p>}
        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-4 text-2xl font-extrabold">Checked in!</h1>
            <p className="mt-2 text-zinc-600">{message}</p>
            {session && (
              <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-left">
                <p className="text-sm font-semibold">{session.session}</p>
                <p className="text-sm text-zinc-500">{session.course}</p>
              </div>
            )}
            <button onClick={() => nav('/dashboard')} className="btn-dark mt-6 w-full">Go to Dashboard</button>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-2xl font-extrabold">Check-in failed</h1>
            <p className="mt-2 text-zinc-600">{message}</p>
            <button onClick={() => nav('/dashboard')} className="btn-light mt-6 w-full">Go to Dashboard</button>
          </>
        )}
      </div>
    </div>
  )
}
