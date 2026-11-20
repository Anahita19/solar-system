import { useLanguage } from "@/contexts/LanguageContext";

export default function DemoNotice() {
  const { language } = useLanguage();
  const text = language === "fa"
    ? "نسخهٔ نمایشی · اطلاعات شرکت، پروژه‌ها و ارقام نمونه‌اند؛ این سایت درخواست واقعی ثبت نمی‌کند."
    : "Public demo · Company details, projects and figures are samples; this site does not accept real requests.";

  return <aside className="demo-banner" role="note">{text}</aside>;
}
