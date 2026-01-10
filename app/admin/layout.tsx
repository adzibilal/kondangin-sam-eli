import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
