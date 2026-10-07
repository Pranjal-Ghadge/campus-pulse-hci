import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, TrendingUp, CheckCircle, Users, Building2, ArrowRight, Activity } from 'lucide-react';
import Avatar from '../components/Avatar';
import PrimaryActionCard from '../components/PrimaryActionCard';
import SecondaryActionCard from '../components/SecondaryActionCard';
import IssueCard from '../components/IssueCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { useStudent } from '../context/StudentContext';
import { issueCategories, mockIssues, campusInfo, campusImpact } from '../data/mockIssues';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const studentName = profile.name || 'Student';

  const handleActionClick = (category) => {
    navigate('/report', { state: { issueType: category.id } });
  };

  const handleIssueClick = (issue) => {
    navigate('/explore', { state: { category: issue.category } });
  };

  const myIssues = mockIssues.filter(issue => 
    ['Reported', 'Under Review', 'Assigned', 'In Progress'].includes(issue.status)
  );

  const trendingIssues = mockIssues.filter(issue => issue.trending).slice(0, 3);
  const recentIssues = mockIssues.slice(0, 6);

  const stats = {
    open: myIssues.length,
    inProgress: mockIssues.filter(i => i.status === 'In Progress').length,
    resolved: mockIssues.filter(i => i.status === 'Resolved').length,
    awaitingVerification: mockIssues.filter(i => i.status === 'Student Verification').length,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const primaryCategory = issueCategories.find(cat => cat.primary);
  const secondaryCategories = issueCategories.filter(cat => !cat.primary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="lg:ml-72">
        {/* Main Content */}
        <main className="p-4 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {getGreeting()}, {studentName}
                </h1>
                <p className="text-lg text-gray-600">
                  Make your campus better, one voice at a time.
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button type="button" aria-label="Open notifications" onClick={() => navigate('/notifications')} className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors">
                  <Bell size={24} className="text-gray-700" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <Avatar alt={studentName} size="md" />
              </div>
            </div>
          </div>

          {/* Campus Pulse Hero Section */}
          <section className="mb-10">
            <Card elevated className="p-8 bg-gradient-to-r from-primary-600 to-primary-500 border-0 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-3">Your voice matters.</h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {campusImpact.studentVoices.toLocaleString()} students have contributed to making our campus better this month.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => handleActionClick(primaryCategory)}>
                      Raise an Issue
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/explore')} className="text-white hover:bg-white/20 border border-white/30">
                      Explore Campus Issues
                    </Button>
                  </div>
                </div>
                <div className="flex-shrink-0 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                    <TrendingUp size={24} className="text-white" />
                    <div className="text-left">
                      <p className="text-3xl font-bold">{campusImpact.issuesResolved}</p>
                      <p className="text-sm text-white/90">issues resolved this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Your Campus Section */}
          <section className="mb-10">
            <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={24} className="text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Your Campus</h2>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">{campusInfo.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity size={18} />
                  <span>{campusInfo.activeIssues} active issues</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  <span>{campusInfo.departmentsInvolved} departments involved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle size={18} />
                  <span>{campusInfo.responseRate}% response rate</span>
                </div>
              </div>
            </Card>
          </section>

          {/* How can we help - Action Cards */}
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How can we help?</h2>
              <p className="text-gray-600">Choose what you want to share with the campus.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PrimaryActionCard
                category={primaryCategory}
                onClick={() => handleActionClick(primaryCategory)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {secondaryCategories.map((category) => (
                  <SecondaryActionCard
                    key={category.id}
                    category={category}
                    onClick={() => handleActionClick(category)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* What's happening on campus */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">What's happening on campus</h2>
                <p className="text-gray-600">Trending issues and campus updates</p>
              </div>
              <Button variant="ghost" onClick={() => navigate('/explore')} className="text-primary-600 hover:text-primary-700">
                View all <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => handleIssueClick(issue)}
                  showSupportButton={true}
                />
              ))}
            </div>
          </section>

          {/* Campus Impact */}
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campus Impact</h2>
              <p className="text-gray-600">This month's achievements</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card elevated className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{campusImpact.issuesResolved}</p>
                <p className="text-gray-600 font-medium">Issues resolved</p>
              </Card>

              <Card elevated className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-primary-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{campusImpact.studentVoices.toLocaleString()}</p>
                <p className="text-gray-600 font-medium">Student voices</p>
              </Card>

              <Card elevated className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={28} className="text-amber-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{campusImpact.improvementsMade}</p>
                <p className="text-gray-600 font-medium">Improvements made</p>
              </Card>
            </div>
          </section>

          {/* Your Activity */}
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Activity</h2>
              <p className="text-gray-600">Track your campus contributions</p>
            </div>
            
            <Card className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Open Issues</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.open}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.open / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">In Progress</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(stats.inProgress / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Resolved</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.resolved}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.resolved / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Awaiting Verification</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.awaitingVerification}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(stats.awaitingVerification / 10) * 100}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Recent Issues */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Issues</h2>
                <p className="text-gray-600">Latest reports from the campus community</p>
              </div>
              <Button variant="ghost" onClick={() => navigate('/explore')} className="text-primary-600 hover:text-primary-700">
                View all <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => handleIssueClick(issue)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
