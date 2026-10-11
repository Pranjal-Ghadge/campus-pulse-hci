import React, { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, ShieldAlert, Users } from "lucide-react";
import { Link } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
import { useStudent } from "../context/StudentContext";
import { apiRequest } from "../utils/api";

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under review",
  in_progress: "In progress",
  pending_verification: "Pending verification",
  resolved: "Resolved",
  reopened: "Reopened",
};

const issueAgeDays = (issue) => Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / 86400000);

function StaffDashboard() {
  const { profile } = useStudent();
  const [issues, setIssues] = useState([]);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/staff/issues")
      .then((response) => {
        if (!active) return;
        setIssues(response.issues || []);
        setDepartment(response.department || "");
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load the command center.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const metrics = useMemo(() => {
    const activeIssues = issues.filter((issue) => issue.statusCode !== "resolved");
    const resolvedCount = issues.filter((issue) => issue.statusCode === "resolved").length;
    return {
      unassigned: issues.filter((issue) => !issue.assignedTo && issue.statusCode !== "resolved").length,
      watch: activeIssues.filter((issue) => issue.escalatedAt || issueAgeDays(issue) >= 7).length,
      pending: issues.filter((issue) => issue.statusCode === "pending_verification").length,
      resolutionRate: issues.length ? Math.round(resolvedCount / issues.length * 100) : 0,
      attention: [...activeIssues].filter((issue) => issue.type === "safety" || issue.escalatedAt || issueAgeDays(issue) >= 7 || !issue.assignedTo)
        .sort((first, second) => Number(second.type === "safety") - Number(first.type === "safety")
          || Number(Boolean(second.escalatedAt)) - Number(Boolean(first.escalatedAt))
          || (second.affected || 0) - (first.affected || 0))
        .slice(0, 5),
      hotspots: [...new Set(issues.map((issue) => issue.location).filter(Boolean))]
        .map((location) => ({ location, count: issues.filter((issue) => issue.location === location).length }))
        .sort((first, second) => second.count - first.count).slice(0, 4),
    };
  }, [issues]);

  const cards = [
    { label: "Unassigned issues", value: metrics.unassigned, href: "/staff/issues?filter=unassigned", icon: ClipboardList, style: "text-blue-800 bg-blue-50" },
    { label: "Escalated / 7+ day watch", value: metrics.watch, href: "/staff/escalations", icon: AlertTriangle, style: "text-amber-900 bg-amber-50" },
    { label: "Pending student verification", value: metrics.pending, href: "/staff/issues?filter=verification", icon: Users, style: "text-violet-800 bg-violet-50" },
    { label: "Verified resolution rate", value: `${metrics.resolutionRate}%`, href: "/staff/insights", icon: CheckCircle2, style: "text-emerald-800 bg-emerald-50" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:ml-64 lg:px-10">
      <StaffSidebar />
      <div className="mx-auto max-w-7xl pt-16 lg:pt-0">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary-700">Command center</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Good day, {profile.name.split(/\s+/)[0]}</h1>
            <p className="mt-1 text-sm text-slate-500">{department || profile.department || "Campus operations"} · Current issue priorities at a glance</p>
          </div>
          <Link to="/staff/issues" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800">Open issue queue <ArrowRight size={16} /></Link>
        </header>
        {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        {!loading && issues.some((issue) => issue.statusCode !== "resolved" && (issue.type === "safety" || (issue.affected || 0) >= 5)) && (
          <Link to="/staff/issues?filter=priority" className="mb-5 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-950 hover:bg-red-100">
            <ShieldAlert size={21} className="mt-0.5 shrink-0" />
            <span><strong>Safety or high-impact issues need review.</strong><span className="mt-0.5 block text-sm">{issues.filter((issue) => issue.statusCode !== "resolved" && (issue.type === "safety" || (issue.affected || 0) >= 5)).length} priority issue(s) have at least one active safety report or 5+ affected students.</span></span>
            <ArrowRight size={18} className="ml-auto mt-0.5 shrink-0" />
          </Link>
        )}

        <section aria-label="Priority metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, href, icon: Icon, style }) => (
            <Link key={label} to={href} className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">{label}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${style}`}><Icon size={18} /></span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? "—" : value}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-700">View issues <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
              <div><h2 className="font-semibold text-slate-900">Needs attention</h2><p className="mt-0.5 text-sm text-slate-500">Safety first, then escalations and unassigned work.</p></div>
              <Link to="/staff/issues" className="text-sm font-semibold text-primary-700">View queue</Link>
            </div>
            {loading ? <p role="status" className="p-6 text-sm text-slate-500">Loading your priorities...</p>
              : error ? null
                : metrics.attention.length === 0 ? <div className="p-8 text-center"><CheckCircle2 size={28} className="mx-auto text-emerald-600" /><p className="mt-2 font-medium text-slate-800">You’re all caught up</p><p className="mt-1 text-sm text-slate-500">There are no urgent or unassigned issues.</p></div>
                  : <ul className="divide-y divide-gray-100">
                    {metrics.attention.map((issue) => (
                      <li key={issue._id} className="flex items-center gap-3 px-5 py-4">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${issue.type === "safety" ? "bg-red-100 text-red-800" : issue.escalatedAt ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-600"}`}>
                          {issue.type === "safety" ? <ShieldAlert size={17} /> : <Activity size={17} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{issue.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{issue.location} · {issue.affected || 1} affected · {statusLabels[issue.statusCode] || issue.status}</p>
                        </div>
                        <Link aria-label={`Open ${issue.title}`} to={`/staff/issues/${encodeURIComponent(issue._id)}`} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-gray-50">Review</Link>
                      </li>
                    ))}
                  </ul>}
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Campus hotspots</h2>
            <p className="mt-1 text-sm text-slate-500">Most reported locations in the current issue set.</p>
            {loading ? <p role="status" className="mt-5 text-sm text-slate-500">Loading locations...</p>
              : metrics.hotspots.length === 0 ? <p className="mt-5 text-sm text-slate-500">No location data available.</p>
                : <ul className="mt-5 space-y-4">{metrics.hotspots.map((spot) => (
                  <li key={spot.location}>
                    <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{spot.location}</span><span className="text-slate-500">{spot.count}</span></div>
                    <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-primary-600" style={{ width: `${Math.max(8, spot.count / Math.max(...metrics.hotspots.map((entry) => entry.count)) * 100)}%` }} /></div>
                  </li>
                ))}</ul>}
            <Link to="/staff/insights" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">Explore insights <ArrowRight size={15} /></Link>
          </article>
        </section>
        <p className="mt-4 text-xs text-slate-500">The 7-day item is a demo review-age indicator, not a configured institutional SLA.</p>
      </div>
    </main>
  );
}

export default StaffDashboard;
