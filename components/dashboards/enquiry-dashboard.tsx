'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { MessageSquare, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const enquiryData = [
  { month: 'Jan', received: 45, resolved: 38 },
  { month: 'Feb', received: 52, resolved: 48 },
  { month: 'Mar', received: 60, resolved: 55 },
  { month: 'Apr', received: 58, resolved: 52 },
  { month: 'May', received: 68, resolved: 62 },
  { month: 'Jun', received: 75, resolved: 70 },
]

const allEnquiriesData = [
  { id: 'ENQ001', customer: 'John Smith', subject: 'Product Inquiry', date: '2025-11-01', status: 'Resolved', priority: 'High' },
  { id: 'ENQ002', customer: 'Jane Doe', subject: 'Delivery Question', date: '2025-11-02', status: 'Resolved', priority: 'Medium' },
  { id: 'ENQ003', customer: 'Mike Wilson', subject: 'Pricing Request', date: '2025-11-05', status: 'Pending', priority: 'High' },
  { id: 'ENQ004', customer: 'Sarah Johnson', subject: 'Bulk Order', date: '2025-11-06', status: 'Resolved', priority: 'High' },
  { id: 'ENQ005', customer: 'Alex Brown', subject: 'Technical Support', date: '2025-11-08', status: 'Pending', priority: 'Medium' },
  { id: 'ENQ006', customer: 'Emma Davis', subject: 'Return Request', date: '2025-11-10', status: 'Resolved', priority: 'Low' },
  { id: 'ENQ007', customer: 'Robert Miller', subject: 'Warranty Query', date: '2025-11-12', status: 'Resolved', priority: 'Medium' },
  { id: 'ENQ008', customer: 'Lisa Anderson', subject: 'Feedback', date: '2025-11-14', status: 'Pending', priority: 'Low' },
]

const resolvedEnquiriesData = allEnquiriesData.filter(e => e.status === 'Resolved')
const pendingEnquiriesData = allEnquiriesData.filter(e => e.status === 'Pending')

export default function EnquiryDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allEnquiriesData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allEnquiriesData) => {
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
        <h1 className="text-3xl font-bold text-foreground">Enquiry Management Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer enquiries</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Enquiries', allEnquiriesData)}>
          <StatCard
            title="Total Enquiries"
            value="1,245"
            subtitle="All time"
            icon={MessageSquare}
            trend={{ value: 18, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Resolved Enquiries', resolvedEnquiriesData)}>
          <StatCard
            title="Resolved"
            value="1,089"
            subtitle="Completed"
            icon={CheckCircle}
            trend={{ value: 12, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Pending Enquiries', pendingEnquiriesData)}>
          <StatCard
            title="Pending"
            value="125"
            subtitle="Awaiting response"
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
            backgroundColor="bg-yellow-50"
            iconColor="text-yellow-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Avg Resolution"
          value="2.4 days"
          subtitle="Per enquiry"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Enquiry Resolution Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enquiryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="received" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
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
          { key: 'id', label: 'Enquiry ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'subject', label: 'Subject' },
          { key: 'date', label: 'Date' },
          { key: 'priority', label: 'Priority' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </div>
  )
}
