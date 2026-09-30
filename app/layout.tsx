import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "นิสิตกินอย่างไร? | พฤติกรรมและค่าใช้จ่ายในการรับประทานอาหาร",
  description: "แบบสำรวจพฤติกรรมและค่าใช้จ่ายในการรับประทานอาหารของนิสิต",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link href="/" className="brand">
              <span className="brand-mark">🍜</span>
              <span>นิสิตกินอย่างไร?</span>
            </Link>
            <nav className="nav-links">
              <Link href="/">หน้าแรก</Link>
              <Link href="/survey">แบบสำรวจ</Link>
              <Link href="/auth">เข้าสู่ระบบ</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">แบบสำรวจเพื่อการศึกษา • จัดเก็บข้อมูลด้วย Supabase</div>
        </footer>
      </body>
    </html>
  );
}
