import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SurveyForm from "@/components/SurveyForm";

// This page depends on the signed-in user's cookie/session,
// so it must be rendered at request time rather than prerendered at build time.
export const dynamic = "force-dynamic";

export default async function SurveyPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsError ? null : claimsData?.claims ?? null;

  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) redirect("/auth");

  const userEmail = typeof claims?.email === "string" ? claims.email : "";

  const { data: response, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load survey response:", error.message);
  }

  return (
    <div className="container page-space">
      <div className="survey-header">
        <div>
          <span className="eyebrow">SURVEY</span>
          <h1>แบบสำรวจพฤติกรรมการรับประทานอาหาร</h1>
          <p className="muted">ตอบตามพฤติกรรมจริงของคุณมากที่สุด ไม่ต้องใส่ชื่อหรือรหัสนิสิต</p>
        </div>
        <div className="user-pill">{userEmail}</div>
      </div>
      <SurveyForm initialData={response ?? undefined} userId={userId} />
    </div>
  );
}
