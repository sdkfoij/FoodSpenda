import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container page-space">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">STUDENT FOOD SURVEY</span>
          <h1>พฤติกรรมและค่าใช้จ่าย<br />ในการรับประทานอาหารของนิสิต</h1>
          <p>
            แบบสำรวจสั้น ๆ ที่ช่วยเก็บข้อมูลว่า นิสิตรับประทานอาหารอย่างไร ใช้จ่ายเท่าไร
            และปัจจัยใดมีผลต่อการตัดสินใจเลือกร้านหรือมื้ออาหาร
          </p>
          <div className="button-row">
            <Link className="button primary" href="/survey">เริ่มทำแบบสำรวจ</Link>
            <Link className="button secondary" href="/auth">เข้าสู่ระบบ / สมัครสมาชิก</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="food-icon">🍱</div>
          <h2>ใช้เวลาประมาณ 2–3 นาที</h2>
          <p>ข้อมูลจะถูกบันทึกในระบบฐานข้อมูล Supabase และใช้เพื่อการศึกษา</p>
        </div>
      </section>

      <section className="section-heading">
        <span className="eyebrow">WHAT WE ASK</span>
        <h2>แบบสำรวจครอบคลุมเรื่องอะไรบ้าง?</h2>
      </section>

      <section className="card-grid">
        <article className="info-card"><div className="icon">🍚</div><h3>พฤติกรรมการกิน</h3><p>จำนวนมื้อ ช่วงเวลาที่รับประทาน และมื้อที่ซื้อเป็นประจำ</p></article>
        <article className="info-card"><div className="icon">💸</div><h3>ค่าใช้จ่าย</h3><p>งบอาหารต่อเดือนและค่าใช้จ่ายโดยเฉลี่ยต่อมื้อ</p></article>
        <article className="info-card"><div className="icon">📍</div><h3>สถานที่และช่องทาง</h3><p>ร้านอาหาร โรงอาหาร สั่งเดลิเวอรี หรือทำอาหารเอง</p></article>
      </section>

      <section className="notice">
        <strong>หมายเหตุด้านข้อมูลส่วนบุคคล</strong>
        <span>เว็บไซต์ตัวอย่างนี้ไม่ขอรหัสนิสิตหรือข้อมูลบัตรประชาชน และเปิดให้แก้ไขเฉพาะข้อมูลของบัญชีที่เข้าสู่ระบบ</span>
      </section>
    </div>
  );
}
