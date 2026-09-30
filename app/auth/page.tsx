"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/survey";
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else if (data.session) window.location.href = "/survey";
      else setMessage("สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ");
    }

    setLoading(false);
  }

  return (
    <div className="container narrow page-space">
      <section className="auth-card">
        <span className="eyebrow">ACCOUNT</span>
        <h1>{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>
        <p className="muted">ใช้บัญชีนี้เพื่อส่งและดูข้อมูลแบบสำรวจของตัวเอง</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>อีเมล<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" /></label>
          <label>รหัสผ่าน<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" /></label>
          <button className="button primary full" disabled={loading}>{loading ? "กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</button>
        </form>
        {message && <div className="alert">{message}</div>}
        <button type="button" className="link-button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>
          {mode === "login" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
        </button>
      </section>
    </div>
  );
}
