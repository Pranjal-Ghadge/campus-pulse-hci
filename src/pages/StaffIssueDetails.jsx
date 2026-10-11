import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Download, LoaderCircle, ShieldAlert, Upload } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import StaffSidebar from "../components/StaffSidebar";
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
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [escalationReason, setEscalationReason] = useState("");
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

  const requestInformation = async () => {
    const details = window.prompt("What information would help you investigate this issue?");
    if (!details?.trim()) return;
    await perform(
      `/api/staff/issues/${encodeURIComponent(id)}/comments`,
      "POST",
      { text: `More information requested: ${details.trim()}` },
      "Information request sent to the affected students."
    );
  };

  const submitResolution = async (event) => {
    event.preventDefault();
    if (!resolutionNote.trim() || evidenceFiles.length === 0) return;
    if (!window.confirm("Send this resolution and evidence to the student for verification?")) return;
    try {
      const evidence = await Promise.all(evidenceFiles.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ filename: file.name, contentType: file.type, data: reader.result });
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
        reader.readAsDataURL(file);
      })));
      await perform(`/api/staff/issues/${encodeURIComponent(id)}/resolve`, "PUT", { resolutionNote, evidence }, "Resolution submitted for student verification.");
      setEvidenceFiles([]);
      setResolutionNote("");
    } catch (requestError) {
      setError(requestError.message || "Unable to prepare the evidence files.");
    }
  };

  const downloadEvidence = async (item) => {
    try {
      const result = await apiRequest(`/api/staff/issues/${encodeURIComponent(id)}/evidence/${encodeURIComponent(item.id)}`);
      const bytes = Uint8Array.from(atob(result.data), (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: result.contentType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message || "Unable to download this evidence file.");
    }
  };

  const canReview = issue?.statusCode === "submitted" || issue?.statusCode === "reopened";
  const canStartWork = issue?.statusCode === "under_review";

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:ml-64 lg:px-10">
      <StaffSidebar />
      <div className="mx-auto max-w-5xl pt-16 lg:pt-8">
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
                <div><dt className="text-slate-500">Student voice</dt><dd className="mt-1 font-medium capitalize text-slate-800">{issue.type || "problem"}</dd></div>
                <div><dt className="text-slate-500">Students affected</dt><dd className="mt-1 font-medium text-slate-800">{issue.affected || 1}</dd></div>
              </dl>
              {issue.affectedStudents?.length > 0 && (
                <details className="mt-4 rounded-lg border border-gray-200 p-3">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">View students who also reported being affected ({issue.affectedStudents.length})</summary>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {issue.affectedStudents.map((student) => <li key={student.id}>{student.name}</li>)}
                  </ul>
                </details>
              )}
              {issue.resolutionNote && (
                <section className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <h2 className="font-semibold text-emerald-900">{issue.statusCode === "pending_verification" ? "Awaiting student verification" : "Resolution"}</h2>
                  <p className="mt-1 text-sm text-emerald-800">{issue.resolutionNote}</p>
                  {issue.evidence?.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {issue.evidence.map((item) => (
                        <li key={item.id}>
                          <button type="button" onClick={() => downloadEvidence(item)} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900 underline">
                            <Download size={15} /> {item.filename}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
                {issue.statusCode !== "resolved" && issue.statusCode !== "pending_verification" && (
                  <button type="button" disabled={saving} onClick={() => {
                    if (escalationReason.trim() && window.confirm("Escalate this issue for administrator review?")) {
                      perform(`/api/staff/issues/${encodeURIComponent(id)}/escalate`, "PUT", { reason: escalationReason.trim() }, "Issue escalated for administrator review.");
                    }
                  }} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-800 disabled:opacity-50">
                    <ShieldAlert size={16} className="mr-2 inline" />Escalate
                  </button>
                )}
              </div>
              {issue.statusCode !== "resolved" && issue.statusCode !== "pending_verification" && (
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  Escalation reason
                  <input value={escalationReason} onChange={(event) => setEscalationReason(event.target.value)} maxLength={1000} placeholder="Why does this need administrator attention?" className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2" />
                </label>
              )}
              {issue.escalatedAt && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">Escalated {new Date(issue.escalatedAt).toLocaleString()}: {issue.escalationReason}</p>}
              {issue.statusCode === "in_progress" && (
                <form
                  className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4"
                  onSubmit={submitResolution}
                >
                  <label className="block text-sm font-medium text-slate-700" htmlFor="resolution-note">Action taken / resolution (required)</label>
                  <textarea id="resolution-note" required maxLength={2000} value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="resolution-evidence">Proof of resolution (required; JPEG, PNG, WebP, or PDF; total max 1 MB)</label>
                  <input id="resolution-evidence" type="file" required accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    const totalBytes = files.reduce((total, file) => total + file.size, 0);
                    if (files.some((file) => file.size === 0) || totalBytes > 1024 * 1024) {
                      setError("Choose valid evidence files with a combined size of no more than 1 MB.");
                      event.target.value = "";
                      setEvidenceFiles([]);
                      return;
                    }
                    setError("");
                    setEvidenceFiles(files);
                  }} className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm" />
                  {evidenceFiles.length > 0 && <p className="mt-2 text-xs text-slate-500">{evidenceFiles.length} evidence file(s) selected.</p>}
                  <button type="submit" disabled={saving || !resolutionNote.trim() || evidenceFiles.length === 0} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Upload size={16} /> Request Student Verification</button>
                </form>
              )}
            </article>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">Comments and updates</h2>
                  <button type="button" disabled={saving} onClick={requestInformation} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-50">Request information</button>
                </div>
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
