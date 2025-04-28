'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/typography"
import { Meal } from "@/types/dashboard"
import { UploadCloud, Calendar, Clock, Info, Heart, Brain, Zap, AlertCircle, Dumbbell, X, Utensils } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MealData {
  id: number
  user_id: number
  meal_image_url: string
  meal_output: string | any // This can be a JSON string or parsed object
  meal_rating: string | null
  created_at: string
}

interface ParsedMeal {
  id: number
  user_id: number
  meal_image_url: string
  meal_output: string | any
  meal_rating: string | null
  created_at: string
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
  parsed: {
    name: string
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
    pillarComments?: {
      cardiovascular: string
      cancer: string
      cognitive: string
      metabolic: string
      musculoskeletal: string
    }
    micronutrients?: { name: string; amount: string; unit: string; }[]
    health_benefits?: string[]
    recommendations?: string[]
    overall_assessment?: string
    health_concerns?: string[]
  }
  overallRating: string
  cardColor: string
}

// Component to display individual pillar ratings
const PillarRating = ({ name, rating }: { name: string; rating: string }) => {
  return (
    <div className="flex flex-col items-center rounded-md border p-2">
      <span className="text-xs text-muted-foreground">{name}</span>
      <span className={`text-lg font-bold ${getRatingColor(rating)}`}>
        {rating}
      </span>
    </div>
  );
};

// Updated function to extract information from meal_output JSON
function parseMealOutput(mealOutput: string | any): {
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
  },
  pillarComments?: {
    cardiovascular: string,
    cancer: string,
    cognitive: string,
    metabolic: string,
    musculoskeletal: string
  },
  micronutrients?: { name: string; amount: string; unit: string; }[],
  health_benefits?: string[],
  recommendations?: string[],
  overall_assessment?: string,
  health_concerns?: string[]
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
    },
    pillarComments: {
      cardiovascular: "",
      cancer: "",
      cognitive: "",
      metabolic: "",
      musculoskeletal: ""
    },
    micronutrients: [] as { name: string; amount: string; unit: string; }[],
    health_benefits: [] as string[],
    recommendations: [] as string[],
    overall_assessment: "",
    health_concerns: [] as string[]
  };
  
  try {
    // First, ensure mealOutput is a JSON object
    let outputData: any;
    
    if (typeof mealOutput === 'string') {
      try {
        // Try to parse it if it's a string
        outputData = JSON.parse(mealOutput);
      } catch (err) {
        console.warn("Failed to parse meal_output as JSON, falling back to regex parsing");
        // Fall back to old parsing method for backward compatibility
        return parseMarkdownOutput(mealOutput);
      }
    } else {
      // It's already an object
      outputData = mealOutput;
    }
    
    // Extract data from the JSON structure
    if (outputData) {
      // Extract meal name
      if (outputData.meal_name) {
        result.name = outputData.meal_name;
      }
      
      // Extract calories
      if (outputData.analysis?.estimated_caloric_content) {
        const calorieData = outputData.analysis.estimated_caloric_content;
        // Use the midpoint of min-max range
        if (calorieData.min && calorieData.max) {
          result.calories = Math.round((calorieData.min + calorieData.max) / 2).toString();
        }
      }
      
      // Extract macronutrients
      if (outputData.analysis?.macronutrients) {
        const macros = outputData.analysis.macronutrients;
        
        if (macros.protein?.amount) {
          result.protein = macros.protein.amount.toString();
        }
        
        if (macros.carbohydrates?.amount) {
          result.carbs = macros.carbohydrates.amount.toString();
        }
        
        if (macros.fats?.amount) {
          result.fat = macros.fats.amount.toString();
        }
      }
      
      // Extract health ratings and notes
      if (outputData.analysis?.longevity_pillars) {
        const pillars = outputData.analysis.longevity_pillars;
        
        if (pillars.cardiovascular_health?.grade) {
          result.ratings.cardiovascular = pillars.cardiovascular_health.grade;
          // Extract notes if available
          if (pillars.cardiovascular_health?.notes) {
            result.pillarComments.cardiovascular = pillars.cardiovascular_health.notes;
          }
        }
        
        if (pillars.cancer_prevention?.grade) {
          result.ratings.cancer = pillars.cancer_prevention.grade;
          // Extract notes if available
          if (pillars.cancer_prevention?.notes) {
            result.pillarComments.cancer = pillars.cancer_prevention.notes;
          }
        }
        
        if (pillars.cognitive_health?.grade) {
          result.ratings.cognitive = pillars.cognitive_health.grade;
          // Extract notes if available
          if (pillars.cognitive_health?.notes) {
            result.pillarComments.cognitive = pillars.cognitive_health.notes;
          }
        }
        
        if (pillars.metabolic_health?.grade) {
          result.ratings.metabolic = pillars.metabolic_health.grade;
          // Extract notes if available
          if (pillars.metabolic_health?.notes) {
            result.pillarComments.metabolic = pillars.metabolic_health.notes;
          }
        }
        
        if (pillars.musculoskeletal_health?.grade) {
          result.ratings.musculoskeletal = pillars.musculoskeletal_health.grade;
          // Extract notes if available
          if (pillars.musculoskeletal_health?.notes) {
            result.pillarComments.musculoskeletal = pillars.musculoskeletal_health.notes;
          }
        }
      }
      
      // Extract micronutrients
      if (outputData.analysis?.micronutrients && Array.isArray(outputData.analysis.micronutrients)) {
        result.micronutrients = outputData.analysis.micronutrients.map((nutrient: any) => ({
          name: nutrient.name || '',
          amount: nutrient.amount?.toString() || '0',
          unit: nutrient.unit || 'mg'
        }));
      }
      
      // Extract health benefits
      if (outputData.analysis?.health_benefits && Array.isArray(outputData.analysis.health_benefits)) {
        result.health_benefits = outputData.analysis.health_benefits;
      }
      
      // Extract recommendations
      if (outputData.recommendations && Array.isArray(outputData.recommendations)) {
        result.recommendations = outputData.recommendations;
      }
      
      // Extract overall nutritional assessment
      if (outputData.overall_nutritional_assessment) {
        result.overall_assessment = outputData.overall_nutritional_assessment;
      }
      
      // Extract health benefits and concerns
      if (outputData.health) {
        if (outputData.health.benefits && Array.isArray(outputData.health.benefits)) {
          result.health_benefits = outputData.health.benefits;
        }
        
        if (outputData.health.concerns && Array.isArray(outputData.health.concerns)) {
          result.health_concerns = outputData.health.concerns;
        }
      }
    }
  } catch (error) {
    console.error("Error parsing meal output:", error);
    // Return default values in case of error
  }
  
  return result;
}

