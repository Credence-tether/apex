'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>({ deposits: [], loans: [], kyc: [] })
  const [loading, setLoading] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    loadAdminRecords()
  }, [])

  async function loadAdminRecords() {
    const res = await fetch('/api/admin/actions')
    const json = await res.json()
    if (json.success) setData(json.payload)
    setLoading(false)
  }

  async function updateStatus(table: string, id: string, nextStatus: string) {
    setStatusMsg('Processing update action...')
    const res = await fetch('/api/admin/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_table: table, target_id: id, target_status: nextStatus })
    })
    const json = await res.json()
    if (json.success) {
      setStatusMsg('State updated successfully.')
      loadAdminRecords()
    } else {
      setStatusMsg(`Action failed: ${json.error}`)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#060613] text-gray-100 flex items-center justify-center font-mono">LOADING OVERSEER ROOT LAYER...</div>

  return (
    <div className="min-h-screen bg-[#03030a] text-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-red-900/40 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-red-500 tracking-widest uppercase">Admin Control Board</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">Status feedback: {statusMsg || 'Idle'}</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-xs border border-gray-700 px-4 py-2 rounded text-gray-400 uppercase">Exit Board</button>
        </header>

        {/* PENDING DEPOSITS MATRIX */}
        <section className="bg-[#0b0b18] p-6 rounded-xl border border-red-950/40">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-4">Pending Network Funding Audit</h2>
          <div className="space-y-3">
            {data.deposits.filter((d: any) => d.status === 'pending').map((dep: any) => (
              <div key={dep.id} className="flex justify-between items-center bg-[#060613] p-4 rounded border border-[#1e1e38] text-xs font-mono">
                <div>
                  <p className="text-white font-sans text-sm font-bold">Volume: ${dep.amount_deposited}</p>
                  <p className="text-gray-400 mt-1">User Reference Node: {dep.user_id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus('apex_deposit_requests', dep.id, 'approved')} className="bg-emerald-600 text-white px-3 py-1 rounded font-sans font-bold uppercase text-[10px]">Approve & Credit</button>
                  <button onClick={() => updateStatus('apex_deposit_requests', dep.id, 'rejected')} className="bg-red-950 text-red-400 border border-red-900 px-3 py-1 rounded font-sans font-bold uppercase text-[10px]">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PENDING LOAN APPLICATION MANAGEMENT */}
        <section className="bg-[#0b0b18] p-6 rounded-xl border border-red-950/40">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-4">Pending Capital Credit Appraisals</h2>
          <div className="space-y-3">
            {data.loans.filter((l: any) => l.status === 'pending').map((loan: any) => (
              <div key={loan.id} className="flex justify-between items-center bg-[#060613] p-4 rounded border border-[#1e1e38] text-xs font-mono">
                <div>
                  <p className="text-white font-sans text-sm font-bold">Credit Line Request: ${loan.amount_requested}</p>
                  <p className="text-gray-400 mt-1">Collateral Requirement: ${loan.collateral_amount}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus('apex_loans', loan.id, 'approved')} className="bg-emerald-600 text-white px-3 py-1 rounded font-sans font-bold uppercase text-[10px]">Approve Disbursement</button>
                  <button onClick={() => updateStatus('apex_loans', loan.id, 'rejected')} className="bg-red-950 text-red-400 border border-red-900 px-3 py-1 rounded font-sans font-bold uppercase text-[10px]">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
