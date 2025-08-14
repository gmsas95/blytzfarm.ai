import { DashboardLayout } from "@/components/dashboard-layout"
import { LiveDashboard } from "@/components/live-dashboard"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <LiveDashboard />
    </DashboardLayout>
  )
}
