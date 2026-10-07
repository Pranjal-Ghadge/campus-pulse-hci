import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Tag, Users, Check, Search as SearchIcon, AlertTriangle, Plus } from "lucide-react";
import { apiRequest } from "../utils/api";

function MyIssues() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError("");

    apiRequest("/api/issues")
      .then(({ issues: loadedIssues }) => {
        if (isCurrent) {
          setIssues(loadedIssues.map((issue) => ({ ...issue, icon: AlertTriangle })));
        }
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error.message || "Unable to load your issues. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadCount]);

  const filters = [
    { label: "All", count: issues.length },
    {
      label: "In Progress",
      count: issues.filter((i) => i.status === "In Progress").length,
    },
    {
      label: "Under Review",
      count: issues.filter((i) => i.status === "Under Review").length,
    },
    {
      label: "Resolved",
      count: issues.filter((i) => i.status === "Resolved").length,
    },
    {
      label: "Waiting for You",
      count: issues.filter((i) => i.status === "Waiting for You").length,
    },
  ];

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter =
      activeFilter === "All" || issue.status === activeFilter;

    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.id.toLowerCase().includes(search.toLowerCase()) ||
      issue.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "Waiting for You") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-sky-50 text-sky-700 border-sky-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10 pt-20 lg:pt-8 lg:ml-64">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">
              Your Activity
            </p>

            <h1 className="text-2xl font-semibold text-slate-900">
              My Issues
            </h1>

            <p className="mt-2 text-slate-500">
              Track the issues you've reported and supported.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/report")}
            className="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            <Plus size={16} className="mr-2" />
            Raise an Issue
          </button>

        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Total Issues</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{issues.length}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-sky-600">
              {issues.filter((issue) => issue.status === "In Progress").length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {issues.filter((issue) => issue.status === "Resolved").length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Supported</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">
              {issues.filter((issue) => issue.supportedByCurrentUser).length}
            </p>
          </div>

        </div>

        {/* Search + Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="mb-4">
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon size={18} />
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your issues..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />

            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">

            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter.label
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}

                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                    activeFilter === filter.label
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}

          </div>
        </div>

        {/* Issue List */}
        {isLoading ? (
          <div role="status" className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading your issues...
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-800">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        ) : (
        <div className="space-y-4">

          {filteredIssues.map((issue) => (

            <div
              key={issue.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >

              {/* Top */}
              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <issue.icon size={20} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {issue.title}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        #{issue.id} · Reported {issue.date}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>

                  </div>

                  {/* Metadata */}
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {issue.location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-gray-400" />
                      {issue.category}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-gray-400" />
                      {issue.affected} affected
                    </span>

                  </div>

                </div>

              </div>

              {/* Progress */}
              <div className="mt-6 border-t border-gray-100 pt-5">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-700">
                    Issue progress
                  </p>

                  <p className="text-xs text-gray-400">
                    Updated {issue.updated}
                  </p>

                </div>

                <div className="flex items-center">

                  {/* Step 1 */}
                  <div className="flex items-center">

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                      <Check size={12} />
                    </div>

                    <span className="ml-2 hidden text-xs font-medium text-slate-600 sm:block">
                      Submitted
                    </span>

                  </div>

                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      issue.status === "Under Review" ||
                      issue.status === "Assigned" ||
                      issue.status === "In Progress" ||
                      issue.status === "Resolved"
                        ? "bg-sky-400"
                        : "bg-gray-200"
                    }`}
                  />

                  {/* Step 2 */}
                  <div className="flex items-center">

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                        issue.status === "Under Review" ||
                        issue.status === "Assigned" ||
                        issue.status === "In Progress" ||
                        issue.status === "Resolved"
                          ? "bg-sky-500 text-white"
                          : "border-2 border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {issue.status === "Under Review" ||
                      issue.status === "Assigned" ||
                      issue.status === "In Progress" ||
                      issue.status === "Resolved"
                        ? <Check size={12} />
                        : "2"}
                    </div>

                    <span className="ml-2 hidden text-xs font-medium text-slate-600 sm:block">
                      Investigating
                    </span>

                  </div>

                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      issue.status === "Resolved"
                        ? "bg-emerald-400"
                        : "bg-gray-200"
                    }`}
                  />

                  {/* Step 3 */}
                  <div className="flex items-center">

                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                        issue.status === "Resolved"
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {issue.status === "Resolved" ? <Check size={12} /> : "3"}
                    </div>

                    <span className="ml-2 hidden text-xs font-medium text-slate-600 sm:block">
                      Resolved
                    </span>

                  </div>

                </div>

              </div>

              {/* Bottom */}
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
                  {issue.statusText}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const { icon, ...issueDetails } = issue;
                    navigate(`/issues/${encodeURIComponent(issue.databaseId || issue.id)}`, {
                      state: { issue: issueDetails },
                    });
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 sm:w-auto"
                >
                  View Issue →
                </button>

              </div>

            </div>

          ))}

          {/* Empty State */}
          {filteredIssues.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <SearchIcon size={28} />
              </div>

              <h2 className="font-semibold text-slate-900">
                No issues found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>
        )}

      </div>
    </div>
  );
}

export default MyIssues;