import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SurveyForm from "@/components/SurveyForm";

export default async function SurveyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: response } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="container page-space">
      <div className="survey-header">
        <div>
          <span className="eyebrow">SURVEY</span>
          <h1>แบบสำรวจพฤติกรรมการรับประทานอาหาร</h1>
          <p className="muted">ตอบตามพฤติกรรมจริงของคุณมากที่สุด ไม่ต้องใส่ชื่อหรือรหัสนิสิต</p>
        </div>
        <div className="user-pill">{user.email}</div>
      </div>
      <SurveyForm initialData={response ?? undefined} userId={user.id} />
    </div>
  );
}
