'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../stat-card'
import FilterBar from '../filter-bar'
import DataModal from '../data-modal'
import { Zap, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import Dashboard from "../Repaire Dashboard/Dashboard";


export default function RepairDashboard() {



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Repair System Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track equipment repairs and maintenance</p>
      </div>

<Dashboard/>
     
    </div>
  )
}
