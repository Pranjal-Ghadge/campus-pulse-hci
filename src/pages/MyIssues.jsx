import React, { useState } from "react";

function MyIssues() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const issues = [
    {
      id: "CP-1024",
      title: "Library Wi-Fi Connectivity Problem",
      category: "Infrastructure",
      location: "Library",
      status: "In Progress",
      statusText: "Being investigated",
      affected: 127,
      updated: "2 hours ago",
      date: "Sep 30, 2026",
      icon: "📶",
    },
    {
      id: "CP-1018",
      title: "AC not working in Room 204",
      category: "Infrastructure",
      location: "Main Building · Room 204",
      status: "Resolved",
      statusText: "Resolution verified",
      affected: 34,
      updated: "Yesterday",
      date: "Sep 28, 2026",
      icon: "❄",
    },
    {
      id: "CP-1009",
      title: "Water dispenser needs maintenance",
      category: "Facilities",
      location: "Block B",
      status: "Waiting for You",
      statusText: "Verification required",
      affected: 18,
      updated: "Sep 27, 2026",
      date: "Sep 25, 2026",
      icon: "💧",
    },
    {
      id: "CP-0997",
      title: "More charging points in library",
      category: "Suggestion",
      location: "Library",
      status: "Resolved",
      statusText: "Implemented",
      affected: 86,
      updated: "Sep 24, 2026",
      date: "Sep 20, 2026",
      icon: "🔌",
    },
    {
      id: "CP-0988",
      title: "Canteen seating area needs cleaning",
      category: "Cleanliness",
      location: "Canteen",
      status: "In Progress",
      statusText: "Assigned to housekeeping",
      affected: 42,
      updated: "Sep 22, 2026",
      date: "Sep 21, 2026",
      icon: "🧹",
    },
  ];

  const filters = [
    { label: "All", count: issues.length },
    {
      label: "In Progress",
      count: issues.filter((i) => i.status === "In Progress").length,
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
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">
              Your Activity
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              My Issues
            </h1>

            <p className="mt-2 text-slate-500">
              Track the issues you've reported and supported.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          >
            + Raise an Issue
          </button>

        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Total Issues</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">5</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-sky-600">2</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">2</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Supported</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">7</p>
          </div>

        </div>

        {/* Search + Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="mb-4">
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
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
        <div className="space-y-4">

          {filteredIssues.map((issue) => (

            <div
              key={issue.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >

              {/* Top */}
              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xl">
                  {issue.icon}
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

                    <span>
                      📍 {issue.location}
                    </span>

                    <span>
                      🏷 {issue.category}
                    </span>

                    <span>
                      👥 {issue.affected} affected
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
                      ✓
                    </div>

                    <span className="ml-2 hidden text-xs font-medium text-slate-600 sm:block">
                      Submitted
                    </span>

                  </div>

                  <div
                    className={`mx-2 h-0.5 flex-1 ${
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
                        issue.status === "In Progress" ||
                        issue.status === "Resolved"
                          ? "bg-sky-500 text-white"
                          : "border-2 border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {issue.status === "In Progress" ||
                      issue.status === "Resolved"
                        ? "✓"
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
                      {issue.status === "Resolved" ? "✓" : "3"}
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

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-2xl">
                🔎
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

      </div>
    </div>
  );
}

export default MyIssues;