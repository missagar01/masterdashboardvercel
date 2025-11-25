'use client'

import ChecklistDashboard from './dashboards/checklist-dashboard'
import PlanningDashboard from './dashboards/planning-dashboard'
import PurchaseDashboard from './dashboards/purchase-dashboard'
import EnquiryDashboard from './dashboards/enquiry-dashboard'
import MaintenanceDashboard from './dashboards/maintenance-dashboard'
import O2DDashboard from './dashboards/o2d-dashboard'
import DocumentsDashboard from './dashboards/documents-dashboard'
import BilletDashboard from './dashboards/billet-dashboard'
import RepairDashboard from './dashboards/repair-dashboard'
import SubscriptionDashboard from './dashboards/subscription-dashboard'
import TravelDashboard from './dashboards/travel-dashboard'
import MachineMaintenanceDashboard from './dashboards/machine-maintenance-dashboard'

interface MainContentProps {
  activeSystem: string
}

export default function MainContent({ activeSystem }: MainContentProps) {
  const renderDashboard = () => {
    switch (activeSystem) {
      case 'checklist':
        return <ChecklistDashboard />
      case 'planning':
        return <PlanningDashboard />
      case 'purchase':
        return <PurchaseDashboard />
      case 'enquiry':
        return <EnquiryDashboard />
      case 'maintenance':
        return <MaintenanceDashboard />
      case 'machine-maintenance':
        return <MachineMaintenanceDashboard />
      case 'o2d':
        return <O2DDashboard />
      case 'documents':
        return <DocumentsDashboard />
      case 'billet':
        return <BilletDashboard />
      case 'repair':
        return <RepairDashboard />
      case 'subscription':
        return <SubscriptionDashboard />
      case 'travel':
        return <TravelDashboard />
      default:
        return <ChecklistDashboard />
    }
  }

  return (
    <main className="flex-1 min-h-screen w-full min-w-0 overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/5 lg:w-[calc(100vw-16rem)]">
      <div className="w-full px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-10 lg:pt-10">
        <div className="w-full animate-fadeInUp space-y-6">
          {renderDashboard()}
        </div>
      </div>
    </main>
  )
}
