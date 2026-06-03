import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { plan_name, amount, apy } = await request.json()
    const allocationAmount = parseFloat(amount)

    if (isNaN(allocationAmount) || allocationAmount < 300) {
      return NextResponse.json({ success: false, error: 'Minimum allocation is $300' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: wallet, error: walletErr } = await supabase
      .from('apex_wallets')
      .select('available_balance')
      .eq('user_id', user.id)
      .single()

    if (walletErr || !wallet || Number(wallet.available_balance) < allocationAmount) {
      return NextResponse.json({ success: false, error: 'Insufficient available funds for this allocation' }, { status: 400 })
    }

    // Deduct from wallet
    const { error: walletUpdateErr } = await supabase
      .from('apex_wallets')
      .update({ available_balance: Number(wallet.available_balance) - allocationAmount })
      .eq('user_id', user.id)
    if (walletUpdateErr) throw walletUpdateErr

    // Create investment
    const { error: contractErr } = await supabase
      .from('apex_investments')
      .insert([{
        user_id: user.id,
        plan_name,
        amount_invested: allocationAmount,
        apy_percentage: parseFloat(apy),
        status: 'active',
        weeks_elapsed: 0,
        lock_duration_weeks: 52,
      }])
    if (contractErr) throw contractErr

    // Log transaction
    await supabase.from('apex_transactions').insert([{
      user_id: user.id,
      type: 'investment_entry',
      gross_amount: allocationAmount,
      net_amount: allocationAmount,
      platform_fee: 0,
      status: 'completed',
      description: `Allocated to ${plan_name}`,
    }])

    return NextResponse.json({ success: true, message: 'Yield contract activated' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
