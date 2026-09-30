"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const REQUEST_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      window.setTimeout(
        () => reject(new Error("การเชื่อมต่อ Supabase ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง")),
        timeoutMs
      )
    ),
  ]);
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowResend(false);
    
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!url || !key) {
        throw new Error("ยังไม่ได้ตั้งค่า Supabase ใน Vercel: NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
      }

      const supabase = createClient();

      if (mode === "login") {
        const { error } = await withTimeout(
          supabase.auth.signInWithPassword({ email: email.trim(), password }),
          REQUEST_TIMEOUT_MS
        );

        if (error) throw error;

        window.location.href = "/survey";
        return;
      }

      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
        }),
        REQUEST_TIMEOUT_MS
      );

      if (error) throw error;

      if (data.session) {
        window.location.href = "/survey";
        return;
      }

      setMessageType("success");
      setMessage(
        "สมัครสมาชิกสำเร็จครับ/ค่ะ กรุณาเปิดอีเมลเพื่อกดยืนยันบัญชี แล้วระบบจะพากลับเข้าเว็บไซต์อัตโนมัติ"
      );
      setShowResend(true);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setShowResend(mode === "signup" && email.trim().length > 0);
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!email.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await withTimeout(
        supabase.auth.resend({
          type: "signup",
          email: email.trim(),
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
        }),
        REQUEST_TIMEOUT_MS
      );

      if (error) throw error;

      setMessageType("success");
      setMessage("ส่งอีเมลยืนยันใหม่แล้ว กรุณาตรวจสอบกล่องจดหมายและโฟลเดอร์สแปม");
      setShowResend(false);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "ส่งอีเมลยืนยันไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container narrow page-space">
      <section className="auth-card">
        <span className="eyebrow">ACCOUNT</span>
        <h1>{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>
        <p className="muted">ใช้บัญชีนี้เพื่อส่งและดูข้อมูลแบบสำรวจของตัวเอง</p>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            อีเมล
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              disabled={loading}
            />
          </label>

          <label>
            รหัสผ่าน
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              disabled={loading}
            />
          </label>

          <button className="button primary full" disabled={loading}>
            {loading
              ? "กำลังเชื่อมต่อ..."
              : mode === "login"
                ? "เข้าสู่ระบบ"
                : "สร้างบัญชี"}
          </button>
        </form>

        {message && (
          <div className={messageType === "success" ? "success-box" : "alert"}>
            {message}
          </div>
        )}

        {showResend && mode === "signup" && (
          <button type="button" className="link-button" disabled={loading} onClick={resendConfirmation}>
            ส่งอีเมลยืนยันอีกครั้ง
          </button>
        )}

        <button
          type="button"
          className="link-button"
          disabled={loading}
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
        </button>
      </section>
    </div>
  );
}
