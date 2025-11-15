'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { FileText, Archive, Clock, CheckCircle } from 'lucide-react'

const docData = [
  { month: 'Jan', uploaded: 45, archived: 12 },
  { month: 'Feb', uploaded: 58, archived: 18 },
  { month: 'Mar', uploaded: 62, archived: 22 },
  { month: 'Apr', uploaded: 71, archived: 28 },
  { month: 'May', uploaded: 82, archived: 35 },
  { month: 'Jun', uploaded: 95, archived: 42 },
]

const allDocumentsData = [
  { id: 'DOC001', name: 'Annual Report 2025', type: 'Report', date: '2025-11-01', status: 'Verified', size: '2.4 MB' },
  { id: 'DOC002', name: 'Financial Statements', type: 'Report', date: '2025-11-02', status: 'Verified', size: '1.8 MB' },
  { id: 'DOC003', name: 'Policy Manual', type: 'Manual', date: '2025-11-05', status: 'Pending Review', size: '3.2 MB' },
  { id: 'DOC004', name: 'Meeting Minutes', type: 'Minutes', date: '2025-11-06', status: 'Archived', size: '0.9 MB' },
  { id: 'DOC005', name: 'Employee Handbook', type: 'Manual', date: '2025-11-08', status: 'Verified', size: '2.7 MB' },
]

const verifiedDocs = allDocumentsData.filter(d => d.status === 'Verified')
const pendingDocs = allDocumentsData.filter(d => d.status === 'Pending Review')
const archivedDocs = allDocumentsData.filter(d => d.status === 'Archived')

export default function DocumentsDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allDocumentsData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allDocumentsData) => {
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
        <h1 className="text-3xl font-bold text-foreground">Document Management Dashboard</h1>
        <p className="text-muted-foreground mt-1">Organize and track document lifecycle</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Documents', allDocumentsData)}>
          <StatCard
            title="Total Documents"
            value="5,678"
            subtitle="In system"
            icon={FileText}
            trend={{ value: 25, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Archived Documents', archivedDocs)}>
          <StatCard
            title="Archived"
            value="2,134"
            subtitle="Stored safely"
            icon={Archive}
            trend={{ value: 8, isPositive: true }}
            backgroundColor="bg-purple-50"
            iconColor="text-purple-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Pending Documents', pendingDocs)}>
          <StatCard
            title="Pending Review"
            value="267"
            subtitle="Awaiting approval"
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
            backgroundColor="bg-yellow-50"
            iconColor="text-yellow-600"
            onClick={() => {}}
          />
        </div>
        <div onClick={() => handleStatCardClick('Verified Documents', verifiedDocs)}>
          <StatCard
            title="Verified"
            value="5,234"
            subtitle="Approved docs"
            icon={CheckCircle}
            trend={{ value: 12, isPositive: true }}
            backgroundColor="bg-green-50"
            iconColor="text-green-600"
            onClick={() => {}}
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Document Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={docData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uploaded" fill="#3b82f6" />
              <Bar dataKey="archived" fill="#10b981" />
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
          { key: 'id', label: 'Document ID' },
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'size', label: 'Size' },
        ]}
      />
    </div>
  )
}
