import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { LanguageSwitch, useLanguage, type Language } from "@/contexts/LanguageContext";

const projects = [
  { name: "Northgate Distribution Center", kw: "4,820 kW", save: "$684,000", img: "/images/warehouse-rooftop-solar.png" },
  { name: "Lone Star Manufacturing", kw: "2,140 kW", save: "$312,000", img: "/images/commercial-solar-roof.jpg" },
  { name: "Cedar Ridge ISD", kw: "1,360 kW", save: "$198,000", img: "/images/solar-project.jpg" },
];

const homeCopy = {
  fa: {
    pageTitle: "سولاس انرژی | انرژی خورشیدی تجاری در تگزاس",
    metaDescription: "راهکارهای خورشیدی تجاری، ذخیره‌سازی باتری و خدمات انرژی برای کسب‌وکارهای تگزاس. سولاس از سال ۲۰۱۱ بیش از ۳۱۰ مگاوات ظرفیت نصب کرده است.",
    utilityTagline: "از ۲۰۱۱، همراه کسب‌وکارهای تگزاس",
    customerPortal: "پرتال مشتریان",
    support: "پشتیبانی",
    careers: "فرصت‌های شغلی",
    navLabel: "ناوبری اصلی",
    solutionsNav: "راهکارها",
    industriesNav: "صنایع",
    projectsNav: "پروژه‌ها",
    financingNav: "تأمین مالی",
    aboutNav: "درباره ما",
    estimateNav: "دریافت برآورد",
    menuOpen: "باز کردن منو",
    menuClose: "بستن منو",
    heroEyebrow: "انرژی خورشیدی تجاری. ساخته‌شده برای تگزاس.",
    heroLine1: "سقف‌تان را",
    heroLine2: "پربازده‌تر کنید.",
    heroLede: "انرژی مطمئن. هزینه‌های قابل پیش‌بینی. شریکی برای مسیر بلندمدت.",
    exploreSavings: "برآورد صرفه‌جویی شما",
    seeWork: "دیدن پروژه‌ها",
    heroCaption: "پروژه اجرایی سولاس · دالاس، تگزاس",
    estimateEyebrow: "شروعی هوشمندانه",
    estimateTitle: "صرفه‌جویی‌تان را برآورد کنید",
    estimateIntro: "کمی درباره ملک‌تان به ما بگویید.",
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
    calculate: "محاسبه صرفه‌جویی",
    introEyebrow: "انرژی‌ای که ارزش می‌آفریند",
    introTitle1: "برای مکان‌هایی ساخته شده",
    introTitle2: "که تگزاس را به حرکت درمی‌آورند.",
    introCopy: "از سال ۲۰۱۱، سولاس به کسب‌وکارها کمک کرده هزینه‌های انرژی را با سامانه‌های خورشیدی تجاری متناسب با شیوه کارشان مدیریت کنند. از نخستین بررسی بام تا سال‌ها نگهداری سامانه، یک تیم پاسخ‌گو در تمام مسیر کنار شماست.",
    meetPartner: "با شریک انرژی خود آشنا شوید",
    servicesEyebrow: "خدمات ما",
    servicesTitle: "یک بام؛ فرصت‌های بیشتر.",
    allSolutions: "همه راهکارها",
    generation: "۰۱ / تولید انرژی",
    rooftopSolar: "خورشیدی پشت‌بامی",
    rooftopCopy: "فضای بلااستفاده بام را به دارایی انرژی بلندمدت تبدیل کنید.",
    exploreRooftop: "بررسی خورشیدی پشت‌بامی",
    solarCarports: "سایبان خورشیدی پارکینگ",
    carportCopy: "فضای پارکینگ را به سطحی پربازده تبدیل کنید.",
    batteryStorage: "ذخیره‌سازی باتری",
    batteryCopy: "انرژی را برای زمانی ذخیره کنید که به آن نیاز دارید.",
    operations: "بهره‌برداری و نگهداری",
    operationsCopy: "عملکرد سامانه را سال‌به‌سال پایدار نگه دارید.",
    canopy: "۰۲ / سایبان",
    resilience: "۰۳ / تاب‌آوری",
    lifecycle: "۰۴ / چرخه عمر",
    industriesEyebrow: "صنایعی که پشتیبانی می‌کنیم",
    industriesTitle1: "متناسب با",
    industriesTitle2: "عملیات شما طراحی شده.",
    industriesCopy: "هر مجموعه‌ای ویژگی‌های خودش را دارد. ما بر مبنای الگوی مصرف، سازه بام و برنامه کاری شما طراحی می‌کنیم؛ نه با نسخه‌ای یکسان برای همه.",
    industries: ["انبار و توزیع", "تولید و صنعت", "مدارس و نهادهای عمومی", "فروشگاه‌ها و مجموعه‌های تجاری"],
    findSolution: "راهکار مناسب خود را پیدا کنید",
    peopleEyebrow: "نیروی انسانی پشت انرژی",
    peopleTitle1: "تیم‌های باتجربه.",
    peopleTitle2: "یک شریک پاسخ‌گو.",
    peopleCopy: "تیم ۴۲۰ نفره ما تخصص مهندسی، ساخت و نگهداری بلندمدت را کنار هم می‌آورد تا از نخستین بررسی تا بهره‌برداری، مسئولیت پروژه روشن باشد.",
    howWeWork: "روش کار ما",
    founded: "تأسیس در تگزاس",
    professionals: "متخصص حوزه انرژی",
    installed: "ظرفیت نصب‌شده در تگزاس",
    warranty: "ضمانت عملکرد قابل ارائه",
    projectsEyebrow: "پروژه‌های منتخب",
    projectsTitle: "کار دقیق. نتیجه قابل سنجش.",
    discussProject: "درباره پروژه‌تان گفت‌وگو کنیم",
    projectLocations: ["دالاس–فورت وورث، تگزاس", "سن‌آنتونیو، تگزاس", "آستین، تگزاس"],
    installedCapacity: "ظرفیت نصب‌شده",
    annualSavings: "صرفه‌جویی سالانه برآوردی",
    projectDisclaimer: "نمونه‌هایی از نتایج پروژه‌ها. عملکرد و صرفه‌جویی واقعی با توجه به محل، تعرفه برق و شرایط بهره‌برداری متفاوت است.",
    financeEyebrow: "انعطاف‌پذیر بر اساس نیاز شما",
    financeTitle1: "ساختار پروژه‌ای",
    financeTitle2: "متناسب با برنامه شما.",
    financeCopy: "سامانه را بخرید، سرمایه را حفظ کنید یا در منافع شریک شوید. ساختارها را با هم بررسی می‌کنیم تا گزینه مناسب کسب‌وکار شما پیدا شود.",
    exploreFinance: "بررسی روش‌های تأمین مالی",
    financeOptions: [
      { title: "خرید مستقیم", body: "مالک سامانه شوید و از ارزش بلندمدت آن بهره‌مند شوید." },
      { title: "اجاره خورشیدی", body: "با پرداخت‌های قابل پیش‌بینی و هزینه اولیه کمتر، خورشیدی شوید." },
      { title: "قرارداد خرید برق", body: "برای انرژی تولیدشده هزینه بپردازید، نه تجهیزات." },
    ],
    newsEyebrow: "از سولاس",
    newsTitle: "خبرها و دیدگاه‌ها",
    allInsights: "همه مطالب",
    newsDates: ["۲۸ اکتبر ۲۰۲۶", "۱۶ سپتامبر ۲۰۲۶", "۴ اوت ۲۰۲۶"],
    newsTitles: [
      "آنچه مدیران مراکز تگزاس باید درباره انرژی خورشیدی تجاری در ۲۰۲۷ بدانند",
      "تکمیل پروژه خورشیدی ۴٫۸ مگاواتی سولاس برای مرکز توزیع شمال تگزاس",
      "برنامه‌ریزی برای تاب‌آوری: چه زمانی ذخیره‌سازی باتری برای مجموعه شما به‌صرفه است؟",
    ],
    readMore: "ادامه مطلب",
    ctaEyebrow: "درباره بام‌تان گفت‌وگو کنیم",
    ctaTitle1: "تصمیم بعدی شما درباره انرژی",
    ctaTitle2: "با یک گفت‌وگو آغاز می‌شود.",
    projectEstimate: "برآورد پروژه بگیرید",
    footerDescription: "انرژی خورشیدی تجاری؛ طراحی و اجرا برای تگزاس.",
    licence: "پیمانکار برق تگزاس",
    licenceDetails: "مجوز TECL #39218 · دارای گواهی NABCEP",
    footerSolutions: "راهکارها",
    footerIndustries: "صنایع",
    footerCompany: "شرکت",
    aboutSolace: "درباره سولاس",
    newsInsights: "خبرها و دیدگاه‌ها",
    texasOffices: "دفاتر تگزاس",
    dallasOffice: "دالاس–فورت وورث",
    austinOffice: "آستین",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    accessibility: "دسترس‌پذیری",
    servingSince: "همراه تگزاس از ۲۰۱۱",
  },
  en: {
    pageTitle: "Solace Energy | Commercial Solar for Texas",
    metaDescription: "Commercial solar, battery storage and energy services engineered for Texas facilities. Solace has delivered 310 MW since 2011.",
    utilityTagline: "Powering Texas business since 2011",
    customerPortal: "Customer portal",
    support: "Support",
    careers: "Careers",
    navLabel: "Main navigation",
    solutionsNav: "Solutions",
    industriesNav: "Industries",
    projectsNav: "Projects",
    financingNav: "Financing",
    aboutNav: "About",
    estimateNav: "Get an estimate",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    heroEyebrow: "Commercial solar. Texas built.",
    heroLine1: "Make your roof",
    heroLine2: "work harder.",
    heroLede: "Reliable energy. Predictable costs. A partner built for the long run.",
    exploreSavings: "Explore your savings",
    seeWork: "See our work",
    heroCaption: "SOLACE INSTALLATION · DALLAS, TX",
    estimateEyebrow: "A smarter start",
    estimateTitle: "Estimate your savings",
    estimateIntro: "Tell us a little about your property.",
    address: "Building address",
    addressPlaceholder: "Street address, city, ZIP",
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
    calculate: "Calculate savings",
    introEyebrow: "Energy that earns its keep",
    introTitle1: "Built for the places",
    introTitle2: "that keep Texas moving.",
    introCopy: "Since 2011, Solace has helped businesses take control of energy costs with commercial solar designed around the way they operate. From the first roof survey to decades of system care, we bring one accountable team to every project.",
    meetPartner: "Meet your energy partner",
    servicesEyebrow: "What we do",
    servicesTitle: "One roof. More possibilities.",
    allSolutions: "All solutions",
    generation: "01 / GENERATION",
    rooftopSolar: "Rooftop solar",
    rooftopCopy: "Turn underused roof space into a long-term energy asset.",
    exploreRooftop: "Explore rooftop solar",
    solarCarports: "Solar carports",
    carportCopy: "Put parking areas to productive use.",
    batteryStorage: "Battery storage",
    batteryCopy: "Store energy for when it matters most.",
    operations: "Operations & maintenance",
    operationsCopy: "Keep performance on track year after year.",
    canopy: "02 / CANOPY",
    resilience: "03 / RESILIENCE",
    lifecycle: "04 / LIFECYCLE",
    industriesEyebrow: "Industries we serve",
    industriesTitle1: "Designed around",
    industriesTitle2: "your operation.",
    industriesCopy: "Every facility is different. We engineer around your load profile, roof structure and operating schedule—not a one-size-fits-all template.",
    industries: ["Warehouses & distribution", "Manufacturing & industrial", "Schools & public institutions", "Retail & commercial portfolios"],
    findSolution: "Find your solution",
    peopleEyebrow: "People behind the power",
    peopleTitle1: "Experienced crews.",
    peopleTitle2: "One accountable partner.",
    peopleCopy: "Our 420-person team brings engineering, construction and long-term care together—so your project has a clear owner from first survey through system operations.",
    howWeWork: "How we work",
    founded: "Founded in Texas",
    professionals: "Energy professionals",
    installed: "Installed across Texas",
    warranty: "Performance warranties available",
    projectsEyebrow: "Selected projects",
    projectsTitle: "Good work. Measurable impact.",
    discussProject: "Discuss your project",
    projectLocations: ["Dallas–Fort Worth, TX", "San Antonio, TX", "Austin, TX"],
    installedCapacity: "Installed capacity",
    annualSavings: "Estimated annual savings",
    projectDisclaimer: "Representative project results. Actual performance and savings vary by site, utility rate and operating conditions.",
    financeEyebrow: "Flexible by design",
    financeTitle1: "A project structure",
    financeTitle2: "that fits your plans.",
    financeCopy: "Own the system, preserve capital, or share the benefits. We help you compare the structures and find a path that works for your business.",
    exploreFinance: "Explore financing",
    financeOptions: [
      { title: "Direct purchase", body: "Own your system and capture the long-term value." },
      { title: "Solar lease", body: "Go solar with predictable payments and less upfront cost." },
      { title: "Power purchase agreement", body: "Pay for the energy produced, not the equipment." },
    ],
    newsEyebrow: "From Solace",
    newsTitle: "News & perspectives",
    allInsights: "All insights",
    newsDates: ["OCTOBER 28, 2026", "SEPTEMBER 16, 2026", "AUGUST 04, 2026"],
    newsTitles: [
      "What Texas facility leaders should know about commercial solar in 2027",
      "Solace completes 4.8 MW rooftop project for North Texas distribution center",
      "Planning for resilience: when battery storage makes sense for your facility",
    ],
    readMore: "Read more",
    ctaEyebrow: "Let's talk about your roof",
    ctaTitle1: "Your next energy decision",
    ctaTitle2: "starts with a conversation.",
    projectEstimate: "Get a project estimate",
    footerDescription: "Commercial solar, engineered and delivered for Texas.",
    licence: "Texas Electrical Contractor",
    licenceDetails: "TECL #39218 · NABCEP Certified",
    footerSolutions: "Solutions",
    footerIndustries: "Industries",
    footerCompany: "Company",
    aboutSolace: "About Solace",
    newsInsights: "News & insights",
    texasOffices: "Texas offices",
    dallasOffice: "Dallas–Fort Worth",
    austinOffice: "Austin",
    privacy: "Privacy",
    terms: "Terms",
    accessibility: "Accessibility",
    servingSince: "Serving Texas since 2011",
  },
} as const;

