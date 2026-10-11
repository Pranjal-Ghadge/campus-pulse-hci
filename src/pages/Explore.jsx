import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Wifi,
  Plug,
  Droplets,
  Brush,
  Snowflake,
  Lightbulb,
  Search as SearchIcon,
  MapPin,
  Tag,
  MessageCircle,
  Check,
  TrendingUp,
  Users,
  Plus,
  Heart,
} from "lucide-react";
import Modal from "../components/Modal";
import { apiRequest } from "../utils/api";

const categories = [
  "All",
  "Infrastructure",
  "Facilities",
  "Cleanliness",
  "Internet",
  "Safety",
  "Suggestions",
];

const categoryIcons = {
  infrastructure: Snowflake,
  facilities: Plug,
  cleanliness: Brush,
  internet: Wifi,
  safety: Lightbulb,
  suggestions: Lightbulb,
  water: Droplets,
};

const toExploreIssue = (issue) => {
  const Icon = categoryIcons[String(issue.category || "").toLowerCase()] || Plug;
  return {
    ...issue,
    id: issue.databaseId,
    displayId: issue.trackingId,
    supporters: issue.affected || 1,
    comments: issue.commentsCount || 0,
    dateReported: issue.createdAt,
    updatedLabel: issue.updated,
    trending: (issue.affected || 1) >= 5,
    icon: Icon,
  };
};

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() =>
    categories.includes(location.state?.category) ? location.state.category : "All"
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Most Supported");
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supportingId, setSupportingId] = useState("");
  const [actionError, setActionError] = useState("");

  const loadIssues = async () => {
    setLoading(true);
    setError("");
    try {
      const { issues: records } = await apiRequest("/api/community/issues");
      setIssues((records || []).map(toExploreIssue));
    } catch (requestError) {
      setError(requestError.message || "Unable to load campus issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const toggleSupport = async (issue) => {
    if (supportingId) return;
    setSupportingId(issue.id);
    setActionError("");
    try {
      const { issue: updated } = await apiRequest(`/api/issues/${encodeURIComponent(issue.id)}/support`, {
        method: "PUT",
        body: JSON.stringify({ supported: !issue.supportedByCurrentUser }),
      });
      const nextIssue = toExploreIssue(updated);
      setIssues((current) => current.map((item) => item.id === issue.id ? nextIssue : item));
      setSelectedIssue((current) => current?.id === issue.id ? nextIssue : current);
    } catch (requestError) {
      setActionError(requestError.message || "Unable to update your support.");
    } finally {
      setSupportingId("");
    }
  };

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();
    return issues
      .filter((issue) => {
        const matchesCategory = activeCategory === "All"
          || issue.category?.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch = !query || [
          issue.title,
          issue.description,
          issue.location,
          issue.category,
          issue.trackingId,
        ].some((value) => String(value || "").toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
      })
      .sort((first, second) => sortBy === "Most Supported"
        ? second.supporters - first.supporters
        : new Date(second.updatedAt || second.dateReported) - new Date(first.updatedAt || first.dateReported));
  }, [issues, activeCategory, search, sortBy]);

  const getStatusStyle = (statusCode) => {
    if (statusCode === "resolved") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (statusCode === "pending_verification") return "bg-amber-50 text-amber-800 border-amber-100";
    if (statusCode === "under_review") return "bg-violet-50 text-violet-700 border-violet-100";
    return "bg-sky-50 text-sky-700 border-sky-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">Campus Community</p>
            <h1 className="text-2xl font-semibold text-slate-900">Explore Issues</h1>
            <p className="mt-2 text-slate-500">See what students are experiencing across campus and add your voice.</p>
          </div>
          <button type="button" onClick={() => navigate("/report")} className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800">
            <Plus size={16} className="mr-2" />Raise an Issue
          </button>
        </header>

        <section className="mb-7 overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">Your voice can strengthen an existing issue.</p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">Supporting an issue adds your account to its affected-student list. The saved count remains after you refresh.</p>
            </div>
            <div className="shrink-0 rounded-lg border border-blue-100 bg-white px-4 py-3">
              <p className="text-xl font-semibold text-slate-900">{issues.reduce((total, issue) => total + (issue.supporters || 0), 0)}</p>
              <p className="text-xs text-slate-500">affected-student reports</p>
            </div>
          </div>
        </section>

        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
          <label className="relative block">
            <span className="sr-only">Search campus issues</span>
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search campus issues..." className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100" />
          </label>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeCategory === category ? "bg-sky-500 text-white" : "border border-gray-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Campus Issues</h2>
            <p className="mt-1 text-sm text-gray-500">Live issues and support counts saved in Campus Pulse.</p>
          </div>
          <label className="text-sm font-medium text-slate-600">
            <span className="sr-only">Sort issues</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option>Most Supported</option><option>Recently Updated</option>
            </select>
          </label>
        </div>

        {actionError && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{actionError}</p>}

        {loading ? <p role="status" className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-slate-500">Loading campus issues...</p>
          : error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800"><p>{error}</p><button type="button" onClick={loadIssues} className="mt-3 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white">Try again</button></div>
            : filteredIssues.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <SearchIcon size={28} className="mx-auto mb-4 text-sky-600" />
                <h2 className="font-semibold text-slate-900">{issues.length ? "No issues found" : "No community issues yet"}</h2>
                <p className="mt-1 text-sm text-gray-500">{issues.length ? "Try another search term or category." : "New student reports will appear here."}</p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredIssues.map((issue) => (
                  <article key={issue.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><issue.icon size={20} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {issue.trending && <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600"><TrendingUp size={12} />High impact</span>}
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(issue.statusCode)}`}>{issue.status}</span>
                        </div>
                        <h3 className="mt-2 font-semibold text-slate-900">{issue.title}</h3>
                        <p className="mt-1 text-xs text-gray-400">#{issue.displayId}</p>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{issue.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" />{issue.location}</span>
                      <span className="flex items-center gap-1.5"><Tag size={14} className="text-gray-400" />{issue.category}</span>
                    </div>
                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-slate-900" aria-live="polite">{issue.supporters}</p>
                          <p className="text-xs text-gray-500">students affected / supporting</p>
                        </div>
                        <button type="button" disabled={Boolean(supportingId) || issue.reportedByCurrentUser} aria-pressed={issue.supportedByCurrentUser} onClick={() => toggleSupport(issue)} className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${issue.supportedByCurrentUser ? "bg-sky-600 text-white" : "border border-sky-200 bg-white text-sky-700 hover:bg-sky-50"}`}>
                          {issue.supportedByCurrentUser ? <Check size={14} /> : <Heart size={14} />}
                          {issue.reportedByCurrentUser ? "You reported this" : issue.supportedByCurrentUser ? "I'm affected" : supportingId === issue.id ? "Saving..." : "I'm also affected"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5"><MessageCircle size={14} />{issue.comments} updates</span>
                        <span>Updated {issue.updatedLabel}</span>
                      </div>
                      <button type="button" onClick={() => setSelectedIssue(issue)} className="text-sm font-semibold text-sky-700 hover:text-sky-800">View Issue →</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-6 text-center">
          <h2 className="font-semibold text-slate-900">Can’t find what you’re looking for?</h2>
          <p className="mt-1 text-sm text-slate-500">If your issue isn’t already listed, you can raise a new one.</p>
          <button type="button" onClick={() => navigate("/report")} className="mt-4 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Raise a New Issue</button>
        </div>

        <Modal isOpen={Boolean(selectedIssue)} onClose={() => setSelectedIssue(null)} title={selectedIssue?.title || "Issue details"} size="md">
          {selectedIssue && (
            <div>
              <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{selectedIssue.status}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{selectedIssue.category}</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{selectedIssue.description}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin size={14} />{selectedIssue.location}</span>
                <span className="flex items-center gap-1.5"><Users size={14} />{selectedIssue.supporters} affected</span>
                <span className="flex items-center gap-1.5"><MessageCircle size={14} />{selectedIssue.comments} updates</span>
              </div>
              <button type="button" disabled={Boolean(supportingId) || selectedIssue.reportedByCurrentUser} onClick={() => toggleSupport(selectedIssue)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {selectedIssue.supportedByCurrentUser ? <Check size={15} /> : <Heart size={15} />}
                {selectedIssue.supportedByCurrentUser ? "I'm affected" : selectedIssue.reportedByCurrentUser ? "You reported this" : "I'm also affected"}
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Explore;
