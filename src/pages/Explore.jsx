import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wifi, Plug, Droplets, Brush, Snowflake, Lightbulb, Search as SearchIcon, MapPin, Tag, MessageCircle, Check, TrendingUp, Users, Plus } from "lucide-react";
import Modal from "../components/Modal";

function Explore() {
  const categories = [
    "All",
    "Infrastructure",
    "Facilities",
    "Cleanliness",
    "Internet",
    "Safety",
    "Suggestions",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() =>
    categories.includes(location.state?.category) ? location.state.category : "All"
  );
  const [search, setSearch] = useState("");
  const [supportedIssues, setSupportedIssues] = useState([]);
  const [sortBy, setSortBy] = useState("Most Supported");
  const [selectedIssue, setSelectedIssue] = useState(null);

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
      icon: Wifi,
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
      icon: Plug,
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
      icon: Droplets,
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
      icon: Brush,
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
      icon: Snowflake,
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
      icon: Lightbulb,
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

  const sortedIssues = [...filteredIssues].sort((first, second) =>
    sortBy === "Most Supported"
      ? second.supporters - first.supporters
      : issues.indexOf(first) - issues.indexOf(second)
  );

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
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10 pt-20 lg:pt-8 lg:ml-64">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">
              Campus Community
            </p>

            <h1 className="text-2xl font-semibold text-slate-900">
              Explore Issues
            </h1>

            <p className="mt-2 text-slate-500">
              See what students are experiencing across campus and add your voice.
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

        {/* Community Banner */}
        <div className="mb-7 overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-base font-semibold text-slate-900">
                Your voice can strengthen an existing issue.
              </p>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                Before reporting something new, check whether another student
                has already raised it. Supporting an existing issue helps the
                campus understand its impact.
              </p>
            </div>

            <div className="shrink-0 rounded-lg border border-blue-100 bg-white px-4 py-3">
              <p className="text-xl font-semibold text-slate-900">248</p>
              <p className="text-xs text-slate-500">
                students participating
              </p>
            </div>

          </div>

        </div>

        {/* Search */}
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={18} />
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

          <button
            type="button"
            aria-label={`Sort issues: ${sortBy}. Activate to change sort order.`}
            onClick={() => setSortBy((current) => current === "Most Supported" ? "Recently Updated" : "Most Supported")}
            className="hidden text-sm font-medium text-sky-600 sm:block"
          >
            Sort: {sortBy} ▾
          </button>

        </div>

        {/* Issue Cards */}
        <div className="grid gap-5 lg:grid-cols-2">

          {sortedIssues.map((issue) => {

            const isSupported = supportedIssues.includes(issue.id);

            return (
              <div
                key={issue.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >

                {/* Top row */}
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <issue.icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      {issue.trending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                          <TrendingUp size={12} />
                          Trending
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

                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    {issue.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-gray-400" />
                    {issue.category}
                  </span>

                </div>

                {/* Support */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {issue.supporters + (isSupported ? 1 : 0)}
                      </p>

                      <p className="text-xs text-gray-500">
                        students affected / supporting
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-pressed={isSupported}
                      onClick={() => toggleSupport(issue.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isSupported
                          ? "bg-sky-500 text-white"
                          : "border border-sky-200 bg-white text-sky-600 hover:bg-sky-50"
                      }`}
                    >
                      {isSupported && <Check size={14} />}
                      {isSupported ? "I'm affected" : "I'm also affected"}
                    </button>

                  </div>

                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">

                  <div className="flex gap-4 text-xs text-gray-400">

                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} />
                      {issue.comments} comments
                    </span>

                    <span>
                      Updated {issue.updated}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedIssue(issue)}
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

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <SearchIcon size={28} />
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
            onClick={() => navigate("/report")}
            className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Raise a New Issue
          </button>

        </div>

        <Modal
          isOpen={Boolean(selectedIssue)}
          onClose={() => setSelectedIssue(null)}
          title={selectedIssue?.title || "Issue details"}
          size="md"
        >
          {selectedIssue && (
            <div>
              <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{selectedIssue.status}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{selectedIssue.category}</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{selectedIssue.description}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin size={14} />{selectedIssue.location}</span>
                <span className="flex items-center gap-1.5"><Users size={14} />{selectedIssue.supporters} supporting</span>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
}

export default Explore;