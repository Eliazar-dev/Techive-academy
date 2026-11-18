import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import { captureRef } from './lib/academy'

const Course = lazy(() => import('./pages/Course'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Learn = lazy(() => import('./pages/Learn'))
const PayReturn = lazy(() => import('./pages/PayReturn'))
const Verify = lazy(() => import('./pages/Verify'))
const Auth = lazy(() => import('./pages/Auth'))
const NotFound = lazy(() => import('./pages/NotFound'))
const CheckIn = lazy(() => import('./pages/CheckIn'))

export default function App() {
  useEffect(captureRef, [])
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="c/:slug" element={<Course />} />
          <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="learn/:slug" element={<RequireAuth><Learn /></RequireAuth>} />
          <Route path="pay/return" element={<RequireAuth><PayReturn /></RequireAuth>} />
          <Route path="verify" element={<Verify />} />
          <Route path="verify/:code" element={<Verify />} />
          <Route path="checkin/:token" element={<CheckIn />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <CookieBanner />
    </Suspense>
  )
}
