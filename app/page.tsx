'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import MainContent from '@/components/main-content'
import { SheetsProvider } from '@/components/context/SheetsContext'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Home() {
  const [activeSystem, setActiveSystem] = useState('checklist')

  return (
    <SidebarProvider>
      <SheetsProvider>
        <div className="flex h-screen bg-background">
          <Sidebar activeSystem={activeSystem} onSystemChange={setActiveSystem} />
          <MainContent activeSystem={activeSystem} />
        </div>
      </SheetsProvider>
    </SidebarProvider>
  )
}
