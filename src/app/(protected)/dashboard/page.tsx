"use client"
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardPage = () => {
  const {user} = useUser()
  if(!user){
    return redirect("/sign-up")
  }
  return (
    <div>
      DashboardPage {user?.firstName}
    </div>
  )
}

export default DashboardPage 
