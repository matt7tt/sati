'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Text } from "@/components/ui/typography"

interface LabParameter {
  parameter: string
  value: string | number
  unit: string
  normal_range: string
  status: string
  explanation?: string
  recommendations?: string
}

interface AnalysisResponse {
  analysis: {
    analysis: LabParameter[]
  }
}

interface TestResult {
  id: number
  results_json: LabParameter[] | AnalysisResponse | string
  test_metadata: any
  analysis_id: number
  created_at: string
  updated_at: string
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

const ParameterChart = ({ data }: { data: (LabParameter & { date: string })[] }) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    value: item.value
  }))

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function LabResults() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTestResults() {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          console.log("No token found, redirecting to login...")
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/test-results`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log("API Response:", JSON.stringify(data, null, 2))
          setTestResults(data)
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching test results:", error)
        toast({
          title: "Error",
          description: "Failed to fetch test results. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestResults()
  }, [router, toast])

  // Group parameters by type across all test results
  const groupedParameters = testResults.reduce((acc, result) => {
    try {
      // Get the results array, handling both string and array cases
      let parameters = result.results_json;
      if (typeof parameters === 'string') {
        try {
          // Replace single quotes with double quotes first
          let jsonString = parameters.replace(/'/g, '"');
          
          // Find all complete objects in the array
          const objects = jsonString.match(/\{(?:[^{}]|\{[^{}]*\})*\}/g) || [];
          
          // Reconstruct the JSON with only complete objects
          if (objects.length > 0) {
            jsonString = `{"analysis":{"analysis":[${objects.join(',')}]}}`;
          }
          
          parameters = JSON.parse(jsonString) as AnalysisResponse;
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          return acc;
        }
      }
      
      // Handle both direct array and nested analysis structure
      const paramArray = Array.isArray(parameters) 
        ? parameters 
        : (parameters as AnalysisResponse)?.analysis?.analysis || [];

      paramArray.forEach((param: LabParameter) => {
        // Extract numeric value from string (e.g., "289 mcg/dL" -> 289)
        const numericValue = typeof param.value === 'string'
          ? parseFloat(param.value.replace(/[^\d.-]/g, ''))
          : param.value;

        if (!acc[param.parameter]) {
          acc[param.parameter] = [];
        }
        acc[param.parameter].push({
          ...param,
          value: numericValue,
          date: result.created_at
        });
      });
    } catch (error) {
      console.error('Error processing test result:', error);
    }
    return acc;
  }, {} as Record<string, (LabParameter & { date: string })[]>);

  if (isLoading) return <div>Loading test results...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Lab Results History</h1>

      <div className="space-y-6">
        {Object.entries(groupedParameters).map(([parameter, values]) => (
          <Card key={parameter} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{parameter}</span>
                <StatusBadge status={values[values.length - 1].status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm text-muted-foreground">Latest Value</Text>
                    <Text className="text-lg font-semibold">
                      {values[values.length - 1].value} {values[values.length - 1].unit}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-sm text-muted-foreground">Normal Range</Text>
                    <Text className="text-lg font-semibold">
                      {values[values.length - 1].normal_range}
                    </Text>
                  </div>
                </div>
                
                {values.length > 1 && (
                  <ParameterChart data={values} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 