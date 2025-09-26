'use client'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
  repoUrl: string,
  projectName: string,
  githubToken?: string
}

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>()
  const createProject = api.project.createProject.useMutation()
  const refetch = useRefetch()

  function onSubmit(data: FormInput) {
    createProject.mutate({
      name: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken
    }, {
      onSuccess: () => {
      toast.success("Project created successfully")
      reset()
      refetch()
      },
      onError: () => {
        toast.error("Failed to create project")
      }
    })
  }
  return (
    <div className='flex items-center justify-center gap-12 h-full'>
      <img src={'./undraw_programming.svg'} className=' h-58 w-auto' />
      <div>
        <div>
          <h1 className=' font-semibold text-2xl'>
            Add your Github Repository
          </h1>
          <p className=' text-sm text-muted-foreground'>
            Enter the URL of your github repository
          </p>
        </div>
        <div className='h-4'></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              required
              placeholder='Project Name'
              {...register('projectName', { required: true })}
            />
            <div className='h-2'></div>
            <Input
              required
              placeholder='Github Repo URL'
              {...register('repoUrl', { required: true })}
              type='url'
            />
            <div className='h-2'></div>
            <Input
              placeholder='Github Token (Optional)'
              {...register('githubToken')}
            />
            <div className='h-4'></div>
            <Button type='submit' disabled={createProject.isPending}>
              Create Project {
                createProject.isPending && <LoaderIcon className='animate-spin'/>
              }
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
