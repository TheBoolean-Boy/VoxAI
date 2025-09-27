"use client"
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, ScanEye, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    title: "Security",
    url: '/security',
    icon: Shield
  },
  {
    title: "Billing",
    url: '/billing',
    icon: CreditCard
  },
]

// const Projects = [
//   {
//     name: "Project 1"
//   },
//   {
//     name: "Project 2"
//   },
//   {
//     name: "Project 3"
//   }
// ]

function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()
  const {projects, projectId, setProjectId} = useProject()
  
  return (

    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <div className=" flex items-center gap-2">
          {/* <Image src={'/logo.png'} alt="Logo" width={40} height={40} /> */}
          {
            open ? (<h1 className=" ml-2 text-2xl font-bold text-primary/80 mt-1">
              Vox AI
            </h1>) : (<h1 className=" ml-2 text-2xl font-bold text-primary/80 mt-1">
              V
            </h1>) 
          }

        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={cn({
                        '!bg-primary !text-white': pathname === item.url
                      })}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project, index) => {
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <div onClick={ () => {
                        setProjectId(project.id)
                      }}>
                        <div className={cn(
                          'rounded-sm size-6 border flex items-center justify-center text-sm bg-white text-primary',
                          {
                            'bg-primary text-white': project.id === projectId
                          }
                        )}>
                          {project.name[0]}
                        </div>
                        {project.name}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <div className=' h-4'></div>
              {
                open && (
                  <SidebarMenuItem>
                    <Link href={'/create'}>
                      <Button size={'sm'} variant={'outline'} className='w-fit'>
                        <Plus />
                        Create Project
                      </Button>
                    </Link>
                  </SidebarMenuItem>
                )
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
