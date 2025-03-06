"use client"

import { useState } from "react"
import OnboardingForm from "@/components/onboarding/OnboardingForm"
import OnboardingHeader from "@/components/onboarding/OnboardingHeader"

export default function OnboardingPage() {
  // We're keeping minimal state in the page component
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2
  
  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <main className="flex-1 py-12 px-4">
        <OnboardingForm onStepChange={handleStepChange} />
      </main>
    </div>
  )
} 