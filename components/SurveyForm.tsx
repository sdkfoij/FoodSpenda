"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Existing = {
  faculty: string;
  year_level: string;
  meals_per_day: number;
  monthly_food_budget: number;
  average_meal_spend: number;
  common_meal: string;
  dining_place: string;
  delivery_frequency: string;
  important_factors: string[];
  skip_meal_frequency: string;
  notes: string | null;
};

const defaults: Existing = {
  faculty: "",
  year_level: "",
  meals_per_day: 3,
  monthly_food_budget: 3000,
  average_meal_spend: 50,
  common_meal: "มื้อกลางวัน",
  dining_place: "โรงอาหารมหาวิทยาลัย",
  delivery_frequency: "น้อยกว่า 1 ครั้ง/สัปดาห์",
  important_factors: [],
  skip_meal_frequency: "ไม่เคย",
  notes: "",
};

const factors = ["ราคา", "รสชาติ", "ความสะอาด", "ความสะดวก", "ปริมาณ", "โภชนาการ", "รีวิว/คำแนะนำ"];

export default function SurveyForm({ initialData, userId }: { initialData?: Partial<Existing>; userId: string }) {
  const [form, setForm] = useState<Existing>({ ...defaults, ...initialData });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const isEditing = useMemo(() => Boolean(initialData), [initialData]);

  function update<K extends keyof Existing>(key: K, value: Existing[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFactor(factor: string) {
    update(
      "important_factors",
      form.important_factors.includes(factor)
        ? form.important_factors.filter((x) => x !== factor)
        : [...form.important_factors, factor]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const payload = {
      user_id: userId,
      faculty: form.faculty,
      year_level: form.year_level,
      meals_per_day: Number(form.meals_per_day),
      monthly_food_budget: Number(form.monthly_food_budget),
      average_meal_spend: Number(form.average_meal_spend),
      common_meal: form.common_meal,
      dining_place: form.dining_place,
      delivery_frequency: form.delivery_frequency,
      important_factors: form.important_factors,
      skip_meal_frequency: form.skip_meal_frequency,
      notes: form.notes || null,
    };

    const { error } = await supabase.from("survey_responses").upsert(payload, { onConflict: "user_id" });

    if (error) setMessage(error.message);
    else setMessage(isEditing ? "บันทึกการแก้ไขเรียบร้อยแล้ว" : "ส่งแบบสำรวจเรียบร้อยแล้ว ขอบคุณสำหรับข้อมูลครับ/ค่ะ");

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      <section className="form-card">
        <div className="section-title"><span>01</span><div><h2>ข้อมูลทั่วไป</h2><p>ใช้สำหรับแบ่งกลุ่มข้อมูลในการวิเคราะห์</p></div></div>
        <div className="form-grid">
          <label>คณะ / สาขา<input required value={form.faculty} onChange={(e) => update("faculty", e.target.value)} placeholder="เช่น วิทยาศาสตร์" /></label>
          <label>ชั้นปี<select required value={form.year_level} onChange={(e) => update("year_level", e.target.value)}><option value="">เลือกชั้นปี</option><option>ปี 1</option><option>ปี 2</option><option>ปี 3</option><option>ปี 4</option><option>ปี 5 ขึ้นไป</option></select></label>
        </div>
      </section>

      <section className="form-card">
        <div className="section-title"><span>02</span><div><h2>พฤติกรรมและค่าใช้จ่าย</h2><p>ตอบโดยประมาณก็ได้</p></div></div>
        <div className="form-grid three">
          <label>จำนวนมื้อต่อวัน<input type="number" min="1" max="8" required value={form.meals_per_day} onChange={(e) => update("meals_per_day", Number(e.target.value))} /></label>
          <label>งบอาหารต่อเดือน (บาท)<input type="number" min="0" step="100" required value={form.monthly_food_budget} onChange={(e) => update("monthly_food_budget", Number(e.target.value))} /></label>
          <label>ค่าอาหารเฉลี่ยต่อมื้อ (บาท)<input type="number" min="0" step="1" required value={form.average_meal_spend} onChange={(e) => update("average_meal_spend", Number(e.target.value))} /></label>
        </div>
        <div className="form-grid">
          <label>มื้อที่ซื้ออาหารบ่อยที่สุด<select value={form.common_meal} onChange={(e) => update("common_meal", e.target.value)}><option>มื้อเช้า</option><option>มื้อกลางวัน</option><option>มื้อเย็น</option><option>ของว่าง / เครื่องดื่ม</option></select></label>
          <label>สถานที่/ช่องทางที่ใช้บ่อย<select value={form.dining_place} onChange={(e) => update("dining_place", e.target.value)}><option>โรงอาหารมหาวิทยาลัย</option><option>ร้านอาหารรอบมหาวิทยาลัย</option><option>ร้านสะดวกซื้อ</option><option>สั่งเดลิเวอรี</option><option>ทำอาหารเอง</option></select></label>
          <label>สั่งเดลิเวอรีบ่อยแค่ไหน<select value={form.delivery_frequency} onChange={(e) => update("delivery_frequency", e.target.value)}><option>ทุกวัน</option><option>3–6 ครั้ง/สัปดาห์</option><option>1–2 ครั้ง/สัปดาห์</option><option>น้อยกว่า 1 ครั้ง/สัปดาห์</option><option>ไม่เคย</option></select></label>
          <label>ข้ามมื้ออาหารบ่อยแค่ไหน<select value={form.skip_meal_frequency} onChange={(e) => update("skip_meal_frequency", e.target.value)}><option>ไม่เคย</option><option>นาน ๆ ครั้ง</option><option>1–2 ครั้ง/สัปดาห์</option><option>3 ครั้งขึ้นไป/สัปดาห์</option></select></label>
        </div>
      </section>

      <section className="form-card">
        <div className="section-title"><span>03</span><div><h2>ปัจจัยในการเลือกรับประทานอาหาร</h2><p>เลือกได้มากกว่า 1 ข้อ</p></div></div>
        <div className="check-grid">
          {factors.map((factor) => (
            <label className="check-item" key={factor}><input type="checkbox" checked={form.important_factors.includes(factor)} onChange={() => toggleFactor(factor)} /><span>{factor}</span></label>
          ))}
        </div>
        <label>ความคิดเห็นเพิ่มเติม (ไม่บังคับ)<textarea rows={4} value={form.notes ?? ""} onChange={(e) => update("notes", e.target.value)} placeholder="เช่น ปัจจัยที่ทำให้เลือกกินอาหารราคาแพงขึ้น..." /></label>
      </section>

      <label className="consent"><input type="checkbox" required /><span>ฉันยืนยันว่าข้อมูลที่ให้เป็นความจริงตามความเข้าใจของฉัน และยินยอมให้ใช้เพื่อการศึกษา/วิเคราะห์ในภาพรวม</span></label>

      <div className="submit-row"><button className="button primary" disabled={saving}>{saving ? "กำลังบันทึก..." : isEditing ? "บันทึกการแก้ไข" : "ส่งแบบสำรวจ"}</button>{message && <span className="success-text">{message}</span>}</div>
    </form>
  );
}
