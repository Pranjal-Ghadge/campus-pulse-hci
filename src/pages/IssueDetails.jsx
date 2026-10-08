import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Tag, Users, RotateCcw } from "lucide-react";
import { apiRequest } from "../utils/api";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

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
      <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
        <div role="status" className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Loading issue...
        </div>
      </main>
    );
  }

  if (loadError || !issue) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
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

  const reopenIssue = async () => {
    if (!window.confirm("Reopen this issue because it is not resolved?")) return;
    const note = window.prompt("Briefly explain what still needs attention.");
    if (!note?.trim()) return;
    setActionMessage("");
    setActionError("");
    try {
      const { issue: updatedIssue } = await apiRequest(`/api/issues/${encodeURIComponent(issue.databaseId)}/reopen`, {
        method: "PUT",
        body: JSON.stringify({ note: note.trim() }),
      });
      setIssue(updatedIssue);
      setActionMessage("Issue reopened for review.");
    } catch (error) {
      setActionError(error.message || "Unable to reopen this issue.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
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

          <dl className="mt-5 grid gap-3 border-t border-gray-100 pt-5 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Assigned department</dt><dd className="mt-1 font-medium text-slate-700">{issue.assignedDepartment || "Not assigned yet"}</dd></div>
            <div><dt className="text-gray-500">Assigned person</dt><dd className="mt-1 font-medium text-slate-700">{issue.assignedTo?.name || "Not assigned yet"}</dd></div>
          </dl>
          {issue.resolutionNote && (
            <section className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <h2 className="font-semibold text-emerald-900">Resolution</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm text-emerald-800">{issue.resolutionNote}</p>
            </section>
          )}
          {(issue.comments || []).length > 0 && (
            <section className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="font-semibold text-slate-900">Updates</h2>
              <div className="mt-3 space-y-3">
                {issue.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
                    <p className="whitespace-pre-wrap text-sm text-slate-700">{comment.text}</p>
                    <p className="mt-2 text-xs text-slate-500">{comment.user} · {new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {(issue.timeline || []).length > 0 && (
            <section className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="font-semibold text-slate-900">Issue timeline</h2>
              <ol className="mt-3 space-y-3">
                {issue.timeline.map((event) => (
                  <li key={event.id} className="border-l-2 border-sky-200 pl-3">
                    <p className="text-sm font-medium text-slate-800">{event.action}</p>
                    {event.note && <p className="mt-1 text-sm text-slate-600">{event.note}</p>}
                    <p className="mt-1 text-xs text-slate-500">{event.actor} · {new Date(event.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-5 text-sm text-gray-500">
            <p>{issue.statusText}</p>
            <p>Updated {issue.updated}</p>
            {issue.anonymous && <p>Reported anonymously</p>}
            {issue.hasPhoto && <p>Photo attached</p>}
          </div>
          {issue.statusCode === "resolved" && (
            <button type="button" onClick={reopenIssue} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50">
              <RotateCcw size={16} /> Reopen issue
            </button>
          )}
          {actionMessage && <p role="status" className="mt-3 text-sm text-slate-700">{actionMessage}</p>}
          {actionError && <p role="alert" className="mt-3 text-sm text-red-700">{actionError}</p>}
        </article>
      </div>
    </main>
  );
}

export default IssueDetails;