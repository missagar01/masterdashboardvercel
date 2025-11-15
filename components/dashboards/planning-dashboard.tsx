'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

const weekData = [
  { week: 'Week 1', target: 100, actual: 95 },
  { week: 'Week 2', target: 100, actual: 102 },
  { week: 'Week 3', target: 100, actual: 98 },
  { week: 'Week 4', target: 100, actual: 105 },
  { week: 'Week 5', target: 100, actual: 103 },
  { week: 'Week 6', target: 100, actual: 107 },
]

const goalData = [
  { goal: 'Revenue', progress: 85 },
  { goal: 'Customer Retention', progress: 92 },
  { goal: 'Team Productivity', progress: 78 },
  { goal: 'Market Share', progress: 65 },
]

const allGoalsData = [
  { id: 'G001', goal: 'Revenue', category: 'Sales', target: '₹100L', actual: '₹85L', progress: 85, status: 'On Track' },
  { id: 'G002', goal: 'Customer Retention', category: 'Marketing', target: '95%', actual: '92%', progress: 92, status: 'On Track' },
  { id: 'G003', goal: 'Team Productivity', category: 'Operations', target: '100%', actual: '78%', progress: 78, status: 'At Risk' },
  { id: 'G004', goal: 'Market Share', category: 'Strategy', target: '30%', actual: '19.5%', progress: 65, status: 'At Risk' },
  { id: 'G005', goal: 'Customer Satisfaction', category: 'Service', target: '90%', actual: '88%', progress: 88, status: 'On Track' },
]

const onTrackGoals = allGoalsData.filter(g => g.status === 'On Track')
const atRiskGoals = allGoalsData.filter(g => g.status === 'At Risk')

export default function PlanningDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allGoalsData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allGoalsData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.category.toLowerCase().includes(filters.month.toLowerCase()))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.goal.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">12 Week Planning Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track quarterly goals and strategic objectives</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Goals', allGoalsData)}>
          <StatCard
            title="Active Goals"
            value="12"
            subtitle="Current quarter"
            icon={Target}
            trend={{ value: 2, isPositive: true }}
            backgroundColor="bg-purple-50"
            iconColor="text-purple-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('On Track Goals', onTrackGoals)}>
          <StatCard
            title="On Track"
            value="9"
            subtitle="Meeting targets"
            icon={CheckCircle}
            trend={{ value: 1, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('At Risk Goals', atRiskGoals)}>
          <StatCard
            title="At Risk"
            value="2"
            subtitle="Needs attention"
            icon={AlertCircle}
            trend={{ value: 1, isPositive: false }}
            backgroundColor="bg-orange-50"
            iconColor="text-orange-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Completion"
          value="87%"
          subtitle="Overall progress"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          backgroundColor="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalData.map((goal) => (
              <div key={goal.goal}>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{goal.goal}</p>
                  <p className="text-sm font-semibold text-primary">{goal.progress}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        columns={[
          { key: 'id', label: 'Goal ID' },
          { key: 'goal', label: 'Goal' },
          { key: 'category', label: 'Category' },
          { key: 'target', label: 'Target' },
          { key: 'actual', label: 'Actual' },
          { key: 'progress', label: 'Progress %' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </div>
  )
}
