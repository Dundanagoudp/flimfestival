'use client'

import React, { useEffect, useState } from 'react'
import DashboardPage from '@/components/admin/dashboard/dashboardpage'
import UserProfile from '@/components/admin/user/profile/userProfile'

export default function Page() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const cookies = `; ${document.cookie}`
    const parts = cookies.split('; userRole=')
    const userRole = parts.length === 2 ? parts.pop()?.split(';').shift() || null : null
    setRole(userRole)
  }, [])

  if (!role) {
    // default to admin dashboard while loading or when role is admin
    return <DashboardPage />
  }

  if (role !== 'admin') {
    return <UserProfile />
  }

  return <DashboardPage />
}
