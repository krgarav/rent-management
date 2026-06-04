'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { UserRole } from '@/types'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  DollarSign,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (!user) return null

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.TENANT],
    },
    {
      href: '/dashboard/properties',
      label: 'Properties',
      icon: Building2,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER],
    },
    {
      href: '/dashboard/tenants',
      label: 'Tenants',
      icon: Users,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER],
    },
    {
      href: '/dashboard/rent-payments',
      label: 'Rent Payments',
      icon: CreditCard,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.TENANT],
    },
    {
      href: '/dashboard/expenses',
      label: 'Expenses',
      icon: DollarSign,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER],
    },
    {
      href: '/dashboard/reports',
      label: 'Reports',
      icon: BarChart3,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER],
    },
    {
      href: '/dashboard/documents',
      label: 'Documents',
      icon: FileText,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.TENANT],
    },
    {
      href: '/dashboard/notifications',
      label: 'Notifications',
      icon: Bell,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.TENANT],
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
      roles: [UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.TENANT],
    },
  ]

  const filteredNav = navItems.filter(item => item.roles.includes(user.role))

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground">RentManager</h1>
          </div>

          {/* User Info */}
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {filteredNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border space-y-2 px-4 py-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-foreground hover:bg-secondary lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <h2 className="flex-1 text-lg font-semibold text-foreground md:ml-0 ml-4">
              {filteredNav.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
