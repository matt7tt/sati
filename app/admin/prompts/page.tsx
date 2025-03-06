"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Suspense } from 'react'
import PromptList from '@/components/admin/prompts/PromptList'
import PromptFilter from '@/components/admin/prompts/PromptFilter'
import PromptForm from '@/components/admin/prompts/PromptForm'
import PageHeader from '@/components/layout/PageHeader'
import Loading from './loading'

interface Prompt {
  id: string
  name: string
  description: string
  content: string
}

export default async function PromptsAdminPage() {
  // Server component data fetching (if needed)
  // const prompts = await fetchPrompts();
  
  return (
    <div className="container mx-auto p-4">
      <PageHeader 
        title="Prompt Management" 
        description="Create and manage your prompts"
      />
      
      <PromptFilter />
      
      <Suspense fallback={<Loading />}>
        <PromptList />
      </Suspense>
      
      <PromptForm />
    </div>
  )
}

