import { Type as type, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<any>
  trend?: {
    value: number
    isPositive: boolean
  }
  backgroundColor?: string
  iconColor?: string
  onClick?: () => void
  gradient?: string
  className?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  backgroundColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  onClick,
  gradient,
  className,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform',
        'hover:shadow-lg hover:scale-105 active:scale-95',
        gradient || backgroundColor,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground/80">{title}</p>
            <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(trend.value)}% from last month
              </div>
            )}
          </div>
          <div className={cn(
            'w-14 h-14 rounded-lg flex items-center justify-center transition-transform',
            isHovered && 'scale-110',
            backgroundColor
          )}>
            <Icon className={cn('w-7 h-7', iconColor)} />
          </div>
        </div>
      </div>
    </div>
  )
}
