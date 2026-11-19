import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";

type EstimateStart = { address?: string; type?: string; bill?: string };
type ContactForm = { name: string; company: string; role: string; email: string; phone: string; consent: boolean };

export default function Estimate() {
  const isDemoMode = useMemo(() => new URLSearchParams(window.location.search).get("demo") === "1", []);
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
  const mapSrc = mapAddress ? `/api/property-map?address=${encodeURIComponent(mapAddress)}` : "";
  const submit = trpc.lead.submit.useMutation();

  useEffect(() => {
    document.title = "Estimate your solar savings | Solace Energy";
  }, []);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isDemoMode) {
      setError("Demo mode is read-only. No site-assessment request was sent.");
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
      setError("We couldn't submit your request just now. Please try again or call (800) 555-0146.");
    }
  }

  return <div className="estimate-page">
    <header className="estimate-top"><div className="wrap"><Link href="/" className="brand"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to Solace</Link></div></header>
    <div className="wrap estimate-layout">
      <div className="estimate-summary">
        <p className="eyebrow">YOUR SOLAR OPPORTUNITY</p>
        <h1>A first look at<br/>your property's potential.</h1>
        <p className="muted">A preliminary estimate based on your monthly energy spend. Our team will verify roof conditions, utility rates and operating details during a site assessment.</p>
        <div className="map-box">
          {mapSrc ? <img src={mapSrc} alt={`Satellite view of ${mapAddress}`} onError={event => { event.currentTarget.style.display = "none"; setMapFailed(true); }} /> : <div className="map-placeholder">Enter an address to view the property</div>}
          {mapFailed && <div className="map-placeholder map-error">Satellite imagery is temporarily unavailable.</div>}
          <div className="map-address">{mapAddress || "Property satellite view"}</div>
        </div>
        <div className="estimate-metrics">
          <div><span>PRELIMINARY SYSTEM SIZE</span><b>{systemKw.toLocaleString()} <small>kW</small></b></div>
          <div><span>EST. ANNUAL SAVINGS</span><b>${annualSavings.toLocaleString()}</b></div>
          <div><span>EST. SIMPLE PAYBACK</span><b>{paybackYears} <small>years</small></b></div>
        </div>
        <p className="disclaimer">Illustrative estimate only, not a proposal or guarantee. Final design and economics depend on site assessment, tariff, incentives and engineering.</p>
      </div>
      <aside className="estimate-edit">
        <p className="eyebrow">PROPERTY DETAILS</p>
        <label>Building address<input value={address} onChange={event => setAddress(event.target.value)} onBlur={() => { if (address.trim() !== mapAddress) { setMapFailed(false); setMapAddress(address.trim()); } }} placeholder="Street, city, ZIP"/></label>
        <label>Building type<select value={type} onChange={event => setType(event.target.value)}>{["Warehouse", "Factory / manufacturing", "School / campus", "Office", "Retail", "Other"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Average monthly electricity bill<div className="money-input"><span>$</span><input type="number" min="100" value={bill} onChange={event => setBill(Number(event.target.value))}/></div></label>
        <div className="assessment-form">
          <p className="eyebrow">NEXT STEP</p>
          {isDemoMode && <p className="muted demo-notice">Demo mode · submissions are disabled</p>}
          <h2>Request a site assessment</h2>
          <p>We'll follow up to learn about your facility and arrange a no-obligation site review.</p>
          {done ? <div className="success-panel"><Check/><h3>Request received.</h3><p>Thank you, {form.name}. A Solace project advisor will be in touch soon.</p></div> : <form onSubmit={send}>
            <label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })}/></label>
            <label>Company<input required value={form.company} onChange={event => setForm({ ...form, company: event.target.value })}/></label>
            <label>Role / title<input required value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}/></label>
            <label>Work email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })}/></label>
            <label>Phone<input required type="tel" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })}/></label>
            <label className="consent"><input required type="checkbox" checked={form.consent} onChange={event => setForm({ ...form, consent: event.target.checked })}/><span>I agree that Solace may contact me about this assessment. I can opt out at any time.</span></label>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-green full" disabled={isDemoMode || submit.isPending}>{isDemoMode ? "Demo mode · submissions disabled" : submit.isPending ? "Sending request…" : "Request my assessment"} <ArrowRight size={15}/></button>
          </form>}
        </div>
      </aside>
    </div>
    <footer className="estimate-footer"><div className="wrap">© 2026 Solace Energy · Texas TECL #39218 <span>Estimates are preliminary and subject to site verification.</span></div></footer>
  </div>;
}
