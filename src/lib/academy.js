import { api } from './api'

const REF = 'tch_ref'
export const captureRef = () => {
  try {
    const r = new URLSearchParams(window.location.search).get('ref')
    if (r && /^[A-Za-z0-9]{4,12}$/.test(r)) localStorage.setItem(REF, r.toUpperCase())
  } catch { /* storage blocked */ }
}

// After any sign-in: tell the server who invited this student (best effort, once).
export async function afterLogin() {
  try {
    const code = localStorage.getItem(REF)
    if (!code) return
    await api('/academy/referrals/claim/', { method: 'POST', body: { code } })
    localStorage.removeItem(REF)
  } catch { /* never block sign-in */ }
}

export const priceLabel = (c) => {
  if (c.price === null || c.price === undefined) return 'Price coming soon'
  if (c.price === 0) return 'Free'
  return `KES ${Number(c.price).toLocaleString('en-KE')}`
}

export function videoEmbed(url) {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (yt) return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}` }
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { type: 'video', src: url }
  return { type: 'link', src: url }
}
