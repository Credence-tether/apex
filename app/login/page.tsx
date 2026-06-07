"use client";
import { useState } from "react";
import { createClient, getSupabaseClientError } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { useLocale } from "../../lib/locale-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [verified, setVerified] = useState(false); // ← new: show verification screen
  const envError = getSupabaseClientError();
  const supabase = createClient();
  const router = useRouter();
  const { locale } = useLocale();
  const de = locale === "de";

  const T = {
    portal:      de ? "Kundenportal" : "Access Client Portal",
    createAcct:  de ? "Konto erstellen" : "Create Your Account",
    fullName:    de ? "Vollständiger Name" : "Full Name",
    fullNamePh:  de ? "Ihr vollständiger Name" : "Your full name",
    email:       de ? "E-Mail-Adresse" : "Email Address",
    emailPh:     de ? "sie@beispiel.de" : "you@example.com",
    password:    de ? "Passwort" : "Password",
    wait:        de ? "Bitte warten…" : "Please wait…",
    register:    de ? "Registrieren" : "Register",
    signIn:      de ? "Anmelden" : "Sign In",
    newHere:     de ? "Noch kein Konto? " : "New to Apex Asset Management? ",
    haveAcct:    de ? "Bereits registriert? " : "Already have an account? ",
    createLink:  de ? "Konto erstellen" : "Create Account",
    signInLink:  de ? "Hier anmelden" : "Sign In Here",
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (envError) { setMessage(envError); setLoading(false); return; }
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) setMessage(error.message);
        else setVerified(true); // ← show verification screen
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setMessage(error.message); setLoading(false); return; }
        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", data.user.id).single();
        router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
        return;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : de ? "Authentifizierung fehlgeschlagen." : "Authentication failed.");
    }
    setLoading(false);
  };

  // ── Verification pending screen ────────────────────────────────
  if (verified) {
    return (
      <main style={{
        minHeight:"100vh",background:"#050d1a",display:"flex",alignItems:"center",
        justifyContent:"center",padding:"32px 16px",fontFamily:"'DM Sans',sans-serif",
        position:"relative",overflow:"hidden",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div style={{
          width:"100%",maxWidth:420,
          background:"rgba(10,22,40,0.9)",
          border:"1px solid rgba(0,200,170,0.15)",
          borderRadius:20,padding:"48px 36px 40px",
          backdropFilter:"blur(16px)",
          boxShadow:"0 32px 64px rgba(0,0,0,0.45)",
          textAlign:"center",
        }}>
          {/* Icon */}
          <div style={{
            width:64,height:64,borderRadius:"50%",
            background:"rgba(0,200,170,0.1)",
            border:"1px solid rgba(0,200,170,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 24px",fontSize:28,
          }}>✉️</div>

          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#00c8aa",letterSpacing:"0.1em",marginBottom:8}}>
            CHECK YOUR EMAIL
          </div>
          <p style={{fontSize:14,color:"#6680a0",lineHeight:1.7,marginBottom:24}}>
            We sent a verification link to<br/>
            <strong style={{color:"#e8eef8"}}>{email}</strong>
          </p>

          <div style={{
            background:"rgba(0,200,170,0.06)",
            border:"1px solid rgba(0,200,170,0.15)",
            borderRadius:12,padding:"16px 20px",
            fontSize:13,color:"#94a3b8",lineHeight:1.7,
            marginBottom:28,textAlign:"left",
          }}>
            <p style={{margin:"0 0 6px",color:"#00c8aa",fontWeight:600,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>What happens next</p>
            <p style={{margin:0}}>1. Open the email from <strong style={{color:"#e8eef8"}}>support@apxfund.xyz</strong><br/>
            2. Click the verification link<br/>
            3. You'll be taken to your dashboard</p>
          </div>

          <p style={{fontSize:12,color:"#3d5070",marginBottom:16}}>
            Didn't receive it? Check your spam folder.
          </p>

          <button
            onClick={() => { setVerified(false); setIsRegistering(false); setMessage(""); }}
            style={{
              background:"none",border:"1px solid rgba(0,200,170,0.2)",
              borderRadius:10,color:"#00c8aa",fontSize:13,fontWeight:500,
              padding:"10px 24px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              transition:"background .2s",
            }}
          >
            Back to Sign In
          </button>
        </div>
      </main>
    );
  }

  // ── Normal login / register form ───────────────────────────────
  return (
    <main style={{
      minHeight:"100vh",background:"#050d1a",display:"flex",alignItems:"center",
      justifyContent:"center",padding:"32px 16px",fontFamily:"'DM Sans',sans-serif",
      position:"relative",overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .apex-glow{position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:500px;height:350px;background:radial-gradient(ellipse,rgba(0,200,170,0.09) 0%,transparent 70%);pointer-events:none;}
        .apex-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(0,200,170,0.15);border-radius:10px;color:#e8eef8;font-family:'DM Sans',sans-serif;font-size:15px;padding:13px 16px;outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}
        .apex-input:focus{border-color:#00c8aa;box-shadow:0 0 0 3px rgba(0,200,170,0.1);}
        .apex-input::placeholder{color:#3d5070;}
        .apex-input-pw{padding-right:48px;}
        .apex-submit{width:100%;padding:15px;background:#00c8aa;border:none;border-radius:12px;color:#050d1a;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:background .2s,transform .15s;margin-top:8px;}
        .apex-submit:hover:not(:disabled){background:#00e0be;transform:translateY(-1px);}
        .apex-submit:disabled{opacity:.5;cursor:not-allowed;}
        .apex-toggle{background:none;border:none;cursor:pointer;color:#00c8aa;font-size:13px;font-weight:500;text-decoration:underline;text-underline-offset:2px;padding:0;font-family:'DM Sans',sans-serif;}
        .apex-toggle:hover{color:#00e0be;}
        .pw-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6680a0;font-size:18px;line-height:1;padding:4px;transition:color .2s;}
        .pw-eye:hover{color:#00c8aa;}
        .apex-label{display:block;font-size:11px;font-weight:500;letter-spacing:.1em;color:#6680a0;margin-bottom:8px;text-transform:uppercase;}
      `}</style>
      <div className="apex-glow" />
      <div style={{
        width:"100%",maxWidth:420,
        background:"rgba(10,22,40,0.9)",
        border:"1px solid rgba(0,200,170,0.15)",
        borderRadius:20,padding:"44px 36px 36px",
        backdropFilter:"blur(16px)",
        boxShadow:"0 32px 64px rgba(0,0,0,0.45),0 0 0 1px rgba(0,200,170,0.05)",
        position:"relative",zIndex:1,
      }}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:30,color:"#00c8aa",letterSpacing:"0.15em"}}>APEX</div>
          <div style={{fontSize:12,color:"#6680a0",letterSpacing:"0.06em",marginTop:4}}>
            {isRegistering ? T.createAcct : T.portal}
          </div>
        </div>

        {(message || envError) && (
          <div style={{
            padding:"12px 16px",borderRadius:10,fontSize:13,marginBottom:20,textAlign:"center",
            background:"rgba(220,60,60,0.1)",
            border:"1px solid rgba(220,60,60,0.25)",
            color:"#ff7070",
          }}>
            {message || envError}
          </div>
        )}

        <form onSubmit={handleAuth}>
          {isRegistering && (
            <div style={{marginBottom:20}}>
              <label className="apex-label">{T.fullName}</label>
              <input className="apex-input" type="text" required placeholder={T.fullNamePh}
                value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div style={{marginBottom:20}}>
            <label className="apex-label">{T.email}</label>
            <input className="apex-input" type="email" required placeholder={T.emailPh}
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div style={{marginBottom:20}}>
            <label className="apex-label">{T.password}</label>
            <div style={{position:"relative"}}>
              <input className="apex-input apex-input-pw" type={showPw ? "text" : "password"}
                required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                autoComplete={isRegistering ? "new-password" : "current-password"} />
              <button type="button" className="pw-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button type="submit" className="apex-submit" disabled={Boolean(envError) || loading}>
            {loading ? T.wait : isRegistering ? T.register : T.signIn}
          </button>
        </form>

        <p style={{fontSize:13,color:"#6680a0",textAlign:"center",marginTop:24}}>
          {isRegistering ? T.haveAcct : T.newHere}
          <button className="apex-toggle" onClick={() => { setIsRegistering(p => !p); setMessage(""); }}>
            {isRegistering ? T.signInLink : T.createLink}
          </button>
        </p>
      </div>
    </main>
  );
}

