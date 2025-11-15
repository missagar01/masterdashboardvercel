'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { CreditCard, Users, TrendingUp, AlertCircle } from 'lucide-react'

const subscriptionData = [
  { month: 'Jan', active: 1200, revenue: 240000 },
  { month: 'Feb', active: 1350, revenue: 270000 },
  { month: 'Mar', active: 1480, revenue: 296000 },
  { month: 'Apr', active: 1620, revenue: 324000 },
  { month: 'May', active: 1750, revenue: 350000 },
  { month: 'Jun', active: 1890, revenue: 378000 },
]

const allSubscribersData = [
  { id: 'SUB001', name: 'John Doe', plan: 'Premium', amount: '₹999/mo', date: '2025-11-01', status: 'Active' },
  { id: 'SUB002', name: 'Jane Smith', plan: 'Standard', amount: '₹499/mo', date: '2025-11-02', status: 'Active' },
  { id: 'SUB003', name: 'Mike Johnson', plan: 'Premium', amount: '₹999/mo', date: '2025-11-05', status: 'Active' },
  { id: 'SUB004', name: 'Sarah Lee', plan: 'Basic', amount: '₹299/mo', date: '2025-11-06', status: 'Cancelled' },
  { id: 'SUB005', name: 'Alex Brown', plan: 'Premium', amount: '₹999/mo', date: '2025-11-08', status: 'Active' },
]

const activeSubscribers = allSubscribersData.filter(s => s.status === 'Active')

export default function SubscriptionDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allSubscribersData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allSubscribersData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.date.includes(filters.month))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscription FMS Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor subscription metrics and revenue</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Subscriptions', allSubscribersData)}>
          <StatCard
            title="Active Subscriptions"
            value="1,890"
            subtitle="Current"
            icon={CreditCard}
            trend={{ value: 8, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Total Subscribers', activeSubscribers)}>
          <StatCard
            title="Total Subscribers"
            value="2,456"
            subtitle="All time"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Monthly Revenue"
          value="₹37.8L"
          subtitle="This month"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Churn Rate"
          value="2.3%"
          subtitle="Monthly"
          icon={AlertCircle}
          trend={{ value: 1, isPositive: true }}
          backgroundColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Active Subscriptions Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'plan', label: 'Plan' },
          { key: 'amount', label: 'Amount' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </div>
  )
}
