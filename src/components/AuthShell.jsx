import React from "react";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f8fc] px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 flex items-center justify-center gap-3 text-gray-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white shadow-sm">
            <Activity size={23} />
          </span>
          <span>
            <span className="block text-lg font-semibold">Campus Pulse</span>
            <span className="block text-xs text-gray-500">Student Voice Platform</span>
          </span>
        </Link>
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md sm:p-8">
          <p className="mb-1 text-sm font-medium text-primary-700">{eyebrow}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
          <p className="mt-2 text-sm leading-5 text-gray-600">{description}</p>
          <div className="mt-6">{children}</div>
        </section>
        <p className="mt-5 text-center text-sm text-gray-600">{footer}</p>
      </div>
    </main>
  );
}

export default AuthShell;
