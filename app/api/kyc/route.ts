import { NextResponse } from "next/server";
import {
  createClient,
  createAdminClient,
} from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id_type = formData.get("id_type")?.toString();
    const id_number = formData.get("id_number")?.toString();
    const full_name = formData.get("full_name")?.toString();
    const documentFile = formData.get("document") as File | null;
    const selfieFile = formData.get("selfie") as File | null;

    if (!id_type)
      return NextResponse.json(
        { success: false, error: "Document type is required." },
        { status: 400 },
      );

    if (!id_number)
      return NextResponse.json(
        { success: false, error: "Document number is required." },
        { status: 400 },
      );

    if (!documentFile)
      return NextResponse.json(
        { success: false, error: "Document file is required." },
        { status: 400 },
      );

    const supabase = await createClient();
    const adminClient = await createAdminClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { data: pendingKyc, error: existingError } = await supabase
      .from("apex_master_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("request_type", "kyc_submission")
      .eq("status", "pending")
      .limit(1);

    if (existingError) throw existingError;

    if (pendingKyc && pendingKyc.length > 0)
      return NextResponse.json(
        {
          success: false,
          error:
            "You already have a pending KYC verification. Please wait for review.",
        },
        { status: 400 },
      );

    const timestamp = Date.now();
    const docFileName = `${user.id}/kyc-document-${timestamp}-${documentFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const docBuffer = await documentFile.arrayBuffer();

    const { data: docUpload, error: docUploadError } = await adminClient.storage
      .from("kyc-documents")
      .upload(docFileName, docBuffer, {
        contentType: documentFile.type || "application/octet-stream",
        upsert: false,
      });

    if (docUploadError || !docUpload)
      throw new Error(`Document upload failed: ${docUploadError?.message}`);

    let selfieUrl: string | null = null;
    if (selfieFile) {
      const selfieFileName = `${user.id}/kyc-selfie-${timestamp}-${selfieFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const selfieBuffer = await selfieFile.arrayBuffer();

      const { data: selfieUpload, error: selfieUploadError } =
        await adminClient.storage
          .from("kyc-documents")
          .upload(selfieFileName, selfieBuffer, {
            contentType: selfieFile.type || "application/octet-stream",
            upsert: false,
          });

      if (selfieUploadError) {
        console.warn("Selfie upload warning:", selfieUploadError.message);
      } else if (selfieUpload) {
        selfieUrl = selfieFileName;
      }
    }

    const { error } = await supabase.from("apex_master_requests").insert([
      {
        user_id: user.id,
        request_type: "kyc_submission",
        status: "pending",
        amount: 0,
        meta_data: {
          full_name: full_name || user.user_metadata?.full_name || "",
          id_type: id_type.trim(),
          id_number: id_number.trim(),
          document_path: docFileName,
          selfie_path: selfieUrl,
          submitted_at: new Date().toISOString(),
        },
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "KYC submission received and pending review.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
