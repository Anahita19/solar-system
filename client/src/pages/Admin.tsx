import { useMemo } from "react";
import { Link } from "wouter";
import { Download, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export default function Admin() {
  const auth = useAuth();
  const owner = trpc.auth.isOwner.useQuery(undefined, { enabled: Boolean(auth.user), retry: false });
  const q = trpc.lead.adminList.useQuery(undefined, { enabled: owner.data === true, retry: false });
  const rows = q.data || [];
  const csv = useMemo(() => {
    const headers = ["Created", "Name", "Company", "Role", "Email", "Phone", "Address", "Building type", "Monthly bill", "System kW", "Annual savings", "Payback years", "UTM source", "UTM medium", "UTM campaign"];
    return [headers, ...rows.map(r => [r.createdAt, r.name, r.company, r.role, r.email, r.phone, r.address, r.buildingType, r.monthlyBill, r.systemKw, r.annualSavings, r.paybackYears, r.utmSource, r.utmMedium, r.utmCampaign])]
      .map(row => row.map(csvCell).join(",")).join("\r\n");
  }, [rows]);
  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "solace-leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  const checking = auth.loading || (Boolean(auth.user) && owner.isLoading) || q.isLoading;

  return <div className="admin-page">
    <header className="admin-top"><div className="wrap"><Link href="/" className="brand"><span className="brand-mark">S</span><span>SOLACE<small>ENERGY</small></span></Link><span>LEAD MANAGEMENT</span></div></header>
    <main className="wrap admin-content">
      <div className="admin-heading"><div><p className="eyebrow">OWNER WORKSPACE</p><h1>Assessment requests</h1><p>Confidential lead details and preliminary project estimates.</p></div>
        {owner.data === true && <div className="admin-actions"><button className="btn btn-green" onClick={download} disabled={!rows.length}><Download size={16}/> Export CSV</button><button className="btn btn-outline-dark" onClick={() => auth.logout()}><LogOut size={15}/> Sign out</button></div>}
      </div>
      {checking ? <p>Checking access…</p> : !auth.user ? <div className="admin-gate"><h2>Owner sign-in required</h2><p>Sign in with the Solace owner account to view submitted leads.</p><button className="btn btn-green" onClick={() => startLogin()}>Sign in securely</button></div>
        : owner.isError ? <div className="admin-gate"><h2>Unable to verify owner access</h2><p>Please refresh the page or sign in again.</p><button className="btn btn-outline-dark" onClick={() => owner.refetch()}>Try again</button></div>
        : owner.data !== true ? <div className="admin-gate"><h2>Owner access only</h2><p>This workspace is restricted to the configured Solace owner account.</p><button className="btn btn-outline-dark" onClick={() => auth.logout()}>Sign out</button></div>
        : q.error ? <div className="admin-gate"><h2>Unable to load leads</h2><p>{q.error.message}</p><button className="btn btn-outline-dark" onClick={() => q.refetch()}>Try again</button></div>
        : <><div className="lead-count">{rows.length} {rows.length === 1 ? "request" : "requests"}</div><div className="table-shell"><table className="lead-table"><thead><tr><th>CONTACT</th><th>PROPERTY</th><th>ESTIMATE</th><th>ATTRIBUTION</th><th>RECEIVED</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td><b>{r.name}</b><small>{r.company} · {r.role}</small><a href={`mailto:${r.email}`}>{r.email}</a><a href={`tel:${r.phone}`}>{r.phone}</a></td><td><b>{r.address}</b><small>{r.buildingType} · ${Number(r.monthlyBill).toLocaleString()}/mo</small></td><td><b>{Number(r.systemKw).toLocaleString()} kW</b><small>${Number(r.annualSavings).toLocaleString()}/yr</small><small>{r.paybackYears} yr payback</small></td><td>{r.utmSource || "Direct"}<small>{r.utmMedium || "—"} · {r.utmCampaign || "—"}</small></td><td>{new Date(r.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>{!rows.length && <p className="empty-leads">No assessment requests yet.</p>}</div></>}
    </main>
  </div>;
}
