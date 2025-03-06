"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Document {
  id: string
  metadata: {
    title: string
    author: string
    doc_type: string
    branch_of_medicine: string
    publication_date?: string
    journal?: string
    [key: string]: any
  }
}

interface DocumentsResponse {
  namespace: string
  count: number
  documents: string // JSON string containing document data
}

const DOC_TYPES = [
  { value: "clinical_trials", label: "Clinical Trials" },
  { value: "research_papers", label: "Research Papers" },
  { value: "guidelines", label: "Guidelines" },
]

export default function ReferencesPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDocType, setSelectedDocType] = useState(DOC_TYPES[0].value)
  const [debugInfo, setDebugInfo] = useState<{
    responseStatus?: number
    rawResponse?: string
    parsedDocuments?: string
    error?: string
  }>({})
  const { toast } = useToast()

  const fetchDocuments = useCallback(
    async (docType: string) => {
      setIsLoading(true)
      setDebugInfo({}) // Reset debug info

      try {
        const token = localStorage.getItem("authToken")
        console.log("[Debug] Fetching documents for type:", docType)
        console.log("[Debug] Using token (first 10 chars):", token?.substring(0, 10))

        const response = await fetch(
          `https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/admin/list-documents/${docType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log("[Debug] Response status:", response.status)
        setDebugInfo((prev) => ({ ...prev, responseStatus: response.status }))

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: DocumentsResponse = await response.json()
        console.log("[Debug] Raw response:", data)
        setDebugInfo((prev) => ({ ...prev, rawResponse: JSON.stringify(data, null, 2) }))

        // Log the structure of the response
        console.log("[Debug] Response structure:", {
          namespace: data.namespace,
          count: data.count,
          documentsType: typeof data.documents,
          documentsLength: data.documents?.length,
        })

        let parsedDocuments: Document[] = []
        try {
          // Check if documents is already an array
          if (Array.isArray(data.documents)) {
            console.log("[Debug] Documents is already an array")
            parsedDocuments = data.documents
          } else {
            console.log("[Debug] Attempting to parse documents string")
            parsedDocuments = JSON.parse(data.documents)
          }

          console.log("[Debug] Parsed documents:", parsedDocuments)
          setDebugInfo((prev) => ({
            ...prev,
            parsedDocuments: JSON.stringify(parsedDocuments, null, 2),
          }))
        } catch (error) {
          console.error("[Debug] Error parsing documents:", error)
          setDebugInfo((prev) => ({
            ...prev,
            error: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
          }))
          toast({
            title: "Error",
            description: "Failed to parse documents data. Check console for details.",
            variant: "destructive",
          })
        }

        setDocuments(parsedDocuments)
      } catch (error) {
        console.error("[Debug] Fetch error:", error)
        setDebugInfo((prev) => ({
          ...prev,
          error: `Fetch error: ${error instanceof Error ? error.message : String(error)}`,
        }))
        toast({
          title: "Error",
          description: "Failed to fetch documents. Check console for details.",
          variant: "destructive",
        })
        setDocuments([])
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchDocuments(selectedDocType)
  }, [selectedDocType, fetchDocuments])

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tighter glow-text">References</h1>
        <Button asChild>
          <Link href="/admin/references/add" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-[200px]">
          <Select value={selectedDocType} onValueChange={(value) => setSelectedDocType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Branch of Medicine</TableHead>
              <TableHead>Publication Date</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">No documents found for this type.</p>

                    {/* Debug Information */}
                    <div className="text-left mx-auto max-w-2xl text-sm space-y-2">
                      <p className="font-semibold text-primary">Debug Information:</p>
                      {debugInfo.responseStatus && <p>Response Status: {debugInfo.responseStatus}</p>}
                      {debugInfo.error && (
                        <div className="bg-destructive/10 p-2 rounded">
                          <p className="font-semibold text-destructive">Error:</p>
                          <p className="font-mono text-xs">{debugInfo.error}</p>
                        </div>
                      )}
                      {debugInfo.rawResponse && (
                        <div className="space-y-1">
                          <p className="font-semibold">Raw Response:</p>
                          <pre className="bg-muted p-2 rounded overflow-auto text-xs">{debugInfo.rawResponse}</pre>
                        </div>
                      )}
                      {debugInfo.parsedDocuments && (
                        <div className="space-y-1">
                          <p className="font-semibold">Parsed Documents:</p>
                          <pre className="bg-muted p-2 rounded overflow-auto text-xs">{debugInfo.parsedDocuments}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.metadata.title}</TableCell>
                  <TableCell>{doc.metadata.author}</TableCell>
                  <TableCell>{doc.metadata.branch_of_medicine}</TableCell>
                  <TableCell>
                    {doc.metadata.publication_date ? new Date(doc.metadata.publication_date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>{doc.metadata.journal || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

