export const AUTH_COURSES = [
  { name: 'Certified Free Website Development with AI', track: 'Free course', blurb: 'Build and publish a real website in 4 weeks, with AI as your assistant.' },
  { name: 'Certified Free Python Programming', track: 'Free course', blurb: 'Learn Python from zero in 4 weeks and build your first programs.' },
  { name: 'Certified Computer Packages', track: 'Live classes', blurb: 'Word, Excel, PowerPoint and more. 2 months of live Google Meet classes.' },
]
export const MAIN_SITE = import.meta.env.VITE_MAIN_SITE_URL || 'https://techive.co.ke'
export const WHATSAPP = import.meta.env.VITE_WHATSAPP || ''
export const kes = (n) => `KES ${Number(n).toLocaleString('en-KE')}`
