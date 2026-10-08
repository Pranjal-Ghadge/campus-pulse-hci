import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const StudentContext = createContext(null);

const defaultSettings = {
  emailNotifications: false,
  issueUpdates: true,
  campusAnnouncements: false,
  anonymousReporting: false,
  profileVisible: false,
};

const readSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem("campusPulseSettings") || "null");
    return settings && typeof settings === "object"
      ? { ...defaultSettings, ...settings }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export function StudentProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(readSettings);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authFeedback, setAuthFeedback] = useState("");

  const clearAuthentication = useCallback(() => {
    localStorage.removeItem("campusPulseToken");
    setProfile(null);
    setAuthError("");
    setAuthFeedback("");
  }, []);
  const clearAuthFeedback = useCallback(() => setAuthFeedback(""), []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("campusPulseToken");
    if (!token) {
      setProfile(null);
      setAuthError("");
      setIsAuthLoading(false);
      return null;
    }

    setIsAuthLoading(true);
    setAuthError("");
    try {
      const { user } = await apiRequest("/api/auth/me");
      setProfile(user);
      return user;
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem("campusPulseToken");
        setProfile(null);
      } else {
        setAuthError(error.message || "Unable to verify your session.");
      }
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthentication();
      setIsAuthLoading(false);
    };
    window.addEventListener("campusPulseUnauthorized", handleUnauthorized);
    return () => window.removeEventListener("campusPulseUnauthorized", handleUnauthorized);
  }, [clearAuthentication]);

  const login = async (credentials) => {
    const { token, user } = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const effectiveRole = user.role || "student";
    const expectedRole = credentials.role;
    if (
      expectedRole &&
      (expectedRole === "staff" ? !["staff", "admin"].includes(effectiveRole) : effectiveRole !== "student")
    ) {
      const actualRole = effectiveRole === "staff" || effectiveRole === "admin"
        ? "Staff"
        : "Student";
      const expectedLogin = actualRole === "Staff" ? "Staff / Resolver" : "Student";
      throw new Error(`This account is registered as a ${actualRole} account. Please select ${expectedLogin} Login.`);
    }
    localStorage.setItem("campusPulseToken", token);
    const profile = { ...user, role: effectiveRole };
    setProfile(profile);
    setAuthError("");
    setAuthFeedback(`Welcome back, ${user.name.split(/\s+/)[0] || user.name}.`);
    return profile;
  };

  const signup = (details) => apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(details),
  });

  const logout = () => {
    clearAuthentication();
    setIsAuthLoading(false);
  };

  const saveProfile = async (nextProfile) => {
    const { user } = await apiRequest("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ name: nextProfile.name }),
    });
    setProfile(user);
    return user;
  };

  const saveSettings = (nextSettings) => {
    localStorage.setItem("campusPulseSettings", JSON.stringify(nextSettings));
    setSettings(nextSettings);
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        settings,
        saveProfile,
        saveSettings,
        login,
        signup,
        logout,
        isAuthLoading,
        authError,
        authFeedback,
        clearAuthFeedback,
        refreshProfile,
      }}
    >
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
