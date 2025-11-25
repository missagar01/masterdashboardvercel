'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import DataModal from '../data-modal'
import { ClipboardList, CreditCard, Home, RotateCcw, Users } from 'lucide-react'
import { SUBSCRIPTION_API_BASE } from '@/lib/apiEndpoints'

type SubscriptionRow = {
  id?: number
  timestamp?: string
  subscriptionNo?: string
  companyName?: string
  subscriberName?: string
  subscriptionName?: string
  price?: string
  frequency?: string
  purpose?: string
  planned1?: string | null
  actual1?: string | null
  timeDelay1?: any
  renewalStatus?: string | null
  renewalCount?: number | string | null
  planned2?: string | null
  actual2?: string | null
  timeDelay2?: any
  approvalStatus?: string | null
  planned3?: string | null
  actual3?: string | null
  timeDelay3?: any
  startDate?: string | null
  endDate?: string | null
  planned_1?: string | null
  planned_2?: string | null
  planned_3?: string | null
  actual_1?: string | null
  actual_2?: string | null
  actual_3?: string | null
  timeDelay_1?: any
  timeDelay_2?: any
  timeDelay_3?: any
}

type RenewalRow = {
  price?: string
}

type DashboardResponse = {
  subscriptionSheet?: SubscriptionRow[]
  renewalSheet?: RenewalRow[]
} | SubscriptionRow[]

const DASHBOARD_ENDPOINT = `${SUBSCRIPTION_API_BASE}/api/dashboard-routes/dashboard-all`

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 1,
}).format

const statusPalette: Record<string, string> = {
  Created: '#3b82f6',
  Active: '#10b981',
  Renewal: '#f59e0b',
  Approved: '#6366f1',
  Rejected: '#ef4444',
  Ended: '#8b5cf6',
  Expired: '#f97316',
}

function toNumber(value?: string) {
  if (!value) return 0
  const numeric = Number.parseInt(value.toString().replace(/[^\d.-]/g, ''), 10)
  return Number.isNaN(numeric) ? 0 : numeric
}

function getStatus(row: SubscriptionRow): string {
  const planned1 = row.planned1 ?? row.planned_1
  const planned2 = row.planned2 ?? row.planned_2
  const planned3 = row.planned3 ?? row.planned_3
  const actual1 = row.actual1 ?? row.actual_1
  const actual2 = row.actual2 ?? row.actual_2
  const actual3 = row.actual3 ?? row.actual_3

  if (row.renewalStatus !== 'Renewed' && planned2 && !actual2) return 'Created'
  if (row.renewalStatus === 'Renewed' && planned2 && !actual2) return 'Renewal'
  if (!planned3 && actual2) return 'Rejected'
  if (planned3 && !actual3) return 'Approved'
  if (row.endDate && new Date(row.endDate) > new Date()) return 'Active'
  if (planned1 && !actual1) return 'Ended'
  if (planned1 && actual1 && row.renewalStatus !== 'Renewed') return 'Expired'
  return ''
}

