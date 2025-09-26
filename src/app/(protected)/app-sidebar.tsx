"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar'
import { Bot, CreditCard, LayoutDashboard, Presentation, ScanEye } from 'lucide-react'
import React from 'react'


const items = [
  {
    title: "Dashboard",
    url: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: "Q&A",
    url: '/qa',
    icon: Bot
  },
  {
    title: "Meetings",
    url: '/meetings',
    icon: Presentation
  },
  {
    title: "Billing",
    url: '/billing',
    icon: CreditCard
  },
  {
    title: "Security",
    url: '/security',
    icon: ScanEye
  },
]

function AppSidebar() {
  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        Logo
      </SidebarHeader>

      <SidebarContent> 
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>

          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
