import { Link } from 'react-router-dom'
import { useSEO } from '../components/ui'
export default function NotFound() {
  useSEO('Page not found', '', undefined, '/logo.png', true)
  return <div className="container-x py-32 text-center"><h1 className="text-4xl font-extrabold">Page not found</h1><p className="mt-3 text-zinc-600">That page does not exist.</p><Link to="/" className="btn-grad mt-8">See courses</Link></div>
}
