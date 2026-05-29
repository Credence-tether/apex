'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` }
      })
      if (error) setMessage(error.message)
      else setMessage('Registration successful! Check your email for verification.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#060613] flex items-center justify-center p-4">
      <div className="bg-[#0f0f30] p-8 rounded-xl border border-[#1e1e38] w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isRegistering ? 'Create Apex Account' : 'Access Client Portal'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="w-full p-3 rounded bg-[#09091f] border border-[#1e1e38] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="w-full p-3 rounded bg-[#09091f] border border-[#1e1e38] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full p-3 rounded bg-[#00d1b2] text-[#060613] font-bold">
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        {message && <p className="text-sm text-center text-[#00d1b2] mt-4">{message}</p>}

        <p className="text-sm text-gray-400 text-center mt-6">
          {isRegistering ? 'Already have an account?' : 'New to Apex Asset Management?'}
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-[#00d1b2] ml-1 underline bg-transparent border-none cursor-pointer"
          >
            {isRegistering ? 'Sign In Here' : 'Create Account'}
          </button>
        </p>
      </div>
    </main>
  )
}

