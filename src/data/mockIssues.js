export const mockIssues = [
  {
    id: 1,
    title: "Library Wi-Fi keeps disconnecting",
    category: "Internet",
    location: "Central Library",
    status: "In Progress",
    supporters: 127,
    dateReported: "2024-09-25",
    description: "The Wi-Fi connection in the Central Library drops every 10-15 minutes, making it impossible to study effectively.",
    priority: "High",
    trending: true
  },
  {
    id: 2,
    title: "Broken AC in Lecture Hall 3",
    category: "Infrastructure",
    location: "Academic Block A",
    status: "Under Review",
    supporters: 45,
    dateReported: "2024-09-26",
    description: "The air conditioning in Lecture Hall 3 has been malfunctioning for the past week. Classrooms are getting too hot.",
    priority: "Medium",
    trending: true
  },
  {
    id: 3,
    title: "Need more vegetarian options in cafeteria",
    category: "Campus Life",
    location: "Main Cafeteria",
    status: "Reported",
    supporters: 89,
    dateReported: "2024-09-27",
    description: "The cafeteria has very limited vegetarian options, especially during lunch hours. Please add more variety.",
    priority: "Low",
    trending: true
  },
  {
    id: 4,
    title: "Insufficient parking spaces near Engineering Block",
    category: "Infrastructure",
    location: "Engineering Block",
    status: "Resolved",
    supporters: 156,
    dateReported: "2024-09-20",
    description: "Students are unable to find parking spaces near the Engineering Block during peak hours.",
    priority: "High",
    trending: false
  },
  {
    id: 5,
    title: "Broken chairs in Computer Lab 2",
    category: "Laboratory",
    location: "Computer Lab 2",
    status: "Assigned",
    supporters: 23,
    dateReported: "2024-09-28",
    description: "Several chairs in Computer Lab 2 are broken or have missing wheels, making it uncomfortable to work.",
    priority: "Medium",
    trending: false
  },
  {
    id: 6,
    title: "Appreciation for new study lounge",
    category: "Appreciation",
    location: "Student Center",
    status: "Resolved",
    supporters: 234,
    dateReported: "2024-09-15",
    description: "The new study lounge in the Student Center is excellent! Great ambiance, comfortable seating, and quiet environment.",
    priority: "Low",
    trending: false
  },
  {
    id: 7,
    title: "Poor lighting in the hostel corridor",
    category: "Infrastructure",
    location: "Hostel Block B",
    status: "In Progress",
    supporters: 67,
    dateReported: "2024-09-24",
    description: "The corridor lights in Hostel Block B are very dim and some flicker constantly. This is a safety concern at night.",
    priority: "High",
    trending: false
  },
  {
    id: 8,
    title: "Request for extended library hours during exams",
    category: "Library",
    location: "Central Library",
    status: "Under Review",
    supporters: 312,
    dateReported: "2024-09-22",
    description: "Library should stay open until 11 PM during exam weeks to help students prepare better.",
    priority: "Medium",
    trending: false
  }
];

export const issueCategories = [
  { id: 'problem', label: 'Report a Problem', icon: 'AlertTriangle', description: 'Report campus issues that need attention', primary: true },
  { id: 'improvement', label: 'Suggest Improvement', icon: 'Lightbulb', description: 'Share ideas to make campus better', primary: false },
  { id: 'safety', label: 'Safety Concern', icon: 'Shield', description: 'Report urgent safety-related issues', primary: false },
  { id: 'question', label: 'Ask a Question', icon: 'HelpCircle', description: 'Get answers about campus services', primary: false },
  { id: 'appreciation', label: 'Appreciation', icon: 'Star', description: 'Recognize positive campus experiences', primary: false }
];

export const statusFlow = [
  'Reported',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Student Verification'
];

export const campusInfo = {
  name: 'VJTI Mumbai',
  activeIssues: 12,
  departmentsInvolved: 8,
  responseRate: 94
};

export const campusImpact = {
  issuesResolved: 128,
  studentVoices: 2481,
  improvementsMade: 36
};
