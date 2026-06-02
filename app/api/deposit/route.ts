import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { amount, asset_ticker, transaction_hash } = await request.json();
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid transaction volume specified' }, { status: 400 });
    }

    if (!transaction_hash || transaction_hash.trim() === '') {
      return NextResponse.json({ success: false, error: 'Cryptographic Transaction Hash is mandatory' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Access token tracking unauthorized' }, { status: 401 });
    }

    // Fixed payload to supply the required transaction_hash mapping string
    const { error } = await supabase
      .from('apex_deposit_requests')
      .insert([{ 
        user_id: user.id, 
        amount_deposited: parsedAmount, 
        status: 'pending',
        asset_ticker: asset_ticker || 'USDT',
        transaction_hash: transaction_hash.trim()
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Deposit ledger state tracked.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
