import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useStudent } from "../context/StudentContext";

function Signup() {
  const { signup } = useStudent();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!success) return undefined;
    const timeout = window.setTimeout(() => {
      navigate("/login", { replace: true, state: { message: success } });
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [success, navigate]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Check both fields and try again.");
      return;
    }
    if (form.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });
      setSuccess("Account created successfully. Please log in.");
      setIsSubmitting(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to create your account. Please try again.");
      setIsSubmitting(false);
    }
  };

  const passwordInput = (field, label, shown, toggleShown, autocomplete) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <span className="relative block">
        <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={shown ? "text" : "password"}
          name={field}
          autoComplete={autocomplete}
          required
          minLength={8}
          maxLength={128}
          value={form[field]}
          onChange={updateField(field)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="button"
          onClick={toggleShown}
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={shown}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          {shown ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );

  return (
    <AuthShell
      eyebrow="Join your campus community"
      title="Create your account"
      description="Use your account to report issues and follow campus updates."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-800">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Full name</span>
          <span className="relative block">
            <UserRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={form.name}
              onChange={updateField("name")}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Email</span>
          <span className="relative block">
            <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={updateField("email")}
              placeholder="you@college.edu"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </span>
        </label>
        {passwordInput("password", "Password", showPassword, () => setShowPassword((shown) => !shown), "new-password")}
        {passwordInput("confirmPassword", "Confirm password", showConfirmPassword, () => setShowConfirmPassword((shown) => !shown), "new-password")}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700">Account type</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "student", label: "Student" },
              { value: "staff", label: "Staff / Resolver" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                  role === option.value
                    ? "border-primary-700 bg-blue-50 text-primary-800"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => {
                    setRole(option.value);
                    setError("");
                  }}
                  className="accent-primary-700"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-xs text-gray-500">Use at least 8 characters for your password.</p>
        {(error || success) && (
          <p role={error ? "alert" : "status"} className={`rounded-lg border px-3 py-2.5 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
            {error || success}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Signup;