export default function SubscriptionDashboard() {
  const [sheets, setSheets] = useState<DashboardResponse>({ subscriptionSheet: [], renewalSheet: [] })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<SubscriptionRow[]>([])
  const [modalTitle, setModalTitle] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(DASHBOARD_ENDPOINT, { signal: controller.signal, cache: 'no-store' })
        let data: DashboardResponse = { subscriptionSheet: [], renewalSheet: [] }
        if (res.ok) {
          const incoming = (await res.json()) as DashboardResponse
          data = Array.isArray(incoming) ? { subscriptionSheet: incoming, renewalSheet: [] } : incoming
        }
        setSheets({
          subscriptionSheet: Array.isArray(data.subscriptionSheet) ? data.subscriptionSheet : [],
          renewalSheet: Array.isArray(data.renewalSheet) ? data.renewalSheet : [],
        })
      } catch (err) {
        console.error('Failed to load subscription dashboard', err)
        setSheets({ subscriptionSheet: [], renewalSheet: [] })
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const filteredSubscriptions = useMemo(() => sheets.subscriptionSheet || [], [sheets.subscriptionSheet])

  const stats = useMemo(() => {
    const totalSubscriptions = filteredSubscriptions.length
    const activeSubscriptions = filteredSubscriptions.filter((row) => getStatus(row) === 'Active').length
    const pendingApprovals = filteredSubscriptions.filter(
      (row) => (row.actual2 ?? row.actual_2 ?? '') === '' && (row.planned2 ?? row.planned_2)
    ).length
    const pendingPayments = filteredSubscriptions.filter(
      (row) => (row.actual3 ?? row.actual_3 ?? '') === '' && (row.planned3 ?? row.planned_3)
    ).length
    const pendingRenewals = filteredSubscriptions.filter(
      (row) => (row.actual1 ?? row.actual_1 ?? '') === '' && (row.planned1 ?? row.planned_1)
    ).length

    const totalValue = filteredSubscriptions.reduce((acc, row) => {
      const renewalCount = Number.isNaN(Number.parseInt(row.renewalCount || '', 10))
        ? 1
        : Number.parseInt(row.renewalCount || '0', 10) + 1
      return acc + toNumber(row.price) * renewalCount
    }, 0)

    const totalRenewalValue = (sheets.renewalSheet || []).reduce((acc, row) => acc + toNumber(row.price), 0)

    return {
      totalSubscriptions,
      activeSubscriptions,
      pendingApprovals,
      pendingPayments,
      pendingRenewals,
      totalValue,
      totalRenewalValue,
    }
  }, [filteredSubscriptions, sheets.renewalSheet])

  const chartData = useMemo(() => {
    const statusBuckets: Record<string, number> = {}
    filteredSubscriptions.forEach((row) => {
      const status = getStatus(row) || 'Unknown'
      statusBuckets[status] = (statusBuckets[status] || 0) + 1
    })
    return Object.entries(statusBuckets).map(([status, subscriptions]) => ({
      status,
      subscriptions,
      color: statusPalette[status] || '#94a3b8',
    }))
  }, [filteredSubscriptions])

  const monthlySeries = useMemo(() => {
    const monthMap: Record<string, { month: string; active: number; revenue: number }> = {}

    filteredSubscriptions.forEach((row) => {
      const dateStr = row.startDate || row.timestamp || ''
      const dt = dateStr ? new Date(dateStr) : null
      const monthIndex = dt && !Number.isNaN(dt.getTime()) ? dt.getMonth() : -1
      const monthLabel = monthIndex >= 0 ? monthOrder[monthIndex] : 'N/A'
      if (!monthMap[monthLabel]) monthMap[monthLabel] = { month: monthLabel, active: 0, revenue: 0 }
      monthMap[monthLabel].active += getStatus(row) === 'Active' ? 1 : 0
      monthMap[monthLabel].revenue += toNumber(row.price)
    })

    const series = Object.values(monthMap)
    return series.length
      ? series.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
      : monthOrder.slice(0, 6).map((m) => ({ month: m, active: 0, revenue: 0 }))
  }, [filteredSubscriptions])

  const costlySubscriptions = useMemo(() => {
    return [...filteredSubscriptions]
      .sort((a, b) => toNumber(b.price) - toNumber(a.price))
      .slice(0, 5)
  }, [filteredSubscriptions])

  const modalRows = useMemo(
    () =>
      filteredSubscriptions.map((row) => ({
        id: row.subscriptionNo || row.id?.toString() || '—',
        name: row.subscriberName || '—',
        plan: row.subscriptionName || '—',
        amount: currencyFormatter(toNumber(row.price)),
        startDate: row.startDate || '—',
        status: getStatus(row) || '—',
      })),
    [filteredSubscriptions]
  )

  const handleStatCardClick = (title: string, subset: SubscriptionRow[]) => {
    setModalTitle(title)
    setModalData(subset)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 bg-[rgb(243,239,255)]/70 rounded-3xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white shadow-sm rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-3 text-primary">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <p className="text-xl font-semibold text-foreground">View your subscription analytics</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white shadow-sm rounded-2xl px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-semibold">
            📅
          </span>
          <span>Pick date range</span>
        </div>
        <div className="ml-auto text-muted-foreground text-xs">Live data from dashboard API</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Values"
          value={loading ? '—' : currencyFormatter(stats.totalValue)}
          subtitle=""
          icon={CreditCard}
          backgroundColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Renewal Values"
          value={loading ? '—' : currencyFormatter(stats.totalRenewalValue)}
          subtitle=""
          icon={RotateCcw}
          backgroundColor="bg-violet-50"
          iconColor="text-violet-600"
        />
        <div onClick={() => handleStatCardClick('All Subscriptions', sheets.subscriptionSheet || [])} className="cursor-pointer">
          <StatCard
            title="Total Subscriptions"
            value={loading ? '—' : stats.totalSubscriptions.toString()}
            subtitle=""
            icon={ClipboardList}
            backgroundColor="bg-orange-50"
            iconColor="text-orange-600"
            onClick={() => {}}
          />
        </div>
        <div
          onClick={() => handleStatCardClick('Active Subscriptions', filteredSubscriptions.filter((row) => getStatus(row) === 'Active'))}
          className="cursor-pointer"
        >
          <StatCard
            title="Active Subscriptions"
            value={loading ? '—' : stats.activeSubscriptions.toString()}
            subtitle=""
            icon={Users}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
      </div>



      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 border-l-4 border-orange-300 rounded-md bg-white/90">
          <CardContent className="flex gap-3 items-center p-4">
            <ClipboardList className="text-orange-400" size={36} />
            <div>
              <p className="text-lg font-medium">Pending Approvals</p>
              <p className="text-sm text-muted-foreground">
                {stats.pendingApprovals || 'No'} Subscription{stats.pendingApprovals !== 1 && 's'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 border-l-4 border-green-500 rounded-md bg-white/90">
          <CardContent className="flex gap-3 items-center p-4">
            <CreditCard className="text-green-500" size={36} />
            <div>
              <p className="text-lg font-medium">Pending Payments</p>
              <p className="text-sm text-muted-foreground">
                {stats.pendingPayments || 'No'} Subscription{stats.pendingPayments !== 1 && 's'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 border-l-4 border-blue-500 rounded-md bg-white/90">
          <CardContent className="flex gap-3 items-center p-4">
            <RotateCcw className="text-blue-500" size={36} />
            <div>
              <p className="text-lg font-medium">Pending Renewals</p>
              <p className="text-sm text-muted-foreground">
                {stats.pendingRenewals || 'No'} Subscription{stats.pendingRenewals !== 1 && 's'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:flex gap-4">
        <Card className="w-full md:max-w-150 h-full gap-3 bg-white/90">
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="subscriptions"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={85}
                  label={(d) => d.status}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-3">
              {chartData.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-grow gap-0 bg-white/90">
          <CardHeader>
            <CardTitle>Top Subscription Costs</CardTitle>
          </CardHeader>
          <CardContent className="">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {costlySubscriptions.map((sub, idx) => (
                  <tr key={sub.subscriptionNo || idx} className="border-t">
                    <td className="py-2 text-primary font-semibold">{sub.subscriptionName || '—'}</td>
                    <td className="py-2 text-right">{currencyFormatter(toNumber(sub.price))}</td>
                  </tr>
                ))}
                {!costlySubscriptions.length && (
                  <tr>
                    <td className="py-2 text-muted-foreground" colSpan={2}>
                      No data to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalRows}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Subscriber' },
          { key: 'plan', label: 'Subscription' },
          { key: 'amount', label: 'Amount' },
          { key: 'startDate', label: 'Start Date' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </div>
  )
}
