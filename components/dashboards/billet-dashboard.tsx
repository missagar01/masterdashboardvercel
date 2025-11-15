'use client'

import { useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Factory, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

const productionData = [
  { month: 'Jan', produced: 5200, target: 5500 },
  { month: 'Feb', produced: 5400, target: 5500 },
  { month: 'Mar', produced: 5600, target: 5500 },
  { month: 'Apr', produced: 5350, target: 5500 },
  { month: 'May', produced: 5800, target: 5500 },
  { month: 'Jun', produced: 6100, target: 5500 },
]

const qualityData = [
  { name: 'Grade A', value: 78, color: '#10b981' },
  { name: 'Grade B', value: 15, color: '#f59e0b' },
  { name: 'Grade C', value: 5, color: '#ef4444' },
  { name: 'Rejected', value: 2, color: '#6b7280' },
]

const allBatchesData = [
  { id: 'B001', batch: 'BATCH-001', quantity: 1200, target: 1500, status: 'Completed', quality: 'Grade A' },
  { id: 'B002', batch: 'BATCH-002', quantity: 1350, target: 1500, status: 'Completed', quality: 'Grade A' },
  { id: 'B003', batch: 'BATCH-003', quantity: 1480, target: 1500, status: 'In Progress', quality: 'Grade A' },
  { id: 'B004', batch: 'BATCH-004', quantity: 890, target: 1500, status: 'On Hold', quality: 'Grade B' },
]

const completedBatches = allBatchesData.filter(b => b.status === 'Completed')
const inProgressBatches = allBatchesData.filter(b => b.status === 'In Progress')

export default function BilletDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allBatchesData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allBatchesData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.quality.toLowerCase().includes(filters.month.toLowerCase()))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.batch.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billet Production Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor production schedules and quality</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Batches', allBatchesData)}>
          <StatCard
            title="Produced"
            value="5,800"
            subtitle="This month"
            icon={Factory}
            trend={{ value: 5, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('On Target Batches', completedBatches)}>
          <StatCard
            title="On Target"
            value="105%"
            subtitle="Production rate"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Quality Pass Batches', inProgressBatches)}>
          <StatCard
            title="Quality Pass"
            value="98%"
            subtitle="Grade A & B"
            icon={CheckCircle}
            trend={{ value: 2, isPositive: true }}
            backgroundColor="bg-purple-50"
            iconColor="text-purple-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Defects"
          value="2.1%"
          subtitle="Per batch"
          icon={AlertCircle}
          trend={{ value: 1, isPositive: true }}
          backgroundColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Production vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="produced" fill="#3b82f6" />
                <Bar dataKey="target" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80}>
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
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
          { key: 'id', label: 'Batch ID' },
          { key: 'batch', label: 'Batch Number' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'target', label: 'Target' },
          { key: 'status', label: 'Status' },
          { key: 'quality', label: 'Quality' },
        ]}
      />
    </div>
  )
}
