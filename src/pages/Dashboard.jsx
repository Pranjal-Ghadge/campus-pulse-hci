import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Building2, CheckCircle, CircleCheck, ClipboardList, Users, Wrench, MessageSquareText } from 'lucide-react';
import SecondaryActionCard from '../components/SecondaryActionCard';
import IssueCard from '../components/IssueCard';
import Button from '../components/Button';
import { useStudent } from '../context/StudentContext';
import { issueCategories, mockIssues, campusInfo, campusImpact } from '../data/mockIssues';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const studentName = profile.name || 'Student';
  const firstName = studentName.trim().split(/\s+/)[0] || 'Student';
  const categories = issueCategories.filter((category) =>
    ['problem', 'improvement', 'safety'].includes(category.id)
  );
  const recentIssues = mockIssues.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleActionClick = (category) => {
    navigate('/report', { state: { issueType: category.id } });
  };

  const handleIssueClick = (issue) => {
    navigate('/explore', { state: { category: issue.category } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-64">
        <main className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 lg:px-10 lg:pt-8">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-primary-700">
                <span className="h-2 w-2 rounded-full bg-primary-600" aria-hidden="true" />
                Campus Pulse <span className="text-gray-400">/</span> VJTI Mumbai
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {getGreeting()}, {firstName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">What would you like to improve on campus?</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => navigate('/notifications')}
                className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Bell size={19} />
              </button>
              <Button onClick={() => navigate('/report')}>
                Raise an Issue
              </Button>
            </div>
          </header>

          <section aria-label="Campus introduction" className="mb-7 overflow-hidden rounded-2xl border border-blue-200 bg-blue-100/70 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
                  <MessageSquareText size={24} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-blue-950">Your voice helps campus move forward</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-5 text-blue-900/80">
                    {campusImpact.studentVoices.toLocaleString()} students have shared feedback. Browse current issues or send a report to the team that can help.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => navigate('/explore')} className="shrink-0 border-blue-200 text-primary-800 hover:bg-white">
                Explore campus issues <ArrowRight size={15} className="ml-2" />
              </Button>
            </div>
          </section>

          <section aria-label="Campus summary" className="mb-9">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-primary-700" />
                <h2 className="text-lg font-semibold text-gray-900">Campus at a glance</h2>
              </div>
              <span className="hidden text-xs text-gray-500 sm:block">Community response</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active issues</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{campusInfo.activeIssues}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <ClipboardList size={20} />
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Open reports across campus
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Response rate</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{campusInfo.responseRate}%</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <Users size={20} />
                  </span>
                </div>
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100"
                  role="img"
                  aria-label={`${campusInfo.responseRate}% response rate`}
                >
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${campusInfo.responseRate}%` }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">Reports receiving a response</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved this month</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{campusImpact.issuesResolved}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <CircleCheck size={20} />
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  Campus reports completed
                </p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
              <Wrench size={14} />
              {campusInfo.departmentsInvolved} campus departments are responding to reports
            </p>
          </section>

          <section className="mb-9 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Choose how to contribute</h2>
                <p className="mt-1 text-sm text-gray-600">Select the option that best fits what you want to share.</p>
              </div>
              <span className="text-xs font-medium text-primary-800">Your report goes to the right campus team</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {categories.map((category) => (
                <SecondaryActionCard
                  key={category.id}
                  category={category}
                  onClick={() => handleActionClick(category)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent campus activity</h2>
                <p className="mt-1 text-sm text-gray-600">A few of the latest reports from students.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
                Explore issues <ArrowRight size={15} className="ml-1" />
              </Button>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {recentIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => handleIssueClick(issue)}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle size={14} className="text-green-700" />
              Campus updates are shared with the relevant departments.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
