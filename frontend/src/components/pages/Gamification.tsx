import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Medal,
  Crown,
  Flame
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { tasksApi } from '../../services/tasksApi'
import { projectsApi } from '../../services/projectsApi'
import { usersApi } from '../../services/usersApi'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt?: Date
  progress?: number
  maxProgress?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  points: number
  badge?: Badge
  completedAt?: Date
  type: 'task' | 'collaboration' | 'consistency' | 'leadership'
}

interface UserStats {
  id: string
  name: string
  role: string
  totalPoints: number
  level: number
  currentXP: number
  nextLevelXP: number
  badges: Badge[]
  achievements: Achievement[]
  streak: number
  tasksCompleted: number
  projectsContributed: number
  rank: number
}

const BADGE_DEFINITIONS: (Omit<Badge, 'earnedAt'> & { rule: (tasks: number) => boolean })[] = [
  { id: '1', name: 'Task Master', description: 'Complete 10 tasks on time', icon: 'checkCircle', color: 'bg-green-500', rarity: 'common', progress: 0, maxProgress: 10, rule: (t) => t >= 10 },
  { id: '2', name: 'Top Contributor', description: 'Be the top contributor of the week', icon: 'crown', color: 'bg-yellow-500', rarity: 'legendary', progress: 0, maxProgress: 1, rule: () => false },
  { id: '3', name: 'Speed Demon', description: 'Complete 5 tasks in one day', icon: 'zap', color: 'bg-red-500', rarity: 'rare', progress: 0, maxProgress: 5, rule: () => false },
  { id: '4', name: 'Team Player', description: 'Help 3 team members this week', icon: 'users', color: 'bg-green-500', rarity: 'common', progress: 0, maxProgress: 3, rule: () => false },
  { id: '5', name: 'Streak Warrior', description: 'Maintain a 7-day active streak', icon: 'flame', color: 'bg-red-500', rarity: 'epic', progress: 0, maxProgress: 7, rule: () => false },
]

