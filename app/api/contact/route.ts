import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { full_name, email, message } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Insert the message text into your public.contact_submissions table
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ full_name, email, message }]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Message recorded safely.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

