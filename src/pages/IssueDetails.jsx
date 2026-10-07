import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Tag, Users } from "lucide-react";
import { apiRequest } from "../utils/api";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setIssue(null);
    setIsLoading(true);
    setLoadError("");

    apiRequest(`/api/issues/${encodeURIComponent(id)}`)
      .then(({ issue: loadedIssue }) => {
        if (isCurrent) setIssue(loadedIssue);
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error.message || "Unable to load this issue. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-72 lg:px-10 lg:pt-8">
        <div role="status" className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Loading issue...
        </div>
      </main>
    );
  }

  if (loadError || !issue) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-72 lg:px-10 lg:pt-8">
        <div role="alert" className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {loadError ? "Unable to load issue" : "Issue not found"}
          </h1>
          <p className="mt-2 text-slate-500">
            {loadError || "This issue is no longer available."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/my-issues")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            <ArrowLeft size={16} />
            Back to My Issues
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-72 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/my-issues")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          <ArrowLeft size={16} />
          Back to My Issues
        </button>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-sky-600">Issue Details</p>
              <h1 className="text-2xl font-bold text-slate-900">{issue.title}</h1>
              <p className="mt-2 text-sm text-gray-400">#{issue.id}</p>
            </div>
            <span className="w-fit rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              {issue.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 border-y border-gray-100 py-5 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Tag size={16} className="text-gray-400" />
              {issue.category}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} className="text-gray-400" />
              {issue.location}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays size={16} className="text-gray-400" />
              Reported {issue.date}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Users size={16} className="text-gray-400" />
              {issue.affected} affected
            </p>
          </div>

          <section className="pt-5">
            <h2 className="font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {issue.description || issue.title}
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-5 text-sm text-gray-500">
            <p>{issue.statusText}</p>
            <p>Updated {issue.updated}</p>
            {issue.anonymous && <p>Reported anonymously</p>}
            {issue.hasPhoto && <p>Photo attached</p>}
          </div>
        </article>
      </div>
    </main>
  );
}

export default IssueDetails;