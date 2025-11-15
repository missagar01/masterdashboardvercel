'use client'

import { useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Wrench, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

const maintenanceData = [
  { month: 'Jan', completed: 45, pending: 12 },
  { month: 'Feb', completed: 52, pending: 10 },
  { month: 'Mar', completed: 58, pending: 8 },
  { month: 'Apr', completed: 61, pending: 7 },
  { month: 'May', completed: 68, pending: 5 },
  { month: 'Jun', completed: 75, pending: 3 },
]

const statusData = [
  { name: 'Completed', value: 65, color: '#10b981' },
  { name: 'In Progress', value: 20, color: '#3b82f6' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
  { name: 'Overdue', value: 5, color: '#ef4444' },
]

const allVehiclesData = [
  { id: 'MH12AB1234', vehicle: 'Truck A', type: 'Oil Change', date: '2025-11-01', status: 'Completed', cost: '₹5,000' },
  { id: 'MH12AB1235', vehicle: 'Truck B', type: 'Tire Replacement', date: '2025-11-02', status: 'Completed', cost: '₹15,000' },
  { id: 'MH12AB1236', vehicle: 'Car A', type: 'Battery Check', date: '2025-11-05', status: 'In Progress', cost: '₹3,000' },
  { id: 'MH12AB1237', vehicle: 'Car B', type: 'Brake Service', date: '2025-11-06', status: 'Pending', cost: '₹12,000' },
  { id: 'MH12AB1238', vehicle: 'Bus A', type: 'Engine Service', date: '2025-11-08', status: 'Completed', cost: '₹25,000' },
  { id: 'MH12AB1239', vehicle: 'Truck C', type: 'Alignment', date: '2025-11-10', status: 'Completed', cost: '₹8,000' },
]

const completedData = allVehiclesData.filter(v => v.status === 'Completed')
const pendingData = allVehiclesData.filter(v => v.status === 'Pending' || v.status === 'In Progress')

export default function MaintenanceDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allVehiclesData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allVehiclesData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.date.includes(filters.month))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.vehicle.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Car FMS Maintenance Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor vehicle maintenance schedules</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Vehicles', allVehiclesData)}>
          <StatCard
            title="Total Vehicles"
            value="456"
            subtitle="In fleet"
            icon={Wrench}
            trend={{ value: 3, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Completed Maintenance', completedData)}>
          <StatCard
            title="Completed"
            value="298"
            subtitle="Maintenance done"
            icon={CheckCircle}
            trend={{ value: 14, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Pending Maintenance', pendingData)}>
          <StatCard
            title="Pending"
            value="89"
            subtitle="Scheduled"
            icon={AlertCircle}
            trend={{ value: 2, isPositive: false }}
            backgroundColor="bg-yellow-50"
            iconColor="text-yellow-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Cost Saved"
          value="₹2.3L"
          subtitle="Preventive maintenance"
          icon={TrendingUp}
          trend={{ value: 22, isPositive: true }}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Maintenance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Maintenance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80}>
                  {statusData.map((entry, index) => (
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
          { key: 'id', label: 'Vehicle ID' },
          { key: 'vehicle', label: 'Vehicle' },
          { key: 'type', label: 'Maintenance Type' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'cost', label: 'Cost' },
        ]}
      />
    </div>
  )
}
