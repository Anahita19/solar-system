import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Download, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { LanguageSwitch, useLanguage } from "@/contexts/LanguageContext";
import { IS_PUBLIC_DEMO } from "@shared/site-mode";

const persianBuildingTypes: Record<string, string> = {
  "Warehouse": "انبار",
  "Factory / manufacturing": "کارخانه / تولید",
  "School / campus": "مدرسه / پردیس آموزشی",
  "Office": "دفتر کار",
  "Retail": "فروشگاه / خرده‌فروشی",
  "Other": "سایر",
};

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const adminCopy = {
  fa: {
    pageTitle: "مدیریت سرنخ‌ها | سولاس انرژی",
    header: "مدیریت درخواست‌ها",
    eyebrow: "فضای کاری مالک",
    heading: "درخواست‌های ارزیابی",
    description: "اطلاعات محرمانه سرنخ‌ها و برآوردهای اولیه پروژه.",
    export: "دریافت CSV",
    signOut: "خروج",
    checking: "در حال بررسی دسترسی…",
    signInTitle: "ورود مالک لازم است",
    signInCopy: "برای مشاهده درخواست‌ها با حساب مالک سولاس وارد شوید.",
    signIn: "ورود امن",
    verifyTitle: "تأیید دسترسی مالک ممکن نشد",
    retryCopy: "صفحه را تازه‌سازی کنید یا دوباره وارد شوید.",
    retry: "تلاش دوباره",
    ownerOnlyTitle: "فقط مالک مجاز است",
    ownerOnlyCopy: "این بخش فقط برای حساب مالک تعریف‌شدهٔ سولاس در دسترس است.",
    loadTitle: "بارگذاری درخواست‌ها ممکن نشد",
    request: "درخواست",
    requests: "درخواست",
    contact: "راه‌های تماس",
    property: "ملک",
    estimate: "برآورد",
    attribution: "منبع جذب",
    received: "زمان دریافت",
    monthly: "ماهانه",
    year: "سالانه",
    payback: "بازگشت سرمایه",
    direct: "مستقیم",
    empty: "هنوز درخواست ارزیابی ثبت نشده است.",
    demoTitle: "پنل مالک در نسخهٔ دمو غیرفعال است",
    demoCopy: "این نسخه فقط نمایشی است و به اطلاعات درخواست‌های واقعی دسترسی ندارد.",
    demoDescription: "نسخهٔ نمایشی؛ در این صفحه درخواست واقعی یا دادهٔ محرمانه‌ای نمایش داده نمی‌شود.",
  },
  en: {
    pageTitle: "Lead management | Solace Energy",
    header: "LEAD MANAGEMENT",
    eyebrow: "OWNER WORKSPACE",
    heading: "Assessment requests",
    description: "Confidential lead details and preliminary project estimates.",
    export: "Export CSV",
    signOut: "Sign out",
    checking: "Checking access…",
    signInTitle: "Owner sign-in required",
    signInCopy: "Sign in with the Solace owner account to view submitted leads.",
    signIn: "Sign in securely",
    verifyTitle: "Unable to verify owner access",
    retryCopy: "Please refresh the page or sign in again.",
    retry: "Try again",
    ownerOnlyTitle: "Owner access only",
    ownerOnlyCopy: "This workspace is restricted to the configured Solace owner account.",
    loadTitle: "Unable to load leads",
    request: "request",
    requests: "requests",
    contact: "CONTACT",
    property: "PROPERTY",
    estimate: "ESTIMATE",
    attribution: "ATTRIBUTION",
    received: "RECEIVED",
    monthly: "monthly",
    year: "year",
    payback: "yr payback",
    direct: "Direct",
    empty: "No assessment requests yet.",
    demoTitle: "Owner workspace is disabled in the demo",
    demoCopy: "This is a view-only demonstration and cannot access real assessment requests.",
    demoDescription: "Public demo: no real requests or confidential lead records are shown here.",
  },
} as const;

