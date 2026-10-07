import React, { createContext, useContext, useState } from "react";

const StudentContext = createContext(null);

const defaultProfile = {
  name: "Student",
  email: "student@campus.edu",
  studentId: "",
  program: "",
  year: "",
};

const defaultSettings = {
  emailNotifications: false,
  issueUpdates: true,
  campusAnnouncements: false,
  anonymousReporting: false,
  profileVisible: false,
};

const readStoredValue = (key, defaults) => {
  try {
    const storedValue = JSON.parse(localStorage.getItem(key) || "null");
    return storedValue && typeof storedValue === "object"
      ? { ...defaults, ...storedValue }
      : defaults;
  } catch {
    return defaults;
  }
};

export function StudentProvider({ children }) {
  const [profile, setProfile] = useState(() =>
    readStoredValue("campusPulseProfile", defaultProfile)
  );
  const [settings, setSettings] = useState(() =>
    readStoredValue("campusPulseSettings", defaultSettings)
  );

  const saveProfile = (nextProfile) => {
    localStorage.setItem("campusPulseProfile", JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  const saveSettings = (nextSettings) => {
    localStorage.setItem("campusPulseSettings", JSON.stringify(nextSettings));
    setSettings(nextSettings);
  };

  return (
    <StudentContext.Provider value={{ profile, settings, saveProfile, saveSettings }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}