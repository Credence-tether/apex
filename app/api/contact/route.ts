import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { full_name, email, message } = await request.json();
    const supabase = await createClient();

    // Insert the message text into your public.contact_submissions table
    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ full_name, email, message }]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Message recorded safely." },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
