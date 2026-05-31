'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'APY Plans', href: '#plans' },
  { label: 'Credit Lines', href: '#loans' },
  { label: 'Fee Schedule', href: '#fees' },
  { label: 'Security', href: '#security' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0e0e2c]/95 backdrop-blur border-b border-[#1e1e38]">
      <div className="max-w-6xl mx-auto px-4 py-3">

        {/* Desktop nav */}
        <div className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors duration-200 font-dm">
              {link.label}
            </a>
          ))}
          <a href="#calculator"
            className="text-sm text-gray-200 border border-gray-200/40 px-3 py-0.5 rounded-full hover:bg-gray-200/10 transition-all">
            APY Calculator
          </a>
          {!loading && (
            <div className="flex items-center gap-2 ml-2">
              {user ? (
                <>
                  <a href="/dashboard" className="text-sm font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-3 py-1 rounded-lg hover:bg-[#e2e8f0]/10 transition-all">Dashboard</a>
                  <button onClick={handleSignOut} className="text-sm font-syne font-semibold bg-[#e2e8f0] text-[#060613] px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">Sign Out</button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-sm font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-3 py-1 rounded-lg hover:bg-[#e2e8f0]/10 transition-all">Sign In</a>
                  <a href="/login" className="text-sm font-syne font-semibold bg-[#e2e8f0] text-[#060613] px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">Sign Up</a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-between">
          <span className="text-sm font-syne font-bold text-[#e2e8f0] tracking-widest uppercase">Apex</span>
          <div className="flex items-center gap-2">
            {!loading && (
              user
                ? <a href="/dashboard" className="text-xs font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-2 py-1 rounded-lg">Dashboard</a>
                : <a href="/login" className="text-xs font-syne font-semibold bg-[#e2e8f0] text-[#060613] px-3 py-1 rounded-lg">Sign In</a>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white p-1 transition-colors">
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-[#1e1e38] pt-3 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-400 hover:text-gray-100 transition-colors font-dm py-1">
                {link.label}
              </a>
            ))}
            <a href="#calculator" onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-200 border border-gray-200/40 px-3 py-1.5 rounded-full hover:bg-gray-200/10 transition-all text-center">
              APY Calculator
            </a>
            {!loading && user && (
              <button onClick={handleSignOut}
                className="text-sm font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-3 py-1.5 rounded-lg hover:bg-[#e2e8f0]/10 transition-all text-center">
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
