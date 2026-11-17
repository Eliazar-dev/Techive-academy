export const AUTH_COURSES = [
  { name: 'Certified Free Website Development with AI', track: 'Free course', blurb: 'Build and publish a real website in 4 weeks, with AI as your assistant.' },
  { name: 'Certified Free Python Programming', track: 'Free course', blurb: 'Learn Python from zero in 4 weeks and build your first programs.' },
  { name: 'Certified Computer Packages', track: 'Live classes', blurb: 'Word, Excel, PowerPoint and more. 2 months of live Google Meet classes.' },
]
export const MAIN_SITE = import.meta.env.VITE_MAIN_SITE_URL || 'https://techiveitsolution.co.ke'
export const WHATSAPP = import.meta.env.VITE_WHATSAPP || ''
export const kes = (n) => `KES ${Number(n).toLocaleString('en-KE')}`

// ---------------------------------------------------------------------------
// DEFAULT PAGE CONTENT. Every page reads its text from here through useContent(page).
// Admin > Pages saves overrides to the API; arrays are replaced as a whole, objects are merged key by key.
// ---------------------------------------------------------------------------
export const DEFAULTS = {
  academy_site: {
    hero: {
      badge: 'New · Techive Academy',
      title_line1: 'Learn real skills.',
      title_line2: 'Get certified.',
      text: 'Free certified courses in website development with AI and Python programming, plus live Computer Packages classes.',
    },
    announcement: {
      text: 'Registration opens 23rd Nov',
    },
    whatsapp: {
      url: '',
      label: 'Join our WhatsApp group',
    },
    courses_section: {
      title: 'Our courses',
      text: 'Pick a course and register. Free courses cost nothing to learn.',
    },
    steps: [
      { title: 'Register', text: 'Create your free account in a minute.' },
      { title: 'Learn', text: 'Videos, live classes and practice.' },
      { title: 'Get certified', text: 'Pass the quiz and finish a small project.' },
      { title: 'Refer friends', text: 'Earn a reward when a friend pays for a paid course.' },
    ],
    payments: {
      note: 'Pay by M-Pesa (STK push) or card through Paystack.',
    },
    certificate: {
      issuer: 'Techive IT Solutions',
      wording: 'has successfully completed',
      signed_by: '',
    },
    footer: {
      text: '',
      email: '',
      phone: '',
    },
  },
}
