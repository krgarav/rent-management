'use client'

import { useAuth } from '@/providers/auth-provider'
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { Trash2, CheckCircle } from 'lucide-react'

export default function NotificationsPage() {
  const { user } = useAuth()

  if (!user) {
    return <div className="text-center py-12">Access denied</div>
  }

  const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === user.id)

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20'
      case 'warning':
        return 'bg-warning/10 border-warning/20'
      case 'error':
        return 'bg-destructive/10 border-destructive/20'
      default:
        return 'bg-info/10 border-info/20'
    }
  }

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-success'
      case 'warning':
        return 'border-l-4 border-l-warning'
      case 'error':
        return 'border-l-4 border-l-destructive'
      default:
        return 'border-l-4 border-l-info'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your property and payment alerts</p>
      </div>

      {/* Notification Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-primary">
          All Notifications
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          Unread
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {userNotifications.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No notifications at this time</p>
          </div>
        ) : (
          userNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border ${getNotificationBorderColor(notification.type)} ${getNotificationColor(notification.type)} p-4`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button className="p-2 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
