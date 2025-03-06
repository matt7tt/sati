"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type React from "react"

interface AnalysisParameter {
  parameter: string
  value: string
  normal_range: string
  status: string
  explanation: string
  recommendations: string
}

interface AnalysisData {
  analysis: {
    analysis: AnalysisParameter[]
  }
  phenotypic_age_error?: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "high":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/50"
      case "low":
        return "bg-blue-500/20 text-blue-600 border-blue-500/50"
      case "normal":
        return "bg-green-500/20 text-green-600 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/50"
    }
  }

  return (
    <Badge variant="outline" className={`${getStatusColor(status)} capitalize`}>
      {status}
    </Badge>
  )
}

export default function AnalyzeResults() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const token =
        document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1") ||
        localStorage.getItem("authToken")
      if (!token) {
        console.log("No token found, redirecting to login...")
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/analyze-test-results",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      if (response.ok) {
        const result = await response.json()
        console.log("Analysis result:", result) // Debug log
        setAnalysisResult(result)
        toast({
          title: "Success",
          description: "Test results analyzed successfully.",
        })
      } else if (response.status === 422) {
        const errorData = await response.json()
        toast({
          title: "Validation Error",
          description: errorData.detail[0].msg || "Invalid input. Please check your file.",
          variant: "destructive",
        })
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error analyzing test results:", error)
      toast({
        title: "Error",
        description: "An error occurred while analyzing the test results. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Group parameters by status
  const groupedParameters = analysisResult?.analysis.analysis.reduce(
    (acc, item) => {
      if (!acc[item.status]) {
        acc[item.status] = []
      }
      acc[item.status].push(item)
      return acc
    },
    {} as Record<string, AnalysisParameter[]>,
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Analyze Test Results</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
            Upload Test Results (PDF)
          </label>
          <Input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1"
            required
          />
        </div>
        <Button type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Analyze Results"}
        </Button>
      </form>

      {analysisResult?.analysis && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {groupedParameters &&
              Object.entries(groupedParameters).map(([status, parameters]) => (
                <Card key={status} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <StatusBadge status={status} />
                      <span className="capitalize">{status} Parameters</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      {parameters.map((param, index) => (
                        <li key={index}>
                          {param.parameter}: {param.value}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Detailed Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysisResult.analysis.analysis.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-primary">{item.parameter}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Value:</span> {item.value}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Normal Range:</span> {item.normal_range}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Explanation:</span>
                      <p className="mt-1">{item.explanation}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recommendations:</span>
                      <p className="mt-1">{item.recommendations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

