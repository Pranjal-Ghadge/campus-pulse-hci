import React, { useState } from "react";

function Explore() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [supportedIssues, setSupportedIssues] = useState([]);

  const categories = [
    "All",
    "Infrastructure",
    "Facilities",
    "Cleanliness",
    "Internet",
    "Safety",
    "Suggestions",
  ];

  const issues = [
    {
      id: "CP-1024",
      title: "Library Wi-Fi keeps disconnecting",
      description:
        "Students are experiencing frequent Wi-Fi disconnections while studying in the library.",
      category: "Internet",
      location: "Library",
      status: "In Progress",
      supporters: 127,
      comments: 18,
      updated: "2 hours ago",
      icon: "📶",
      trending: true,
    },
    {
      id: "CP-1031",
      title: "More charging points needed in the library",
      description:
        "There are not enough charging points for students using the library for extended periods.",
      category: "Suggestions",
      location: "Library",
      status: "Under Review",
      supporters: 86,
      comments: 12,
      updated: "4 hours ago",
      icon: "🔌",
      trending: true,
    },
    {
      id: "CP-1016",
      title: "Water dispenser needs maintenance",
      description:
        "The water dispenser near Block B has not been functioning properly.",
      category: "Facilities",
      location: "Block B",
      status: "In Progress",
      supporters: 54,
      comments: 7,
      updated: "Yesterday",
      icon: "💧",
      trending: false,
    },
    {
      id: "CP-1008",
      title: "Canteen seating area needs cleaning",
      description:
        "Students have reported that the seating area requires more frequent cleaning.",
      category: "Cleanliness",
      location: "Canteen",
      status: "Assigned",
      supporters: 42,
      comments: 5,
      updated: "Yesterday",
      icon: "🧹",
      trending: false,
    },
    {
      id: "CP-1002",
      title: "AC not working in Room 204",
      description:
        "The air conditioner in Room 204 has not been functioning properly during lectures.",
      category: "Infrastructure",
      location: "Main Building · Room 204",
      status: "Resolved",
      supporters: 34,
      comments: 9,
      updated: "2 days ago",
      icon: "❄",
      trending: false,
    },
    {
      id: "CP-0992",
      title: "Improve lighting near the parking area",
      description:
        "Additional lighting could improve visibility around the parking area after evening classes.",
      category: "Safety",
      location: "Parking Area",
      status: "Under Review",
      supporters: 29,
      comments: 6,
      updated: "3 days ago",
      icon: "💡",
      trending: false,
    },
  ];

  const toggleSupport = (id) => {
    setSupportedIssues((current) =>
      current.includes(id)
        ? current.filter((issueId) => issueId !== id)
        : [...current, id]
    );
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesCategory =
      activeCategory === "All" || issue.category === activeCategory;

    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase()) ||
      issue.location.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "Under Review") {
      return "bg-violet-50 text-violet-700 border-violet-100";
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
              Campus Community
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Explore Issues
            </h1>

            <p className="mt-2 text-slate-500">
              See what students are experiencing across campus and add your voice.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          >
            + Raise an Issue
          </button>

        </div>

        {/* Community Banner */}
        <div className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-lg font-semibold">
                Your voice can strengthen an existing issue.
              </p>

              <p className="mt-1 max-w-xl text-sm text-sky-50">
                Before reporting something new, check whether another student
                has already raised it. Supporting an existing issue helps the
                campus understand its impact.
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-white/15 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">248</p>
              <p className="text-xs text-sky-50">
                students participating
              </p>
            </div>

          </div>

        </div>

        {/* Search */}
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campus issues..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />

          </div>

        </div>

        {/* Categories */}
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-sky-500 text-white"
                  : "border border-gray-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Campus Issues
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Issues raised by students like you
            </p>
          </div>

          <button className="hidden text-sm font-medium text-sky-600 sm:block">
            Sort: Most Supported ▾
          </button>

        </div>

        {/* Issue Cards */}
        <div className="grid gap-5 lg:grid-cols-2">

          {filteredIssues.map((issue) => {

            const isSupported = supportedIssues.includes(issue.id);

            return (
              <div
                key={issue.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >

                {/* Top row */}
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xl">
                    {issue.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      {issue.trending && (
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                          🔥 Trending
                        </span>
                      )}

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>

                    </div>

                    <h3 className="mt-2 font-semibold text-slate-900">
                      {issue.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      #{issue.id}
                    </p>

                  </div>

                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {issue.description}
                </p>

                {/* Location */}
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                  <span>
                    📍 {issue.location}
                  </span>

                  <span>
                    🏷 {issue.category}
                  </span>

                </div>

                {/* Support */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {issue.supporters}
                      </p>

                      <p className="text-xs text-gray-500">
                        students affected / supporting
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSupport(issue.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isSupported
                          ? "bg-sky-500 text-white"
                          : "border border-sky-200 bg-white text-sky-600 hover:bg-sky-50"
                      }`}
                    >
                      {isSupported ? "✓ I'm affected" : "I'm also affected"}
                    </button>

                  </div>

                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">

                  <div className="flex gap-4 text-xs text-gray-400">

                    <span>
                      💬 {issue.comments} comments
                    </span>

                    <span>
                      Updated {issue.updated}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    View Issue →
                  </button>

                </div>

              </div>
            );
          })}

        </div>

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
              Try another search term or category.
            </p>

          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-6 text-center">

          <h2 className="font-semibold text-slate-900">
            Can't find what you're looking for?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            If your issue isn't already listed, you can raise a new one.
          </p>

          <button
            type="button"
            className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Raise a New Issue
          </button>

        </div>

      </div>
    </div>
  );
}

export default Explore;