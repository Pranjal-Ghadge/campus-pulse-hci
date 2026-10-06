import React, { useState } from "react";

function Report() {
  const [issueType, setIssueType] = useState("problem");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

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

  const issueTypes = [
    {
      id: "problem",
      icon: "⚠",
      title: "Report a Problem",
      description: "Something on campus needs attention",
    },
    {
      id: "improvement",
      icon: "💡",
      title: "Suggest Improvement",
      description: "Share an idea to make campus better",
    },
    {
      id: "safety",
      icon: "🛡",
      title: "Safety Concern",
      description: "Report an urgent safety-related issue",
    },
    {
      id: "question",
      icon: "?",
      title: "Ask a Question",
      description: "Need information or clarification?",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10">
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

        {/* Progress / reassurance */}
        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white">
              ✓
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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">

          {/* Section 1 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900">
              What would you like to share?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose the option that best describes your concern.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {issueTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setIssueType(type.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    issueType === type.id
                      ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500"
                      : "border-gray-200 bg-white hover:border-sky-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                        issueType === type.id
                          ? "bg-sky-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {type.icon}
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
                value={description}
                onChange={handleDescriptionChange}
                rows="5"
                placeholder="Example: The Wi-Fi keeps disconnecting in the library..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Describe the problem in your own words.</span>
                <span>{description.length}/500</span>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {description.length > 15 && (
            <div className="mb-8 rounded-xl border border-sky-100 bg-sky-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  ✨
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
                  !
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    A similar issue already exists
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Library Wi-Fi Connectivity Problem
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    127 students are currently affected.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      I'm also affected
                    </button>

                    <button
                      type="button"
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
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100">
                  <option>Select location</option>
                  <option>Library</option>
                  <option>Main Building</option>
                  <option>Computer Lab</option>
                  <option>Hostel</option>
                  <option>Canteen</option>
                  <option>Sports Complex</option>
                  <option>Other</option>
                </select>
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

              <div className="mb-2 text-2xl">
                📷
              </div>

              <p className="text-sm font-medium text-slate-700">
                Upload a photo
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG or JPG · Maximum 5 MB
              </p>

              <input type="file" accept="image/*" className="hidden" />

            </label>
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
              type="button"
              className="rounded-xl bg-sky-500 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md"
            >
              Submit Issue →
            </button>

          </div>

        </div>

        {/* Bottom help */}
        <div className="mt-5 text-center text-sm text-gray-400">
          Need urgent help?{" "}
          <button className="font-medium text-sky-600">
            Contact campus support
          </button>
        </div>

      </div>
    </div>
  );
}

export default Report;