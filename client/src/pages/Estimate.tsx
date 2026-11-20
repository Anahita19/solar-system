import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LanguageSwitch, useLanguage, type Language } from "@/contexts/LanguageContext";
import { IS_PUBLIC_DEMO } from "@shared/site-mode";

type EstimateStart = { address?: string; type?: string; bill?: string };
type ContactForm = { name: string; company: string; role: string; email: string; phone: string; consent: boolean };

const estimateCopy = {
  fa: {
    pageTitle: "برآورد صرفه‌جویی خورشیدی | سولاس انرژی",
    metaDescription: "برآورد اولیه ظرفیت سامانه خورشیدی، صرفه‌جویی سالانه و بازگشت سرمایه برای ملک تجاری شما در تگزاس.",
    back: "بازگشت به سولاس",
    eyebrow: "فرصت خورشیدی ملک شما",
    titleLine1: "نگاهی اولیه به",
    titleLine2: "ظرفیت ملک شما.",
    summary: "این برآورد اولیه بر اساس هزینه ماهانه انرژی محاسبه می‌شود. تیم ما در بازدید از محل، وضعیت بام، تعرفه برق و جزئیات بهره‌برداری را بررسی و تأیید می‌کند.",
    mapAlt: (address: string) => `نمای ماهواره‌ای ${address}`,
    mapPrompt: "نشانی را وارد کنید تا ملک روی نقشه نمایش داده شود",
    mapUnavailable: "تصویر ماهواره‌ای موقتاً در دسترس نیست.",
    propertyView: "نمای ماهواره‌ای ملک",
    metricSystem: "ظرفیت اولیه سامانه",
    metricSavings: "صرفه‌جویی سالانه برآوردی",
    metricPayback: "دوره بازگشت ساده سرمایه",
    years: "سال",
    disclaimer: "این برآورد صرفاً نمایشی است و پیشنهاد یا تضمین محسوب نمی‌شود. طراحی و صرفه اقتصادی نهایی به ارزیابی محل، تعرفه، مشوق‌ها و مهندسی بستگی دارد.",
    propertyDetails: "مشخصات ملک",
    address: "نشانی ساختمان",
    addressPlaceholder: "خیابان، شهر، کد پستی",
    buildingType: "نوع ساختمان",
    buildingTypes: [
      { value: "Warehouse", label: "انبار" },
      { value: "Factory / manufacturing", label: "کارخانه / تولید" },
      { value: "School / campus", label: "مدرسه / پردیس آموزشی" },
      { value: "Office", label: "دفتر کار" },
      { value: "Retail", label: "فروشگاه / خرده‌فروشی" },
      { value: "Other", label: "سایر" },
    ],
    monthlyBill: "میانگین قبض ماهانه برق",
    nextStep: "گام بعدی",
    demoNotice: "این نسخه فقط برای نمایش است؛ اطلاعات شرکت و پروژه‌ها نمونه‌اند و امکان ثبت درخواست یا ارسال اطلاعات وجود ندارد.",
    requestTitle: "درخواست ارزیابی محل",
    requestIntro: "برای شناخت مجموعه شما و هماهنگی بازدید بدون تعهد، با شما تماس می‌گیریم.",
    fullName: "نام و نام خانوادگی",
    company: "شرکت",
    role: "سمت / عنوان شغلی",
    workEmail: "ایمیل کاری",
    phone: "تلفن",
    consent: "موافقم سولاس درباره این ارزیابی با من تماس بگیرد. هر زمان می‌توانم درخواست توقف تماس بدهم.",
    demoError: "حالت دمو فقط برای مشاهده است. درخواست ارزیابی ارسال نشد.",
    submitError: "در حال حاضر نتوانستیم درخواست را ارسال کنیم. دوباره تلاش کنید یا با شماره (800) 555-0146 تماس بگیرید.",
    requestButton: "درخواست ارزیابی من",
    sending: "در حال ارسال درخواست…",
    demoButton: "حالت دمو · ارسال غیرفعال است",
    successTitle: "درخواست شما دریافت شد.",
    successPrefix: "سپاسگزاریم،",
    successSuffix: "مشاور پروژه سولاس به‌زودی با شما تماس می‌گیرد.",
    copyright: "© 2026 سولاس انرژی",
    footerLicence: "تگزاس · مجوز TECL #39218",
    estimateNotice: "برآوردها اولیه‌اند و باید در محل تأیید شوند.",
  },
  en: {
    pageTitle: "Estimate your solar savings | Solace Energy",
    metaDescription: "Get a preliminary estimate of solar system size, annual savings and payback for your Texas commercial property.",
    back: "Back to Solace",
    eyebrow: "Your solar opportunity",
    titleLine1: "A first look at",
    titleLine2: "your property's potential.",
    summary: "A preliminary estimate based on your monthly energy spend. Our team will verify roof conditions, utility rates and operating details during a site assessment.",
    mapAlt: (address: string) => `Satellite view of ${address}`,
    mapPrompt: "Enter an address to view the property",
    mapUnavailable: "Satellite imagery is temporarily unavailable.",
    propertyView: "Property satellite view",
    metricSystem: "Preliminary system size",
    metricSavings: "Estimated annual savings",
    metricPayback: "Estimated simple payback",
    years: "years",
    disclaimer: "Illustrative estimate only, not a proposal or guarantee. Final design and economics depend on site assessment, tariff, incentives and engineering.",
    propertyDetails: "Property details",
    address: "Building address",
    addressPlaceholder: "Street, city, ZIP",
    buildingType: "Building type",
    buildingTypes: [
      { value: "Warehouse", label: "Warehouse" },
      { value: "Factory / manufacturing", label: "Factory / manufacturing" },
      { value: "School / campus", label: "School / campus" },
      { value: "Office", label: "Office" },
      { value: "Retail", label: "Retail" },
      { value: "Other", label: "Other" },
    ],
    monthlyBill: "Average monthly electricity bill",
    nextStep: "Next step",
    demoNotice: "This is a view-only demo. Company and project details are samples; forms and lead submissions are disabled.",
    requestTitle: "Request a site assessment",
    requestIntro: "We'll follow up to learn about your facility and arrange a no-obligation site review.",
    fullName: "Full name",
    company: "Company",
    role: "Role / title",
    workEmail: "Work email",
    phone: "Phone",
    consent: "I agree that Solace may contact me about this assessment. I can opt out at any time.",
    demoError: "Demo mode is read-only. No site-assessment request was sent.",
    submitError: "We couldn't submit your request just now. Please try again or call (800) 555-0146.",
    requestButton: "Request my assessment",
    sending: "Sending request…",
    demoButton: "Demo mode · submissions disabled",
    successTitle: "Request received.",
    successPrefix: "Thank you,",
    successSuffix: "A Solace project advisor will be in touch soon.",
    copyright: "© 2026 Solace Energy",
    footerLicence: "Texas TECL #39218",
    estimateNotice: "Estimates are preliminary and subject to site verification.",
  },
} as const;

