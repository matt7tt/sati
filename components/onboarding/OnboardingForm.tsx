"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading, Text } from "@/components/ui/typography"
import { CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Define the steps for the onboarding process based on the intake form
const steps = [
  {
    id: 1,
    title: "Patient Information",
    description: "Provide basic personal and contact information."
  },
  {
    id: 2,
    title: "Health History",
    description: "Outline your personal medical history and family health background."
  },
  {
    id: 3,
    title: "Lifestyle Factors",
    description: "Describe your daily habits, routines, and psychosocial factors that affect your health."
  },
  {
    id: 4,
    title: "Biometrics & Lab Data",
    description: "Share your recent measurements and laboratory test results for more personalized recommendations."
  },
  {
    id: 5,
    title: "Goals & Concerns",
    description: "Tell us about your health goals, concerns, and areas of interest for personalized optimization."
  },
  {
    id: 6,
    title: "Tracking & Feedback Preferences",
    description: "Let us know how you prefer to receive insights and track your progress."
  }
]

interface OnboardingFormProps {
  onStepChange?: (step: number) => void;
}

interface OnboardingFormData {
  // Basic fields
  fullName: string;
  dateOfBirth: string;
  genderIdentity: string;
  phoneNumber: string;
  emailAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  ethnicity: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;

  // Health History
  pastMedicalConditions: string;
  familyMedicalHistory: string;
  currentMedications: string;
  pastMedications: string;
  allergiesIntolerances: string;
  tetanusTdTdap: string;
  tetanusUpToDate: boolean;
  tetanusLastDose: string;
  fluVaccine: boolean;
  fluLastDose: string;
  covidVaccine: boolean;
  covidLastDose: string;
  otherImmunizations: string;

  // Lifestyle Factors
  dietaryPattern: string;
  foodSensitivities: string;
  alcoholConsumption: string;
  caffeineConsumption: string;
  hydrationHabits: string;
  exerciseType: string;
  exerciseFrequency: string;
  exerciseIntensity: string;
  exerciseLimitations: string;
  sleepDuration: string;
  sleepQuality: string;
  bedtimeWakingTime: string;
  sleepDisorders: string;
  hasSleepDisorders: boolean;
  stressLevel: string;
  mainStressors: string;
  copingMechanisms: string;
  mentalHealthHistory: string;
  supportSystem: string;
  socialInteractionLevel: string;
  relationshipSatisfaction: string;
  occupation: string;
  workHours: string;
  workEnvironmentStress: string;
  workLifeBalance: string;
  burnoutJobStrain: boolean;
  burnoutDetails: string;

  // Biometrics & Lab Data
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  bmi: string;
  bodyFatPercentage: string;
  waistCircumference: string;
  waistCircumferenceUnit: string;
  hipCircumference: string;
  hipCircumferenceUnit: string;
  waistToHipRatio: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  restingHeartRate: string;
  heartRateVariability: string;
  vo2Max: string;
  totalCholesterol: string;
  ldlCholesterol: string;
  hdlCholesterol: string;
  triglycerides: string;
  bloodGlucoseFasting: string;
  bloodGlucoseA1c: string;
  crp: string;
  otherInflammatoryMarkers: string;
  tsh: string;
  testosterone: string;
  estrogen: string;
  cortisol: string;
  otherHormones: string;
  vitaminD: string;
  vitaminB12: string;
  ironFerritin: string;
  otherVitaminsMinerals: string;

  // Goals & Concerns
  primaryHealthGoals: string;
  biggestHealthConcerns: string;
  healthGoalsConcerns: string;
  diseasePrevention: string;
  mentalSharpness: string;
  vitalityEnergyLevels: string;
  areasOfInterest: string;
  additionalGoalsConcerns: string;

  // Concerns
  concernChronicDisease: boolean;
  concernCognitiveDecline: boolean;
  concernPhysicalDecline: boolean;
  concernAppearanceChanges: boolean;
  concernEnergyVitality: boolean;
  concernOther: boolean;
  concernOtherDetails: string;

  // Interests
  interestBiohacking: boolean;
  interestLongevityScience: boolean;
  interestRegenerativeMedicine: boolean;
  interestPersonalizedNutrition: boolean;
  interestAdvancedFitness: boolean;
  interestSupplementation: boolean;
  interestOther: boolean;
  interestOtherDetails: string;

  // Tracking & Feedback
  insightFormatWritten: boolean;
  insightFormatPhone: boolean;
  insightFormatDashboard: boolean;
  insightFormatOther: boolean;
  insightFormatOtherDetails: string;
  checkInFrequency: string;
  checkInFrequencyOther: string;
  digitalMonitoringOpenness: string;
  wearableDeviceUse: string;
  wearableDeviceName: string;
  healthAppsUse: string;
  healthAppsNames: string;
  aiCoachingInterest: string;
  feedbackStyleCharts: boolean;
  feedbackStyleSimplified: boolean;
  feedbackStyleEncouraging: boolean;
  feedbackStyleDetailed: boolean;
  feedbackStyleOther: boolean;
  feedbackStyleOtherDetails: string;
  privacyDataConcerns: string;

  // Additional Data
  completeBloodCount: string;
  metabolicPanel: string;
  otherLabResults: string;
  hasRecentLabWork: boolean;
  labWorkDate: string;
  geneticTesting: string;
  geneticFindings: string;
  familyLongevity: string;
  microbiomeTest: string;
  microbiomeInsights: string;
  sleepTracker: string;
  averageSleepDuration: string;
  sleepQualityScore: string;
  averageDailySteps: string;
  weeklyActiveMinutes: string;
  otherFitnessMetrics: string;
  averageHRV: string;
  hrvNotes: string;
  usesCGM: string;
  glucoseLevels: string;
}

export default function OnboardingForm({ onStepChange }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Basic fields
    fullName: "",
    dateOfBirth: "",
    genderIdentity: "",
    phoneNumber: "",
    emailAddress: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    ethnicity: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    
    // Health History
    pastMedicalConditions: "",
    familyMedicalHistory: "",
    currentMedications: "",
    pastMedications: "",
    allergiesIntolerances: "",
    tetanusTdTdap: "",
    tetanusUpToDate: false,
    tetanusLastDose: "",
    fluVaccine: false,
    fluLastDose: "",
    covidVaccine: false,
    covidLastDose: "",
    otherImmunizations: "",
    
    // Lifestyle Factors
    dietaryPattern: "",
    foodSensitivities: "",
    alcoholConsumption: "",
    caffeineConsumption: "",
    hydrationHabits: "",
    exerciseType: "",
    exerciseFrequency: "",
    exerciseIntensity: "",
    exerciseLimitations: "",
    sleepDuration: "",
    sleepQuality: "",
    bedtimeWakingTime: "",
    sleepDisorders: "",
    hasSleepDisorders: false,
    stressLevel: "",
    mainStressors: "",
    copingMechanisms: "",
    mentalHealthHistory: "",
    supportSystem: "",
    socialInteractionLevel: "",
    relationshipSatisfaction: "",
    occupation: "",
    workHours: "",
    workEnvironmentStress: "",
    workLifeBalance: "",
    burnoutJobStrain: false,
    burnoutDetails: "",
    
    // Biometrics & Lab Data
    height: "",
    heightUnit: "",
    weight: "",
    weightUnit: "",
    bmi: "",
    bodyFatPercentage: "",
    waistCircumference: "",
    waistCircumferenceUnit: "",
    hipCircumference: "",
    hipCircumferenceUnit: "",
    waistToHipRatio: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    restingHeartRate: "",
    heartRateVariability: "",
    vo2Max: "",
    totalCholesterol: "",
    ldlCholesterol: "",
    hdlCholesterol: "",
    triglycerides: "",
    bloodGlucoseFasting: "",
    bloodGlucoseA1c: "",
    crp: "",
    otherInflammatoryMarkers: "",
    tsh: "",
    testosterone: "",
    estrogen: "",
    cortisol: "",
    otherHormones: "",
    vitaminD: "",
    vitaminB12: "",
    ironFerritin: "",
    otherVitaminsMinerals: "",
    
    // Goals & Concerns
    primaryHealthGoals: "",
    biggestHealthConcerns: "",
    healthGoalsConcerns: "",
    diseasePrevention: "",
    mentalSharpness: "",
    vitalityEnergyLevels: "",
    areasOfInterest: "",
    additionalGoalsConcerns: "",
    
    // Concerns
    concernChronicDisease: false,
    concernCognitiveDecline: false,
    concernPhysicalDecline: false,
    concernAppearanceChanges: false,
    concernEnergyVitality: false,
    concernOther: false,
    concernOtherDetails: "",
    
    // Interests
    interestBiohacking: false,
    interestLongevityScience: false,
    interestRegenerativeMedicine: false,
    interestPersonalizedNutrition: false,
    interestAdvancedFitness: false,
    interestSupplementation: false,
    interestOther: false,
    interestOtherDetails: "",
    
    // Tracking & Feedback
    insightFormatWritten: false,
    insightFormatPhone: false,
    insightFormatDashboard: false,
    insightFormatOther: false,
    insightFormatOtherDetails: "",
    checkInFrequency: "",
    checkInFrequencyOther: "",
    digitalMonitoringOpenness: "",
    wearableDeviceUse: "",
    wearableDeviceName: "",
    healthAppsUse: "",
    healthAppsNames: "",
    aiCoachingInterest: "",
    feedbackStyleCharts: false,
    feedbackStyleSimplified: false,
    feedbackStyleEncouraging: false,
    feedbackStyleDetailed: false,
    feedbackStyleOther: false,
    feedbackStyleOtherDetails: "",
    privacyDataConcerns: "",
    
    // Additional Data
    completeBloodCount: "",
    metabolicPanel: "",
    otherLabResults: "",
    hasRecentLabWork: false,
    labWorkDate: "",
    geneticTesting: "",
    geneticFindings: "",
    familyLongevity: "",
    microbiomeTest: "",
    microbiomeInsights: "",
    sleepTracker: "",
    averageSleepDuration: "",
    sleepQualityScore: "",
    averageDailySteps: "",
    weeklyActiveMinutes: "",
    otherFitnessMetrics: "",
    averageHRV: "",
    hrvNotes: "",
    usesCGM: "",
    glucoseLevels: "",
  })
  
  const router = useRouter()
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    validatePasswords(e.target.value, confirmPassword)
  }
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    validatePasswords(password, e.target.value)
  }
  
  const validatePasswords = (pass: string, confirm: string) => {
    if (pass && confirm && pass !== confirm) {
      setPasswordError("Passwords do not match")
    } else if (pass && pass.length < 8) {
      setPasswordError("Password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
  }
  
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const registerUser = async () => {
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(/\s+/)
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

      const registerData = {
        email: formData.emailAddress,
        first_name: firstName,
        last_name: lastName,
        password: password
      };

      console.log('Register Request URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`);
      console.log('Register Request Body:', JSON.stringify(registerData, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('Register Response Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        if (response.status === 422) {
          // Handle validation errors
          const validationErrors = errorData.detail.map((err: any) => err.msg).join(', ')
          throw new Error(`Validation error: ${validationErrors}`)
        }
        throw new Error(errorData.message || 'Registration failed')
      }
      
      const data = await response.json()
      console.log('Register Response:', data);

      // Login to get auth token
      await loginUser(formData.emailAddress, password);

      return data.id // Return the user ID from the response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }
  
  const submitIntakeForm = async (userId: number) => {
    try {
      // Format dates to ISO format
      const formatDate = (dateStr: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toISOString();
      };

      // Get auth token
      const token = localStorage.getItem('token');

      // Map form data to API schema
      const intakeData = {
        full_name: formData.fullName,
        date_of_birth: formatDate(formData.dateOfBirth),
        gender_identity: formData.genderIdentity,
        phone_number: formData.phoneNumber,
        email_address: formData.emailAddress,
        address_line1: formData.streetAddress,
        address_line2: "",
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: formData.country,
        ethnicity: formData.ethnicity,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_relationship: formData.emergencyContactRelationship,
        emergency_contact_phone: formData.emergencyContactPhone,
        past_medical_conditions: formData.pastMedicalConditions,
        family_medical_history: formData.familyMedicalHistory,
        current_medications: formData.currentMedications,
        past_medications: formData.pastMedications,
        allergies: formData.allergiesIntolerances,
        tetanus_up_to_date: formData.tetanusUpToDate,
        tetanus_last_dose: formatDate(formData.tetanusLastDose),
        flu: formData.fluVaccine,
        flu_last_dose: formatDate(formData.fluLastDose),
        covid19: formData.covidVaccine,
        covid19_last_dose: formatDate(formData.covidLastDose),
        immunization_others: formData.otherImmunizations,
        dietary_pattern: formData.dietaryPattern,
        food_sensitivities: formData.foodSensitivities,
        alcohol_consumption: formData.alcoholConsumption,
        caffeine_consumption: formData.caffeineConsumption,
        hydration_habits: formData.hydrationHabits,
        exercise_type: formData.exerciseType,
        exercise_frequency: formData.exerciseFrequency,
        exercise_intensity: formData.exerciseIntensity,
        exercise_injuries: formData.exerciseLimitations,
        sleep_duration: formData.sleepDuration,
        sleep_quality: formData.sleepQuality,
        bedtime_waking_time: formData.bedtimeWakingTime,
        sleep_disorders: formData.hasSleepDisorders ? formData.sleepDisorders : "",
        perceived_stress_level: formData.stressLevel,
        main_stress_sources: formData.mainStressors,
        coping_mechanisms: formData.copingMechanisms,
        mental_health_history: formData.mentalHealthHistory,
        support_system: formData.supportSystem,
        social_interaction_level: formData.socialInteractionLevel,
        relationship_satisfaction: parseInt(formData.relationshipSatisfaction) || 0,
        occupation: formData.occupation,
        work_environment_stress: formData.workEnvironmentStress,
        work_life_balance: parseInt(formData.workLifeBalance) || 0,
        burnout: formData.burnoutJobStrain ? formData.burnoutDetails : "",
        height: `${formData.height} ${formData.heightUnit}`,
        weight: `${formData.weight} ${formData.weightUnit}`,
        bmi: parseFloat(formData.bmi) || 0,
        body_fat_percentage: parseFloat(formData.bodyFatPercentage) || 0,
        waist_circumference: `${formData.waistCircumference} ${formData.waistCircumferenceUnit}`,
        hip_circumference: `${formData.hipCircumference} ${formData.hipCircumferenceUnit}`,
        waist_to_hip_ratio: parseFloat(formData.waistToHipRatio) || 0,
        blood_pressure: formData.bloodPressureSystolic && formData.bloodPressureDiastolic ? 
          `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}` : "",
        resting_heart_rate: parseInt(formData.restingHeartRate) || 0,
        heart_rate_variability: formData.heartRateVariability,
        vo2_max: parseFloat(formData.vo2Max) || 0,
        total_cholesterol: parseFloat(formData.totalCholesterol) || 0,
        ldl: parseFloat(formData.ldlCholesterol) || 0,
        hdl: parseFloat(formData.hdlCholesterol) || 0,
        triglycerides: parseFloat(formData.triglycerides) || 0,
        fasting_glucose: parseFloat(formData.bloodGlucoseFasting) || 0,
        hba1c: parseFloat(formData.bloodGlucoseA1c) || 0,
        crp: parseFloat(formData.crp) || 0,
        inflammatory_others: formData.otherInflammatoryMarkers,
        tsh: parseFloat(formData.tsh) || 0,
        t4: 0, // Not in form
        testosterone: parseFloat(formData.testosterone) || 0,
        estrogen: parseFloat(formData.estrogen) || 0,
        cortisol: parseFloat(formData.cortisol) || 0,
        vitamin_d: parseFloat(formData.vitaminD) || 0,
        vitamin_b12: parseFloat(formData.vitaminB12) || 0,
        iron_ferritin: parseFloat(formData.ironFerritin) || 0,
        vitamins_others: formData.otherVitaminsMinerals,
        genetic_testing: formData.geneticTesting === "yes",
        genetic_findings: formData.geneticFindings,
        family_longevity: formData.familyLongevity,
        microbiome_test: formData.microbiomeTest === "yes",
        microbiome_insights: formData.microbiomeInsights,
        sleep_tracker: formData.sleepTracker === "yes",
        average_nightly_sleep: parseFloat(formData.averageSleepDuration) || 0,
        sleep_quality_score: parseFloat(formData.sleepQualityScore) || 0,
        average_daily_steps: parseInt(formData.averageDailySteps) || 0,
        weekly_active_minutes: parseInt(formData.weeklyActiveMinutes) || 0,
        other_fitness_metrics: formData.otherFitnessMetrics,
        wearable_hrv: parseFloat(formData.averageHRV) || 0,
        hrv_trends: formData.hrvNotes,
        cgm: formData.usesCGM === "yes",
        cgm_details: formData.glucoseLevels,
        primary_health_goals: formData.primaryHealthGoals,
        biggest_health_concerns: formData.biggestHealthConcerns,
        aging_concerns: [
          formData.concernChronicDisease ? "Chronic diseases" : "",
          formData.concernCognitiveDecline ? "Cognitive decline" : "",
          formData.concernPhysicalDecline ? "Physical decline" : "",
          formData.concernAppearanceChanges ? "Appearance changes" : "",
          formData.concernEnergyVitality ? "Energy/vitality decline" : "",
          formData.concernOther ? formData.concernOtherDetails : ""
        ].filter(Boolean).join(", "),
        disease_prevention: formData.diseasePrevention,
        cognitive_health: formData.mentalSharpness,
        vitality_levels: formData.vitalityEnergyLevels,
        areas_of_interest: [
          formData.interestBiohacking ? "Biohacking" : "",
          formData.interestLongevityScience ? "Longevity Science" : "",
          formData.interestRegenerativeMedicine ? "Regenerative Medicine" : "",
          formData.interestPersonalizedNutrition ? "Personalized Nutrition" : "",
          formData.interestAdvancedFitness ? "Advanced Fitness Training" : "",
          formData.interestSupplementation ? "Supplementation & Nootropics" : "",
          formData.interestOther ? formData.interestOtherDetails : ""
        ].filter(Boolean).join(", "),
        additional_goals: formData.additionalGoalsConcerns,
        preferred_insights_format: [
          formData.insightFormatWritten ? "Written report" : "",
          formData.insightFormatPhone ? "Phone/video consultation" : "",
          formData.insightFormatDashboard ? "Interactive dashboard" : "",
          formData.insightFormatOther ? formData.insightFormatOtherDetails : ""
        ].filter(Boolean).join(", "),
        check_in_frequency: formData.checkInFrequency === "other" ? 
          formData.checkInFrequencyOther : formData.checkInFrequency,
        digital_monitoring: formData.digitalMonitoringOpenness,
        wearable_devices: formData.digitalMonitoringOpenness === "already-use" ? 
          formData.wearableDeviceName : "",
        wellness_apps: formData.healthAppsUse === "currently-use" ? 
          formData.healthAppsNames : formData.healthAppsUse,
        ai_coaching: formData.aiCoachingInterest,
        feedback_style: [
          formData.feedbackStyleCharts ? "Data-driven charts" : "",
          formData.feedbackStyleSimplified ? "Simplified recommendations" : "",
          formData.feedbackStyleEncouraging ? "Encouraging messages" : "",
          formData.feedbackStyleDetailed ? "Detailed scientific explanations" : "",
          formData.feedbackStyleOther ? formData.feedbackStyleOtherDetails : ""
        ].filter(Boolean).join(", "),
        privacy_data_sharing: formData.privacyDataConcerns,
        user_id: userId
      }

      console.log('Intake Form Request URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/intake-form`);
      console.log('Intake Form Request Body:', JSON.stringify(intakeData, null, 2));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/intake-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(intakeData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('Intake Form Response Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || 'Failed to submit intake form')
      }
      
      const data = await response.json()
      console.log('Intake Form Response:', data);
      return data
    } catch (error) {
      console.error('Intake form submission error:', error)
      throw error
    }
  }
  
  const handleNext = async () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      if (onStepChange) onStepChange(nextStep)
      window.scrollTo(0, 0)
    } else {
      // Submit form data and register user
      try {
        setIsSubmitting(true)
        
        // Validate password if we're submitting
        if (!password) {
          toast({
            title: "Password Required",
            description: "Please create a password to register your account.",
            variant: "destructive"
          })
          setIsSubmitting(false)
          return
        }
        
        if (passwordError) {
          toast({
            title: "Password Error",
            description: passwordError,
            variant: "destructive"
          })
          setIsSubmitting(false)
          return
        }
        
        // First register the user
        const userId = await registerUser()
        
        // Then submit the intake form with the user ID
        await submitIntakeForm(userId)
        
        toast({
          title: "Registration Complete",
          description: "Your account has been created and your health information has been saved.",
          variant: "default"
        })
        
        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("Submission error:", error)
        toast({
          title: "Submission Error",
          description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
          variant: "destructive"
        })
        setIsSubmitting(false)
      }
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      if (onStepChange) onStepChange(prevStep)
      window.scrollTo(0, 0)
    }
  }
  
  // Check if current step form is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.fullName.trim() !== "" &&
        formData.dateOfBirth.trim() !== "" &&
        formData.genderIdentity.trim() !== "" &&
        formData.phoneNumber.trim() !== "" &&
        formData.emailAddress.trim() !== ""
        // Address fields are optional
      )
    }
    
    if (currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5) {
      return true // Make health history, lifestyle factors, biometrics, and goals optional
    }
    
    if (currentStep === 6) {
      // For the final step, require password if we're about to submit
      return !passwordError
    }
    
    return false
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map(step => (
            <div 
              key={step.id} 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.id < currentStep 
                  ? "bg-accent text-white" 
                  : step.id === currentStep 
                    ? "bg-accent/20 text-accent border border-accent" 
                    : "bg-border text-subtext"
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-border h-2 rounded-full">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Form card */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-text">
            {steps[currentStep - 1].title}
          </CardTitle>
          <Text size="sm" className="text-subtext mt-1">
            {steps[currentStep - 1].description}
          </Text>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genderIdentity">Gender Identity <span className="text-red-500">*</span></Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("genderIdentity", value)}
                  value={formData.genderIdentity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender identity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Contact Details</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State/Province"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip/Postal Code"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity (Optional)</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("ethnicity", value)}
                  value={formData.ethnicity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ethnicity (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="black">Black or African American</SelectItem>
                    <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                    <SelectItem value="native">Native American or Alaska Native</SelectItem>
                    <SelectItem value="pacific">Native Hawaiian or Pacific Islander</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="multiple">Two or More Races</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Name</Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={handleInputChange}
                      placeholder="e.g., spouse, parent, friend"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="allergiesIntolerances">
                  Allergies and Intolerances
                </Label>
                <Text size="sm" className="text-subtext">
                  List any known drug, food, or environmental allergies or intolerances, and describe your reactions.
                </Text>
                <Text size="xs" className="text-subtext italic">
                  Examples: penicillin - hives; peanuts - anaphylaxis; lactose intolerance - bloating
                </Text>
                <Textarea
                  id="allergiesIntolerances"
                  name="allergiesIntolerances"
                  value={formData.allergiesIntolerances}
                  onChange={handleInputChange}
                  placeholder="Enter your allergies and intolerances"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Immunizations</Label>
                <Text size="sm" className="text-subtext">
                  Indicate if you are up to date on common vaccines and list the date of your last immunizations if known.
                </Text>
                
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="tetanusUpToDate"
                        checked={formData.tetanusUpToDate}
                        onChange={(e) => handleCheckboxChange("tetanusUpToDate", e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <Label htmlFor="tetanusUpToDate" className="font-normal">Tetanus (Td/Tdap): Up to date</Label>
                    </div>
                    
                    <div className="pl-6">
                      <Label htmlFor="tetanusLastDose" className="text-sm font-normal">Last dose:</Label>
                      <Input
                        id="tetanusLastDose"
                        name="tetanusLastDose"
                        type="date"
                        value={formData.tetanusLastDose}
                        onChange={handleInputChange}
                        className="w-40 mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="fluVaccine"
                        checked={formData.fluVaccine}
                        onChange={(e) => handleCheckboxChange("fluVaccine", e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <Label htmlFor="fluVaccine" className="font-normal">Flu (annual)</Label>
                    </div>
                    
                    <div className="pl-6">
                      <Label htmlFor="fluLastDose" className="text-sm font-normal">Last dose:</Label>
                      <Input
                        id="fluLastDose"
                        name="fluLastDose"
                        type="date"
                        value={formData.fluLastDose}
                        onChange={handleInputChange}
                        className="w-40 mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="covidVaccine"
                        checked={formData.covidVaccine}
                        onChange={(e) => handleCheckboxChange("covidVaccine", e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <Label htmlFor="covidVaccine" className="font-normal">COVID-19</Label>
                    </div>
                    
                    <div className="pl-6">
                      <Label htmlFor="covidLastDose" className="text-sm font-normal">Last dose:</Label>
                      <Input
                        id="covidLastDose"
                        name="covidLastDose"
                        type="date"
                        value={formData.covidLastDose}
                        onChange={handleInputChange}
                        className="w-40 mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherImmunizations" className="font-normal">Others (Hepatitis, Shingles, etc.):</Label>
                    <Input
                      id="otherImmunizations"
                      name="otherImmunizations"
                      value={formData.otherImmunizations}
                      onChange={handleInputChange}
                      placeholder="List other immunizations"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pastMedicalConditions">
                  Past Medical Conditions
                </Label>
                <Text size="sm" className="text-subtext">
                  List any chronic illnesses, significant surgeries, major allergies, or hospitalizations you have had. Include the year/age and any relevant details.
                </Text>
                <Text size="xs" className="text-subtext italic">
                  Examples: diabetes, hypertension, COVID-19 (2021), appendectomy (age 13)
                </Text>
                <Textarea
                  id="pastMedicalConditions"
                  name="pastMedicalConditions"
                  value={formData.pastMedicalConditions}
                  onChange={handleInputChange}
                  placeholder="Enter your past medical conditions"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="familyMedicalHistory">
                  Family Medical History
                </Label>
                <Text size="sm" className="text-subtext">
                  Describe any genetic predispositions or health issues in your immediate family. Include relatives' ages/longevity and any history of chronic diseases.
                </Text>
                <Text size="xs" className="text-subtext italic">
                  Examples: heart disease in father, diagnosed at 50; grandparents lived into 90s; no family history of cancer
                </Text>
                <Textarea
                  id="familyMedicalHistory"
                  name="familyMedicalHistory"
                  value={formData.familyMedicalHistory}
                  onChange={handleInputChange}
                  placeholder="Enter your family medical history"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentMedications">
                  Current Medications & Supplements
                </Label>
                <Text size="sm" className="text-subtext">
                  List all prescription medications, over-the-counter drugs, and dietary supplements you currently take. Include dosages and frequency if possible.
                </Text>
                <Textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="Enter your current medications and supplements"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pastMedications">
                  Past Medications & Supplements
                </Label>
                <Text size="sm" className="text-subtext">
                  List any notable medications or supplements you have taken regularly in the past (especially long-term or high-dose use) that you are no longer taking.
                </Text>
                <Textarea
                  id="pastMedications"
                  name="pastMedications"
                  value={formData.pastMedications}
                  onChange={handleInputChange}
                  placeholder="Enter your past medications and supplements"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Diet & Nutrition</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="dietaryPattern">Dietary Pattern/Preferences</Label>
                    <Text size="xs" className="text-subtext">
                      e.g., Omnivore, Vegetarian, Vegan, Paleo, Keto, Mediterranean, etc.
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("dietaryPattern", value)}
                      value={formData.dietaryPattern}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dietary pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">Omnivore</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="foodSensitivities">Food Sensitivities or Intolerances</Label>
                    <Text size="xs" className="text-subtext">
                      List any foods you avoid due to various reasons or preferences (e.g., gluten, dairy, spicy foods).
                    </Text>
                    <Textarea
                      id="foodSensitivities"
                      name="foodSensitivities"
                      value={formData.foodSensitivities}
                      onChange={handleInputChange}
                      placeholder="Enter food sensitivities or intolerances"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("alcoholConsumption", value)}
                      value={formData.alcoholConsumption}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alcohol consumption pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-6 drinks/week)</SelectItem>
                        <SelectItem value="regular">Regular (1+ drinks per day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caffeineConsumption">Caffeine Consumption</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("caffeineConsumption", value)}
                      value={formData.caffeineConsumption}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select caffeine consumption pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low (1 cup/day)</SelectItem>
                        <SelectItem value="moderate">Moderate (2-3 cups/day)</SelectItem>
                        <SelectItem value="high">High (4+ cups/day)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Text size="xs" className="text-subtext">
                      Indicate type (coffee, tea, energy drinks)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hydrationHabits">Hydration Habits</Label>
                    <Text size="xs" className="text-subtext">
                      Approximate glasses of water per day and other fluids. Example: 8 glasses water/day, occasional sports drinks
                    </Text>
                    <Textarea
                      id="hydrationHabits"
                      name="hydrationHabits"
                      value={formData.hydrationHabits}
                      onChange={handleInputChange}
                      placeholder="Describe your hydration habits"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Physical Activity</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="exerciseType">Type of Exercise/Activity</Label>
                    <Text size="xs" className="text-subtext">
                      List the types of physical activities you engage in (e.g., walking, running, weightlifting, yoga, sports, etc.)
                    </Text>
                    <Textarea
                      id="exerciseType"
                      name="exerciseType"
                      value={formData.exerciseType}
                      onChange={handleInputChange}
                      placeholder="Describe your exercise types"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exerciseFrequency">Frequency</Label>
                    <Text size="xs" className="text-subtext">
                      How many days per week do you exercise?
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("exerciseFrequency", value)}
                      value={formData.exerciseFrequency}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 days/week</SelectItem>
                        <SelectItem value="1-2">1-2 days/week</SelectItem>
                        <SelectItem value="3-4">3-4 days/week</SelectItem>
                        <SelectItem value="5-7">5-7 days/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exerciseIntensity">Intensity</Label>
                    <Text size="xs" className="text-subtext">
                      Describe typical intensity (Light - e.g., casual walk; Moderate - makes you sweat; Vigorous - high effort or competitive)
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("exerciseIntensity", value)}
                      value={formData.exerciseIntensity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light (casual walk)</SelectItem>
                        <SelectItem value="moderate">Moderate (makes you sweat)</SelectItem>
                        <SelectItem value="vigorous">Vigorous (high effort or competitive)</SelectItem>
                        <SelectItem value="mixed">Mixed (varies by activity)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exerciseLimitations">Limitations</Label>
                    <Text size="xs" className="text-subtext">
                      Note any history of injuries, chronic pain, or mobility limitations that affect exercise. Examples: past knee surgery, lower back pain with heavy lifting
                    </Text>
                    <Textarea
                      id="exerciseLimitations"
                      name="exerciseLimitations"
                      value={formData.exerciseLimitations}
                      onChange={handleInputChange}
                      placeholder="Describe any exercise limitations"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Sleep Patterns</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="sleepDuration">Sleep Duration</Label>
                    <Text size="xs" className="text-subtext">
                      How many hours of sleep do you get on average per night?
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("sleepDuration", value)}
                      value={formData.sleepDuration}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sleep duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5">Less than 5 hours</SelectItem>
                        <SelectItem value="5-6">5-6 hours</SelectItem>
                        <SelectItem value="7-8">7-8 hours</SelectItem>
                        <SelectItem value=">8">More than 8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Text size="xs" className="text-subtext">
                      Rate the quality of your sleep (Likert scale 1-5, 1 = very poor, 5 = excellent) and/or describe issues (e.g., wake up frequently, feel rested or tired in morning)
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("sleepQuality", value)}
                      value={formData.sleepQuality}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your sleep quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very poor</SelectItem>
                        <SelectItem value="2">2 - Poor</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      id="sleepQualityNotes"
                      name="sleepQualityNotes"
                      placeholder="Describe any sleep issues (optional)"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bedtimeWakingTime">Bedtime & Waking Time</Label>
                    <Text size="xs" className="text-subtext">
                      Typical bedtime and wake-up time. Do you maintain a consistent schedule?
                    </Text>
                    <Textarea
                      id="bedtimeWakingTime"
                      name="bedtimeWakingTime"
                      value={formData.bedtimeWakingTime}
                      onChange={handleInputChange}
                      placeholder="Describe your sleep schedule"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasSleepDisorders"
                        checked={formData.hasSleepDisorders}
                        onChange={(e) => handleCheckboxChange("hasSleepDisorders", e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <Label htmlFor="hasSleepDisorders" className="font-normal">Sleep Disorders</Label>
                    </div>
                    
                    {formData.hasSleepDisorders && (
                      <div className="pl-6">
                        <Text size="xs" className="text-subtext mb-1">
                          Any diagnosed or suspected sleep issues? (Examples: insomnia, sleep apnea, restless legs, frequent nightmares)
                        </Text>
                        <Textarea
                          id="sleepDisorders"
                          name="sleepDisorders"
                          value={formData.sleepDisorders}
                          onChange={handleInputChange}
                          placeholder="Describe your sleep disorders"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Stress & Coping</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="stressLevel">Perceived Stress Level</Label>
                    <Text size="xs" className="text-subtext">
                      On a scale of 1-10 (or Low/Medium/High), how would you rate your typical stress?
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("stressLevel", value)}
                      value={formData.stressLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stress level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (1-3)</SelectItem>
                        <SelectItem value="medium">Medium (4-7)</SelectItem>
                        <SelectItem value="high">High (8-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mainStressors">Main Stress Sources</Label>
                    <Text size="xs" className="text-subtext">
                      Briefly describe your biggest stressors (e.g., work pressure, family responsibilities, financial concerns).
                    </Text>
                    <Textarea
                      id="mainStressors"
                      name="mainStressors"
                      value={formData.mainStressors}
                      onChange={handleInputChange}
                      placeholder="Describe your main stressors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="copingMechanisms">Coping Mechanisms</Label>
                    <Text size="xs" className="text-subtext">
                      How do you manage stress? (Examples: exercise, meditation, deep breathing, hobbies, socializing, therapy)
                    </Text>
                    <Textarea
                      id="copingMechanisms"
                      name="copingMechanisms"
                      value={formData.copingMechanisms}
                      onChange={handleInputChange}
                      placeholder="Describe your coping mechanisms"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mentalHealthHistory">Mental Health History</Label>
                    <Text size="xs" className="text-subtext">
                      Note any history of mental health conditions such as anxiety, depression, PTSD, etc. Include past therapy or psychiatric medications if applicable.
                    </Text>
                    <Textarea
                      id="mentalHealthHistory"
                      name="mentalHealthHistory"
                      value={formData.mentalHealthHistory}
                      onChange={handleInputChange}
                      placeholder="Describe your mental health history"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Social Connections & Support</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="supportSystem">Support System</Label>
                    <Text size="xs" className="text-subtext">
                      Describe your social support network (friends, family, community groups). Do you have people you can rely on for help or talk to regularly?
                    </Text>
                    <Textarea
                      id="supportSystem"
                      name="supportSystem"
                      value={formData.supportSystem}
                      onChange={handleInputChange}
                      placeholder="Describe your support system"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialInteractionLevel">Social Interaction Level</Label>
                    <Text size="xs" className="text-subtext">
                      How frequently do you engage socially?
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("socialInteractionLevel", value)}
                      value={formData.socialInteractionLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select social interaction frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="several-times-week">Several times a week</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relationshipSatisfaction">Relationship Satisfaction</Label>
                    <Text size="xs" className="text-subtext">
                      Rate your overall satisfaction with personal relationships.
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("relationshipSatisfaction", value)}
                      value={formData.relationshipSatisfaction}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your relationship satisfaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very dissatisfied</SelectItem>
                        <SelectItem value="2">2 - Dissatisfied</SelectItem>
                        <SelectItem value="3">3 - Neutral</SelectItem>
                        <SelectItem value="4">4 - Satisfied</SelectItem>
                        <SelectItem value="5">5 - Very satisfied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Work-Life Balance & Occupational Stress</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Text size="xs" className="text-subtext">
                      What is your current job/role and typical work hours per week?
                    </Text>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Your occupation/job title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workHours">Work Hours</Label>
                    <Text size="xs" className="text-subtext">
                      Typical hours worked per week
                    </Text>
                    <Input
                      id="workHours"
                      name="workHours"
                      value={formData.workHours}
                      onChange={handleInputChange}
                      placeholder="e.g., 40 hours/week"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workEnvironmentStress">Work Environment Stress</Label>
                    <Text size="xs" className="text-subtext">
                      Rate how stressful you find your work environment and list any major work stress factors.
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("workEnvironmentStress", value)}
                      value={formData.workEnvironmentStress}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your work environment stress" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      id="workStressFactors"
                      name="workStressFactors"
                      placeholder="List major work stress factors (e.g., tight deadlines, physical labor, high responsibility)"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workLifeBalance">Work-Life Balance</Label>
                    <Text size="xs" className="text-subtext">
                      Rate your work-life balance and describe if work often interferes with personal life.
                    </Text>
                    <Select 
                      onValueChange={(value) => handleSelectChange("workLifeBalance", value)}
                      value={formData.workLifeBalance}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your work-life balance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very poor</SelectItem>
                        <SelectItem value="2">2 - Poor</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Very good</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="burnoutJobStrain"
                        checked={formData.burnoutJobStrain}
                        onChange={(e) => handleCheckboxChange("burnoutJobStrain", e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <Label htmlFor="burnoutJobStrain" className="font-normal">Burnout or Job Strain</Label>
                    </div>
                    
                    {formData.burnoutJobStrain && (
                      <div className="pl-6">
                        <Text size="xs" className="text-subtext mb-1">
                          Do you feel signs of burnout or excessive job strain? If yes, explain.
                        </Text>
                        <Textarea
                          id="burnoutDetails"
                          name="burnoutDetails"
                          value={formData.burnoutDetails}
                          onChange={handleInputChange}
                          placeholder="Describe your burnout or job strain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Anthropometrics</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      <Select 
                        onValueChange={(value) => handleSelectChange("heightUnit", value)}
                        value={formData.heightUnit}
                        defaultValue="inches"
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feet/inches">feet/inches</SelectItem>
                          <SelectItem value="inches">inches</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Text size="xs" className="text-subtext">
                      (feet/inches or cm)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      <Select 
                        onValueChange={(value) => handleSelectChange("weightUnit", value)}
                        value={formData.weightUnit}
                        defaultValue="lbs"
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Text size="xs" className="text-subtext">
                      (lbs or kg)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
                    <Input
                      id="bmi"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      placeholder="Enter value if known"
                    />
                    <Text size="xs" className="text-subtext">
                      (if known; otherwise will be calculated from height/weight)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bodyFatPercentage">Body Fat Percentage</Label>
                    <Input
                      id="bodyFatPercentage"
                      name="bodyFatPercentage"
                      value={formData.bodyFatPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter value if known"
                    />
                    <Text size="xs" className="text-subtext">
                      % (if known from recent scan or device)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waistCircumference">Waist Circumference</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="waistCircumference"
                        name="waistCircumference"
                        value={formData.waistCircumference}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      <Select 
                        onValueChange={(value) => handleSelectChange("waistCircumferenceUnit", value)}
                        value={formData.waistCircumferenceUnit}
                        defaultValue="inches"
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inches">inches</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Text size="xs" className="text-subtext">
                      (inches or cm, if available)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hipCircumference">Hip Circumference</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="hipCircumference"
                        name="hipCircumference"
                        value={formData.hipCircumference}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      <Select 
                        onValueChange={(value) => handleSelectChange("hipCircumferenceUnit", value)}
                        value={formData.hipCircumferenceUnit}
                        defaultValue="inches"
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inches">inches</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Text size="xs" className="text-subtext">
                      (in or cm, if available)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waistToHipRatio">Waist-to-Hip Ratio</Label>
                    <Input
                      id="waistToHipRatio"
                      name="waistToHipRatio"
                      value={formData.waistToHipRatio}
                      onChange={handleInputChange}
                      placeholder="Enter value if known"
                    />
                    <Text size="xs" className="text-subtext">
                      (if known)
                    </Text>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Vital Signs</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="bloodPressureSystolic"
                        name="bloodPressureSystolic"
                        value={formData.bloodPressureSystolic}
                        onChange={handleInputChange}
                        placeholder="Systolic"
                        className="w-24"
                      />
                      <span>/</span>
                      <Input
                        id="bloodPressureDiastolic"
                        name="bloodPressureDiastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={handleInputChange}
                        placeholder="Diastolic"
                        className="w-24"
                      />
                      <span className="ml-2">mmHg</span>
                    </div>
                    <Text size="xs" className="text-subtext">
                      / mmHg (most recent reading if known)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="restingHeartRate">Resting Heart Rate (RHR)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="restingHeartRate"
                        name="restingHeartRate"
                        value={formData.restingHeartRate}
                        onChange={handleInputChange}
                        placeholder="Enter value"
                        className="w-24"
                      />
                      <span>bpm</span>
                    </div>
                    <Text size="xs" className="text-subtext">
                      bpm (beats per minute)
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heartRateVariability">Heart Rate Variability (HRV)</Label>
                    <Input
                      id="heartRateVariability"
                      name="heartRateVariability"
                      value={formData.heartRateVariability}
                      onChange={handleInputChange}
                      placeholder="Enter value if known"
                    />
                    <Text size="xs" className="text-subtext">
                      ms, average or range if tracked
                    </Text>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vo2Max">VO₂ Max</Label>
                    <Input
                      id="vo2Max"
                      name="vo2Max"
                      value={formData.vo2Max}
                      onChange={handleInputChange}
                      placeholder="Enter value if known"
                    />
                    <Text size="xs" className="text-subtext">
                      (if tested, e.g., from a fitness test or wearable)
                    </Text>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Laboratory Results</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasRecentLabWork"
                      checked={formData.hasRecentLabWork}
                      onChange={(e) => handleCheckboxChange("hasRecentLabWork", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="hasRecentLabWork" className="text-sm font-normal">I have recent lab work</Label>
                  </div>
                </div>
                
                <Text size="sm" className="text-subtext">
                  If you have recent laboratory results (within the last 6 months), please enter the values below. 
                  This information helps us create a more personalized health optimization plan.
                </Text>
                
                {formData.hasRecentLabWork && (
                  <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="labWorkDate">Date of Lab Work</Label>
                      <Input
                        id="labWorkDate"
                        name="labWorkDate"
                        type="date"
                        value={formData.labWorkDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Heading size="xs" className="mt-4">Blood Markers</Heading>
                    <Text size="xs" className="text-subtext italic">
                      (Provide recent lab values if available)
                    </Text>
                    
                    <div className="space-y-2">
                      <Label>Lipid Panel</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="totalCholesterol" className="text-sm font-normal">Total Cholesterol</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="totalCholesterol"
                              name="totalCholesterol"
                              value={formData.totalCholesterol}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">mg/dL</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="ldlCholesterol" className="text-sm font-normal">LDL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="ldlCholesterol"
                              name="ldlCholesterol"
                              value={formData.ldlCholesterol}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">mg/dL</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="hdlCholesterol" className="text-sm font-normal">HDL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="hdlCholesterol"
                              name="hdlCholesterol"
                              value={formData.hdlCholesterol}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">mg/dL</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="triglycerides" className="text-sm font-normal">Triglycerides</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="triglycerides"
                              name="triglycerides"
                              value={formData.triglycerides}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">mg/dL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Glucose Fasting</Label>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="bloodGlucoseFasting"
                            name="bloodGlucoseFasting"
                            value={formData.bloodGlucoseFasting}
                            onChange={handleInputChange}
                            placeholder="Value"
                            className="w-24"
                          />
                          <span className="text-sm text-subtext">mg/dL</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm">and/or HbA1c:</span>
                          <Input
                            id="bloodGlucoseA1c"
                            name="bloodGlucoseA1c"
                            value={formData.bloodGlucoseA1c}
                            onChange={handleInputChange}
                            placeholder="Value"
                            className="w-24"
                          />
                          <span className="text-sm text-subtext">%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Inflammatory Markers</Label>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-sm">e.g., C-reactive Protein (CRP)</span>
                        <div className="flex items-center gap-2">
                          <Input
                            id="crp"
                            name="crp"
                            value={formData.crp}
                            onChange={handleInputChange}
                            placeholder="Value"
                            className="w-24"
                          />
                          <span className="text-sm text-subtext">mg/L</span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <Label htmlFor="otherInflammatoryMarkers" className="text-sm font-normal">Other inflammatory markers</Label>
                        <Input
                          id="otherInflammatoryMarkers"
                          name="otherInflammatoryMarkers"
                          value={formData.otherInflammatoryMarkers}
                          onChange={handleInputChange}
                          placeholder="Enter other inflammatory markers if known"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hormone Levels</Label>
                      <Text size="xs" className="text-subtext">
                        (if checked) e.g.,
                      </Text>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="tsh" className="text-sm font-normal">Thyroid (TSH)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="tsh"
                              name="tsh"
                              value={formData.tsh}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">T4</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="testosterone" className="text-sm font-normal">Testosterone</Label>
                          <Input
                            id="testosterone"
                            name="testosterone"
                            value={formData.testosterone}
                            onChange={handleInputChange}
                            placeholder="Value"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="estrogen" className="text-sm font-normal">Estrogen</Label>
                          <Input
                            id="estrogen"
                            name="estrogen"
                            value={formData.estrogen}
                            onChange={handleInputChange}
                            placeholder="Value"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="cortisol" className="text-sm font-normal">Cortisol</Label>
                          <Input
                            id="cortisol"
                            name="cortisol"
                            value={formData.cortisol}
                            onChange={handleInputChange}
                            placeholder="Value"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <Label htmlFor="otherHormones" className="text-sm font-normal">Other hormones, etc.</Label>
                        <Input
                          id="otherHormones"
                          name="otherHormones"
                          value={formData.otherHormones}
                          onChange={handleInputChange}
                          placeholder="Enter other hormone levels if known"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Vitamin/Mineral Levels</Label>
                      <Text size="xs" className="text-subtext">
                        (if available) e.g.,
                      </Text>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="vitaminD" className="text-sm font-normal">Vitamin D</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="vitaminD"
                              name="vitaminD"
                              value={formData.vitaminD}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">ng/mL</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="vitaminB12" className="text-sm font-normal">Vitamin B12</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="vitaminB12"
                              name="vitaminB12"
                              value={formData.vitaminB12}
                              onChange={handleInputChange}
                              placeholder="Value"
                              className="w-24"
                            />
                            <span className="text-sm text-subtext">pg/mL</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="ironFerritin" className="text-sm font-normal">Iron/Ferritin</Label>
                          <Input
                            id="ironFerritin"
                            name="ironFerritin"
                            value={formData.ironFerritin}
                            onChange={handleInputChange}
                            placeholder="Value"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="otherVitaminsMinerals" className="text-sm font-normal">Others</Label>
                          <Input
                            id="otherVitaminsMinerals"
                            name="otherVitaminsMinerals"
                            value={formData.otherVitaminsMinerals}
                            onChange={handleInputChange}
                            placeholder="Other vitamins/minerals"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Heading size="xs" className="mt-4">Other Lab Tests</Heading>
                    <div className="space-y-2">
                      <Label htmlFor="completeBloodCount">Complete Blood Count (CBC) Notes</Label>
                      <Textarea
                        id="completeBloodCount"
                        name="completeBloodCount"
                        value={formData.completeBloodCount}
                        onChange={handleInputChange}
                        placeholder="Enter any notable CBC results or abnormalities"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metabolicPanel">Comprehensive Metabolic Panel Notes</Label>
                      <Textarea
                        id="metabolicPanel"
                        name="metabolicPanel"
                        value={formData.metabolicPanel}
                        onChange={handleInputChange}
                        placeholder="Enter any notable metabolic panel results or abnormalities"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="otherLabResults">Other Lab Results</Label>
                      <Textarea
                        id="otherLabResults"
                        name="otherLabResults"
                        value={formData.otherLabResults}
                        onChange={handleInputChange}
                        placeholder="Enter any other relevant lab results (e.g., homocysteine, ferritin, specialized tests)"
                      />
                    </div>
                  </div>
                )}
                
                {!formData.hasRecentLabWork && (
                  <div className="mt-2 p-4 bg-accent/10 rounded-md">
                    <Text size="sm">
                      No problem! You can still receive a personalized health plan based on your other information. 
                      For more precise recommendations, consider getting basic lab work done and updating your profile later.
                    </Text>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Genetic Data</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label>Have you had your DNA or genetic testing done related to health/longevity?</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="geneticTestingYes"
                          name="geneticTesting"
                          checked={formData.geneticTesting === "yes"}
                          onChange={() => handleSelectChange("geneticTesting", "yes")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="geneticTestingYes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="geneticTestingNo"
                          name="geneticTesting"
                          checked={formData.geneticTesting === "no"}
                          onChange={() => handleSelectChange("geneticTesting", "no")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="geneticTestingNo" className="font-normal">No</Label>
                      </div>
                    </div>
                    <Text size="xs" className="text-subtext italic">
                      (e.g., 23andMe, Ancestry, whole genome sequencing)
                    </Text>
                  </div>
                  
                  {formData.geneticTesting === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="geneticFindings">If Yes, are there any notable genetic findings you're aware of?</Label>
                      <Textarea
                        id="geneticFindings"
                        name="geneticFindings"
                        value={formData.geneticFindings}
                        onChange={handleInputChange}
                        placeholder="Enter any notable genetic findings"
                      />
                      <Text size="xs" className="text-subtext italic">
                        (Examples: APOE genotype, BRCA status, MTHFR mutation, predispositions to certain conditions)
                      </Text>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyLongevity">Family Longevity: Typical ages of parents/grandparents given notable longevity in family.</Label>
                    <Textarea
                      id="familyLongevity"
                      name="familyLongevity"
                      value={formData.familyLongevity}
                      onChange={handleInputChange}
                      placeholder="Describe family longevity patterns"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Microbiome Analysis</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label>Have you ever done a gut microbiome test (such as Viome, uBiome)?</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="microbiomeTestYes"
                          name="microbiomeTest"
                          checked={formData.microbiomeTest === "yes"}
                          onChange={() => handleSelectChange("microbiomeTest", "yes")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="microbiomeTestYes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="microbiomeTestNo"
                          name="microbiomeTest"
                          checked={formData.microbiomeTest === "no"}
                          onChange={() => handleSelectChange("microbiomeTest", "no")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="microbiomeTestNo" className="font-normal">No</Label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.microbiomeTest === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="microbiomeInsights">If Yes, provide any key insights if available</Label>
                      <Textarea
                        id="microbiomeInsights"
                        name="microbiomeInsights"
                        value={formData.microbiomeInsights}
                        onChange={handleInputChange}
                        placeholder="Enter microbiome test insights"
                      />
                      <Text size="xs" className="text-subtext italic">
                        (e.g., diversity score, specific bacteria overgrowth, recommendations given)
                      </Text>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Wearable & Device Data</Label>
                <Text size="xs" className="text-subtext italic">
                  (if you use health trackers, share any useful data)
                </Text>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label>Sleep Tracker: Do you use a device/app to track sleep (Fitbit, Oura, etc.)?</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="sleepTrackerYes"
                          name="sleepTracker"
                          checked={formData.sleepTracker === "yes"}
                          onChange={() => handleSelectChange("sleepTracker", "yes")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="sleepTrackerYes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="sleepTrackerNo"
                          name="sleepTracker"
                          checked={formData.sleepTracker === "no"}
                          onChange={() => handleSelectChange("sleepTracker", "no")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="sleepTrackerNo" className="font-normal">No</Label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.sleepTracker === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="averageSleepDuration">If Yes, average nightly sleep</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="averageSleepDuration"
                          name="averageSleepDuration"
                          value={formData.averageSleepDuration}
                          onChange={handleInputChange}
                          placeholder="Hours"
                          className="w-24"
                        />
                        <span>hours</span>
                      </div>
                      
                      <div className="mt-2">
                        <Label htmlFor="sleepQualityScore">Sleep quality score (if provided)</Label>
                        <Input
                          id="sleepQualityScore"
                          name="sleepQualityScore"
                          value={formData.sleepQualityScore}
                          onChange={handleInputChange}
                          placeholder="Score"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="activityTracker">Activity Tracker:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="averageDailySteps" className="text-sm font-normal">Average daily steps</Label>
                        <Input
                          id="averageDailySteps"
                          name="averageDailySteps"
                          value={formData.averageDailySteps}
                          onChange={handleInputChange}
                          placeholder="Steps"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="weeklyActiveMinutes" className="text-sm font-normal">Weekly active minutes</Label>
                        <Input
                          id="weeklyActiveMinutes"
                          name="weeklyActiveMinutes"
                          value={formData.weeklyActiveMinutes}
                          onChange={handleInputChange}
                          placeholder="Minutes"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Label htmlFor="otherFitnessMetrics">Other fitness metrics</Label>
                      <Input
                        id="otherFitnessMetrics"
                        name="otherFitnessMetrics"
                        value={formData.otherFitnessMetrics}
                        onChange={handleInputChange}
                        placeholder="Enter other fitness metrics"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hrvMonitor">HRV Monitor: (e.g., Oura Ring, chest strap)</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="averageHRV" className="text-sm font-normal">Average HRV</Label>
                      <Input
                        id="averageHRV"
                        name="averageHRV"
                        value={formData.averageHRV}
                        onChange={handleInputChange}
                        placeholder="Value"
                        className="w-24"
                      />
                      <span>(if known)</span>
                    </div>
                    
                    <div className="mt-2">
                      <Label htmlFor="hrvNotes">Any notable HRV patterns</Label>
                      <Input
                        id="hrvNotes"
                        name="hrvNotes"
                        value={formData.hrvNotes}
                        onChange={handleInputChange}
                        placeholder="Enter HRV patterns or notes"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Glucose Monitor</Label>
                <div className="space-y-4 pl-4 border-l-2 border-border pt-2">
                  <div className="space-y-2">
                    <Label>Do you use a Continuous Glucose Monitor (CGM)?</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="cgmYes"
                          name="usesCGM"
                          checked={formData.usesCGM === "yes"}
                          onChange={() => handleSelectChange("usesCGM", "yes")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="cgmYes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="cgmNo"
                          name="usesCGM"
                          checked={formData.usesCGM === "no"}
                          onChange={() => handleSelectChange("usesCGM", "no")}
                          className="h-4 w-4 border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="cgmNo" className="font-normal">No</Label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.usesCGM === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="glucoseLevels">If Yes, note average glucose levels or any frequent high/low patterns</Label>
                      <Textarea
                        id="glucoseLevels"
                        name="glucoseLevels"
                        value={formData.glucoseLevels}
                        onChange={handleInputChange}
                        placeholder="Describe your glucose patterns"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Health Goals & Concerns
                </Label>
                <Text size="sm" className="text-subtext">
                  What are your current health goals and any concerns you have about your health?
                </Text>
                <Textarea
                  id="healthGoalsConcerns"
                  name="healthGoalsConcerns"
                  value={formData.healthGoalsConcerns}
                  onChange={handleInputChange}
                  placeholder="Enter your health goals and concerns"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>
                  Areas of Interest for Optimization
                </Label>
                <Text size="sm" className="text-subtext">
                  Are there any specific areas of your health you're interested in optimizing?
                </Text>
                <Textarea
                  id="areasOfInterest"
                  name="areasOfInterest"
                  value={formData.areasOfInterest}
                  onChange={handleInputChange}
                  placeholder="Enter any specific areas of interest"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Password creation fields for registration */}
              <div className="space-y-2 mb-6 p-4 bg-accent/10 rounded-md">
                <Label htmlFor="password">Create Password <span className="text-red-500">*</span></Label>
                <Text size="sm" className="text-subtext">
                  You'll need to create a password to access your account and dashboard.
                </Text>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password"
                  required
                  className="mt-1"
                />
                
                <Label htmlFor="confirmPassword" className="mt-3">Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  required
                  className="mt-1"
                />
                
                {passwordError && (
                  <Text size="sm" className="text-red-500 mt-1">
                    {passwordError}
                  </Text>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>
                  Preferred Format for Insights
                </Label>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="insightFormatWritten"
                      checked={formData.insightFormatWritten}
                      onChange={(e) => handleCheckboxChange("insightFormatWritten", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="insightFormatWritten" className="font-normal">Written report or email summary</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="insightFormatPhone"
                      checked={formData.insightFormatPhone}
                      onChange={(e) => handleCheckboxChange("insightFormatPhone", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="insightFormatPhone" className="font-normal">Phone or video consultation to discuss results</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="insightFormatDashboard"
                      checked={formData.insightFormatDashboard}
                      onChange={(e) => handleCheckboxChange("insightFormatDashboard", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="insightFormatDashboard" className="font-normal">Interactive dashboard or mobile app updates</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="insightFormatOther"
                      checked={formData.insightFormatOther}
                      onChange={(e) => handleCheckboxChange("insightFormatOther", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="insightFormatOther" className="font-normal">Other:</Label>
                    
                    {formData.insightFormatOther && (
                      <Input
                        id="insightFormatOtherDetails"
                        name="insightFormatOtherDetails"
                        value={formData.insightFormatOtherDetails}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="ml-2 w-60"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  Desired Check-in Frequency
                </Label>
                <Text size="sm" className="text-subtext">
                  How often would you like to have follow-up reviews or progress checks?
                </Text>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="checkInFrequencyWeekly"
                      name="checkInFrequency"
                      checked={formData.checkInFrequency === "weekly"}
                      onChange={() => handleSelectChange("checkInFrequency", "weekly")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="checkInFrequencyWeekly" className="font-normal">Weekly</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="checkInFrequencyMonthly"
                      name="checkInFrequency"
                      checked={formData.checkInFrequency === "monthly"}
                      onChange={() => handleSelectChange("checkInFrequency", "monthly")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="checkInFrequencyMonthly" className="font-normal">Monthly</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="checkInFrequencyQuarterly"
                      name="checkInFrequency"
                      checked={formData.checkInFrequency === "quarterly"}
                      onChange={() => handleSelectChange("checkInFrequency", "quarterly")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="checkInFrequencyQuarterly" className="font-normal">Quarterly</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="checkInFrequencyAsNeeded"
                      name="checkInFrequency"
                      checked={formData.checkInFrequency === "as-needed"}
                      onChange={() => handleSelectChange("checkInFrequency", "as-needed")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="checkInFrequencyAsNeeded" className="font-normal">Only as needed / On request</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="checkInFrequencyOther"
                      name="checkInFrequency"
                      checked={formData.checkInFrequency === "other"}
                      onChange={() => handleSelectChange("checkInFrequency", "other")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="checkInFrequencyOther" className="font-normal">Other:</Label>
                    
                    {formData.checkInFrequency === "other" && (
                      <Input
                        id="checkInFrequencyOther"
                        name="checkInFrequencyOther"
                        value={formData.checkInFrequencyOther}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="ml-2 w-60"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  Use of Digital Monitoring
                </Label>
                <Text size="sm" className="text-subtext">
                  Are you open to using digital tools to help track your progress and keep you accountable?
                </Text>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="digitalMonitoringAlreadyUse"
                      name="digitalMonitoringOpenness"
                      checked={formData.digitalMonitoringOpenness === "already-use"}
                      onChange={() => handleSelectChange("digitalMonitoringOpenness", "already-use")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="digitalMonitoringAlreadyUse" className="font-normal">I already use one (Device:</Label>
                    
                    {formData.digitalMonitoringOpenness === "already-use" && (
                      <Input
                        id="wearableDeviceName"
                        name="wearableDeviceName"
                        value={formData.wearableDeviceName}
                        onChange={handleInputChange}
                        placeholder="Device name"
                        className="ml-2 w-60"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="digitalMonitoringWilling"
                      name="digitalMonitoringOpenness"
                      checked={formData.digitalMonitoringOpenness === "willing"}
                      onChange={() => handleSelectChange("digitalMonitoringOpenness", "willing")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="digitalMonitoringWilling" className="font-normal">Willing to use if it helps</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="digitalMonitoringNotInterested"
                      name="digitalMonitoringOpenness"
                      checked={formData.digitalMonitoringOpenness === "not-interested"}
                      onChange={() => handleSelectChange("digitalMonitoringOpenness", "not-interested")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="digitalMonitoringNotInterested" className="font-normal">Not interested</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  Health & Wellness Apps
                </Label>
                <Text size="sm" className="text-subtext">
                  (Nutrition logging, meditation apps, etc.)
                </Text>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="healthAppsCurrentlyUse"
                      name="healthAppsUse"
                      checked={formData.healthAppsUse === "currently-use"}
                      onChange={() => handleSelectChange("healthAppsUse", "currently-use")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="healthAppsCurrentlyUse" className="font-normal">I currently use apps (Names:</Label>
                    
                    {formData.healthAppsUse === "currently-use" && (
                      <Input
                        id="healthAppsNames"
                        name="healthAppsNames"
                        value={formData.healthAppsNames}
                        onChange={handleInputChange}
                        placeholder="App names"
                        className="ml-2 w-60"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="healthAppsOpen"
                      name="healthAppsUse"
                      checked={formData.healthAppsUse === "open"}
                      onChange={() => handleSelectChange("healthAppsUse", "open")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="healthAppsOpen" className="font-normal">Open to using recommended apps</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="healthAppsNotInterested"
                      name="healthAppsUse"
                      checked={formData.healthAppsUse === "not-interested"}
                      onChange={() => handleSelectChange("healthAppsUse", "not-interested")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="healthAppsNotInterested" className="font-normal">Not interested in app-based tracking</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  AI-Driven Coaching
                </Label>
                <Text size="sm" className="text-subtext">
                  (e.g., chatbots or AI reminders for habits)
                </Text>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="aiCoachingInterested"
                      name="aiCoachingInterest"
                      checked={formData.aiCoachingInterest === "interested"}
                      onChange={() => handleSelectChange("aiCoachingInterest", "interested")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="aiCoachingInterested" className="font-normal">Interested in AI coaching/reminder services</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="aiCoachingMaybe"
                      name="aiCoachingInterest"
                      checked={formData.aiCoachingInterest === "maybe"}
                      onChange={() => handleSelectChange("aiCoachingInterest", "maybe")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="aiCoachingMaybe" className="font-normal">Maybe, curious but cautious</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="aiCoachingNotInterested"
                      name="aiCoachingInterest"
                      checked={formData.aiCoachingInterest === "not-interested"}
                      onChange={() => handleSelectChange("aiCoachingInterest", "not-interested")}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="aiCoachingNotInterested" className="font-normal">Not interested in AI-based coaching</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  Feedback Style
                </Label>
                <Text size="sm" className="text-subtext">
                  What style of feedback keeps you motivated?
                </Text>
                <div className="space-y-2 pl-4 border-l-2 border-border pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="feedbackStyleCharts"
                      checked={formData.feedbackStyleCharts}
                      onChange={(e) => handleCheckboxChange("feedbackStyleCharts", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="feedbackStyleCharts" className="font-normal">Data-driven charts and graphs</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="feedbackStyleSimplified"
                      checked={formData.feedbackStyleSimplified}
                      onChange={(e) => handleCheckboxChange("feedbackStyleSimplified", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="feedbackStyleSimplified" className="font-normal">Simplified recommendations and checklists</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="feedbackStyleEncouraging"
                      checked={formData.feedbackStyleEncouraging}
                      onChange={(e) => handleCheckboxChange("feedbackStyleEncouraging", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="feedbackStyleEncouraging" className="font-normal">Encouraging messages and tips</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="feedbackStyleDetailed"
                      checked={formData.feedbackStyleDetailed}
                      onChange={(e) => handleCheckboxChange("feedbackStyleDetailed", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="feedbackStyleDetailed" className="font-normal">Detailed scientific explanations</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="feedbackStyleOther"
                      checked={formData.feedbackStyleOther}
                      onChange={(e) => handleCheckboxChange("feedbackStyleOther", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <Label htmlFor="feedbackStyleOther" className="font-normal">Other:</Label>
                    
                    {formData.feedbackStyleOther && (
                      <Input
                        id="feedbackStyleOtherDetails"
                        name="feedbackStyleOtherDetails"
                        value={formData.feedbackStyleOtherDetails}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="ml-2 w-60"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="privacyDataConcerns">
                  Privacy & Data Sharing
                </Label>
                <Text size="sm" className="text-subtext">
                  Do you have any concerns about how your health data is used or shared (e.g., with AI tools or third-party services)? If yes, please specify so we can address them.
                </Text>
                <Textarea
                  id="privacyDataConcerns"
                  name="privacyDataConcerns"
                  value={formData.privacyDataConcerns}
                  onChange={handleInputChange}
                  placeholder="Describe any privacy or data sharing concerns"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="default" 
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
          >
            Previous
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : currentStep === steps.length ? (
              "Complete & Create Account"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 text-center">
        <Text size="xs" className="text-subtext">
          All data is kept confidential and used only to generate personalized insights for your healthspan optimization.
        </Text>
      </div>
    </div>
  )
} 