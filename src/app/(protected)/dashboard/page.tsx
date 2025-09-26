"use client"
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardPage = () => {
  const {user} = useUser()
  
  return (
    <div>
      DashboardPage {user?.firstName}
    </div>
  )
}

export default DashboardPage 
