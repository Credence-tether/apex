import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { plan_name, amount, apy } = await request.json();
    const allocationAmount = parseFloat(amount);

    if (isNaN(allocationAmount) || allocationAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid balance allocation parameters' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: wallet, error: walletErr } = await supabase
      .from('apex_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletErr || !wallet || Number(wallet.balance) < allocationAmount) {
      return NextResponse.json({ success: false, error: 'Insufficient available funds for selection' }, { status: 400 });
    }

    await supabase
      .from('apex_wallets')
      .update({ balance: Number(wallet.balance) - allocationAmount })
      .eq('user_id', user.id);

    const { error: contractErr } = await supabase
      .from('apex_investments')
      .insert([{ 
        user_id: user.id, 
        plan_name, 
        amount_invested: allocationAmount, 
        apy_percentage: parseFloat(apy), 
        status: 'active' 
      }]);

    if (contractErr) throw contractErr;

    await supabase
      .from('apex_transactions')
      .insert([{ 
        user_id: user.id, 
        type: 'investment_entry', 
        amount: allocationAmount, 
        description: `Allocated to ${plan_name}` 
      }]);

    return NextResponse.json({ success: true, message: 'Yield contract safely activated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
