"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="reveal-up" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      // background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(26,92,170,0.1)",
      boxShadow: "0 2px 20px rgba(26,92,170,0.08)"
    }}>
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:70 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/aythiya_logo.png" alt="Aythiya Logo" style={{ width:38, height:38, objectFit:"contain" }} />
          <span style={{ fontFamily:"'Noto Sans Sinhala', sans-serif", fontSize:22, fontWeight:700, color:"#1a5caa" }}>අයිතිය</span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display:"flex", gap:32, alignItems:"center" }} className="desktop-nav">
          {["Home","Features","About","Pricing","FAQ","Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color:"#334155", textDecoration:"none", fontSize:14, fontWeight:500,
              transition:"color 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.color="#1a5caa")}
            onMouseLeave={e => (e.currentTarget.style.color="#334155")}
            >{item}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <a href="/login" className="hover-lift shine-on-hover" style={{
            background:"linear-gradient(135deg,#1a5caa,#2e78d4)", color:"#fff",
            padding:"10px 22px", borderRadius:50, fontSize:14, fontWeight:600,
            textDecoration:"none", transition:"transform 0.2s, box-shadow 0.2s",
            boxShadow:"0 4px 14px rgba(26,92,170,0.3)"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(26,92,170,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 14px rgba(26,92,170,0.3)"; }}
          >Ask for Free</a>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{
            display:"none", background:"none", border:"none", cursor:"pointer",
            flexDirection:"column", gap:5, padding:4
          }}>
            {[0,1,2].map(i => <span key={i} style={{ display:"block", width:22, height:2, background:"#1a5caa", borderRadius:2 }}/>)}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background:"#fff", padding:"16px 24px", borderTop:"1px solid var(--border)" }}>
          {["Home","Features","About","Pricing","FAQ","Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
              display:"block", padding:"12px 0", color:"#334155",
              textDecoration:"none", fontSize:15, fontWeight:500,
              borderBottom:"1px solid #f1f5f9"
            }}>{item}</a>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav { display:none !important; }
          .hamburger { display:flex !important; }
        }
      `}</style>
    </nav>
  );
}