function Header({ c }: { c: (typeof homeCopy)[Language] }) {
  const [open, setOpen] = useState(false);
  const solutions = [c.rooftopSolar, c.solarCarports, c.batteryStorage, c.operations];

  return <>
    <div className="utility">
      <div className="wrap util-inner">
        <span>{c.utilityTagline}</span>
        <div className="utility-actions">
          <LanguageSwitch />
          <span>{c.customerPortal}</span>
          <a className="utility-support" href="tel:+18005550146">{c.support}</a>
          <a className="utility-careers" href="#careers">{c.careers}</a>
          <a className="phone" href="tel:+18005550146" dir="ltr">+1 (800) 555-0146</a>
        </div>
      </div>
    </div>
    <header className="header">
      <div className="wrap nav">
        <a href="/" className="brand" aria-label="Solace Energy home"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></a>
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? c.menuClose : c.menuOpen} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        <nav className={open ? "nav-links show" : "nav-links"} aria-label={c.navLabel}>
          <div className="nav-drop"><button type="button">{c.solutionsNav}<ChevronDown size={14} /></button><div className="dropdown">{solutions.map(x => <a key={x} href="#solutions">{x}</a>)}</div></div>
          <a href="#industries">{c.industriesNav}</a>
          <a href="#projects">{c.projectsNav}</a>
          <a href="#financing">{c.financingNav}</a>
          <a href="#about">{c.aboutNav}</a>
          <Link href="/estimate" className="btn btn-amber nav-cta">{c.estimateNav}<ArrowRight className="directional-arrow" size={15} /></Link>
        </nav>
      </div>
    </header>
  </>;
}

