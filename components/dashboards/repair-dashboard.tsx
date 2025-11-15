'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Zap, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const repairData = [
  { month: 'Jan', initiated: 45, completed: 38 },
  { month: 'Feb', initiated: 52, completed: 48 },
  { month: 'Mar', initiated: 60, completed: 55 },
  { month: 'Apr', initiated: 58, completed: 52 },
  { month: 'May', initiated: 68, completed: 62 },
  { month: 'Jun', initiated: 75, completed: 70 },
]

const allRepairsData = [
  { id: 'REP001', equipment: 'Motor A', issue: 'Bearing Failure', date: '2025-11-01', status: 'Completed', cost: '₹25,000' },
  { id: 'REP002', equipment: 'Pump B', issue: 'Seal Leakage', date: '2025-11-02', status: 'Completed', cost: '₹18,000' },
  { id: 'REP003', equipment: 'Fan C', issue: 'Blade Damage', date: '2025-11-05', status: 'In Progress', cost: '₹12,000' },
  { id: 'REP004', equipment: 'Compressor D', issue: 'Valve Issue', date: '2025-11-06', status: 'Pending', cost: '₹35,000' },
  { id: 'REP005', equipment: 'Motor E', issue: 'Overheating', date: '2025-11-08', status: 'Completed', cost: '₹8,000' },
]

const completedRepairs = allRepairsData.filter(r => r.status === 'Completed')
const inProgressRepairs = allRepairsData.filter(r => r.status === 'In Progress' || r.status === 'Pending')

export default function RepairDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allRepairsData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allRepairsData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.date.includes(filters.month))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.equipment.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Repair System Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track equipment repairs and maintenance</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Repairs', allRepairsData)}>
          <StatCard
            title="Total Repairs"
            value="1,456"
            subtitle="All time"
            icon={Zap}
            trend={{ value: 11, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Completed Repairs', completedRepairs)}>
          <StatCard
            title="Completed"
            value="1,324"
            subtitle="Successfully"
            icon={CheckCircle}
            trend={{ value: 9, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('In Progress Repairs', inProgressRepairs)}>
          <StatCard
            title="In Progress"
            value="89"
            subtitle="Being repaired"
            icon={Clock}
            trend={{ value: 4, isPositive: true }}
            backgroundColor="bg-yellow-50"
            iconColor="text-yellow-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Avg Time"
          value="3.2 days"
          subtitle="Per repair"
          icon={TrendingUp}
          trend={{ value: 6, isPositive: true }}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Repair Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={repairData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="initiated" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        columns={[
          { key: 'id', label: 'Repair ID' },
          { key: 'equipment', label: 'Equipment' },
          { key: 'issue', label: 'Issue' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'cost', label: 'Cost' },
        ]}
      />
    </div>
  )
}
