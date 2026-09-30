# นิสิตกินอย่างไร? — Student Food Survey

เว็บแบบสำรวจหัวข้อ **พฤติกรรมและค่าใช้จ่ายในการรับประทานอาหารของนิสิต**

## เทคโนโลยี

- Next.js + TypeScript
- Supabase Auth + PostgreSQL + Row Level Security (RLS)
- GitHub สำหรับเก็บ Source Code
- Vercel สำหรับ Deploy

## ไฟล์สำคัญ

`app/page.tsx` — หน้าแรก  
`app/auth/page.tsx` — สมัครสมาชิก / เข้าสู่ระบบ  
`app/survey/page.tsx` — หน้าทำแบบสำรวจ  
`components/SurveyForm.tsx` — ฟอร์มและการบันทึกข้อมูล  
`supabase/schema.sql` — ตารางและ RLS Policy  
`lib/supabase/*` — Supabase client/server/session

## ตั้งค่า Supabase

1. สร้าง Project ใหม่ใน Supabase
2. เปิด **SQL Editor**
3. คัดลอกเนื้อหาใน `supabase/schema.sql` ไป Run
4. ดู Project URL และ Publishable Key จาก Supabase แล้วสร้างไฟล์ `.env.local`

ตัวอย่าง:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

**ห้ามนำ `.env.local` หรือ Supabase Secret Key ขึ้น GitHub**

## รันในเครื่อง

ต้องใช้ Node.js 20.9 ขึ้นไป

```bash
npm install
npm run dev
```

จากนั้นเปิด `http://localhost:3000`

## วิธีใช้งาน

1. เปิดหน้า **เข้าสู่ระบบ / สมัครสมาชิก**
2. สมัครด้วยอีเมลและรหัสผ่าน
3. เข้า **แบบสำรวจ**
4. กรอกข้อมูลแล้วกดส่ง
5. ผู้ใช้เดิมสามารถกลับมาแก้ไขคำตอบของตัวเองได้

## Deploy บน Vercel

1. เข้า Vercel
2. เลือก **Add New Project**
3. Import repository `sdkfoij/FoodSpenda`
4. เพิ่ม Environment Variables เหมือนใน `.env.local`
5. Deploy

Environment Variables ที่ต้องมี:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

หลังจากเปลี่ยน Environment Variables ให้ Redeploy เพื่อให้ deployment ใหม่ใช้ค่าดังกล่าว

## ตั้งค่า URL ใน Supabase

หลัง Vercel สร้างโดเมนให้แล้ว ไปที่:

**Supabase → Authentication → URL Configuration**

และตั้ง **Site URL** เป็น URL จริงของเว็บ เช่น:

`https://your-project.vercel.app`

## ความเป็นส่วนตัว

โปรเจกต์ตัวอย่างนี้ไม่ขอรหัสนิสิตหรือเลขบัตรประชาชน ข้อมูลแบบสำรวจเชื่อมกับ account id ของผู้ใช้ และใช้ RLS จำกัดการอ่าน/เพิ่ม/แก้ไข/ลบข้อมูลให้เป็นของเจ้าของบัญชีนั้นเท่านั้น
