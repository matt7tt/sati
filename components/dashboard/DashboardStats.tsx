'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, ArrowUpRight, Activity, Heart, Brain, Zap, AlertCircle, Utensils, Dumbbell, Pills, Stethoscope, Target } from 'lucide-react';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePrompts: 0,
    completionRate: 0,
    averageScore: 0
  });
  const [healthInsights, setHealthInsights] = useState({
    patientName: 'John Doe',
    metabolicHealth: 'Mild insulin resistance detected; focus on glycemic control.',
    cardiovascularHealth: 'LDL slightly elevated; emphasis on omega-3s and exercise.',
    hormonalBalance: 'Low testosterone and slightly elevated cortisol levels; need stress management and potential HRT evaluation.',
    cognitiveFunction: 'Some signs of brain fog and memory issues; neuroprotective interventions recommended.',
    inflammation: 'Slightly high CRP, indicating low-grade chronic inflammation.'
  });
  const [treatmentPlans, setTreatmentPlans] = useState({
    nutrition: {
      title: "Nutrition Plan",
      recommendations: [
        "Follow a low-glycemic Mediterranean diet with emphasis on whole foods",
        "Limit carbohydrates to 100-150g per day, focusing on complex sources",
        "Increase omega-3 intake through fatty fish (2-3 servings/week)",
        "Practice time-restricted eating (8-hour window) 5 days per week",
        "Ensure adequate protein intake (1.2-1.5g/kg body weight)"
      ]
    },
    exercise: {
      title: "Exercise & Movement Plan",
      recommendations: [
        "Strength training 3x weekly focusing on compound movements",
        "Zone 2 cardio training 2-3x weekly (30-45 minutes per session)",
        "Daily walking minimum 7,000 steps",
        "Incorporate mobility work 2x weekly",
        "Add 1-2 HIIT sessions weekly (10-15 minutes)"
      ]
    },
    supplementation: {
      title: "Supplementation Plan",
      recommendations: [
        "Omega-3 fish oil: 2g daily with meal",
        "Vitamin D3: 5,000 IU daily with fat-containing meal",
        "Magnesium glycinate: 300mg before bed",
        "Berberine: 500mg with meals, 2x daily",
        "CoQ10: 200mg daily with fat-containing meal"
      ]
    },
    medical: {
      title: "Medical Interventions & Advanced Therapies",
      recommendations: [
        "Quarterly metabolic panel and hormone testing",
        "Consider testosterone optimization therapy based on next lab results",
        "Continuous glucose monitoring for 2-week period",
        "Sleep study to evaluate potential sleep apnea",
        "Stress management protocol including HRV training"
      ]
    },
    accountability: {
      title: "Accountability & Optimization Plan",
      recommendations: [
        "Weekly check-ins via app to monitor adherence",
        "Monthly biomarker tracking (weight, blood pressure, resting heart rate)",
        "Quarterly comprehensive lab testing",
        "Adjust protocol based on subjective feedback and objective metrics",
        "6-month comprehensive review and protocol adjustment"
      ]
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    async function fetchHealthInsights() {
      try {
        const response = await fetch('/api/dashboard/health-insights');
        const data = await response.json();
        if (data) {
          setHealthInsights(data);
        }
      } catch (error) {
        console.error('Error fetching health insights:', error);
        // Keep default data if fetch fails
      }
    }
    
    async function fetchTreatmentPlans() {
      try {
        const response = await fetch('/api/dashboard/treatment-plans');
        const data = await response.json();
        if (data) {
          setTreatmentPlans(data);
        }
      } catch (error) {
        console.error('Error fetching treatment plans:', error);
        // Keep default data if fetch fails
      }
    }
    
    fetchStats();
    fetchHealthInsights();
    fetchTreatmentPlans();
  }, []);
  
  if (isLoading) return <div>Loading stats...</div>;
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Prompts</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePrompts}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completionRate}%</div>
        </CardContent>
      </Card>
      
      {/* Health Insights Section */}
      <Card className="col-span-3 mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Personalized Healthspan Optimization Plan</CardTitle>
          <Text size="sm">Patient Name: {healthInsights.patientName}</Text>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Heading size="sm" className="mb-2">Summary of Findings & Goals</Heading>
            <Text size="sm">
              Based on your intake data, lab results, and wearable metrics, our AI has identified key 
              areas for optimization. The primary focus of your treatment plan is to enhance longevity, 
              metabolic efficiency, cognitive function, and physical performance while minimizing 
              disease risk.
            </Text>
          </div>
          
          <div>
            <Heading size="sm" className="mb-2">Key Insights</Heading>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Text size="sm" className="font-semibold">Metabolic Health:</Text>
                  <Text size="sm">{healthInsights.metabolicHealth}</Text>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Text size="sm" className="font-semibold">Cardiovascular Health:</Text>
                  <Text size="sm">{healthInsights.cardiovascularHealth}</Text>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <Activity className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Text size="sm" className="font-semibold">Hormonal Balance:</Text>
                  <Text size="sm">{healthInsights.hormonalBalance}</Text>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Text size="sm" className="font-semibold">Cognitive Function:</Text>
                  <Text size="sm">{healthInsights.cognitiveFunction}</Text>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <Text size="sm" className="font-semibold">Inflammation Markers:</Text>
                  <Text size="sm">{healthInsights.inflammation}</Text>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Treatment Plans Section */}
      <Card className="col-span-3 mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Treatment & Optimization Plans</CardTitle>
          <Text size="sm">Personalized recommendations based on your health data</Text>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nutrition" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
              <TabsTrigger value="supplementation">Supplements</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="accountability">Accountability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nutrition" className="space-y-4">
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-accent" />
                <Heading size="sm">{treatmentPlans.nutrition.title}</Heading>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {treatmentPlans.nutrition.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Text size="sm">{rec}</Text>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" size="sm">Download Detailed Nutrition Guide</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="exercise" className="space-y-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-6 w-6 text-accent" />
                <Heading size="sm">{treatmentPlans.exercise.title}</Heading>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {treatmentPlans.exercise.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Text size="sm">{rec}</Text>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" size="sm">View Exercise Demonstrations</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="supplementation" className="space-y-4">
              <div className="flex items-center gap-2">
                <Pills className="h-6 w-6 text-accent" />
                <Heading size="sm">{treatmentPlans.supplementation.title}</Heading>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {treatmentPlans.supplementation.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Text size="sm">{rec}</Text>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" size="sm">View Supplement Details</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-accent" />
                <Heading size="sm">{treatmentPlans.medical.title}</Heading>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {treatmentPlans.medical.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Text size="sm">{rec}</Text>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" size="sm">Schedule Medical Consultation</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="accountability" className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-accent" />
                <Heading size="sm">{treatmentPlans.accountability.title}</Heading>
              </div>
              <ul className="space-y-2 pl-6 list-disc">
                {treatmentPlans.accountability.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Text size="sm">{rec}</Text>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" size="sm">Set Up Tracking Reminders</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
} 