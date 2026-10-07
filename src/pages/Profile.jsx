import React, { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { useStudent } from "../context/StudentContext";

function Profile() {
  const { profile, saveProfile } = useStudent();
  const [draft, setDraft] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setDraft({ ...profile });
    setFeedback("");
    setSaveError("");
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveProfile({ name: draft.name.trim() });
      setIsEditing(false);
      setFeedback("Profile updated successfully.");
      setSaveError("");
    } catch (error) {
      setSaveError(error.message || "Unable to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
    setFeedback("");
    setSaveError("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-sky-600">Your Account</p>
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <p className="mt-2 text-slate-500">Manage the student information connected to your Campus Pulse account.</p>
        </header>

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm lg:p-8">
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
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={draft.name || ""}
                    onChange={(event) => setDraft({ name: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                ) : (
                  <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">{profile.name}</p>
                )}
              </label>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Student email</span>
                <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">{profile.email}</p>
                <p className="mt-1.5 text-xs text-gray-500">Email is used to sign in and cannot be changed here.</p>
              </div>
            </div>

            {(feedback || saveError) && (
              <p role="status" className={`mt-5 text-sm ${saveError ? "text-red-700" : "text-emerald-700"}`}>
                {saveError || feedback}
              </p>
            )}

            {isEditing && (
              <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSaving}>
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  <Check size={16} className="mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
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