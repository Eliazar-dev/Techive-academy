import { useEffect, useRef } from 'react'

// Fade-in on scroll (no animation library)
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return el?.classList.add('in')
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

// Per-page <title> + description (SPA-friendly; pre-render later for max SEO)
export function useSEO(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Techive Academy` : 'Techive Academy: learn, build, get certified'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    window.scrollTo(0, 0)
  }, [title, description])
}

// Round profile picture; falls back to the first letter of the name/email.
export function Avatar({ user, size = 36, className = '' }) {
  const letter = (user?.first_name || user?.email || '?')[0].toUpperCase()
  return user?.avatar_url ? (
    <img src={user.avatar_url} alt="" referrerPolicy="no-referrer" width={size} height={size} style={{ width: size, height: size }} className={`rounded-full object-cover ${className}`} />
  ) : (
    <span style={{ width: size, height: size }} className={`flex items-center justify-center rounded-full bg-brand-grad font-bold text-white ${className}`}>{letter}</span>
  )
}
