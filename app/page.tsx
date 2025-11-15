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
        <div className="flex min-h-screen w-full flex-col bg-background lg:flex-row">
          <Sidebar activeSystem={activeSystem} onSystemChange={setActiveSystem} />
          <MainContent activeSystem={activeSystem} />
        </div>
      </SheetsProvider>
    </SidebarProvider>
  )
}
