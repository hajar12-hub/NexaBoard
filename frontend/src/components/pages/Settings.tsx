import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Plus,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { ProtectedRoute } from '../ProtectedRoute'

export function Settings() {
  const { theme, setTheme, effectiveTheme } = useTheme()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="admin">Admin Settings</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-lg">
                    {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Change photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue={user?.name.split(' ')[0] || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue={user?.name.split(' ')[1] || ''} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={user?.role || 'member'} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Contact an administrator to change your role</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                  defaultValue="Passionate about technology and innovation."
                />
              </div>

              <Button>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Push notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive notifications in the browser</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Email notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive emails for important updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">New task assignments</h4>
                    <p className="text-xs text-muted-foreground">Notification when a task is assigned to you</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Project updates</h4>
                    <p className="text-xs text-muted-foreground">Notification for status changes</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">AI reports</h4>
                    <p className="text-xs text-muted-foreground">Weekly notification for automated reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your account security</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Change password</h4>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button variant="outline">Update password</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Two-factor authentication</h4>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Active sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">MacBook Pro - Chrome</p>
                        <p className="text-xs text-muted-foreground">Paris, France • Current session</p>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">iPhone - Safari</p>
                        <p className="text-xs text-muted-foreground">Paris, France • 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <p className="text-sm text-muted-foreground">Customize the application appearance</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Display mode</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50 ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="w-full h-8 bg-white border rounded mb-2 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-gray-600" />
                      </div>
                      <p className="text-xs text-center font-medium">Light</p>
                    </div>
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50 ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="w-full h-8 bg-gray-900 border rounded mb-2 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs text-center font-medium">Dark</p>
                    </div>
                    <div 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50 ${
                        theme === 'auto' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setTheme('auto')}
                    >
                      <div className="w-full h-8 bg-gradient-to-r from-white to-gray-900 border rounded mb-2 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-gray-600" />
                      </div>
                      <p className="text-xs text-center font-medium">Auto</p>
                    </div>
                  </div>
                  {theme === 'auto' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently using: <span className="font-medium capitalize">{effectiveTheme}</span> mode
                    </p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Language</h4>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Timezone</h4>
                  <Select defaultValue="america/new_york">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="europe/paris">Europe/Paris (GMT+1)</SelectItem>
                      <SelectItem value="asia/tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="australia/sydney">Australia/Sydney (GMT+11)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <p className="text-sm text-muted-foreground">Connect your favorite tools</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">S</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Slack</h4>
                      <p className="text-xs text-muted-foreground">Notifications in Slack</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">G</span>
                    </div>
                    <div>
                      <h4 className="font-medium">GitHub</h4>
                      <p className="text-xs text-muted-foreground">Issue synchronization</p>
                    </div>
                  </div>
                  <Badge>Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">J</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Jira</h4>
                      <p className="text-xs text-muted-foreground">Task import/export</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">F</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Figma</h4>
                      <p className="text-xs text-muted-foreground">Design synchronization</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">API</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Key</p>
                      <p className="text-xs text-muted-foreground">Programmatic access to your data</p>
                    </div>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  <div className="p-3 bg-muted rounded font-mono text-xs">
                    sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === 'admin' && (
          <TabsContent value="admin" className="space-y-6">
            <ProtectedRoute requiredRole="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Admin Settings
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">System-wide settings and user management</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">User Management</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Total Users</p>
                            <p className="text-sm text-muted-foreground">Active user accounts</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">23</div>
                            <Button variant="outline" size="sm" className="mt-1">
                              Manage Users
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">System Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Maintenance Mode</p>
                            <p className="text-xs text-muted-foreground">Restrict access during updates</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">User Registration</p>
                            <p className="text-xs text-muted-foreground">Allow new user signups</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-xs text-muted-foreground">System-wide email settings</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Data Management</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                          <Download className="w-5 h-5 mb-2" />
                          <span className="font-medium">Export Data</span>
                          <span className="text-xs text-muted-foreground">Download system backup</span>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                          <Trash2 className="w-5 h-5 mb-2" />
                          <span className="font-medium">Clear Cache</span>
                          <span className="text-xs text-muted-foreground">Reset system cache</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ProtectedRoute>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}