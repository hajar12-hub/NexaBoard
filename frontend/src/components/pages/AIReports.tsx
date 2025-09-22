import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, FileText, Download } from 'lucide-react'
import { aiInsights, projects, members } from '../../data/mockData'

const productivityData = [
  { month: 'Jan', score: 82, tasks: 45 },
  { month: 'Feb', score: 87, tasks: 52 },
  { month: 'Mar', score: 91, tasks: 48 },
  { month: 'Apr', score: 85, tasks: 56 },
  { month: 'May', score: 89, tasks: 51 },
  { month: 'Jun', score: 93, tasks: 58 }
]

const teamPerformance = [
  { name: 'Alice Martin', efficiency: 94, completed: 28 },
  { name: 'Bob Durand', efficiency: 87, completed: 32 },
  { name: 'Claire Moreau', efficiency: 91, completed: 24 },
  { name: 'David Chen', efficiency: 88, completed: 19 },
  { name: 'Emma Wilson', efficiency: 92, completed: 35 }
]

const projectDistribution = [
  { name: 'Mobile Application', value: 35, color: '#8884d8' },
  { name: 'Corporate Website', value: 25, color: '#82ca9d' },
  { name: 'Analytics Dashboard', value: 20, color: '#ffc658' },
  { name: 'REST API', value: 20, color: '#ff7300' }
]

export function AIReports() {
  const generateReport = () => {
    // Simulate report generation
    console.log('Generating AI report...')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>AI Reports</h1>
          <p className="text-muted-foreground">Automated analysis and insights on your team's productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={generateReport}>
            <Brain className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* AI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Global AI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{aiInsights.productivity.score}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">{aiInsights.productivity.trend}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detected Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{aiInsights.risks.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiInsights.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">Suggested actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deadline Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground">On-time delivery</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Productivity Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Productivity Evolution</CardTitle>
                <p className="text-sm text-muted-foreground">Productivity score and completed tasks</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Efficiency by member</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Project Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution by Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {projectDistribution.map((project, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.value}% of time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">Excellent Performance</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      The team maintains 87% productivity, exceeding the 85% target.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Positive Trend</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Consistent 5% improvement over recent weeks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">Areas of Focus</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Uneven workload distribution among team members.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detected Risks */}
            <Card>
              <CardHeader>
                <CardTitle>Identified Risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.risks.map((risk, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertTriangle className={`w-5 h-5 ${
                      risk.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{risk.project}</div>
                      <div className="text-sm text-muted-foreground">{risk.risk}</div>
                    </div>
                    <Badge variant={risk.severity === 'high' ? 'destructive' : 'secondary'}>
                      {risk.severity === 'high' ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deadline Predictions</CardTitle>
                <p className="text-sm text-muted-foreground">Based on AI analysis of current performance</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => {
                  const predictedCompletion = Math.min(100, project.progress + Math.random() * 20)
                  const onTime = predictedCompletion >= 95
                  
                  return (
                    <div key={project.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant={onTime ? 'default' : 'destructive'}>
                          {onTime ? 'On Time' : 'Delayed'}
                        </Badge>
                      </div>
                      <Progress value={predictedCompletion} className="mb-2" />
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Prediction: {Math.round(predictedCompletion)}%</span>
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Team Capacity</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    The team can handle 15-20 additional tasks this month without overload.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Opportunities</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    12% optimization possible by reorganizing tasks by skills.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Future Trends</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    8% productivity increase expected next month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">Priority actions to optimize performance</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p>{recommendation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">High priority</Badge>
                        <span className="text-xs text-muted-foreground">Estimated impact: +3% productivity</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                ))}

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div className="flex-1">
                    <p>Schedule team training session on new technologies</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Medium priority</Badge>
                      <span className="text-xs text-muted-foreground">Estimated impact: +5% long-term productivity</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}