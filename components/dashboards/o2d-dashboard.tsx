'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

const o2dData = [
  { month: 'Jan', orders: 120, delivered: 115 },
  { month: 'Feb', orders: 135, delivered: 132 },
  { month: 'Mar', orders: 148, delivered: 145 },
  { month: 'Apr', orders: 142, delivered: 138 },
  { month: 'May', orders: 165, delivered: 162 },
  { month: 'Jun', orders: 178, delivered: 175 },
]

const allOrdersData = [
  { id: 'ORD001', order: 'ORD-2025-001', customer: 'ABC Corp', date: '2025-11-01', status: 'Delivered', delivery: '2025-11-03' },
  { id: 'ORD002', order: 'ORD-2025-002', customer: 'XYZ Inc', date: '2025-11-02', status: 'Delivered', delivery: '2025-11-05' },
  { id: 'ORD003', order: 'ORD-2025-003', customer: 'Tech Ltd', date: '2025-11-05', status: 'In Transit', delivery: '2025-11-08' },
  { id: 'ORD004', order: 'ORD-2025-004', customer: 'Global Co', date: '2025-11-06', status: 'In Transit', delivery: '2025-11-09' },
  { id: 'ORD005', order: 'ORD-2025-005', customer: 'Prime Stores', date: '2025-11-08', status: 'Delivered', delivery: '2025-11-10' },
  { id: 'ORD006', order: 'ORD-2025-006', customer: 'Metro Shop', date: '2025-11-10', status: 'Issues', delivery: 'Pending' },
]

const deliveredData = allOrdersData.filter(o => o.status === 'Delivered')
const inTransitData = allOrdersData.filter(o => o.status === 'In Transit')
const issuesData = allOrdersData.filter(o => o.status === 'Issues')

export default function O2DDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allOrdersData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allOrdersData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.date.includes(filters.month))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.customer.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">O2D System Dashboard</h1>
        <p className="text-muted-foreground mt-1">Order to Delivery tracking</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Orders', allOrdersData)}>
          <StatCard
            title="Total Orders"
            value="3,245"
            subtitle="All time"
            icon={Package}
            trend={{ value: 16, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Delivered Orders', deliveredData)}>
          <StatCard
            title="Delivered"
            value="3,156"
            subtitle="Successfully"
            icon={CheckCircle}
            trend={{ value: 18, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('In Transit Orders', inTransitData)}>
          <StatCard
            title="In Transit"
            value="67"
            subtitle="On the way"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Issues Orders', issuesData)}>
          <StatCard
            title="Issues"
            value="22"
            subtitle="Needs attention"
            icon={AlertCircle}
            trend={{ value: 2, isPositive: false }}
            backgroundColor="bg-red-50"
            iconColor="text-red-600"
            onClick={() => {}}
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Order Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={o2dData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" />
              <Bar dataKey="delivered" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <DataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'order', label: 'Order Number' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Order Date' },
          { key: 'status', label: 'Status' },
          { key: 'delivery', label: 'Delivery Date' },
        ]}
      />
    </div>
  )
}