export default function Estimate() {
  const { language } = useLanguage();
  const c = estimateCopy[language];
  const isDemoMode = IS_PUBLIC_DEMO || new URLSearchParams(window.location.search).get("demo") === "1";
  const initial = useMemo<EstimateStart>(() => {
    if (isDemoMode) return { address: "Austin, TX", type: "Office", bill: "9500" };
    try {
      return JSON.parse(sessionStorage.getItem("solaceEstimate") || "{}") as EstimateStart;
    } catch {
      return {};
    }
  }, [isDemoMode]);

  const [address, setAddress] = useState(initial.address || "");
  const [mapAddress, setMapAddress] = useState(initial.address || "");
  const [mapFailed, setMapFailed] = useState(false);
  const [type, setType] = useState(initial.type || "Warehouse");
  const [bill, setBill] = useState(Number(initial.bill) || 8500);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ContactForm>({ name: "", company: "", role: "", email: "", phone: "", consent: false });

  const monthly = Number(bill) || 0;
  const annualSavings = Math.round(monthly * 12 * 0.68);
  const systemKw = Math.round(annualSavings / (0.12 * 1500));
  const paybackYears = Number((systemKw * 1050 / (annualSavings || 1)).toFixed(1));
  const formatNumber = (value: number) => new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 }).format(value);
  const mapSrc = mapAddress ? `/api/property-map?address=${encodeURIComponent(mapAddress)}` : "";
  const submit = trpc.lead.submit.useMutation();

  useEffect(() => {
    document.title = c.pageTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = c.metaDescription;
  }, [c.pageTitle, c.metaDescription]);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isDemoMode) {
      setError(c.demoError);
      return;
    }
    try {
      const query = new URLSearchParams(location.search);
      let saved: Record<string, string> = {};
      try {
        saved = JSON.parse(sessionStorage.getItem("solaceUtm") || "{}");
      } catch {
        saved = {};
      }
      await submit.mutateAsync({
        address,
        buildingType: type,
        monthlyBill: monthly,
        systemKw,
        annualSavings,
        paybackYears,
        ...form,
        consent: true,
        utmSource: query.get("utm_source") || saved.utmSource || undefined,
        utmMedium: query.get("utm_medium") || saved.utmMedium || undefined,
        utmCampaign: query.get("utm_campaign") || saved.utmCampaign || undefined,
      });
      setDone(true);
    } catch {
      setError(c.submitError);
    }
  }

  return <div className="estimate-page">
    <header className="estimate-top"><div className="wrap"><Link href="/" className="brand"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></Link><div className="estimate-top-actions"><LanguageSwitch /><Link href="/" className="back-link"><ArrowLeft className="directional-arrow" size={15} />{c.back}</Link></div></div></header>
    <main className="wrap estimate-layout">
      <div className="estimate-summary">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>{c.titleLine1}<br />{c.titleLine2}</h1>
        <p className="muted">{c.summary}</p>
        <div className="map-box">
          {mapSrc ? <img src={mapSrc} alt={c.mapAlt(mapAddress)} onError={event => { event.currentTarget.style.display = "none"; setMapFailed(true); }} /> : <div className="map-placeholder">{c.mapPrompt}</div>}
          {mapFailed && <div className="map-placeholder map-error">{c.mapUnavailable}</div>}
          <div className="map-address" dir="auto">{mapAddress || c.propertyView}</div>
        </div>
        <div className="estimate-metrics">
          <div><span>{c.metricSystem}</span><b dir="ltr">{formatNumber(systemKw)} <small>kW</small></b></div>
          <div><span>{c.metricSavings}</span><b dir="ltr">${formatNumber(annualSavings)}</b></div>
          <div><span>{c.metricPayback}</span><b dir="ltr">{formatNumber(paybackYears)} <small>{c.years}</small></b></div>
        </div>
        <p className="disclaimer">{c.disclaimer}</p>
      </div>
      <aside className="estimate-edit">
        <p className="eyebrow">{c.propertyDetails}</p>
        <label>{c.address}<input dir="ltr" readOnly={isDemoMode} value={address} onChange={event => setAddress(event.target.value)} onBlur={() => { if (address.trim() !== mapAddress) { setMapFailed(false); setMapAddress(address.trim()); } }} placeholder={c.addressPlaceholder} /></label>
        <label>{c.buildingType}<select disabled={isDemoMode} value={type} onChange={event => setType(event.target.value)}>{c.buildingTypes.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label>{c.monthlyBill}<div className="money-input"><span>$</span><input dir="ltr" readOnly={isDemoMode} type="number" min="100" value={bill} onChange={event => setBill(Number(event.target.value))} /></div></label>
        <div className="assessment-form">
          <p className="eyebrow">{c.nextStep}</p>
          {isDemoMode ? <div className="demo-readonly"><h2>{c.requestTitle}</h2><p className="demo-notice" role="note">{c.demoNotice}</p></div> : <>
          <h2>{c.requestTitle}</h2>
          <p>{c.requestIntro}</p>
          {done ? <div className="success-panel"><Check /><h3>{c.successTitle}</h3><p>{c.successPrefix} {form.name}. {c.successSuffix}</p></div> : <form onSubmit={send}>
            <label>{c.fullName}<input required autoComplete="name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
            <label>{c.company}<input required autoComplete="organization" value={form.company} onChange={event => setForm({ ...form, company: event.target.value })} /></label>
            <label>{c.role}<input required autoComplete="organization-title" value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} /></label>
            <label>{c.workEmail}<input required dir="ltr" autoComplete="email" type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
            <label>{c.phone}<input required dir="ltr" autoComplete="tel" type="tel" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label>
            <label className="consent"><input required type="checkbox" checked={form.consent} onChange={event => setForm({ ...form, consent: event.target.checked })} /><span>{c.consent}</span></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-green full" disabled={isDemoMode || submit.isPending}>{isDemoMode ? c.demoButton : submit.isPending ? c.sending : c.requestButton}<ArrowRight className="directional-arrow" size={15} /></button>
          </form>}
          </>}
        </div>
      </aside>
    </main>
    <footer className="estimate-footer"><div className="wrap"><span>{c.copyright} · {c.footerLicence}</span><span>{c.estimateNotice}</span></div></footer>
  </div>;
}