export default function Home() {
  const { language } = useLanguage();
  const c = homeCopy[language];
  const [address, setAddress] = useState("");
  const [type, setType] = useState("Warehouse");
  const [bill, setBill] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const attrs = { utmSource: query.get("utm_source"), utmMedium: query.get("utm_medium"), utmCampaign: query.get("utm_campaign") };
    if (Object.values(attrs).some(Boolean)) sessionStorage.setItem("solaceUtm", JSON.stringify(attrs));
  }, []);

  useEffect(() => {
    document.title = c.pageTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = c.metaDescription;
  }, [c.pageTitle, c.metaDescription]);

  function estimate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem("solaceEstimate", JSON.stringify({ address, type, bill }));
    location.href = "/estimate";
  }

  return <>
    <Header c={c} />
    <main>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="wrap hero-copy">
          <p className="eyebrow light">{c.heroEyebrow}</p>
          <h1>{c.heroLine1}<br />{c.heroLine2}</h1>
          <p className="hero-lede">{c.heroLede}</p>
          <div className="hero-actions">
            <Link href="/estimate" className="btn btn-amber">{c.exploreSavings}<ArrowRight className="directional-arrow" size={16} /></Link>
            <a href="#projects" className="btn btn-outline">{c.seeWork}</a>
          </div>
          <div className="hero-caption">{c.heroCaption}</div>
        </div>
      </section>

      <div className="estimate-band">
        <div className="wrap">
          <form className="estimate-card" onSubmit={estimate}>
            <div className="est-title"><span className="eyebrow">{c.estimateEyebrow}</span><h2>{c.estimateTitle}</h2><p>{c.estimateIntro}</p></div>
            <label>{c.address}<input required dir="ltr" placeholder={c.addressPlaceholder} value={address} onChange={event => setAddress(event.target.value)} /></label>
            <label>{c.buildingType}<select value={type} onChange={event => setType(event.target.value)}>{c.buildingTypes.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>{c.monthlyBill}<div className="money-input"><span>$</span><input required dir="ltr" type="number" min="100" placeholder="8,500" value={bill} onChange={event => setBill(event.target.value)} /></div></label>
            <button className="btn btn-green">{c.calculate}<ArrowRight className="directional-arrow" size={16} /></button>
          </form>
        </div>
      </div>

      <section className="intro section wrap" id="about">
        <div><p className="eyebrow">{c.introEyebrow}</p><h2>{c.introTitle1}<br />{c.introTitle2}</h2></div>
        <div className="intro-copy"><p>{c.introCopy}</p><a className="text-link" href="#solutions">{c.meetPartner}<ArrowRight className="directional-arrow" size={16} /></a></div>
      </section>

      <section className="solutions section" id="solutions">
        <div className="wrap">
          <div className="section-head"><div><p className="eyebrow">{c.servicesEyebrow}</p><h2>{c.servicesTitle}</h2></div><a href="/estimate" className="text-link">{c.allSolutions}<ArrowRight className="directional-arrow" size={16} /></a></div>
          <div className="solution-grid">
            <article className="solution-card large"><img src="/images/commercial-solar-roof.jpg" alt={language === "fa" ? "پنل‌های خورشیدی روی بام یک مجموعه تجاری" : "Solar panels on a commercial rooftop"} /><div className="solution-info"><span>{c.generation}</span><h3>{c.rooftopSolar}</h3><p>{c.rooftopCopy}</p><a href="/estimate">{c.exploreRooftop}<ArrowRight className="directional-arrow" size={15} /></a></div></article>
            <div className="solution-stack">
              {[
                { n: c.canopy, t: c.solarCarports, d: c.carportCopy },
                { n: c.resilience, t: c.batteryStorage, d: c.batteryCopy },
                { n: c.lifecycle, t: c.operations, d: c.operationsCopy },
              ].map(item => <article className="solution-row" key={item.n}><span>{item.n}</span><div><h3>{item.t}</h3><p>{item.d}</p></div><ArrowRight className="directional-arrow" /></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="industries section wrap" id="industries">
        <div className="industry-photo"><img src="/images/solar-texas-site.webp" alt={language === "fa" ? "تأسیسات خورشیدی تجاری در تگزاس" : "Commercial solar installation in Texas"} /><div className="photo-label">{language === "fa" ? "تأسیسات تجاری · مرکز تگزاس" : "COMMERCIAL INSTALLATION · CENTRAL TEXAS"}</div></div>
        <div className="industry-copy"><p className="eyebrow">{c.industriesEyebrow}</p><h2>{c.industriesTitle1}<br />{c.industriesTitle2}</h2><p>{c.industriesCopy}</p><ul>{c.industries.map((industry, index) => <li key={industry}><span>0{index + 1}</span>{industry}<ArrowRight className="directional-arrow" size={16} /></li>)}</ul><a className="text-link" href="/estimate">{c.findSolution}<ArrowRight className="directional-arrow" size={16} /></a></div>
      </section>

      <section className="crew-feature section wrap">
        <div className="crew-photo"><img src="/images/solar-crew-install.jpg" alt={language === "fa" ? "تیم نصب سولاس در حال کار روی بام تجاری" : "Solace solar installation team working on a commercial rooftop"} /><span>{language === "fa" ? "تیم اجرایی · شمال تگزاس" : "FIELD TEAM · NORTH TEXAS"}</span></div>
        <div className="crew-copy"><p className="eyebrow">{c.peopleEyebrow}</p><h2>{c.peopleTitle1}<br />{c.peopleTitle2}</h2><p>{c.peopleCopy}</p><a href="#about" className="text-link">{c.howWeWork}<ArrowRight className="directional-arrow" size={16} /></a></div>
      </section>

      <section className="numbers"><div className="wrap number-grid"><div><span>2011</span><p>{c.founded}</p></div><div><span>420</span><p>{c.professionals}</p></div><div><span>310 <small>MW</small></span><p>{c.installed}</p></div><div><span>25 <small>{language === "fa" ? "سال" : "yr"}</small></span><p>{c.warranty}</p></div></div></section>

      <section className="projects section wrap" id="projects">
        <div className="section-head"><div><p className="eyebrow">{c.projectsEyebrow}</p><h2>{c.projectsTitle}</h2></div><a className="text-link" href="/estimate">{c.discussProject}<ArrowRight className="directional-arrow" size={16} /></a></div>
        <div className="project-grid">{projects.map((project, index) => <article className="project-card" key={project.name}><div className="project-img"><img src={project.img} alt={language === "fa" ? `پروژه انرژی خورشیدی ${project.name}` : `${project.name} solar energy project`} /><span>0{index + 1}</span></div><p className="eyebrow">{c.projectLocations[index]}</p><h3>{project.name}</h3><div className="project-metrics"><div><b dir="ltr">{project.kw}</b><small>{c.installedCapacity}</small></div><div><b dir="ltr">{project.save}</b><small>{c.annualSavings}</small></div></div></article>)}</div>
        <p className="fineprint">{c.projectDisclaimer}</p>
      </section>

      <section className="financing section" id="financing"><div className="wrap finance-grid"><div><p className="eyebrow light">{c.financeEyebrow}</p><h2>{c.financeTitle1}<br />{c.financeTitle2}</h2><p>{c.financeCopy}</p><a href="/estimate" className="btn btn-amber">{c.exploreFinance}<ArrowRight className="directional-arrow" size={16} /></a></div><div className="finance-options">{c.financeOptions.map((option, index) => <article key={option.title}><span>0{index + 1}</span><div><h3>{option.title}</h3><p>{option.body}</p></div></article>)}</div></div></section>

      <section className="news section wrap" id="news"><div className="section-head"><div><p className="eyebrow">{c.newsEyebrow}</p><h2>{c.newsTitle}</h2></div><a className="text-link" href="#news">{c.allInsights}<ArrowRight className="directional-arrow" size={16} /></a></div><div className="news-grid">{c.newsTitles.map((title, index) => <article key={title}><time>{c.newsDates[index]}</time><h3>{title}</h3><a href="#news">{c.readMore}<ArrowRight className="directional-arrow" size={15} /></a></article>)}</div></section>

      <section className="cta-strip"><div className="wrap cta-inner"><div><p className="eyebrow light">{c.ctaEyebrow}</p><h2>{c.ctaTitle1}<br />{c.ctaTitle2}</h2></div><Link href="/estimate" className="btn btn-amber">{c.projectEstimate}<ArrowRight className="directional-arrow" size={16} /></Link></div></section>
    </main>

    <footer className="footer"><div className="wrap footer-main">
      <div className="footer-brand"><a className="brand brand-light" href="/"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></a><p>{c.footerDescription}</p><a href="tel:+18005550146" dir="ltr">+1 (800) 555-0146</a><p className="license">{c.licence}<br />{c.licenceDetails}</p></div>
      <div><h4>{c.footerSolutions}</h4>{[c.rooftopSolar, c.solarCarports, c.batteryStorage, c.operations].map(item => <a href="#solutions" key={item}>{item}</a>)}</div>
      <div><h4>{c.footerIndustries}</h4>{c.industries.map(item => <a href="#industries" key={item}>{item}</a>)}</div>
      <div id="careers"><h4>{c.footerCompany}</h4><a href="#about">{c.aboutSolace}</a><a href="#projects">{c.projectsNav}</a><a href="#news">{c.newsInsights}</a><a href="#careers">{c.careers}</a></div>
      <div><h4>{c.texasOffices}</h4><p>{c.dallasOffice}<br />1717 McKinney Ave, Suite 1200<br />Dallas, TX 75202</p><p>{c.austinOffice}<br />901 S MoPac Expy, Suite 300<br />Austin, TX 78746</p></div>
    </div><div className="wrap footer-bottom"><span>© 2026 Solace Energy, Inc. {language === "fa" ? "تمام حقوق محفوظ است." : "All rights reserved."}</span><div><a href="#privacy">{c.privacy}</a><a href="#terms">{c.terms}</a><a href="#accessibility">{c.accessibility}</a><span>{c.customerPortal}</span></div><span>{c.servingSince}</span></div></footer>
  </>;
}
