import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api";

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  resolved: "Resolved",
  reopened: "Reopened",
};

function StaffIssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [staff, setStaff] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [comment, setComment] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [issueResponse, staffResponse] = await Promise.all([
        apiRequest(`/api/staff/issues/${encodeURIComponent(id)}`),
        apiRequest("/api/staff/users"),
      ]);
      setIssue(issueResponse.issue);
      setStaff(staffResponse.users || []);
      setAssignee(issueResponse.issue.assignedTo?.id || "");
    } catch (requestError) {
      setError(requestError.message || "Unable to load this issue.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const perform = async (path, method, body, successMessage) => {
    setSaving(true);
    setError("");
    setFeedback("");
    try {
      await apiRequest(path, {
        method,
        body: JSON.stringify(body || {}),
      });
      setFeedback(successMessage);
      await load();
    } catch (requestError) {
      setError(requestError.message || "Unable to save this issue update.");
    } finally {
      setSaving(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    await perform(`/api/staff/issues/${encodeURIComponent(id)}/comments`, "POST", { text: comment }, "Update added.");
    setComment("");
  };

  const canReview = issue?.statusCode === "submitted" || issue?.statusCode === "reopened";
  const canStartWork = issue?.statusCode === "under_review";

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/staff" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        {loading ? (
          <p role="status" className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-slate-500">Loading issue...</p>
        ) : error && !issue ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</p>
        ) : issue && (
          <>
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-primary-700">{issue.trackingId}</p>
                  <h1 className="mt-1 text-2xl font-semibold text-slate-900">{issue.title}</h1>
                  <p className="mt-2 text-sm text-slate-500">{issue.category}{issue.subcategory ? ` · ${issue.subcategory}` : ""} · {issue.location}</p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800">{statusLabels[issue.statusCode]}</span>
              </div>
              <section className="mt-6 border-t border-gray-100 pt-5">
                <h2 className="font-semibold text-slate-900">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{issue.description}</p>
              </section>
              <dl className="mt-5 grid gap-3 border-t border-gray-100 pt-5 text-sm sm:grid-cols-2">
                <div><dt className="text-slate-500">Reporter</dt><dd className="mt-1 font-medium text-slate-800">{issue.anonymous ? "Anonymous" : issue.reporter?.name || "Reporter unavailable"}</dd></div>
                <div><dt className="text-slate-500">Assigned department</dt><dd className="mt-1 font-medium text-slate-800">{issue.assignedDepartment || "Unassigned"}</dd></div>
                <div><dt className="text-slate-500">Assigned person</dt><dd className="mt-1 font-medium text-slate-800">{issue.assignedTo?.name || "Unassigned"}</dd></div>
                <div><dt className="text-slate-500">Reported</dt><dd className="mt-1 font-medium text-slate-800">{issue.date}</dd></div>
              </dl>
              {issue.resolutionNote && (
                <section className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <h2 className="font-semibold text-emerald-900">Resolution</h2>
                  <p className="mt-1 text-sm text-emerald-800">{issue.resolutionNote}</p>
                </section>
              )}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                <button type="button" disabled={saving} onClick={() => perform(`/api/staff/issues/${encodeURIComponent(id)}/assign`, "PUT", { assignedTo: assignee || undefined }, "Issue claimed or assigned.")} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {issue.assignedTo ? "Update assignment" : "Take Issue"}
                </button>
                <select aria-label="Assign responsible person" value={assignee} onChange={(event) => setAssignee(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="">Assign to me</option>
                  {staff.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
                {canReview && <button type="button" disabled={saving} onClick={() => perform(`/api/staff/issues/${encodeURIComponent(id)}/status`, "PUT", { status: "under_review" }, "Issue moved to Under Review.")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">Under Review</button>}
                {canStartWork && <button type="button" disabled={saving} onClick={() => perform(`/api/staff/issues/${encodeURIComponent(id)}/status`, "PUT", { status: "in_progress" }, "Issue moved to In Progress.")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">Start Work</button>}
                {issue.statusCode === "resolved" && <button type="button" disabled={saving} onClick={() => {
                  if (!window.confirm("Reopen this resolved issue for further action?")) return;
                  const note = window.prompt("Explain why this issue needs more work.");
                  if (note?.trim()) perform(`/api/staff/issues/${encodeURIComponent(id)}/status`, "PUT", { status: "reopened", note: note.trim() }, "Issue reopened.");
                }} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 disabled:opacity-50">Reopen Issue</button>}
              </div>
              {issue.statusCode === "in_progress" && (
                <form
                  className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (window.confirm("Confirm that the recorded action resolves this issue?")) {
                      perform(`/api/staff/issues/${encodeURIComponent(id)}/resolve`, "PUT", { resolutionNote }, "Issue marked as resolved.");
                    }
                  }}
                >
                  <label className="block text-sm font-medium text-slate-700" htmlFor="resolution-note">Action taken / resolution</label>
                  <textarea id="resolution-note" required maxLength={2000} value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <button type="submit" disabled={saving || !resolutionNote.trim()} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check size={16} /> Mark Resolved</button>
                </form>
              )}
            </article>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Comments and updates</h2>
                <div className="mt-4 space-y-3">
                  {(issue.comments || []).length === 0 ? <p className="text-sm text-slate-500">No comments yet.</p> : issue.comments.map((item) => (
                    <div key={item.id} className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm text-slate-700">{item.text}</p>
                      <p className="mt-2 text-xs text-slate-500">{item.user} · {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={submitComment} className="mt-4">
                  <label htmlFor="staff-comment" className="sr-only">Add an update</label>
                  <textarea id="staff-comment" required maxLength={2000} value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Add an update for the student" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <button type="submit" disabled={saving || !comment.trim()} className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Add Comment</button>
                </form>
              </section>
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Issue timeline</h2>
                <ol className="mt-4 space-y-4">
                  {(issue.timeline || []).map((event) => (
                    <li key={event.id} className="border-l-2 border-sky-200 pl-4">
                      <p className="text-sm font-medium text-slate-800">{event.action}</p>
                      {event.note && <p className="mt-1 text-sm text-slate-600">{event.note}</p>}
                      <p className="mt-1 text-xs text-slate-500">{event.actor} · {new Date(event.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
            {(error || feedback) && <p role={error ? "alert" : "status"} className={`mt-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>{error || feedback}</p>}
            {saving && <p role="status" className="mt-3 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle size={16} className="animate-spin" /> Saving update...</p>}
          </>
        )}
      </div>
    </main>
  );
}

export default StaffIssueDetails;