// Keep the old function for backward compatibility, renamed for clarity
function parseMarkdownOutput(mealOutput: string): {
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
    case 'A': return 'text-green-600';
    case 'B': return 'text-emerald-600';
    case 'C': return 'text-yellow-600';
    case 'D': return 'text-orange-600';
    case 'F': return 'text-red-600';
    default: return 'text-gray-600';
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

// Extract a section from meal_output text
function extractSection(text: string, sectionHeader: string): string | null {
  if (!text || !sectionHeader) return null;
  
  const startIndex = text.indexOf(sectionHeader);
  if (startIndex === -1) return null;
  
  let endIndex = text.length;
  // Find the next section header after this one
  const nextSectionHeaders = [
    'Ingredients:', 
    'Preparation:', 
    'Nutritional Analysis:', 
    'Dietary Notes:', 
    'Dietary Considerations:', 
    'Health Ratings:', 
    'Recommendations:'
  ];
  
  for (const header of nextSectionHeaders) {
    if (header === sectionHeader) continue;
    
    const headerIndex = text.indexOf(header, startIndex + sectionHeader.length);
    if (headerIndex !== -1 && headerIndex < endIndex) {
      endIndex = headerIndex;
    }
  }
  
  // Extract the content between the section header and the next header
  const sectionContent = text.substring(startIndex + sectionHeader.length, endIndex).trim();
  return sectionContent;
}

export default function MealsList() {
  const [meals, setMeals] = useState<ParsedMeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [selectedMeal, setSelectedMeal] = useState<ParsedMeal | null>(null)

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
              const imageUrl = mealData.meal_image_url ? 
                `${process.env.NEXT_PUBLIC_API_URL}/static/${mealData.meal_image_url}` : 
                '/images/meals/lasagna.jpeg';
              
              return {
                ...mealData,
                name: parsedOutput.name,
                image_url: imageUrl,
                consumed_at: mealData.created_at,
                calories: parsedOutput.calories,
                protein: parsedOutput.protein,
                carbs: parsedOutput.carbs,
                fat: parsedOutput.fat,
                ratings: parsedOutput.ratings,
                parsed: {
                  ...parsedOutput,
                  name: parsedOutput.name,
                  calories: parsedOutput.calories,
                  protein: parsedOutput.protein,
                  carbs: parsedOutput.carbs,
                  fat: parsedOutput.fat,
                  ratings: parsedOutput.ratings,
                  overall_assessment: parsedOutput.overall_assessment,
                  health_concerns: parsedOutput.health_concerns
                },
                overallRating: calculateOverallRating(parsedOutput.ratings),
                cardColor: getRatingColor(calculateOverallRating(parsedOutput.ratings))
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
          const parsedMeals = data.map((mealData) => {
            // Extract meal details from the markdown output
            const parsedOutput = parseMealOutput(mealData.meal_output || '');
            
            // Build the image URL
            const imageUrl = mealData.meal_image_url ? 
              `${process.env.NEXT_PUBLIC_API_URL}/static/${mealData.meal_image_url}` : 
              '/images/meals/lasagna.jpeg';
            
            return {
              ...mealData,
              name: parsedOutput.name,
              image_url: imageUrl,
              consumed_at: mealData.created_at,
              calories: parsedOutput.calories,
              protein: parsedOutput.protein,
              carbs: parsedOutput.carbs,
              fat: parsedOutput.fat,
              ratings: parsedOutput.ratings,
              parsed: {
                ...parsedOutput,
                name: parsedOutput.name,
                calories: parsedOutput.calories,
                protein: parsedOutput.protein,
                carbs: parsedOutput.carbs,
                fat: parsedOutput.fat,
                ratings: parsedOutput.ratings,
                overall_assessment: parsedOutput.overall_assessment,
                health_concerns: parsedOutput.health_concerns
              },
              overallRating: calculateOverallRating(parsedOutput.ratings),
              cardColor: getRatingColor(calculateOverallRating(parsedOutput.ratings))
            };
          });
          
          console.log("Parsed meals after upload:", parsedMeals);
          setMeals(parsedMeals);
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
          <Card
            key={meal.id}
            className="overflow-hidden border bg-background shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedMeal(meal)}
          >
            {meal.image_url && (
              <div className="relative h-40 w-full">
                <Image
                  alt={`Image of ${meal.parsed.name}`}
                  src={meal.image_url}
                  layout="fill"
                  objectFit="cover"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{meal.parsed.name}</CardTitle>
              <CardDescription>
                {new Date(meal.consumed_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs text-muted-foreground">Calories</span>
                  <span className="text-lg font-bold">{meal.parsed.calories}</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs text-muted-foreground">Protein</span>
                  <span className="text-lg font-bold">{meal.parsed.protein}g</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs text-muted-foreground">Carbs</span>
                  <span className="text-lg font-bold">{meal.parsed.carbs}g</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs text-muted-foreground">Fat</span>
                  <span className="text-lg font-bold">{meal.parsed.fat}g</span>
                </div>
              </div>
              
              {/* Health Pillars Ratings */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Health Ratings</h4>
                <div className="grid grid-cols-3 gap-2">
                  <PillarRating 
                    name="Cardiovascular" 
                    rating={meal.parsed.ratings.cardiovascular} 
                  />
                  <PillarRating 
                    name="Cancer" 
                    rating={meal.parsed.ratings.cancer} 
                  />
                  <PillarRating 
                    name="Cognitive" 
                    rating={meal.parsed.ratings.cognitive} 
                  />
                  <PillarRating 
                    name="Metabolic" 
                    rating={meal.parsed.ratings.metabolic} 
                  />
                  <PillarRating 
                    name="Musculoskeletal" 
                    rating={meal.parsed.ratings.musculoskeletal} 
                  />
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Overall</span>
                    <span className={`text-lg font-bold ${getRatingColor(meal.overallRating)}`}>
                      {meal.overallRating}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Micronutrients - Only show if available */}
              {meal.parsed.micronutrients && meal.parsed.micronutrients.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Key Micronutrients</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {meal.parsed.micronutrients.slice(0, 6).map((nutrient, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2 text-xs">
                          <span>{nutrient.name}</span>
                          <span className="font-medium">{nutrient.amount} {nutrient.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Health Benefits - Only show if available */}
              {meal.parsed.health_benefits && meal.parsed.health_benefits.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Health Benefits</h4>
                  <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                    <ul className="list-inside list-disc text-xs">
                      {meal.parsed.health_benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Recommendations - Only show if available */}
              {meal.parsed.recommendations && meal.parsed.recommendations.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Recommendations</h4>
                  <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                    <ul className="list-inside list-disc text-xs">
                      {meal.parsed.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
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

      {/* Meal Details Dialog */}
      {selectedMeal && (
        <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-xl">{selectedMeal.parsed.name}</DialogTitle>
              <DialogDescription className="pt-1">
                {new Date(selectedMeal.consumed_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6">
              {/* Nutrition Info */}
              <div>
                <h3 className="text-sm font-medium mb-3">Nutrition Details</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs text-muted-foreground">Calories</span>
                    <span className="text-lg font-bold">{selectedMeal.parsed.calories}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs text-muted-foreground">Protein</span>
                    <span className="text-lg font-bold">{selectedMeal.parsed.protein}g</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs text-muted-foreground">Carbs</span>
                    <span className="text-lg font-bold">{selectedMeal.parsed.carbs}g</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs text-muted-foreground">Fat</span>
                    <span className="text-lg font-bold">{selectedMeal.parsed.fat}g</span>
                  </div>
                </div>
              </div>
              
              {/* Overall Nutritional Assessment - if available */}
              {selectedMeal.parsed.overall_assessment && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Overall Assessment</h3>
                  <div className="rounded-md border p-3">
                    <p className="text-sm">{selectedMeal.parsed.overall_assessment}</p>
                  </div>
                </div>
              )}
              
              {/* Health Benefits and Concerns together */}
              {(() => {
                const hasHealthBenefits = Array.isArray(selectedMeal.parsed.health_benefits) && selectedMeal.parsed.health_benefits.length > 0;
                const hasHealthConcerns = Array.isArray(selectedMeal.parsed.health_concerns) && selectedMeal.parsed.health_concerns.length > 0;
                
                if (!hasHealthBenefits && !hasHealthConcerns) return null;
                
                return (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Health Impact</h3>
                    <div className="rounded-md border p-3">
                      {hasHealthBenefits && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold mb-2">Benefits:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {selectedMeal.parsed.health_benefits!.map((benefit, index) => (
                              <li key={index} className="text-green-600">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {hasHealthConcerns && (
                        <div>
                          <h4 className="text-xs font-semibold mb-2">Concerns:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {selectedMeal.parsed.health_concerns!.map((concern, index) => (
                              <li key={index} className="text-amber-600">{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              
              {/* Health Ratings */}
              <div>
                <h3 className="text-sm font-medium mb-3">Health Ratings</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Cardiovascular</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.parsed.ratings.cardiovascular)}`}>
                      {selectedMeal.parsed.ratings.cardiovascular}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Cancer</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.parsed.ratings.cancer)}`}>
                      {selectedMeal.parsed.ratings.cancer}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Cognitive</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.parsed.ratings.cognitive)}`}>
                      {selectedMeal.parsed.ratings.cognitive}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Metabolic</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.parsed.ratings.metabolic)}`}>
                      {selectedMeal.parsed.ratings.metabolic}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Musculoskeletal</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.parsed.ratings.musculoskeletal)}`}>
                      {selectedMeal.parsed.ratings.musculoskeletal}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">Overall</span>
                    <span className={`text-lg font-bold ${getRatingColor(selectedMeal.overallRating)}`}>
                      {selectedMeal.overallRating}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Micronutrients */}
              {selectedMeal.parsed.micronutrients && selectedMeal.parsed.micronutrients.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Micronutrients</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedMeal.parsed.micronutrients.map((nutrient, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2 text-xs">
                        <span>{nutrient.name}</span>
                        <span className="font-medium">{nutrient.amount} {nutrient.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              {selectedMeal.parsed.recommendations && selectedMeal.parsed.recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Recommendations</h3>
                  <div className="rounded-md border p-3">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {selectedMeal.parsed.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Additional Meal Details */}
              <div>
                <h3 className="text-sm font-medium mb-3">Meal Details</h3>
                <div className="rounded-md border p-3">
                  <div className="grid gap-3 text-sm">
                    {/* Meal Name with Icon */}
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Meal Name:</span>
                      <span>{selectedMeal.parsed.name}</span>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Date:</span>
                      <span>{formatDate(selectedMeal.consumed_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">Time:</span>
                      <span>{formatTime(selectedMeal.consumed_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detailed Nutritional Information */}
              <div>
                <h3 className="text-sm font-medium mb-3">Detailed Nutrition</h3>
                <div className="rounded-md border p-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Calories:</span>
                      <span>{selectedMeal.parsed.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Protein:</span>
                      <span>{selectedMeal.parsed.protein}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Carbs:</span>
                      <span>{selectedMeal.parsed.carbs}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Fat:</span>
                      <span>{selectedMeal.parsed.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar Specific Analysis */}
              <div>
                <h3 className="text-sm font-medium mb-3">Pillar Analysis</h3>
                <div className="rounded-md border p-3">
                  <div className="grid gap-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Cardiovascular:</span>
                        <span className={getRatingColor(selectedMeal.parsed.ratings.cardiovascular)}>
                          Grade {selectedMeal.parsed.ratings.cardiovascular}
                        </span>
                      </div>
                      {selectedMeal.parsed.pillarComments?.cardiovascular && (
                        <p className="mt-1 ml-6 text-muted-foreground text-xs">
                          {selectedMeal.parsed.pillarComments.cardiovascular}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Cancer Prevention:</span>
                        <span className={getRatingColor(selectedMeal.parsed.ratings.cancer)}>
                          Grade {selectedMeal.parsed.ratings.cancer}
                        </span>
                      </div>
                      {selectedMeal.parsed.pillarComments?.cancer && (
                        <p className="mt-1 ml-6 text-muted-foreground text-xs">
                          {selectedMeal.parsed.pillarComments.cancer}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Cognitive:</span>
                        <span className={getRatingColor(selectedMeal.parsed.ratings.cognitive)}>
                          Grade {selectedMeal.parsed.ratings.cognitive}
                        </span>
                      </div>
                      {selectedMeal.parsed.pillarComments?.cognitive && (
                        <p className="mt-1 ml-6 text-muted-foreground text-xs">
                          {selectedMeal.parsed.pillarComments.cognitive}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Metabolic:</span>
                        <span className={getRatingColor(selectedMeal.parsed.ratings.metabolic)}>
                          Grade {selectedMeal.parsed.ratings.metabolic}
                        </span>
                      </div>
                      {selectedMeal.parsed.pillarComments?.metabolic && (
                        <p className="mt-1 ml-6 text-muted-foreground text-xs">
                          {selectedMeal.parsed.pillarComments.metabolic}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Musculoskeletal:</span>
                        <span className={getRatingColor(selectedMeal.parsed.ratings.musculoskeletal)}>
                          Grade {selectedMeal.parsed.ratings.musculoskeletal}
                        </span>
                      </div>
                      {selectedMeal.parsed.pillarComments?.musculoskeletal && (
                        <p className="mt-1 ml-6 text-muted-foreground text-xs">
                          {selectedMeal.parsed.pillarComments.musculoskeletal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Raw Data Toggle (For Developers/Debugging) */}
              <div className="mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = document.getElementById(`raw-data-${selectedMeal.id}`);
                    if (el) {
                      el.style.display = el.style.display === 'none' ? 'block' : 'none';
                    }
                  }}
                >
                  <Info className="h-3 w-3 mr-1" /> Show Raw Data
                </Button>
                <div 
                  id={`raw-data-${selectedMeal.id}`} 
                  className="rounded-md border p-3 mt-2 max-h-[300px] overflow-y-auto bg-gray-50"
                  style={{ display: 'none' }}
                >
                  <div className="text-xs font-mono whitespace-pre-wrap">
                    {typeof selectedMeal.meal_output === 'string' 
                      ? selectedMeal.meal_output 
                      : JSON.stringify(selectedMeal.meal_output, null, 2)
                    }
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
