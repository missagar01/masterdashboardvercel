'use client'

import { useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Navigation, MapPin, Clock, TrendingUp } from 'lucide-react'

const travelData = [
  { month: 'Jan', trips: 145, cost: 145000 },
  { month: 'Feb', trips: 168, cost: 168000 },
  { month: 'Mar', trips: 182, cost: 182000 },
  { month: 'Apr', trips: 175, cost: 175000 },
  { month: 'May', trips: 198, cost: 198000 },
  { month: 'Jun', trips: 215, cost: 215000 },
]

const travelModeData = [
  { name: 'Flight', value: 45, color: '#3b82f6' },
  { name: 'Train', value: 30, color: '#10b981' },
  { name: 'Car Rental', value: 15, color: '#f59e0b' },
  { name: 'Hotel', value: 10, color: '#8b5cf6' },
]

const allTripsData = [
  { id: 'T001', traveler: 'John Doe', destination: 'New York', date: '2025-11-01', mode: 'Flight', cost: '₹45,000' },
  { id: 'T002', traveler: 'Jane Smith', destination: 'Mumbai', date: '2025-11-02', mode: 'Train', cost: '₹8,000' },
  { id: 'T003', traveler: 'Mike Johnson', destination: 'Delhi', date: '2025-11-05', mode: 'Flight', cost: '₹38,000' },
  { id: 'T004', traveler: 'Sarah Lee', destination: 'Bangalore', date: '2025-11-06', mode: 'Car Rental', cost: '₹15,000' },
  { id: 'T005', traveler: 'Alex Brown', destination: 'Hyderabad', date: '2025-11-08', mode: 'Flight', cost: '₹42,000' },
]

export default function TravelDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<typeof allTripsData>([])
  const [modalTitle, setModalTitle] = useState('')
  const [filters, setFilters] = useState({
    month: '',
    person: '',
  })

  const handleStatCardClick = (title: string, data: typeof allTripsData) => {
    let filteredData = data
    
    if (filters.month) {
      filteredData = filteredData.filter(item => item.date.includes(filters.month))
    }
    if (filters.person) {
      filteredData = filteredData.filter(item => 
        item.traveler.toLowerCase().includes(filters.person.toLowerCase())
      )
    }
    
    setModalTitle(title)
    setModalData(filteredData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Travel FMS Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and track travel expenses</p>
      </div>

      <FilterBar
        showMonth={true}
        showPerson={true}
        showDateRange={false}
        onMonthChange={(month) => setFilters(prev => ({ ...prev, month }))}
        onPersonChange={(person) => setFilters(prev => ({ ...prev, person }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleStatCardClick('All Trips', allTripsData)}>
          <StatCard
            title="Total Trips"
            value="2,156"
            subtitle="All time"
            icon={Navigation}
            trend={{ value: 14, isPositive: true }}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => {}}
          />
        </div>
        <StatCard
          title="Destinations"
          value="248"
          subtitle="Unique locations"
          icon={MapPin}
          trend={{ value: 8, isPositive: true }}
          backgroundColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Avg Trip Duration"
          value="4.2 days"
          subtitle="Per trip"
          icon={Clock}
          trend={{ value: 3, isPositive: true }}
          backgroundColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Spent"
          value="₹32.8L"
          subtitle="All expenses"
          icon={TrendingUp}
          trend={{ value: 11, isPositive: false }}
          backgroundColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Travel Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={travelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" />
                <Bar yAxisId="right" dataKey="cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Travel Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={travelModeData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80}>
                  {travelModeData.map((entry, index) => (
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
          { key: 'id', label: 'Trip ID' },
          { key: 'traveler', label: 'Traveler' },
          { key: 'destination', label: 'Destination' },
          { key: 'date', label: 'Date' },
          { key: 'mode', label: 'Mode' },
          { key: 'cost', label: 'Cost' },
        ]}
      />
    </div>
  )
}
