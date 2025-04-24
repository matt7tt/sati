'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/typography"
import { Meal } from "@/types/dashboard"
import { UploadCloud, Calendar, Clock, Info, Heart, Brain, Zap, AlertCircle, Dumbbell } from "lucide-react"

interface MealData {
  id: number
  user_id: number
  meal_image: string
  meal_output: string
  meal_rating: string | null
  created_at: string
}

interface ParsedMeal {
  id: number
  name: string
  image_url: string
  consumed_at: string
  calories: string
  protein: string
  carbs: string
  fat: string
  ratings: {
    cardiovascular: string
    cancer: string
    cognitive: string
    metabolic: string
    musculoskeletal: string
  }
}

// Function to extract information from meal_output markdown
function parseMealOutput(mealOutput: string): {
  name: string,
  calories: string,
  protein: string,
  carbs: string,
  fat: string,
  ratings: {
    cardiovascular: string,
    cancer: string,
    cognitive: string,
    metabolic: string,
    musculoskeletal: string
  }
} {
  // Default values
  let result = {
    name: "Meal",
    calories: "0",
    protein: "0",
    carbs: "0",
    fat: "0",
    ratings: {
      cardiovascular: "C",
      cancer: "C",
      cognitive: "C", 
      metabolic: "C",
      musculoskeletal: "C"
    }
  };
  
  // Extract meal name - use regex to find what the meal appears to be
  const mealNameMatch = mealOutput.match(/meal comprises (.*?)\./) || 
                        mealOutput.match(/meal consists of (.*?)\./) ||
                        mealOutput.match(/meal includes (.*?)\./);
  if (mealNameMatch && mealNameMatch[1]) {
    result.name = mealNameMatch[1].charAt(0).toUpperCase() + mealNameMatch[1].slice(1);
  }
  
  // Extract calories
  const caloriesMatch = mealOutput.match(/Total Estimated Calories[^\d]*(\d+)[-\s]*(\d+)/) ||
                        mealOutput.match(/Calories[^\d]*(\d+)[-\s]*(\d+)/);
  if (caloriesMatch) {
    // Use the midpoint of the range
    const minCal = parseInt(caloriesMatch[1]);
    const maxCal = parseInt(caloriesMatch[2]);
    result.calories = Math.round((minCal + maxCal) / 2).toString();
  }
  
  // Extract macronutrients
  const proteinMatch = mealOutput.match(/Protein[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*grams/) || 
                       mealOutput.match(/Protein[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*g/);
  if (proteinMatch) {
    const minProtein = parseInt(proteinMatch[1]);
    const maxProtein = parseInt(proteinMatch[2]);
    result.protein = Math.round((minProtein + maxProtein) / 2).toString();
  }
  
  const carbsMatch = mealOutput.match(/Carbohydrates[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*grams/) || 
                     mealOutput.match(/Carbohydrates[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*g/);
  if (carbsMatch) {
    const minCarbs = parseInt(carbsMatch[1]);
    const maxCarbs = parseInt(carbsMatch[2]);
    result.carbs = Math.round((minCarbs + maxCarbs) / 2).toString();
  }
  
  const fatMatch = mealOutput.match(/Fats[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*grams/) || 
                   mealOutput.match(/Fats[^:]*:[^0-9]*(\d+)[-\s]*(\d+)\s*g/);
  if (fatMatch) {
    const minFat = parseInt(fatMatch[1]);
    const maxFat = parseInt(fatMatch[2]);
    result.fat = Math.round((minFat + maxFat) / 2).toString();
  }
  
  // Extract ratings
  const cardiovascularMatch = mealOutput.match(/Cardiovascular Health[^:]*:\s*([A-F])/);
  if (cardiovascularMatch) {
    result.ratings.cardiovascular = cardiovascularMatch[1];
  }
  
  const cancerMatch = mealOutput.match(/Cancer Prevention[^:]*:\s*([A-F])/);
  if (cancerMatch) {
    result.ratings.cancer = cancerMatch[1];
  }
  
  const cognitiveMatch = mealOutput.match(/Cognitive Health[^:]*:\s*([A-F])/);
  if (cognitiveMatch) {
    result.ratings.cognitive = cognitiveMatch[1];
  }
  
  const metabolicMatch = mealOutput.match(/Metabolic Health[^:]*:\s*([A-F])/);
  if (metabolicMatch) {
    result.ratings.metabolic = metabolicMatch[1];
  }
  
  const musculoskeletalMatch = mealOutput.match(/Musculoskeletal Health[^:]*:\s*([A-F])/);
  if (musculoskeletalMatch) {
    result.ratings.musculoskeletal = musculoskeletalMatch[1];
  }
  
  return result;
}

// Function to get rating color
function getRatingColor(rating: string): string {
  switch(rating) {
    case 'A': return 'bg-green-500/20 text-green-600 border-green-500/50';
    case 'B': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/50';
    case 'C': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50';
    case 'D': return 'bg-orange-500/20 text-orange-600 border-orange-500/50';
    case 'F': return 'bg-red-500/20 text-red-600 border-red-500/50';
    default: return 'bg-gray-500/20 text-gray-600 border-gray-500/50';
  }
}

// Calculate overall health rating
function calculateOverallRating(ratings: {[key: string]: string}): string {
  const gradeValues: {[key: string]: number} = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  
  let total = 0;
  let count = 0;
  
  for (const key in ratings) {
    if (ratings[key] && gradeValues[ratings[key]] !== undefined) {
      total += gradeValues[ratings[key]];
      count++;
    }
  }
  
  const average = count > 0 ? total / count : 2; // Default to C if no ratings
  
  if (average >= 3.5) return 'A';
  if (average >= 2.5) return 'B';
  if (average >= 1.5) return 'C';
  if (average >= 0.5) return 'D';
  return 'F';
}

export default function MealsList() {
  const [meals, setMeals] = useState<ParsedMeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchMeals() {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          console.log("No token found, redirecting to login...")
          router.push("/login")
          return
        }

        console.log("Fetching meals from API...")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/meals`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log("API Response Status:", response.status)
        
        if (response.ok) {
          const data = await response.json() as MealData[]
          console.log("Raw meal data from API:", data)
          
          // Log details about each meal for debugging
          if (Array.isArray(data)) {
            console.log(`Received ${data.length} meals from API`)
            
            // Process the meal data
            const parsedMeals = data.map((mealData) => {
              console.log(`Processing meal ${mealData.id}...`)
              
              // Extract meal details from the markdown output
              const parsedOutput = parseMealOutput(mealData.meal_output || '');
              console.log(`Parsed output for meal ${mealData.id}:`, parsedOutput);
              
              // Build the image URL
              const imageUrl = mealData.meal_image ? 
                `${process.env.NEXT_PUBLIC_API_URL}/static/${mealData.meal_image}` : 
                '/placeholder-meal.jpg';
              
              return {
                id: mealData.id,
                name: parsedOutput.name,
                image_url: imageUrl,
                consumed_at: mealData.created_at,
                calories: parsedOutput.calories,
                protein: parsedOutput.protein,
                carbs: parsedOutput.carbs,
                fat: parsedOutput.fat,
                ratings: parsedOutput.ratings
              };
            });
            
            console.log("Parsed meals:", parsedMeals);
            setMeals(parsedMeals);
          } else {
            console.log("Unexpected data format:", typeof data)
          }
        } else {
          console.error("API Error Response:", response.status, response.statusText)
          try {
            // Try to get error details if available
            const errorData = await response.text()
            console.error("Error response data:", errorData)
          } catch (e) {
            console.error("Could not parse error response")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching meals:", error)
        toast({
          title: "Error",
          description: "Failed to fetch meals. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeals()
  }, [router, toast])

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("Starting meal image upload process...")
    console.log("File selected:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)}KB`
    })

    setIsUploading(true)
    setUploadStatus('uploading')
    
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.log("No token found, redirecting to login...")
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append('meal_image', file)
      console.log("FormData prepared with image")
      
      setUploadStatus('uploading')
      console.log("Uploading meal image to API...")
      
      // Debug network request
      console.log("Network request:", {
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/meals`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer [TOKEN_HIDDEN]'
        },
        payload: 'FormData with image'
      })
      
      const uploadStartTime = performance.now()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      const uploadEndTime = performance.now()
      
      console.log(`Upload API Response Status: ${response.status} (took ${(uploadEndTime - uploadStartTime).toFixed(2)}ms)`)
      
      if (response.ok) {
        console.log("Meal image upload successful")
        
        // Try to get the response data
        try {
          const responseData = await response.json()
          console.log("Upload response data:", responseData)
        } catch (e) {
          console.log("No JSON response from upload")
        }
        
        setUploadStatus('success')
        toast({
          title: "Upload successful",
          description: "Your meal image has been uploaded and is being analyzed.",
        })
        
        // Refresh the meals list
        console.log("Refreshing meals list after upload...")
        const refreshStartTime = performance.now()
        const mealsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/meals`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const refreshEndTime = performance.now()
        
        console.log(`Refresh API Response Status: ${mealsResponse.status} (took ${(refreshEndTime - refreshStartTime).toFixed(2)}ms)`)
        
        if (mealsResponse.ok) {
          const data = await mealsResponse.json() as MealData[]
          console.log("Updated meals data:", data)
          
          // Process the meal data like in the fetch meals function
          if (Array.isArray(data)) {
            const parsedMeals = data.map((mealData) => {
              // Extract meal details from the markdown output
              const parsedOutput = parseMealOutput(mealData.meal_output || '');
              
              // Build the image URL
              const imageUrl = mealData.meal_image ? 
                `${process.env.NEXT_PUBLIC_API_URL}/static/${mealData.meal_image}` : 
                '/placeholder-meal.jpg';
              
              return {
                id: mealData.id,
                name: parsedOutput.name,
                image_url: imageUrl,
                consumed_at: mealData.created_at,
                calories: parsedOutput.calories,
                protein: parsedOutput.protein,
                carbs: parsedOutput.carbs,
                fat: parsedOutput.fat,
                ratings: parsedOutput.ratings
              };
            });
            
            console.log("Parsed meals after upload:", parsedMeals);
            setMeals(parsedMeals);
          }
        } else {
          console.error("Failed to refresh meals after upload:", mealsResponse.status)
          try {
            // Try to get error details
            const errorData = await mealsResponse.text()
            console.error("Error response data:", errorData)
          } catch (e) {
            console.error("Could not parse error response")
          }
        }
      } else {
        console.error("Meal upload failed with status:", response.status, response.statusText)
        try {
          // Try to get error details
          const errorData = await response.text()
          console.error("Error response data:", errorData)
        } catch (e) {
          console.error("Could not parse error response")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error uploading meal image:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      setUploadStatus('error')
      toast({
        title: "Upload failed",
        description: "Failed to upload meal image. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    })
  }

  if (isLoading) return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="animate-pulse text-xl font-bold text-primary">Loading meals...</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Meal Tracker</h1>

      {/* Image Upload Section */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add a meal by uploading an image</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isUploading ? 'bg-primary/5 border-primary/30' : 'hover:bg-primary/5 hover:border-primary/30'}
            `}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center justify-center gap-2">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              
              {uploadStatus === 'idle' && (
                <>
                  <p className="text-lg font-medium">Drag & drop your meal photo or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, HEIC</p>
                </>
              )}
              
              {uploadStatus === 'uploading' && (
                <>
                  <p className="text-lg font-medium">Uploading...</p>
                  <div className="w-full max-w-xs bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full animate-progress" style={{ width: '60%' }}></div>
                  </div>
                </>
              )}
              
              {uploadStatus === 'processing' && (
                <>
                  <p className="text-lg font-medium">Processing your meal image...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </>
              )}
              
              {uploadStatus === 'success' && (
                <>
                  <p className="text-lg font-medium text-green-600">Upload successful!</p>
                  <p className="text-sm text-muted-foreground">Your meal is being analyzed</p>
                </>
              )}
              
              {uploadStatus === 'error' && (
                <>
                  <p className="text-lg font-medium text-red-600">Upload failed</p>
                  <p className="text-sm text-muted-foreground">Please try again</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={meal.image_url} 
                alt={meal.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(meal.consumed_at)}</span>
                <span className="text-xs">•</span>
                <Clock className="h-4 w-4" />
                <span>{formatTime(meal.consumed_at)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <Text className="text-sm text-muted-foreground">Calories</Text>
                  <Text className="text-lg font-semibold">{meal.calories}</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm text-muted-foreground">Protein</Text>
                  <Text className="text-lg font-semibold">{meal.protein}g</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm text-muted-foreground">Carbs</Text>
                  <Text className="text-lg font-semibold">{meal.carbs}g</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm text-muted-foreground">Fat</Text>
                  <Text className="text-lg font-semibold">{meal.fat}g</Text>
                </div>
              </div>
              
              <div className="mb-4">
                <Text className="text-sm text-muted-foreground mb-2">Health Ratings</Text>
                <div className="grid grid-cols-5 gap-1">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getRatingColor(meal.ratings.cardiovascular)}`}>
                      <Text className="font-bold">{meal.ratings.cardiovascular}</Text>
                    </div>
                    <Text className="text-xs text-muted-foreground mt-1">Heart</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getRatingColor(meal.ratings.cancer)}`}>
                      <Text className="font-bold">{meal.ratings.cancer}</Text>
                    </div>
                    <Text className="text-xs text-muted-foreground mt-1">Cancer</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getRatingColor(meal.ratings.cognitive)}`}>
                      <Text className="font-bold">{meal.ratings.cognitive}</Text>
                    </div>
                    <Text className="text-xs text-muted-foreground mt-1">Brain</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getRatingColor(meal.ratings.metabolic)}`}>
                      <Text className="font-bold">{meal.ratings.metabolic}</Text>
                    </div>
                    <Text className="text-xs text-muted-foreground mt-1">Metab</Text>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getRatingColor(meal.ratings.musculoskeletal)}`}>
                      <Text className="font-bold">{meal.ratings.musculoskeletal}</Text>
                    </div>
                    <Text className="text-xs text-muted-foreground mt-1">Muscle</Text>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Badge variant="outline" className={getRatingColor(calculateOverallRating(meal.ratings))}>
                  {calculateOverallRating(meal.ratings) === 'A' ? 'Excellent' : 
                   calculateOverallRating(meal.ratings) === 'B' ? 'Good' : 
                   calculateOverallRating(meal.ratings) === 'C' ? 'Average' :
                   calculateOverallRating(meal.ratings) === 'D' ? 'Poor' : 'Unhealthy'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {meals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No meals recorded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload a meal image to get started</p>
        </div>
      )}
    </div>
  )
}
