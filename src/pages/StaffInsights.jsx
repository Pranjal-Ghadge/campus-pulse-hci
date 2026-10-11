import React, { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, MapPin, ShieldCheck, Timer } from "lucide-react";
import StaffSidebar from "../components/StaffSidebar";
import { useStudent } from "../context/StudentContext";
import { apiRequest } from "../utils/api";

const averageResolutionDays = (items) => {
  const resolved = items.filter((issue) => issue.statusCode === "resolved" && issue.resolvedAt);
  if (!resolved.length) return null;
  return resolved.reduce((sum, issue) => sum + (new Date(issue.resolvedAt) - new Date(issue.createdAt)) / 86400000, 0) / resolved.length;
};

const topCounts = (items, getKey) => {
  const values = new Map();
  items.forEach((issue) => {
    const key = getKey(issue) || "Unspecified";
    values.set(key, (values.get(key) || 0) + 1);
  });
  return [...values.entries()].sort((first, second) => second[1] - first[1]).slice(0, 6);
};

function StaffInsights() {
  const { profile } = useStudent();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/staff/issues")
      .then(({ issues: records }) => {
        if (active) setIssues(records || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load campus insights.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const metrics = useMemo(() => {
    const resolvedCount = issues.filter((issue) => issue.statusCode === "resolved").length;
    const resolutionRate = issues.length ? Math.round((resolvedCount / issues.length) * 100) : 0;
    return {
      resolvedCount,
      resolutionRate,
      meanDays: averageResolutionDays(issues),
      categories: topCounts(issues, (issue) => issue.category),
      locations: topCounts(issues, (issue) => issue.location),
      departments: topCounts(issues.filter((issue) => issue.assignedDepartment), (issue) => issue.assignedDepartment),
    };
  }, [issues]);

  const bars = (entries) => {
    const max = Math.max(1, ...entries.map((entry) => entry[1]));
    return entries.length ? <ul className="mt-4 space-y-4">{entries.map(([label, count]) => (
      <li key={label}>
        <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate text-slate-700">{label}</span><span className="font-medium text-slate-900">{count}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.max(5, count / max * 100)}%` }} /></div>
      </li>
    ))}</ul> : <p className="mt-4 text-sm text-slate-500">No data available yet.</p>;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:ml-64 lg:px-10">
      <StaffSidebar />
      <div className="mx-auto max-w-7xl pt-16 lg:pt-0">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary-700">Campus Insights · {profile.role === "admin" ? "System-wide view" : "Staff view"}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Campus issue patterns</h1>
          <p className="mt-1 text-sm text-slate-500">Operational indicators calculated from submitted issue records.</p>
        </header>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {loading ? <p role="status" className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-slate-500">Loading insights...</p> : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Issues in view", value: issues.length, icon: Activity, style: "bg-blue-50 text-blue-800" },
                { title: "Verified resolved", value: `${metrics.resolutionRate}%`, icon: ShieldCheck, style: "bg-emerald-50 text-emerald-800" },
                { title: "Pending verification", value: issues.filter((issue) => issue.statusCode === "pending_verification").length, icon: BarChart3, style: "bg-amber-50 text-amber-900" },
                { title: "Average time to resolution", value: metrics.meanDays === null ? "—" : `${metrics.meanDays.toFixed(1)} days`, icon: Timer, style: "bg-slate-100 text-slate-800" },
              ].map(({ title, value, icon: Icon, style }) => (
                <article key={title} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style}`}><Icon size={18} /></div>
                  <p className="mt-3 text-sm text-slate-500">{title}</p><p className="mt-1 text-2xl font-semibold text-slate-900">{loading ? "…" : value}</p>
                </article>
              ))}
            </section>
            <section className="mt-5 grid gap-5 lg:grid-cols-2">
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900"><MapPin size={18} /> Recurring locations</h2>
                <p className="mt-1 text-sm text-slate-500">Locations with the most reports in the current issue set.</p>
                {bars(metrics.locations)}
              </article>
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Issue categories</h2>
                <p className="mt-1 text-sm text-slate-500">Report volume by assigned category.</p>
                {bars(metrics.categories)}
              </article>
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Department workload</h2>
                <p className="mt-1 text-sm text-slate-500">Issue count by assigned department.</p>
                {bars(metrics.departments)}
              </article>
              <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <h2 className="font-semibold text-blue-950">Metric notes</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-blue-900">
                  <li>Resolution rate counts only issues students verified as resolved.</li>
                  <li>Average resolution time excludes issues awaiting verification or further work.</li>
                  <li>Student satisfaction scores and configured SLA compliance are not yet collected by the system.</li>
                  <li>These summaries use the records returned for this staff account; confirm data scope before comparing departments.</li>
                </ul>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default StaffInsights;
