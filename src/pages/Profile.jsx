import React, { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { useStudent } from "../context/StudentContext";

const profileFields = [
  { key: "name", label: "Full name", required: true },
  { key: "email", label: "Student email", type: "email", required: true },
  { key: "studentId", label: "Student ID", placeholder: "Add your student ID" },
  { key: "program", label: "Program", placeholder: "Add your program" },
  { key: "year", label: "Year of study", placeholder: "Add your year" },
];

function Profile() {
  const { profile, saveProfile } = useStudent();
  const [draft, setDraft] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saveError, setSaveError] = useState("");

  const startEditing = () => {
    setDraft({ ...profile });
    setFeedback("");
    setSaveError("");
    setIsEditing(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    try {
      saveProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim() });
      setIsEditing(false);
      setFeedback("Profile updated successfully.");
      setSaveError("");
    } catch {
      setSaveError("Unable to save your profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
    setFeedback("");
    setSaveError("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-72 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-sky-600">Your Account</p>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="mt-2 text-slate-500">Manage the student information connected to your Campus Pulse account.</p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-7 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
            <Avatar alt={draft.name || "Student"} size="xl" />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{profile.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>
            {!isEditing && (
              <Button type="button" onClick={startEditing}>
                <Pencil size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div className="grid gap-5 sm:grid-cols-2">
              {profileFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
                  {isEditing ? (
                    <input
                      type={field.type || "text"}
                      required={field.required}
                      value={draft[field.key] || ""}
                      placeholder={field.placeholder}
                      onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    />
                  ) : (
                    <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-slate-700">
                      {profile[field.key] || "Not provided"}
                    </p>
                  )}
                </label>
              ))}
            </div>

            {(feedback || saveError) && (
              <p role="status" className={`mt-5 text-sm ${saveError ? "text-red-700" : "text-emerald-700"}`}>
                {saveError || feedback}
              </p>
            )}

            {isEditing && (
              <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Check size={16} className="mr-2" />
                  Save Profile
                </Button>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;