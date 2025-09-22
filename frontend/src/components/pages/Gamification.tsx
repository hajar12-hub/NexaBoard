import React, { useState } from 'react'
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

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Task Master',
    description: 'Complete 10 tasks on time',
    icon: 'checkCircle',
    color: 'bg-green-500',
    rarity: 'common',
    earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    progress: 10,
    maxProgress: 10
  },
  {
    id: '2',
    name: 'Top Contributor',
    description: 'Be the top contributor of the week',
    icon: 'crown',
    color: 'bg-yellow-500',
    rarity: 'legendary',
    earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    progress: 1,
    maxProgress: 1
  },
  {
    id: '3',
    name: 'Speed Demon',
    description: 'Complete 5 tasks in one day',
    icon: 'zap',
    color: 'bg-red-500',
    rarity: 'rare',
    progress: 3,
    maxProgress: 5
  },
  {
    id: '4',
    name: 'Team Player',
    description: 'Help 3 team members this week',
    icon: 'users',
    color: 'bg-green-500',
    rarity: 'common',
    progress: 2,
    maxProgress: 3
  },
  {
    id: '5',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day active streak',
    icon: 'flame',
    color: 'bg-red-500',
    rarity: 'epic',
    earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    progress: 7,
    maxProgress: 7
  }
]

const mockUserStats: UserStats[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'admin',
    totalPoints: 2450,
    level: 12,
    currentXP: 250,
    nextLevelXP: 300,
    badges: mockBadges.filter(b => b.earnedAt),
    achievements: [],
    streak: 14,
    tasksCompleted: 45,
    projectsContributed: 8,
    rank: 1
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    role: 'manager',
    totalPoints: 2380,
    level: 11,
    currentXP: 180,
    nextLevelXP: 200,
    badges: mockBadges.filter(b => b.earnedAt).slice(0, 2),
    achievements: [],
    streak: 12,
    tasksCompleted: 42,
    projectsContributed: 6,
    rank: 2
  },
  {
    id: '3',
    name: 'Mike Chen',
    role: 'member',
    totalPoints: 2100,
    level: 10,
    currentXP: 100,
    nextLevelXP: 200,
    badges: mockBadges.filter(b => b.earnedAt).slice(0, 1),
    achievements: [],
    streak: 8,
    tasksCompleted: 38,
    projectsContributed: 5,
    rank: 3
  },
  {
    id: '4',
    name: 'Emma Davis',
    role: 'member',
    totalPoints: 1850,
    level: 9,
    currentXP: 50,
    nextLevelXP: 200,
    badges: mockBadges.filter(b => b.earnedAt).slice(1, 2),
    achievements: [],
    streak: 5,
    tasksCompleted: 32,
    projectsContributed: 4,
    rank: 4
  },
  {
    id: '5',
    name: 'John Smith',
    role: 'member',
    totalPoints: 1620,
    level: 8,
    currentXP: 120,
    nextLevelXP: 200,
    badges: [],
    achievements: [],
    streak: 3,
    tasksCompleted: 28,
    projectsContributed: 3,
    rank: 5
  }
]

export function Gamification() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('overview')
  
  const currentUser = mockUserStats.find(u => u.name === user?.name) || mockUserStats[0]
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
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {currentUser.level}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{currentUser.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium">{currentUser.totalPoints} points</span>
                        <Badge className="flex items-center gap-1">
                          {getRankIcon(currentUser.rank)}
                          Rank #{currentUser.rank}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level {currentUser.level} Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {currentUser.currentXP}/{currentUser.nextLevelXP} XP
                      </span>
                    </div>
                    <Progress value={(currentUser.currentXP / currentUser.nextLevelXP) * 100} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Tasks Done</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-2">
                        <Flame className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser.streak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-2">
                        <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="font-medium text-sm">{currentUser.projectsContributed}</div>
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
                        <span className="text-sm text-muted-foreground">75/100 tasks</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Team Collaboration</span>
                        <span className="text-sm text-muted-foreground">88%</span>
                      </div>
                      <Progress value={88} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Quality Score</span>
                        <span className="text-sm text-muted-foreground">92%</span>
                      </div>
                      <Progress value={92} />
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
                    {currentUser.badges.slice(0, 3).map((badge) => (
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
                      <span className="text-sm text-muted-foreground">12/15</span>
                    </div>
                    <Progress value={80} />
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
                {mockUserStats.map((user, index) => (
                  <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg border ${user.id === currentUser.id ? 'bg-primary/5 border-primary/20' : 'border-border'}`}>
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant="outline" className="text-xs">{user.role}</Badge>
                        {user.id === currentUser.id && <Badge className="text-xs">You</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Level {user.level}</span>
                        <span>{user.totalPoints} points</span>
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">#{user.rank}</div>
                      <div className="text-xs text-muted-foreground">{user.badges.length} badges</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBadges.map((badge) => (
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