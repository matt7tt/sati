"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

interface ReferenceFormData {
  author?: string
  title?: string
  branch_of_medicine?: string
  entity?: string
  issue_number?: string
  publication_date?: string
  journal?: string
  doi?: string
  abstract?: string
  keywords?: string
  peer_reviewed: boolean
}

export default function AddReferencePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ReferenceFormData>({
    author: "",
    title: "",
    branch_of_medicine: "",
    entity: "",
    issue_number: "",
    publication_date: "",
    journal: "",
    doi: "",
    abstract: "",
    keywords: "",
    peer_reviewed: false,
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      // Only append non-empty values
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (key === "peer_reviewed") {
            formDataToSend.append(key, value.toString())
          } else if (key === "keywords" && value) {
            // Don't append empty keywords
            formDataToSend.append(key, value)
          } else if (value) {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      const token = localStorage.getItem("authToken")
      const response = await fetch(
        "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/admin/upload-document",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        },
      )

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reference uploaded successfully",
        })
        router.push("/admin/references")
      } else if (response.status === 422) {
        const errorData = await response.json()
        toast({
          title: "Validation Error",
          description: errorData.detail[0].msg || "Please check your input",
          variant: "destructive",
        })
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error uploading reference:", error)
      toast({
        title: "Error",
        description: "Failed to upload reference. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/references">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="page-title">Add New Reference</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <Label htmlFor="file" className="form-label">
              Document File *
            </Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              required
              className="cursor-pointer"
            />
            <p className="form-helper-text">Required</p>
          </div>

          <div className="form-group">
            <Label htmlFor="title" className="form-label">
              Title
            </Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="author" className="form-label">
              Author
            </Label>
            <Input id="author" name="author" value={formData.author} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="branch_of_medicine" className="form-label">
              Branch of Medicine
            </Label>
            <Input
              id="branch_of_medicine"
              name="branch_of_medicine"
              value={formData.branch_of_medicine}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="entity" className="form-label">
              Entity
            </Label>
            <Input id="entity" name="entity" value={formData.entity} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="issue_number" className="form-label">
              Issue Number
            </Label>
            <Input id="issue_number" name="issue_number" value={formData.issue_number} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="publication_date" className="form-label">
              Publication Date
            </Label>
            <Input
              id="publication_date"
              name="publication_date"
              type="date"
              value={formData.publication_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="journal" className="form-label">
              Journal
            </Label>
            <Input id="journal" name="journal" value={formData.journal} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="doi" className="form-label">
              DOI
            </Label>
            <Input id="doi" name="doi" value={formData.doi} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <Label htmlFor="keywords" className="form-label">
              Keywords
            </Label>
            <Input
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="Comma-separated keywords"
            />
            <p className="form-helper-text">Separate keywords with commas</p>
          </div>
        </div>

        <div className="form-group">
          <Label htmlFor="abstract" className="form-label">
            Abstract
          </Label>
          <Textarea id="abstract" name="abstract" value={formData.abstract} onChange={handleInputChange} rows={4} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="peer_reviewed"
            checked={formData.peer_reviewed}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, peer_reviewed: checked as boolean }))}
          />
          <Label htmlFor="peer_reviewed" className="form-label">
            Peer Reviewed
          </Label>
        </div>

        <div className="button-group">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Reference"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/references">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

