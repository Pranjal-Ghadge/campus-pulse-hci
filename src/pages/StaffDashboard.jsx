import React, { useEffect, useMemo, useState } from "react";
import { ClipboardList, LogOut, Search, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useStudent } from "../context/StudentContext";

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  resolved: "Resolved",
  reopened: "Reopened",
};

function StaffDashboard() {
  const { profile, logout } = useStudent();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [department, setDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    apiRequest("/api/staff/issues")
      .then((response) => {
        if (!active) return;
        setIssues(response.issues || []);
        setDepartment(response.department || "");
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load issues.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = [...new Set(issues.map((issue) => issue.category).filter(Boolean))];
  const departments = [...new Set(issues.map((issue) => issue.assignedDepartment).filter(Boolean))];
  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const matchesStatus = statusFilter === "all" || issue.statusCode === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    const matchesDepartment = departmentFilter === "all" || issue.assignedDepartment === departmentFilter;
    const searchText = search.trim().toLowerCase();
    const matchesSearch = !searchText || [
      issue.title,
      issue.trackingId,
      issue.category,
      issue.location,
    ].some((value) => String(value || "").toLowerCase().includes(searchText));
    return matchesStatus && matchesCategory && matchesDepartment && matchesSearch;
  }), [issues, statusFilter, categoryFilter, departmentFilter, search]);

  const counts = ["submitted", "under_review", "in_progress", "resolved", "reopened"];

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-700">Campus Pulse</p>
              <h1 className="text-xl font-semibold text-slate-900">Staff Issue Dashboard</h1>
              <p className="text-sm text-slate-500">{profile.name}{department ? ` · ${department}` : ""}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
          >
            <LogOut size={16} /> Log out
          </button>
        </header>

        <section aria-label="Issue totals" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[{ key: "total", label: "Total Issues", count: issues.length }, ...counts.map((status) => ({
            key: status,
            label: statusLabels[status],
            count: issues.filter((issue) => issue.statusCode === status).length,
          }))].map((item) => (
            <div key={item.key} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{item.count}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ClipboardList size={20} /> Student issues
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <label className="relative">
                <span className="sr-only">Search issues</span>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
              </label>
              <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="all">All statuses</option>
                {counts.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
              <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="all">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="all">All departments</option>
                {departments.map((value) => <option key={value} value={value}>{value}</option>)}
                {department && !departments.includes(department) && <option value={department}>{department}</option>}
              </select>
            </div>
          </div>

          {loading ? (
            <p role="status" className="rounded-lg bg-gray-50 p-8 text-center text-sm text-slate-500">Loading issues...</p>
          ) : error ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>
          ) : filteredIssues.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-8 text-center text-sm text-slate-500">No issues match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Tracking ID</th>
                    <th className="px-3 py-3">Issue</th>
                    <th className="px-3 py-3">Category / Location</th>
                    <th className="px-3 py-3">Reported</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Assigned to</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue._id} className="border-b border-gray-100 last:border-0">
                      <td className="whitespace-nowrap px-3 py-4 font-medium text-slate-700">{issue.trackingId}</td>
                      <td className="max-w-xs px-3 py-4 font-medium text-slate-900">{issue.title}</td>
                      <td className="px-3 py-4 text-slate-600">{issue.category}<span className="block text-xs text-slate-400">{issue.location}</span></td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-600">{issue.date}</td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{statusLabels[issue.statusCode]}</span>
                      </td>
                      <td className="px-3 py-4 text-slate-600">{issue.assignedTo?.name || "Unassigned"}</td>
                      <td className="px-3 py-4">
                        <Link to={`/staff/issues/${encodeURIComponent(issue._id)}`} className="font-semibold text-primary-700 hover:text-primary-900">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default StaffDashboard;