export default function Admin() {
  const { language } = useLanguage();
  const c = adminCopy[language];
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const auth = useAuth();
  const owner = trpc.auth.isOwner.useQuery(undefined, { enabled: !IS_PUBLIC_DEMO && Boolean(auth.user), retry: false });
  const q = trpc.lead.adminList.useQuery(undefined, { enabled: !IS_PUBLIC_DEMO && owner.data === true, retry: false });
  const rows = q.data || [];
  const csv = useMemo(() => {
    const headers = ["Created", "Name", "Company", "Role", "Email", "Phone", "Address", "Building type", "Monthly bill", "System kW", "Annual savings", "Payback years", "UTM source", "UTM medium", "UTM campaign"];
    return [headers, ...rows.map(row => [row.createdAt, row.name, row.company, row.role, row.email, row.phone, row.address, row.buildingType, row.monthlyBill, row.systemKw, row.annualSavings, row.paybackYears, row.utmSource, row.utmMedium, row.utmCampaign])]
      .map(row => row.map(csvCell).join(",")).join("\r\n");
  }, [rows]);

  useEffect(() => {
    document.title = c.pageTitle;
  }, [c.pageTitle]);

  function download() {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    anchor.download = "solace-leads.csv";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  const checking = !IS_PUBLIC_DEMO && (auth.loading || (Boolean(auth.user) && owner.isLoading) || q.isLoading);
  const formatted = (value: number) => new Intl.NumberFormat(locale).format(value);

  return <div className="admin-page">
    <header className="admin-top"><div className="wrap"><Link href="/" className="brand"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></Link><div className="admin-top-actions"><LanguageSwitch /><span>{c.header}</span></div></div></header>
    <main className="wrap admin-content">
      <div className="admin-heading"><div><p className="eyebrow">{c.eyebrow}</p><h1>{c.heading}</h1><p>{IS_PUBLIC_DEMO ? c.demoDescription : c.description}</p></div>
        {owner.data === true && <div className="admin-actions"><button className="btn btn-green" onClick={download} disabled={!rows.length}><Download size={16} />{c.export}</button><button className="btn btn-outline-dark" onClick={() => auth.logout()}><LogOut size={15} />{c.signOut}</button></div>}
      </div>
      {IS_PUBLIC_DEMO ? <div className="admin-gate"><h2>{c.demoTitle}</h2><p>{c.demoCopy}</p></div> : checking ? <p>{c.checking}</p> : !auth.user ? <div className="admin-gate"><h2>{c.signInTitle}</h2><p>{c.signInCopy}</p><button className="btn btn-green" onClick={() => startLogin()}>{c.signIn}</button></div>
        : owner.isError ? <div className="admin-gate"><h2>{c.verifyTitle}</h2><p>{c.retryCopy}</p><button className="btn btn-outline-dark" onClick={() => owner.refetch()}>{c.retry}</button></div>
          : owner.data !== true ? <div className="admin-gate"><h2>{c.ownerOnlyTitle}</h2><p>{c.ownerOnlyCopy}</p><button className="btn btn-outline-dark" onClick={() => auth.logout()}>{c.signOut}</button></div>
            : q.error ? <div className="admin-gate"><h2>{c.loadTitle}</h2><p>{language === "en" ? q.error.message : "لطفاً اتصال را بررسی و دوباره تلاش کنید."}</p><button className="btn btn-outline-dark" onClick={() => q.refetch()}>{c.retry}</button></div>
              : <><div className="lead-count">{formatted(rows.length)} {rows.length === 1 ? c.request : c.requests}</div><div className="table-shell"><table className="lead-table"><thead><tr><th>{c.contact}</th><th>{c.property}</th><th>{c.estimate}</th><th>{c.attribution}</th><th>{c.received}</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><b>{row.name}</b><small>{row.company} · {row.role}</small><a dir="ltr" href={`mailto:${row.email}`}>{row.email}</a><a dir="ltr" href={`tel:${row.phone}`}>{row.phone}</a></td><td><b>{row.address}</b><small>{(language === "fa" ? persianBuildingTypes[row.buildingType] || row.buildingType : row.buildingType)} · <bdi dir="ltr">${formatted(Number(row.monthlyBill))}/{c.monthly}</bdi></small></td><td><b dir="ltr">{formatted(Number(row.systemKw))} kW</b><small dir="ltr">${formatted(Number(row.annualSavings))}/{c.year}</small><small>{row.paybackYears} {c.payback}</small></td><td>{row.utmSource || c.direct}<small>{row.utmMedium || "—"} · {row.utmCampaign || "—"}</small></td><td>{new Date(row.createdAt).toLocaleDateString(locale)}</td></tr>)}</tbody></table>{!rows.length && <p className="empty-leads">{c.empty}</p>}</div></>}
    </main>
  </div>;
}
