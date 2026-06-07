"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "../lib/locale-context";

const NAV_LINKS = [
  { label: "Home",         labelDe: "Startseite",  href: "/" },
  { label: "About",        labelDe: "Über uns",     href: "/about" },
  { label: "APY Plans",    labelDe: "Zinspläne",    href: "/#plans" },
  { label: "Credit Lines", labelDe: "Kreditlinien", href: "/loans" },
  { label: "Fees",         labelDe: "Gebühren",     href: "/fees" },
  { label: "Security",     labelDe: "Sicherheit",   href: "/security" },
  { label: "FAQ",          labelDe: "FAQ",           href: "/faq" },
  { label: "Contact",      labelDe: "Kontakt",       href: "/contact" },
];

const AUTH_PATHS = ["/dashboard", "/admin"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser]         = useState<any>(null);
  const [mounted, setMounted]   = useState(false);
  const supabase  = createClient();
  const router    = useRouter();
  const pathname  = usePathname();
  const { locale, toggleLocale } = useLocale();
  const de = locale === "de";

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), []);
  const closeMenu  = useCallback(() => setMenuOpen(false), []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const isAuthPage = AUTH_PATHS.some(p => pathname?.startsWith(p));
  if (isAuthPage) return null;

  return (
    <>
      <style>{`
        .apex-drawer-link{display:block;padding:13px 24px;color:#aabbd4;font-size:14px;text-decoration:none;border-left:3px solid transparent;transition:all .18s}
        .apex-drawer-link:hover{color:#00c8aa;border-left-color:#00c8aa;background:rgba(0,200,170,0.05)}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @media(min-width:1024px){.apex-mobile-row{display:none!important}}
        @media(max-width:1023px){.apex-desktop-nav{display:none!important}.apex-mobile-row{display:flex!important}}
      `}</style>

      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(5,13,26,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(0,200,170,0.1)",fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          {/* Logo */}
          <a href="/" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#00c8aa",letterSpacing:"0.15em",textDecoration:"none",flexShrink:0}}>APEX</a>

          {/* ── DESKTOP ── */}
          <div style={{display:"flex",alignItems:"center",gap:16}} className="apex-desktop-nav">
            {NAV_LINKS.filter(l => l.href !== "/").map(link => (
              <a key={link.href} href={link.href}
                style={{fontSize:12,color:"#8899bb",textDecoration:"none",transition:"color .2s"}}
                onMouseOver={e => (e.currentTarget.style.color="#00c8aa")}
                onMouseOut={e  => (e.currentTarget.style.color="#8899bb")}>
                {de ? link.labelDe : link.label}
              </a>
            ))}
            <button onClick={toggleLocale}
              style={{fontSize:11,background:"transparent",border:"1px solid rgba(0,200,170,0.2)",color:"#6680a0",padding:"4px 9px",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}
              onMouseOver={e => { e.currentTarget.style.color="#00c8aa"; e.currentTarget.style.borderColor="rgba(0,200,170,0.5)"; }}
              onMouseOut={e  => { e.currentTarget.style.color="#6680a0"; e.currentTarget.style.borderColor="rgba(0,200,170,0.2)"; }}>
              {de ? "🇬🇧 EN" : "🇩🇪 DE"}
            </button>
            {mounted && user ? (
              <>
                <a href="/dashboard" style={{fontSize:12,color:"#00c8aa",border:"1px solid rgba(0,200,170,0.35)",padding:"6px 16px",borderRadius:999,textDecoration:"none"}}>
                  Dashboard
                </a>
                <button onClick={handleSignOut}
                  style={{fontSize:12,background:"rgba(180,40,40,0.2)",color:"#ff7070",border:"1px solid rgba(220,60,60,0.3)",padding:"6px 16px",borderRadius:999,cursor:"pointer",fontFamily:"inherit"}}>
                  {de ? "Abmelden" : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <a href="/login" style={{fontSize:12,color:"#00c8aa",border:"1px solid rgba(0,200,170,0.35)",padding:"6px 16px",borderRadius:999,textDecoration:"none"}}>
                  {de ? "Anmelden" : "Login"}
                </a>
                <a href="/login" style={{fontSize:12,background:"#00c8aa",color:"#050d1a",padding:"6px 16px",borderRadius:999,textDecoration:"none",fontWeight:600}}>
                  {de ? "Registrieren" : "Sign Up"}
                </a>
              </>
            )}
          </div>

          {/* ── MOBILE ROW: locale + login + menu ── */}
          <div style={{display:"none",alignItems:"center",gap:6}} className="apex-mobile-row">
            {/* Locale flag */}
            <button onClick={toggleLocale}
              style={{background:"transparent",border:"1px solid rgba(0,200,170,0.2)",color:"#aabbd4",padding:"6px 9px",borderRadius:7,cursor:"pointer",fontSize:13,lineHeight:1}}>
              {de ? "🇬🇧" : "🇩🇪"}
            </button>
            {/* Login — only when logged out */}
            {mounted && !user && (
              <a href="/login"
                style={{fontSize:12,color:"#00c8aa",border:"1px solid rgba(0,200,170,0.4)",padding:"6px 13px",borderRadius:999,textDecoration:"none",fontWeight:500,whiteSpace:"nowrap"}}>
                {de ? "Anmelden" : "Login"}
              </a>
            )}
            {mounted && user && (
              <a href="/dashboard"
                style={{fontSize:12,color:"#00c8aa",border:"1px solid rgba(0,200,170,0.4)",padding:"6px 13px",borderRadius:999,textDecoration:"none",fontWeight:500}}>
                Dashboard
              </a>
            )}
            {/* Menu burger */}
            <button type="button" onClick={toggleMenu} aria-label="Toggle menu"
              style={{background:"transparent",border:"1px solid rgba(0,200,170,0.25)",borderRadius:8,padding:"7px 13px",color:"#e8eef8",cursor:"pointer",fontSize:12,fontFamily:"inherit",whiteSpace:"nowrap"}}>
              {menuOpen ? "✕" : "Menu"}
            </button>
          </div>

        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div onClick={closeMenu}
          style={{position:"fixed",inset:0,zIndex:200,background:"rgba(2,7,16,0.72)",backdropFilter:"blur(6px)",display:"flex",justifyContent:"flex-end"}}>
          <div onClick={e => e.stopPropagation()}
            style={{width:280,height:"100%",background:"#0a1628",borderLeft:"1px solid rgba(0,200,170,0.15)",display:"flex",flexDirection:"column",animation:"slideIn .22s ease-out"}}>
            {/* Drawer header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid rgba(0,200,170,0.1)"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:"#00c8aa",letterSpacing:"0.15em"}}>APEX</span>
              <button onClick={closeMenu} style={{background:"none",border:"none",color:"#6680a0",fontSize:20,cursor:"pointer",padding:"2px 6px"}}>✕</button>
            </div>
            {/* Nav links — Home first */}
            <nav style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} className="apex-drawer-link" onClick={closeMenu}>
                  {de ? link.labelDe : link.label}
                </a>
              ))}
            </nav>
            {/* Auth buttons */}
            <div style={{padding:"16px 20px",borderTop:"1px solid rgba(0,200,170,0.1)",display:"flex",flexDirection:"column",gap:8}}>
              {mounted && user ? (
                <>
                  <a href="/dashboard" onClick={closeMenu}
                    style={{display:"block",textAlign:"center",padding:"11px",borderRadius:10,border:"1px solid rgba(0,200,170,0.35)",color:"#00c8aa",textDecoration:"none",fontSize:14,fontWeight:500}}>
                    Dashboard
                  </a>
                  <button onClick={() => { closeMenu(); handleSignOut(); }}
                    style={{padding:"11px",borderRadius:10,background:"rgba(180,40,40,0.2)",border:"1px solid rgba(220,60,60,0.3)",color:"#ff7070",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
                    {de ? "Abmelden" : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={closeMenu}
                    style={{display:"block",textAlign:"center",padding:"11px",borderRadius:10,border:"1px solid rgba(0,200,170,0.35)",color:"#00c8aa",textDecoration:"none",fontSize:14,fontWeight:500}}>
                    {de ? "Anmelden" : "Login"}
                  </a>
                  <a href="/login" onClick={closeMenu}
                    style={{display:"block",textAlign:"center",padding:"11px",borderRadius:10,background:"#00c8aa",color:"#050d1a",textDecoration:"none",fontSize:14,fontWeight:600}}>
                    {de ? "Registrieren" : "Sign Up"}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
