import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bug, ChevronDown, LifeBuoy, Mail, Search } from "lucide-react";

const faqs = [
  {
    question: "How do I raise an issue?",
    answer: "Choose Raise an Issue in the sidebar, select a category, describe what happened, and add the campus location. You can include a photo or report anonymously before submitting.",
  },
  {
    question: "How can I track my issue?",
    answer: "Open My Issues to find your reports, tracking IDs, current status, and the latest progress update.",
  },
  {
    question: "Can I report anonymously?",
    answer: "Yes. Turn on Report anonymously on the issue form. Your name will not be shown publicly, and you will still receive a tracking ID.",
  },
  {
    question: "How long does resolution take?",
    answer: "Timing depends on the type of issue and the team responsible. You can follow status updates in My Issues as the team reviews and works on your report.",
  },
];

function Help() {
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);
  const visibleFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter(({ question, answer }) =>
      `${question} ${answer}`.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 pt-20 lg:ml-64 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-sky-600">Campus Pulse</p>
          <h1 className="text-2xl font-semibold text-slate-900">Help &amp; Support</h1>
          <p className="mt-2 text-slate-500">Find answers or get help from the campus support team.</p>
        </header>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
          <label htmlFor="help-search" className="mb-3 block text-lg font-semibold text-slate-900">
            Search help topics
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="help-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search questions and answers"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
            {visibleFaqs.map(({ question, answer }) => {
              const isOpen = openQuestion === question;
              const answerId = `faq-${faqs.indexOf(faqs.find((item) => item.question === question))}`;
              return (
                <div key={question} className="px-5 first:rounded-t-2xl last:rounded-b-2xl lg:px-6">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenQuestion(isOpen ? null : question)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-slate-800"
                  >
                    {question}
                    <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <p id={answerId} className="max-w-3xl pb-5 text-sm leading-6 text-slate-500">
                      {answer}
                    </p>
                  )}
                </div>
              );
            })}
            {visibleFaqs.length === 0 && (
              <p className="p-6 text-sm text-gray-500">No help topics match that search. Try a different phrase or contact support.</p>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <LifeBuoy size={20} />
            </div>
            <h2 className="font-semibold text-slate-900">Contact Campus Support</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Send our team a message if you need help with a campus issue or your account.</p>
            <a
              href="mailto:support@campus.edu?subject=Campus%20Pulse%20support"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              <Mail size={16} />
              Email Campus Support
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Bug size={20} />
            </div>
            <h2 className="font-semibold text-slate-900">Report a technical problem</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Let us know if a page, feature, or account action is not working as expected.</p>
            <Link
              to="/report"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              Open the issue form
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Help;