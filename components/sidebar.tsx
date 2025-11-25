'use client'

import { cn } from '@/lib/utils'
import { Type as type, type LucideIcon, CheckSquare, Calendar, ShoppingCart, FileText, Wrench, Package, Zap, FileStack, BarChart3, CreditCard, Navigation, Menu, X } from 'lucide-react'
import { type CSSProperties, useMemo, useState } from 'react'

interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
  gradient: string
}

const sidebarItems: SidebarItem[] = [
  { id: 'checklist', label: 'Checklist & Delegation', icon: CheckSquare, gradient: 'gradient-purple' },
  { id: 'planning', label: '12 Week Planning', icon: Calendar, gradient: 'gradient-orange' },
  { id: 'purchase', label: 'Store Purchase', icon: ShoppingCart, gradient: 'gradient-yellow' },
  { id: 'enquiry', label: 'Enquiry Management', icon: FileText, gradient: 'gradient-teal' },
  { id: 'machine-maintenance', label: 'Machine Maintenance', icon: Wrench, gradient: 'gradient-purple' },
  { id: 'maintenance', label: 'Vehicle Maintenance', icon: Wrench, gradient: 'gradient-pink' },
  { id: 'o2d', label: 'O2D System', icon: Package, gradient: 'gradient-purple' },
  { id: 'documents', label: 'Documents', icon: FileStack, gradient: 'gradient-orange' },
  { id: 'billet', label: 'Billet Production', icon: BarChart3, gradient: 'gradient-yellow' },
  { id: 'repair', label: 'Repair System', icon: Zap, gradient: 'gradient-teal' },
  { id: 'subscription', label: 'Subscriptions', icon: CreditCard, gradient: 'gradient-pink' },
  { id: 'travel', label: 'Travel Management', icon: Navigation, gradient: 'gradient-purple' },
]

export default function Sidebar({ activeSystem, onSystemChange }: { activeSystem: string; onSystemChange: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sidebarSurfaceStyles = useMemo<CSSProperties>(
    () => ({
      backgroundColor: 'var(--color-sidebar)',
      color: 'var(--color-sidebar-foreground)',
    }),
    []
  )

  const sidebarHeaderStyles = useMemo<CSSProperties>(
    () => ({
      backgroundImage: 'linear-gradient(120deg, var(--color-primary) 0%, var(--color-accent) 100%)',
      color: 'var(--color-primary-foreground)',
    }),
    []
  )

  const NavigationItems = () => (
    <nav className="flex-1 space-y-2 overflow-y-auto p-4">
      {sidebarItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSystem === item.id
        return (
          <button
            key={item.id}
            onClick={() => {
              onSystemChange(item.id)
              setMobileMenuOpen(false)
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-md'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              isActive ? 'bg-sidebar-primary-foreground/20' : 'bg-sidebar-accent/50 group-hover:bg-sidebar-primary/20'
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-left flex-1">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-primary p-2 text-primary-foreground shadow-lg ring-1 ring-black/5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 lg:hidden"
        aria-label={mobileMenuOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar - Always visible on lg screens */}
      <div
        className="hidden w-64 flex-col border-r border-sidebar-border shadow-2xl lg:flex lg:sticky lg:top-0 lg:h-screen lg:self-start"
        style={sidebarSurfaceStyles}
      >
        {/* Header */}
        <div className="border-b border-sidebar-border p-6" style={sidebarHeaderStyles}>
          <div className="flex items-center gap-3">
            <div className="gradient-purple w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-bold text-xl">MD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Master Dashboard</h1>
              <p className="text-xs text-muted-foreground">12 Management Systems</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <NavigationItems />

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
            <div className="gradient-purple w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-sidebar-border shadow-2xl lg:hidden"
            style={sidebarSurfaceStyles}
          >
            {/* Header */}
            <div className="border-b border-sidebar-border p-6" style={sidebarHeaderStyles}>
              <div className="flex items-center gap-3">
              <div className="gradient-purple w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">MD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Master Dashboard</h1>
                <p className="text-xs text-muted-foreground">12 Systems</p>
              </div>
            </div>
          </div>

            {/* Navigation Items */}
            <NavigationItems />

            {/* Footer */}
            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                <div className="gradient-purple w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-sidebar-foreground truncate">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
