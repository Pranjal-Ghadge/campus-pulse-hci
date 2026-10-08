import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useStudent } from "../context/StudentContext";

function Login() {
  const { login } = useStudent();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(location.state?.message || "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const user = await login({ email: email.trim(), password, role: loginRole });
      navigate(location.state?.from?.pathname || (user.role === "staff" || user.role === "admin" ? "/staff" : "/dashboard"), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Campus Pulse"
      description="Sign in to follow campus issues and manage your reports."
      footer={<>New to Campus Pulse? <Link to="/signup" className="font-semibold text-primary-700 hover:text-primary-800">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="grid grid-cols-2 gap-2">
          <legend className="mb-1.5 text-sm font-medium text-gray-700">Login as</legend>
          {[
            { value: "student", label: "Student Login" },
            { value: "staff", label: "Staff/Resolver Login" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={loginRole === option.value}
              onClick={() => {
                setLoginRole(option.value);
                setError("");
              }}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${
                loginRole === option.value
                  ? "border-primary-700 bg-blue-50 text-primary-800"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </fieldset>
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Password</span>
          <span className="relative block">
            <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
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
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Login;
