import React, { useState } from "react";
import { Bell, Check, LockKeyhole, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useStudent } from "../context/StudentContext";

const notificationPreferences = [
  { key: "issueUpdates", label: "Issue status updates", description: "Get notified when one of your reports changes status." },
  { key: "emailNotifications", label: "Email notifications", description: "Receive important account and issue updates by email." },
  { key: "campusAnnouncements", label: "Campus announcements", description: "Receive updates about campus services and activity." },
];

function PreferenceToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-sky-500" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function SettingsPage() {
  const { profile, settings, saveSettings } = useStudent();
  const [draft, setDraft] = useState({ ...settings });
  const [feedback, setFeedback] = useState("");
  const [saveError, setSaveError] = useState("");

  const updateSetting = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setFeedback("");
    setSaveError("");
  };

  const handleSave = () => {
    try {
      saveSettings({ ...draft });
      setFeedback("Settings saved successfully.");
      setSaveError("");
    } catch {
      setSaveError("Unable to save your settings. Please try again.");
    }
  };

  const handleCancel = () => {
    setDraft({ ...settings });
    setFeedback("");
    setSaveError("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-72 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-sky-600">Your Account</p>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-500">Choose how Campus Pulse keeps you informed and protects your privacy.</p>
        </header>

        <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Account settings</h2>
              <p className="text-sm text-slate-500">Your student account details</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">{profile.name}</p>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>
            <Link to="/profile" className="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700">
              Manage profile
            </Link>
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Notification preferences</h2>
              <p className="text-sm text-slate-500">Select the updates you want to receive.</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {notificationPreferences.map(({ key, ...preference }) => (
              <PreferenceToggle
                key={key}
                {...preference}
                checked={draft[key]}
                onChange={(value) => updateSetting(key, value)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Privacy settings</h2>
              <p className="text-sm text-slate-500">Control how your identity is used on Campus Pulse.</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            <PreferenceToggle
              label="Default to anonymous reporting"
              description="New reports will start with anonymous reporting enabled. You can change this on each report."
              checked={draft.anonymousReporting}
              onChange={(value) => updateSetting("anonymousReporting", value)}
            />
            <PreferenceToggle
              label="Show my profile to the campus community"
              description="Allow other students to see your profile name on community activity."
              checked={draft.profileVisible}
              onChange={(value) => updateSetting("profileVisible", value)}
            />
          </div>
        </section>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className={`text-sm ${saveError ? "text-red-700" : "text-emerald-700"}`}>
            {saveError || feedback}
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              <Check size={16} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;