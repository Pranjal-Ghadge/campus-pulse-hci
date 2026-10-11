import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, Search, ShieldAlert, Users } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
import { apiRequest } from "../utils/api";
import { useStudent } from "../context/StudentContext";

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  pending_verification: "Pending verification",
  resolved: "Resolved",
  reopened: "Reopened",
};

const ageDays = (issue) => Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / 86400000);
const isUrgent = (issue) => issue.statusCode !== "resolved"
  && (issue.type === "safety" || issue.escalatedAt || (issue.affected || 0) >= 5 || ageDays(issue) >= 7);

function StaffAllIssues() {
  const { profile } = useStudent();
  const [searchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("urgent");
  const [assignee, setAssignee] = useState("");
  const filter = searchParams.get("filter");

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/api/staff/issues"), apiRequest("/api/staff/users")])
      .then(([issueResponse, staffResponse]) => {
        if (!active) return;
        setIssues(issueResponse.issues || []);
        setStaff(staffResponse.users || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load the issue queue.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const departments = useMemo(() => [...new Set(issues.map((issue) => issue.assignedDepartment).filter(Boolean))], [issues]);
  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();
    return issues.filter((issue) => {
      const matchesSearch = !query || [issue.trackingId, issue.title, issue.location, issue.category, issue.description]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || issue.statusCode === statusFilter;
      const matchesDepartment = departmentFilter === "all" || issue.assignedDepartment === departmentFilter;
      const matchesUrgency = urgencyFilter === "all" || (urgencyFilter === "urgent" ? isUrgent(issue) : !isUrgent(issue));
      const matchesShortcut = filter === "unassigned"
        ? !issue.assignedTo
        : filter === "verification"
          ? issue.statusCode === "pending_verification"
          : filter === "priority"
            ? issue.statusCode !== "resolved" && (issue.type === "safety" || (issue.affected || 0) >= 5)
          : filter === "overdue"
            ? isUrgent(issue)
            : true;
      return matchesSearch && matchesStatus && matchesDepartment && matchesUrgency && matchesShortcut;
    }).sort((first, second) => {
      if (sortBy === "impact") return (second.affected || 0) - (first.affected || 0);
      if (sortBy === "oldest") return new Date(first.createdAt) - new Date(second.createdAt);
      if (sortBy === "newest") return new Date(second.createdAt) - new Date(first.createdAt);
      return Number(isUrgent(second)) - Number(isUrgent(first)) || (second.affected || 0) - (first.affected || 0);
    });
  }, [issues, search, statusFilter, departmentFilter, urgencyFilter, sortBy, filter]);

  const selected = filteredIssues.find((issue) => issue._id === selectedId) || filteredIssues[0];
  useEffect(() => {
    setAssignee(selected?.assignedTo?.id || "");
  }, [selected?._id, selected?.assignedTo?.id]);

  const assignSelected = async () => {
    if (!selected) return;
    setError("");
    setFeedback("");
    try {
      const { issue } = await apiRequest(`/api/staff/issues/${encodeURIComponent(selected._id)}/assign`, {
        method: "PUT",
        body: JSON.stringify({ assignedTo: assignee || undefined }),
      });
      setIssues((items) => items.map((item) => item._id === issue._id ? issue : item));
      setFeedback("Assignment saved.");
    } catch (requestError) {
      setError(requestError.message || "Unable to assign this issue.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:ml-64 lg:px-10">
      <StaffSidebar />
      <div className="mx-auto max-w-7xl pt-16 lg:pt-0">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary-700">Triage & queue management</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Issue queue</h1>
            <p className="mt-1 text-sm text-slate-500">Prioritize by safety, escalation, impact, or ticket age.</p>
          </div>
          <p className="text-sm text-slate-500">{filteredIssues.length} issues</p>
        </header>

        {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {feedback && <p role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{feedback}</p>}

        <section aria-label="Issue filters" className="mb-4 grid gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:grid-cols-2 xl:grid-cols-6">
          <label className="relative sm:col-span-2 xl:col-span-2">
            <span className="sr-only">Search issues</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search issues or locations" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
          </label>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="all">All departments</option>
            {departments.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select aria-label="Filter by urgency" value={urgencyFilter} onChange={(event) => setUrgencyFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="all">Any urgency</option><option value="urgent">Safety / high impact / escalated / 7+ days</option><option value="normal">Standard</option>
          </select>
          <select aria-label="Sort issues" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="urgent">Most urgent</option><option value="impact">Highest impact</option><option value="oldest">Oldest</option><option value="newest">Newest</option>
          </select>
        </section>

        <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[minmax(330px,0.85fr)_minmax(0,1.5fr)]">
          <div className="border-b border-gray-200 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="font-semibold text-slate-900">Prioritized issues</h2>
              <span className="text-xs text-slate-500">Select for details</span>
            </div>
            <div className="max-h-[720px] overflow-y-auto">
              {loading ? <p role="status" className="p-6 text-sm text-slate-500">Loading queue...</p>
                : filteredIssues.length === 0 ? <p className="p-6 text-sm text-slate-500">No issues match these filters.</p>
                  : filteredIssues.map((issue) => (
                    <button key={issue._id} type="button" onClick={() => setSelectedId(issue._id)} aria-pressed={selected?._id === issue._id} className={`block w-full border-b border-gray-100 p-4 text-left hover:bg-slate-50 ${selected?._id === issue._id ? "bg-blue-50 ring-1 ring-inset ring-blue-200" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 font-semibold text-slate-900">{issue.title}</p>
                        {issue.type === "safety" && <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">Safety</span>}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{issue.trackingId} · {issue.location}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{statusLabels[issue.statusCode] || issue.status}</span>
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800"><Users size={12} className="mr-1 inline" />{issue.affected || 1} affected</span>
                        {isUrgent(issue) && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-900"><AlertTriangle size={12} className="mr-1 inline" />Needs attention</span>}
                      </div>
                    </button>
                  ))}
            </div>
          </div>

          {selected ? (
            <article className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary-700">{selected.trackingId} · {selected.category}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{selected.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">{selected.location} · Reported {selected.date}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{statusLabels[selected.statusCode] || selected.status}</span>
              </div>
              {(selected.type === "safety" || selected.escalatedAt) && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                  <ShieldAlert size={17} className="mr-2 inline" />{selected.type === "safety" ? "Safety concern — prioritize immediate review." : `Escalated ${new Date(selected.escalatedAt).toLocaleDateString()}.`}
                </div>
              )}
              <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.description}</p>
              <dl className="mt-6 grid gap-4 border-y border-gray-100 py-4 text-sm sm:grid-cols-2">
                <div><dt className="text-slate-500">Student voice</dt><dd className="mt-1 font-medium capitalize text-slate-900">{selected.type || "problem"}</dd></div>
                <div><dt className="text-slate-500">Affected students</dt><dd className="mt-1 font-medium text-slate-900">{selected.affected || 1}</dd></div>
                <div><dt className="text-slate-500">Ticket age</dt><dd className="mt-1 font-medium text-slate-900">{Math.max(0, ageDays(selected))} days</dd></div>
                <div><dt className="text-slate-500">Current assignee</dt><dd className="mt-1 font-medium text-slate-900">{selected.assignedTo?.name || "Unassigned"}</dd></div>
              </dl>
              <label className="mt-5 block text-sm font-medium text-slate-700">Assign resolver
                <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5">
                  <option value="">Assign to me ({profile.name})</option>
                  {staff.map((member) => <option key={member.id} value={member.id}>{member.name}{member.department ? ` · ${member.department}` : ""}</option>)}
                </select>
              </label>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={assignSelected} className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800">Assign issue</button>
                <Link to={`/staff/issues/${encodeURIComponent(selected._id)}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50">Open workspace <ArrowUpRight size={16} /></Link>
              </div>
            </article>
          ) : <div className="flex items-center justify-center p-8 text-sm text-slate-500">Select an issue to review.</div>}
        </section>
        <p className="mt-3 text-xs text-slate-500">High impact is shown at 5+ affected students. The 7-day flag is a demo review-age indicator, not a configured institutional SLA.</p>
      </div>
    </main>
  );
}

export default StaffAllIssues;
