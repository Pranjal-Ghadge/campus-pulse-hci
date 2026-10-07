import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Lightbulb, Shield, HelpCircle, Camera, Sparkles, Check, CheckCircle, X, Heart } from "lucide-react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { useStudent } from "../context/StudentContext";
import { apiRequest } from "../utils/api";

function Report() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { settings } = useStudent();
  const validIssueTypes = ["problem", "improvement", "safety", "question", "appreciation"];
  const initialIssueType = validIssueTypes.includes(routeLocation.state?.issueType)
    ? routeLocation.state.issueType
    : "problem";
  const [issueType, setIssueType] = useState(initialIssueType);
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(() => settings.anonymousReporting);
  const [showSimilar, setShowSimilar] = useState(false);
  const [supportedSimilarIssue, setSupportedSimilarIssue] = useState(false);
  const [location, setLocation] = useState("");
  const [specificPlace, setSpecificPlace] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedIssueId, setSubmittedIssueId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [photoError, setPhotoError] = useState("");

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setFieldErrors((current) => ({ ...current, description: "" }));

    // Demo logic for similar issue detection
    if (
      value.toLowerCase().includes("wifi") ||
      value.toLowerCase().includes("internet")
    ) {
      setShowSimilar(true);
    } else {
      setShowSimilar(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhoto(null);
      setPhotoError("Choose a photo smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setPhoto(null);
      setPhotoError("Choose a PNG or JPG image.");
      e.target.value = "";
      return;
    }

    setPhoto(file);
    setPhotoError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!description.trim()) {
      errors.description = "Please describe the issue.";
    } else if (description.trim().length < 10) {
      errors.description = "Please enter at least 10 characters.";
    } else if (description.length > 500) {
      errors.description = "Keep the description within 500 characters.";
    }
    if (!location) {
      errors.location = "Please select a location.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { issue } = await apiRequest("/api/issues", {
        method: "POST",
        body: JSON.stringify({
          title: description.trim().slice(0, 50),
          description: description.trim(),
          type: issueType,
          category: issueType.charAt(0).toUpperCase() + issueType.slice(1),
          location,
          specificLocation: specificPlace,
          isAnonymous: anonymous,
        }),
      });

      setSubmittedIssueId(issue.trackingId || issue.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setSubmitError(error.message || "Unable to submit your issue right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/my-issues");
  };

  const issueTypes = [
    {
      id: "problem",
      icon: AlertTriangle,
      title: "Report a Problem",
      description: "Something on campus needs attention",
    },
    {
      id: "improvement",
      icon: Lightbulb,
      title: "Suggest Improvement",
      description: "Share an idea to make campus better",
    },
    {
      id: "safety",
      icon: Shield,
      title: "Safety Concern",
      description: "Report an urgent safety-related issue",
    },
    {
      id: "question",
      icon: HelpCircle,
      title: "Ask a Question",
      description: "Need information or clarification?",
    },
    {
      id: "appreciation",
      icon: Heart,
      title: "Share Appreciation",
      description: "Recognize something positive on campus",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10 pt-20 lg:pt-8 lg:ml-72">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-sky-600">
            Campus Voice
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Raise an Issue
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us what happened. We'll help route it to the right team.
          </p>
        </div>

        {/* Validation Error */}
        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p role="alert" className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        {/* Progress / reassurance */}
        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white">
              <Check size={18} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                It only takes a minute
              </p>
              <p className="text-sm text-slate-500">
                Describe the issue and we'll take care of the rest.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">

          {/* Section 1 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900">
              What would you like to share?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose the option that best describes your concern.
            </p>

            <div id="issue-type-options" className="mt-4 grid gap-3 sm:grid-cols-2">

              {issueTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={issueType === type.id}
                  onClick={() => setIssueType(type.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    issueType === type.id
                      ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                      : "border-gray-200 bg-white hover:border-sky-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        issueType === type.id
                          ? "bg-sky-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <type.icon size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {type.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {type.description}
                      </p>
                    </div>

                  </div>
                </button>
              ))}

            </div>
          </div>

          {/* Divider */}
          <div className="mb-8 border-t border-gray-100" />

          {/* Section 2 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Tell us what happened
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  You don't need to know the category. Just describe it naturally.
                </p>
              </div>

              <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 sm:block">
                Smart assistance
              </span>
            </div>

            <div className="mt-4">
              <textarea
                id="issue-description"
                aria-label="Issue description"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.description)}
                aria-describedby={fieldErrors.description ? "description-error" : undefined}
                value={description}
                onChange={handleDescriptionChange}
                maxLength={500}
                rows="5"
                placeholder="Example: The Wi-Fi keeps disconnecting in the library..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Describe the problem in your own words.</span>
                <span aria-live="polite">{description.length}/500</span>
              </div>
              {fieldErrors.description && (
                <p id="description-error" role="alert" className="mt-2 text-sm text-red-700">
                  {fieldErrors.description}
                </p>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {description.length > 15 && (
            <div className="mb-8 rounded-xl border border-sky-100 bg-sky-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-500">
                  <Sparkles size={18} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    We can help categorize this
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Based on your description, we suggest:
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                      Category: Infrastructure
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                      Subcategory: Internet / Wi-Fi
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("issue-type-options")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    Change category
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Similar Issue */}
          {showSimilar && (
            <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle size={18} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    A similar issue already exists
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Library Wi-Fi Connectivity Problem
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    <span aria-live="polite">{127 + (supportedSimilarIssue ? 1 : 0)}</span> students are currently affected.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      aria-pressed={supportedSimilarIssue}
                      onClick={() => setSupportedSimilarIssue((current) => !current)}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      {supportedSimilarIssue ? "Marked as affected" : "I'm also affected"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSimilar(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      This is different
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Where is this happening?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This helps us send your issue to the correct department.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="issue-location" className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <select 
                  id="issue-location"
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.location)}
                  aria-describedby={fieldErrors.location ? "location-error" : undefined}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setFieldErrors((current) => ({ ...current, location: "" }));
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select location</option>
                  <option value="Library">Library</option>
                  <option value="Main Building">Main Building</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Canteen">Canteen</option>
                  <option value="Sports Complex">Sports Complex</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.location && (
                  <p id="location-error" role="alert" className="mt-2 text-sm text-red-700">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Specific place
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  value={specificPlace}
                  onChange={(e) => setSpecificPlace(e.target.value)}
                  placeholder="e.g. Room 204"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>

            </div>
          </div>

          {/* Photo */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Add a photo
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-7 text-center transition hover:border-sky-400 hover:bg-sky-50">

              <div className="mb-2 text-gray-400">
                <Camera size={32} />
              </div>

              <p className="text-sm font-medium text-slate-700">
                {photo ? photo.name : "Upload a photo"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG or JPG · Maximum 5 MB
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Photos are not saved with reports yet.
              </p>

              <input 
                type="file" 
                accept="image/png,image/jpeg,.png,.jpg,.jpeg" 
                onChange={handlePhotoChange}
                aria-label="Choose a PNG or JPG photo"
                className="hidden" 
              />

            </label>
            {photoError && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {photoError}
              </p>
            )}
          </div>

          {/* Privacy */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="font-medium text-slate-800">
                  Report anonymously
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your name won't be shown publicly. You'll still receive a
                  tracking ID.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                aria-pressed={anonymous}
                aria-label="Report anonymously"
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  anonymous ? "bg-sky-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    anonymous ? "left-6" : "left-1"
                  }`}
                />
              </button>

            </div>

          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-gray-400">
              Your issue can be tracked after submission.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-sky-500 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-500"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span aria-live="polite">Submitting...</span>
                </span>
              ) : (
                "Submit Issue →"
              )}
            </button>

          </div>

        </form>

        {/* Bottom help */}
        <div className="mt-5 text-center text-sm text-gray-400">
          Need urgent help?{" "}
          <button type="button" onClick={() => navigate("/help")} className="font-medium text-sky-600">
            Contact campus support
          </button>
        </div>

      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title=""
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Issue submitted successfully
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your issue has been recorded and will be reviewed by the campus administration.
          </p>
          
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
            <p className="text-lg font-semibold text-gray-900">{submittedIssueId}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            You can track its progress in My Issues.
          </p>
          
          <Button
            onClick={handleSuccessModalClose}
            className="w-full"
          >
            Go to My Issues
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Report;