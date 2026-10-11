import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, ClipboardList, ShieldAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
import { useStudent } from "../context/StudentContext";
import { apiRequest } from "../utils/api";

const sevenDaysAgo = (issue) => (Date.now() - new Date(issue.createdAt).getTime()) >= 7 * 86400000;

function StaffWorklist() {
  const { profile } = useStudent();
  const location = useLocation();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const view = location.pathname.split("/").pop();
  const config = {
    assigned: { title: "Assigned to me", description: "Work currently assigned to your staff account." },
    resolved: { title: "Resolved issues", description: "Issues verified as resolved by the reporting student." },
    escalations: { title: "Escalations & SLA watch", description: "Manually escalated issues and older reports needing attention." },
  }[view] || { title: "My work", description: "Your operational issue list." };

  useEffect(() => {
    let active = true;
    apiRequest("/api/staff/issues")
      .then(({ issues: loadedIssues }) => {
        if (active) setIssues(loadedIssues || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this worklist.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredIssues = useMemo(() => issues.filter((issue) => {
    if (view === "assigned") return issue.assignedTo?.id === profile.id && issue.statusCode !== "resolved";
    if (view === "resolved") return issue.statusCode === "resolved";
    if (view === "escalations") return issue.statusCode !== "resolved" && (issue.escalatedAt || issue.type === "safety" || sevenDaysAgo(issue));
    return false;
  }).sort((first, second) => {
    if (view === "escalations") {
      return Number(Boolean(second.escalatedAt || second.type === "safety")) - Number(Boolean(first.escalatedAt || first.type === "safety"))
        || new Date(first.createdAt) - new Date(second.createdAt);
    }
    return new Date(second.updatedAt || second.createdAt) - new Date(first.updatedAt || first.createdAt);
  }), [issues, profile.id, view]);

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:ml-64 lg:px-10">
      <StaffSidebar />
      <div className="mx-auto max-w-6xl pt-16 lg:pt-0">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary-700">Resolver workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </header>
        {view === "escalations" && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><AlertTriangle size={17} className="mr-2 inline" />7+ days is a demo review-age indicator because no institutional SLA policy is configured. Safety reports and manually escalated issues are shown separately.</p>}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? <p role="status" className="p-8 text-sm text-slate-500">Loading worklist...</p>
            : error ? <p role="alert" className="p-8 text-sm text-red-800">{error}</p>
              : filteredIssues.length === 0 ? <div className="p-10 text-center"><ClipboardList className="mx-auto text-slate-300" size={30} /><p className="mt-3 font-medium text-slate-800">Nothing needs your attention here</p><p className="mt-1 text-sm text-slate-500">New or updated issues will appear in this list.</p></div>
                : <ul className="divide-y divide-gray-100">
                  {filteredIssues.map((issue) => (
                    <li key={issue._id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {issue.type === "safety" && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800"><ShieldAlert size={12} className="mr-1 inline" />Safety</span>}
                          {issue.escalatedAt && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-900">Escalated</span>}
                          <span className="text-xs text-slate-500">{issue.trackingId}</span>
                        </div>
                        <h2 className="mt-1 font-semibold text-slate-900">{issue.title}</h2>
                        <p className="mt-1 text-sm text-slate-500">{issue.location} · {issue.category} · {issue.affected || 1} affected · {issue.status}</p>
                      </div>
                      <Link to={`/staff/issues/${encodeURIComponent(issue._id)}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50">Open issue <ArrowUpRight size={15} /></Link>
                    </li>
                  ))}
                </ul>}
        </section>
        <p className="mt-3 text-right text-xs text-slate-500">{filteredIssues.length} issues</p>
      </div>
    </main>
  );
}

export default StaffWorklist;