export function Gamification() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [allTasks, setAllTasks] = useState<{ userId: string; userName: string; done: number; total: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setIsLoading(true)
        const [users, projects, myTasks] = await Promise.all([
          usersApi.getAllUsers(),
          projectsApi.getAllProjects(),
          tasksApi.getUserTasks(user.id),
        ])
        const userTaskCounts = await Promise.all(
          users.map(async (u) => {
            try {
              const tasks = await tasksApi.getUserTasks(u.id)
              const done = tasks.filter((t) => t.status === 'DONE').length
              return { userId: u.id, userName: u.name, userRole: u.role, done, total: tasks.length }
            } catch {
              return { userId: u.id, userName: u.name, userRole: u.role, done: 0, total: 0 }
            }
          })
        )
        setAllTasks(userTaskCounts)

        const myProjects = projects.filter((p) => p.managerId === user.id || true)
        const pointsPerTask = 50
        const xpPerLevel = 200

        const stats: UserStats[] = userTaskCounts
          .map((ut, idx) => {
            const points = ut.done * pointsPerTask
            const level = Math.floor(points / xpPerLevel) + 1
            const currentXP = points % xpPerLevel
            const badges = BADGE_DEFINITIONS.filter((b) => b.rule(ut.done)).map((b) => ({
              ...b,
              earnedAt: new Date(),
              progress: b.maxProgress,
            }))
            return {
              id: ut.userId,
              name: ut.userName,
              role: ut.userRole,
              totalPoints: points,
              level,
              currentXP,
              nextLevelXP: xpPerLevel,
              badges,
              achievements: [],
              streak: Math.min(14, ut.done),
              tasksCompleted: ut.done,
              projectsContributed: myProjects.length,
              rank: 0,
            }
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((s, i) => ({ ...s, rank: i + 1 }))

        setUserStats(stats)
      } catch (error) {
        console.error('Error fetching gamification data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const currentUser = userStats.find((u) => u.id === user?.id || u.name === user?.name) || userStats[0]
  const displayBadges = BADGE_DEFINITIONS.map((b) => {
    const tasksDone = currentUser?.tasksCompleted ?? 0
    const earned = b.rule ? b.rule(tasksDone) : false
    return {
      ...b,
      progress: Math.min(tasksDone, b.maxProgress || 10),
      maxProgress: b.maxProgress || 10,
      earnedAt: earned ? new Date() : undefined,
    }
  })
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-green-400 bg-green-50 dark:bg-green-900'
      case 'rare': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900'
      case 'epic': return 'border-red-400 bg-red-50 dark:bg-red-900'
      case 'legendary': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900'
      default: return 'border-green-400 bg-green-50 dark:bg-green-900'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400 dark:text-white" />
      case 3: return <Medal className="w-5 h-5 text-yellow-600" />
      default: return <Trophy className="w-5 h-5 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "w-6 h-6 text-white" }
    switch (iconName) {
      case 'checkCircle': return <CheckCircle {...iconProps} />
      case 'crown': return <Crown {...iconProps} />
      case 'zap': return <Zap {...iconProps} />
      case 'users': return <Users {...iconProps} />
      case 'flame': return <Flame {...iconProps} />
      default: return <Star {...iconProps} />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Gamification</h1>
        <p className="text-muted-foreground">Track progress, earn badges, and compete with your team</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Progress */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {(currentUser?.name || user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {currentUser?.level ?? 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{currentUser?.name ?? user?.name ?? 'You'}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{currentUser?.role ?? user?.role ?? 'member'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium">{currentUser?.totalPoints ?? 0} points</span>
                        <Badge className="flex items-center gap-1">
                          {getRankIcon(currentUser?.rank ?? 0)}
                          Rank #{currentUser?.rank ?? '-'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level {currentUser?.level ?? 1} Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {currentUser?.currentXP ?? 0}/{currentUser?.nextLevelXP ?? 200} XP
                      </span>
                    </div>
                    <Progress value={((currentUser?.currentXP ?? 0) / (currentUser?.nextLevelXP ?? 200)) * 100} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser?.tasksCompleted ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Tasks Done</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-2">
                        <Flame className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser?.streak ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-2">
                        <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser?.projectsContributed ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Team Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Sprint Goal</span>
                        <span className="text-sm text-muted-foreground">
                          {userStats.reduce((a, u) => a + u.tasksCompleted, 0)}/{Math.max(100, userStats.reduce((a, u) => a + u.tasksCompleted, 0))} tasks
                        </span>
                      </div>
                      <Progress value={Math.min(100, (userStats.reduce((a, u) => a + u.tasksCompleted, 0) / 100) * 100)} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Team Collaboration</span>
                        <span className="text-sm text-muted-foreground">
                          {userStats.length > 0 ? Math.round((userStats.filter((u) => u.tasksCompleted > 0).length / userStats.length) * 100) : 0}%
                        </span>
                      </div>
                      <Progress value={userStats.length > 0 ? (userStats.filter((u) => u.tasksCompleted > 0).length / userStats.length) * 100 : 0} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Quality Score</span>
                        <span className="text-sm text-muted-foreground">
                          {userStats.reduce((a, u) => a + u.tasksCompleted, 0) > 0 ? '85%' : '0%'}
                        </span>
                      </div>
                      <Progress value={userStats.reduce((a, u) => a + u.tasksCompleted, 0) > 0 ? 85 : 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges & Recent Achievements */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(currentUser?.badges || []).slice(0, 3).map((badge) => (
                      <div key={badge.id} className={`p-3 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.color}`}>
                            {getIconComponent(badge.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                            {badge.earnedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Earned {badge.earnedAt.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Complete 15 tasks</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.min(currentUser?.tasksCompleted ?? 0, 15)}/15
                      </span>
                    </div>
                    <Progress value={Math.min(100, ((currentUser?.tasksCompleted ?? 0) / 15) * 100)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Help 5 teammates</span>
                      <span className="text-sm text-muted-foreground">3/5</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Maintain streak</span>
                      <span className="text-sm text-muted-foreground">7/7 days</span>
                    </div>
                    <Progress value={100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Team Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.map((u) => (
                  <div key={u.id} className={`flex items-center gap-4 p-4 rounded-lg border ${u.id === currentUser?.id ? 'bg-primary/5 border-primary/20' : 'border-border'}`}>
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(u.rank)}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{u.name}</h4>
                        <Badge variant="outline" className="text-xs">{u.role}</Badge>
                        {u.id === currentUser?.id && <Badge className="text-xs">You</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Level {u.level}</span>
                        <span>{u.totalPoints} points</span>
                        <span>{u.streak} day streak</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">#{u.rank}</div>
                      <div className="text-xs text-muted-foreground">{u.badges.length} badges</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayBadges.map((badge) => (
              <Card key={badge.id} className={`${getRarityColor(badge.rarity)} border-2`}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${badge.color}`}>
                      {getIconComponent(badge.icon)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                      <Badge variant="outline" className="mt-2 capitalize">
                        {badge.rarity}
                      </Badge>
                    </div>
                    
                    {badge.earnedAt ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <Progress value={(badge.progress! / badge.maxProgress!) * 100} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                All Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Task Master Achievement
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Completed 50 tasks this month</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>+100 points</Badge>
                      <span className="text-xs text-muted-foreground">Earned 2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Team Leader
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Led 3 successful projects</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>+200 points</Badge>
                      <span className="text-xs text-muted-foreground">Earned 1 week ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg opacity-60">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Collaboration Expert
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Help 20 team members (Progress: 12/20)</p>
                    <div className="mt-2">
                      <Progress value={60} />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg opacity-60">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Innovation Award
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Suggest 5 approved improvements</p>
                    <div className="mt-2">
                      <Progress value={40} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}