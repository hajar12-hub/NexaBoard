export const projects = [
  { id: 1, name: 'Mobile Application', progress: 75, manager: 'Hajar Azaou', status: 'In Progress', deadline: '2024-01-15' },
  { id: 2, name: 'Corporate Website', progress: 45, manager: 'Anouar Azaou', status: 'In Progress', deadline: '2024-02-20' },
  { id: 3, name: 'Analytics Dashboard', progress: 90, manager: 'Malika Azaou', status: 'Review', deadline: '2024-01-10' },
  { id: 4, name: 'REST API', progress: 30, manager: 'Hanan Azaou', status: 'In Progress', deadline: '2024-03-01' }
]

export const tasks = [
  { id: 1, title: 'Finalize design system', assignee: 'Hajar Azaou', status: 'todo', project: 'Mobile Application', priority: 'high' },
  { id: 2, title: 'Integrate authentication API', assignee: 'Anouar Azaou', status: 'in-progress', project: 'Corporate Website', priority: 'medium' },
  { id: 3, title: 'Dashboard unit tests', assignee: 'Malika Azaou', status: 'review', project: 'Analytics Dashboard', priority: 'high' },
  { id: 4, title: 'API documentation', assignee: 'Hanan Azaou', status: 'done', project: 'REST API', priority: 'low' },
  { id: 5, title: 'Performance optimization', assignee: 'Abd Azaou', status: 'in-progress', project: 'Mobile Application', priority: 'medium' },
  { id: 6, title: 'Setup CI/CD pipeline', assignee: 'khadija Azaou', status: 'todo', project: 'Corporate Website', priority: 'high' }
]

export const members = [
  { id: 1, name: 'Hajar Azaou', email: 'hajar@startup.com', role: 'Lead Designer', avatar: '/api/placeholder/40/40', status: 'active', tasksCount: 8 },
  { id: 2, name: 'Anouar Azaou', email: 'anouar@startup.com', role: 'Full Stack Developer', avatar: '/api/placeholder/40/40', status: 'active', tasksCount: 12 },
  { id: 3, name: 'Malika Azaou', email: 'malika@startup.com', role: 'Frontend Developer', avatar: '/api/placeholder/40/40', status: 'active', tasksCount: 6 },
  { id: 4, name: 'Hanan Azaou', email: 'hanan@startup.com', role: 'Backend Developer', avatar: '/api/placeholder/40/40', status: 'away', tasksCount: 4 },
  { id: 5, name: 'Abd Azaou', email: 'abd@startup.com', role: 'Product Manager', avatar: '/api/placeholder/40/40', status: 'active', tasksCount: 15 }
]

export const timeEntries = [
  { id: 1, member: 'Hajar Azaou', task: 'Design System', project: 'Mobile Application', date: '2024-01-08', hours: 6.5 },
  { id: 2, member: 'Anouar Azaou', task: 'API Integration', project: 'Corporate Website', date: '2024-01-08', hours: 8 },
  { id: 3, member: 'Malika Azaou', task: 'Unit Tests', project: 'Analytics Dashboard', date: '2024-01-08', hours: 4 },
  { id: 4, member: 'Hanan Azaou', task: 'Documentation', project: 'REST API', date: '2024-01-08', hours: 3 },
  { id: 5, member: 'Abd Azaou', task: 'UI Components', project: 'Mobile Application', date: '2024-01-07', hours: 7 },
  { id: 6, member: 'Khadija Azaou', task: 'Database Setup', project: 'Corporate Website', date: '2024-01-07', hours: 5 }
]

export const aiInsights = {
  productivity: {
    score: 87,
    trend: '+5%',
    summary: "The team maintains an excellent level of productivity with consistent improvement in delivery timelines."
  },
  risks: [
    { project: 'Corporate Website', risk: 'Potential delay on deadline', severity: 'medium' },
    { project: 'REST API', risk: 'Lack of automated testing', severity: 'high' }
  ],
  recommendations: [
    'Increase test coverage for REST API project',
    'Review Corporate Website planning',
    'Organize pair programming session for Analytics Dashboard'
  ]
}

export const activityHeatmap = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
  value: Math.floor(Math.random() * 5)
}))