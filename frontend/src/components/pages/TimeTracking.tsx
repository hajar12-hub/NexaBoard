import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Play, Pause, Clock, Calendar, TrendingUp, User } from 'lucide-react'
import { timeEntries, members, activityHeatmap } from '../../data/mockData'

export function TimeTracking() {
  const totalHoursThisWeek = timeEntries.reduce((acc, entry) => acc + entry.hours, 0)
  const averageHoursPerDay = totalHoursThisWeek / 7

  const getMemberStats = () => {
    return members.map(member => {
      const memberEntries = timeEntries.filter(entry => entry.member === member.name)
      const totalHours = memberEntries.reduce((acc, entry) => acc + entry.hours, 0)
      return {
        ...member,
        totalHours,
        entries: memberEntries.length
      }
    })
  }

  const renderHeatmapCell = (value: number) => {
    const intensity = value / 4
    return (
      <div 
        key={Math.random()} 
        className={`w-3 h-3 rounded-sm ${
          value === 0 ? 'bg-muted' :
          intensity <= 0.25 ? 'bg-green-200 dark:bg-green-900' :
          intensity <= 0.5 ? 'bg-green-300 dark:bg-green-800' :
          intensity <= 0.75 ? 'bg-green-400 dark:bg-green-700' :
          'bg-green-500 dark:bg-green-600'
        }`}
        title={`${value} heures`}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Time Tracking</h1>
          <p className="text-muted-foreground">Analyze time spent on your projects and tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="this-week">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Start Timer
          </Button>
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursThisWeek}h</div>
            <p className="text-xs text-muted-foreground">Entire team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoursPerDay.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">+3% this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeEntries.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{entry.task}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.member} • {entry.project}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{entry.hours}h</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Member Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getMemberStats().map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{member.name}</span>
                      <span className="text-sm text-muted-foreground">{member.totalHours}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (member.totalHours / 20) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {member.entries} entries this week
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize team activity throughout the year
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Heatmap Grid */}
            <div className="grid grid-cols-53 gap-1 max-w-full overflow-x-auto">
              {activityHeatmap.slice(0, 365).map((day, index) => 
                renderHeatmapCell(day.value)
              )}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div 
                      key={level}
                      className={`w-2 h-2 rounded-sm ${
                        level === 0 ? 'bg-muted' :
                        level === 1 ? 'bg-green-200 dark:bg-green-900' :
                        level === 2 ? 'bg-green-300 dark:bg-green-800' :
                        level === 3 ? 'bg-green-400 dark:bg-green-700' :
                        'bg-green-500 dark:bg-green-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {activityHeatmap.filter(d => d.value > 0).length} active days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Time Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Time by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Mobile Application', 'Corporate Website', 'Analytics Dashboard', 'REST API'].map((project) => {
              const projectEntries = timeEntries.filter(entry => entry.project === project)
              const totalHours = projectEntries.reduce((acc, entry) => acc + entry.hours, 0)
              
              return (
                <div key={project} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{project}</span>
                    <span className="text-sm text-muted-foreground">{totalHours}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(totalHours / totalHoursThisWeek) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((totalHours / totalHoursThisWeek) * 100)}% of total time
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}