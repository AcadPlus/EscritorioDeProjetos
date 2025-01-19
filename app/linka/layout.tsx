import { SidebarWrapper } from '@/components/sidebar-wrapper'
import { AuthProvider } from '@/lib/context/AuthContext'

export default function LinkaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarWrapper />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AuthProvider>
  )
}
