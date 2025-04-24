'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, Users, ArrowUpRight, Activity, Heart, Brain, Zap, AlertCircle, Utensils, Dumbbell, Pill, Stethoscope, Target, CheckCircle, Clock } from 'lucide-react';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Insight {
  id: number;
  user_id: number;
  insight_id: number;
  insight_output: string;
  area: string;
  created_at: string;
  updated_at: string;
}

interface HealthInsights {
  metabolic: Insight | null;
  cardiovascular: Insight | null;
  cognitive: Insight | null;
  cancer: Insight | null;
  musculoskeletal: Insight | null;
}

interface UserStats {
  user_id: number;
  phenotypic_age: number;
  age: number;
  created_date: string;
  vo2_max?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
}

interface UserPlan {
  user_id: number;
  plan_id: number;
  id: number;
  created_at: string;
  updated_at: string;
  plan_name: string;
  plan_objective: string;
  plan_output: string;
}

interface TreatmentPlan {
  title: string;
  objective: string;
  recommendations: string[];
  lastUpdated?: string;
  id?: number;
}

interface TreatmentPlans {
  [key: string]: TreatmentPlan;
}

interface Action {
  id: number;
  user_id: number;
  user_plan_id: number;
  action: string;
  created_at: string;
  updated_at: string;
  status: string;
  priority: string;
  plan_name?: string;
}

const defaultInsights = {
  metabolic: {
    area: "Metabolic Health",
    insight_output: "Mild insulin resistance detected; focus on glycemic control"
  },
  cardiovascular: {
    area: "Cardiovascular Health",
    insight_output: "LDL slightly elevated; emphasis on omega-3s and exercise"
  },
  cognitive: {
    area: "Cognitive Health",
    insight_output: "Some signs of brain fog and memory issues; neuroprotective interventions recommended"
  },
  cancer: {
    area: "Cancer Prevention",
    insight_output: "Regular screenings recommended based on age and family history"
  },
  musculoskeletal: {
    area: "Musculoskeletal Health",
    insight_output: "Moderate risk of bone density loss; weight-bearing exercise and calcium supplementation recommended"
  }
};

// Update markdown component types
interface MarkdownComponentProps {
  children?: ReactNode;
}

interface MarkdownLinkProps extends MarkdownComponentProps {
  href?: string;
}

// Define markdown components with proper types
const markdownComponents: Partial<Components> = {
  p: ({ children }: MarkdownComponentProps) => (
    <Text size="sm" className="leading-relaxed mt-2 mb-2">{children}</Text>
  ),
  ul: ({ children }: MarkdownComponentProps) => (
    <ul className="list-disc pl-4 space-y-1 mt-2 mb-2">{children}</ul>
  ),
  ol: ({ children }: MarkdownComponentProps) => (
    <ol className="list-decimal pl-4 space-y-1 mt-2 mb-2">{children}</ol>
  ),
  li: ({ children }: MarkdownComponentProps) => (
    <li className="text-sm mb-1">{children}</li>
  ),
  strong: ({ children }: MarkdownComponentProps) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: MarkdownComponentProps) => (
    <em className="italic">{children}</em>
  ),
  a: ({ children, href }: MarkdownLinkProps) => (
    <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  details: ({ children, ...props }: MarkdownComponentProps) => {
    // Create a collapsible component that uses React state
    const CollapsibleDetails = () => {
      const [isOpen, setIsOpen] = useState(false);
      
      // Extract summary and content
      let summaryContent = null;
      let bodyContent: ReactNode[] = [];
      
      // Process children to separate summary from content
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'summary') {
          summaryContent = child.props.children;
        } else {
          bodyContent.push(child);
        }
      });
      
      return (
        <div className="group border rounded-lg mb-4">
          <div 
            className="flex cursor-pointer select-none items-center gap-2 p-4 font-medium hover:bg-accent/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-medium">{summaryContent || "Details"}</span>
          </div>
          
          {isOpen && (
            <div className="p-4 pt-0">
              {bodyContent}
            </div>
          )}
        </div>
      );
    };
    
    return <CollapsibleDetails />;
  },
  summary: ({ children }: MarkdownComponentProps) => {
    // This component's output is processed by the details component
    // and doesn't render directly
    return <>{children}</>;
  },
  h1: ({ children }: MarkdownComponentProps) => (
    <Heading size="sm" className="mb-2 mt-4">{children}</Heading>
  ),
  h2: ({ children }: MarkdownComponentProps) => (
    <Text size="sm" className="font-semibold mb-2 mt-4">{children}</Text>
  ),
  h3: ({ children }: MarkdownComponentProps) => (
    <Text size="sm" className="font-medium mb-2 mt-4">{children}</Text>
  ),
};

// Update the processMarkdown function
const processMarkdown = (md: string) => {
  // First, ensure we have proper newlines around HTML tags for markdown parsing
  let result = md.replace(/<details>/g, '\n<details>\n');
  result = result.replace(/<\/details>/g, '\n</details>\n');
  result = result.replace(/<summary>Day/g, '<summary>Day'); // Remove newline before Day
  result = result.replace(/<\/summary>/g, '</summary>\n');
  
  // Clean up any multiple newlines that might have been created
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result;
};

// Function to remove plan title from markdown content
const removeTitleFromMarkdown = (md: string, planTitle: string) => {
  // First, try the simple case - exact title match
  let result = md.replace(new RegExp(`^# ${planTitle}\\s*$`, 'mi'), '');
  result = result.replace(new RegExp(`^## ${planTitle}\\s*$`, 'mi'), '');
  
  // Try title without "Plan" suffix
  const titleWithoutPlan = planTitle.replace(/\s+plan$/i, '');
  result = result.replace(new RegExp(`^# ${titleWithoutPlan}\\s*$`, 'mi'), '');
  result = result.replace(new RegExp(`^## ${titleWithoutPlan}\\s*$`, 'mi'), '');
  
  // Extract key words from the plan title
  const keyWords = [];
  if (planTitle.toLowerCase().includes('nutrition')) keyWords.push('nutrition');
  if (planTitle.toLowerCase().includes('exercise') || planTitle.toLowerCase().includes('movement')) keyWords.push('exercise|movement');
  if (planTitle.toLowerCase().includes('supplement')) keyWords.push('supplement');
  if (planTitle.toLowerCase().includes('medical') || planTitle.toLowerCase().includes('intervention')) keyWords.push('medical|intervention|therapies');
  if (planTitle.toLowerCase().includes('sleep')) keyWords.push('sleep');
  if (planTitle.toLowerCase().includes('emotional') || planTitle.toLowerCase().includes('mental')) keyWords.push('emotional|mental');
  if (planTitle.toLowerCase().includes('screening') || planTitle.includes('diagnostic')) keyWords.push('screening|diagnostic');
  if (planTitle.toLowerCase().includes('therapy')) keyWords.push('therapy');
  if (planTitle.toLowerCase().includes('accountability') || planTitle.toLowerCase().includes('optimization')) keyWords.push('accountability|optimization');

  // If we found keywords, remove headers containing those words
  if (keyWords.length > 0) {
    const keywordsPattern = keyWords.join('|');
    // Remove h1 headers with keywords
    result = result.replace(new RegExp(`^# .*?(${keywordsPattern}).*?$`, 'mig'), '');
    // Remove h2 headers with keywords
    result = result.replace(new RegExp(`^## .*?(${keywordsPattern}).*?$`, 'mig'), '');
    // Also try to remove h3 headers that might contain plan titles 
    result = result.replace(new RegExp(`^### .*?(${keywordsPattern}).*?$`, 'mig'), '');
  }
  
  // Special cases for common formats
  // Match formats like "7-Day Nutrition Plan" or "30-Day Exercise Plan"
  result = result.replace(/^# \d+-Day .*? Plan.*$/mig, '');
  result = result.replace(/^## \d+-Day .*? Plan.*$/mig, '');
  
  // Match formats like "Personalized Sleep Plan"
  result = result.replace(/^# Personalized .*? Plan.*$/mig, '');
  result = result.replace(/^## Personalized .*? Plan.*$/mig, '');
  
  // Clean up any multiple newlines that might have been created
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result;
};

// Update the getPlanIcon function to use the same color scheme as in the plans section
const getPlanIcon = (planName: string) => {
  const lowerName = planName?.toLowerCase() || "";
  
  if (lowerName.includes("nutrition")) {
    return { 
      icon: <Utensils className="h-3.5 w-3.5" />,
      bgClass: "bg-emerald-100",
      textClass: "text-emerald-600"
    };
  } else if (lowerName.includes("exercise") || lowerName.includes("movement")) {
    return { 
      icon: <Dumbbell className="h-3.5 w-3.5" />,
      bgClass: "bg-blue-100",
      textClass: "text-blue-600"
    };
  } else if (lowerName.includes("supplement")) {
    return { 
      icon: <Pill className="h-3.5 w-3.5" />,
      bgClass: "bg-purple-100",
      textClass: "text-purple-600"
    };
  } else if (lowerName.includes("medical") || lowerName.includes("intervention") || lowerName.includes("therapies")) {
    return { 
      icon: <Stethoscope className="h-3.5 w-3.5" />,
      bgClass: "bg-red-100",
      textClass: "text-red-600"
    };
  } else if (lowerName.includes("account") || lowerName.includes("optimization")) {
    return { 
      icon: <Target className="h-3.5 w-3.5" />,
      bgClass: "bg-amber-100",
      textClass: "text-amber-600"
    };
  } else if (lowerName.includes("sleep")) {
    return { 
      icon: <Clock className="h-3.5 w-3.5" />,
      bgClass: "bg-indigo-100",
      textClass: "text-indigo-600"
    };
  } else if (lowerName.includes("emotional") || lowerName.includes("mental")) {
    return { 
      icon: <Brain className="h-3.5 w-3.5" />,
      bgClass: "bg-fuchsia-100",
      textClass: "text-fuchsia-600"
    };
  } else if (lowerName.includes("screening") || lowerName.includes("diagnostic")) {
    return { 
      icon: <Activity className="h-3.5 w-3.5" />,
      bgClass: "bg-cyan-100",
      textClass: "text-cyan-600"
    };
  } else if (lowerName.includes("therapy")) {
    return { 
      icon: <Heart className="h-3.5 w-3.5" />,
      bgClass: "bg-rose-100",
      textClass: "text-rose-600"
    };
  }
  
  // Default icon if no match
  return { 
    icon: <Activity className="h-3.5 w-3.5" />,
    bgClass: "bg-gray-100",
    textClass: "text-gray-600"
  };
};

// Get appropriate action icon based on action text
const getActionIcon = (actionText: string) => {
  const text = actionText.toLowerCase();
  
  // Exercise/Movement related
  if (text.includes('exercise') || text.includes('workout') || text.includes('training') || 
      text.includes('run') || text.includes('walk') || text.includes('steps') || 
      text.includes('cardio') || text.includes('strength') || text.includes('gym')) {
    return { 
      icon: <Dumbbell className="h-6 w-6" />,
      bgClass: "bg-blue-100",
      textClass: "text-blue-600"
    };
  }
  
  // Sleep related
  if (text.includes('sleep') || text.includes('rest') || text.includes('bed') || 
      text.includes('circadian') || text.includes('nap') || text.includes('melatonin')) {
    return { 
      icon: <Clock className="h-6 w-6" />,
      bgClass: "bg-indigo-100",
      textClass: "text-indigo-600"
    };
  }
  
  // Nutrition related
  if (text.includes('eat') || text.includes('food') || text.includes('meal') || 
      text.includes('diet') || text.includes('protein') || text.includes('carb') || 
      text.includes('fat') || text.includes('calorie') || text.includes('nutrition') || 
      text.includes('vegetable') || text.includes('fruit')) {
    return { 
      icon: <Utensils className="h-6 w-6" />,
      bgClass: "bg-emerald-100",
      textClass: "text-emerald-600"
    };
  }
  
  // Supplements related
  if (text.includes('supplement') || text.includes('vitamin') || text.includes('mineral') || 
      text.includes('omega') || text.includes('magnesium') || text.includes('zinc') || 
      text.includes('pill') || text.includes('capsule') || text.includes('protein powder')) {
    return { 
      icon: <Pill className="h-6 w-6" />,
      bgClass: "bg-purple-100",
      textClass: "text-purple-600"
    };
  }
  
  // Medical related
  if (text.includes('doctor') || text.includes('appointment') || text.includes('checkup') || 
      text.includes('test') || text.includes('scan') || text.includes('blood') || 
      text.includes('medical') || text.includes('healthcare') || text.includes('therapy')) {
    return { 
      icon: <Stethoscope className="h-6 w-6" />,
      bgClass: "bg-red-100",
      textClass: "text-red-600"
    };
  }
  
  // Mental health related
  if (text.includes('stress') || text.includes('meditation') || text.includes('mindfulness') || 
      text.includes('anxiety') || text.includes('mental') || text.includes('relax') || 
      text.includes('calm') || text.includes('breathing')) {
    return { 
      icon: <Brain className="h-6 w-6" />,
      bgClass: "bg-fuchsia-100",
      textClass: "text-fuchsia-600"
    };
  }
  
  // Default heart icon
  return { 
    icon: <Heart className="h-6 w-6" />,
    bgClass: "bg-gray-100",
    textClass: "text-gray-600"
  };
};

// Function to strip asterisks from text
const stripAsterisks = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*/g, '');
};

// Get appropriate icon for insight area
const getInsightIcon = (area: string) => {
  const areaLower = area.toLowerCase();
  
  if (areaLower.includes('metabolic') || areaLower.includes('glucose') || areaLower.includes('insulin')) {
    return <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('cardio') || areaLower.includes('heart') || areaLower.includes('vascular')) {
    return <Heart className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('hormon') || areaLower.includes('testosterone') || areaLower.includes('estrogen')) {
    return <Activity className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('cognit') || areaLower.includes('brain') || areaLower.includes('neuro')) {
    return <Brain className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('inflamm') || areaLower.includes('immune')) {
    return <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('cancer') || areaLower.includes('prevention')) {
    return <Target className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  if (areaLower.includes('musculo') || areaLower.includes('skeletal') || areaLower.includes('bone')) {
    return <Dumbbell className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
  }
  
  // Default icon
  return <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />;
};

export default function DashboardStats() {
  const [stats, setStats] = useState({
    phenotypicAge: '-',
    vo2Max: '-',
    bodyFat: '-',
    muscleMass: '-'
  });
  const [insights, setInsights] = useState<HealthInsights>({
    metabolic: null,
    cardiovascular: null,
    cognitive: null,
    cancer: null,
    musculoskeletal: null
  });
  const [actions, setActions] = useState<Action[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlans>({});
  const [activePlanTab, setActivePlanTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllActions, setShowAllActions] = useState(false);
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        // Try to fetch stats
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data: UserStats = await response.json();
          if (isMounted) {
            setStats(prev => ({
              ...prev,
              phenotypicAge: data.phenotypic_age?.toString() || '38',
              vo2Max: data.vo2_max?.toString() || '42.5',
              bodyFat: data.body_fat_percentage?.toString() || '18.2',
              muscleMass: data.muscle_mass?.toString() || '32.6'
            }));
          }
        }
      } catch (error) {
        console.log('Error fetching stats');
        if (isMounted) {
          setStats(prev => ({
            ...prev,
            phenotypicAge: '38',
            vo2Max: '42.5',
            bodyFat: '18.2',
            muscleMass: '32.6'
          }));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    async function fetchInsights() {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Fetching insights with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/insights`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Insights API response status:', response.status);
        
        if (response.ok) {
          const data: Insight[] = await response.json();
          console.log('Insights data received:', data);
          console.log('Number of insights:', data.length);
          
          // Log each insight to check the structure
          data.forEach((insight, index) => {
            console.log(`Insight ${index}:`, insight);
            console.log(`  - area: "${insight.area}"`);
            console.log(`  - insight_output: "${insight.insight_output}"`);
          });
          
          // Store all insights for rendering if they don't fit into categories
          if (data.length > 0) {
            setAllInsights(data);
          }
          
          // Organize insights by area
          const organizedInsights: HealthInsights = {
            metabolic: data.find(i => i.area?.toLowerCase().includes('metabolic')) || null,
            cardiovascular: data.find(i => i.area?.toLowerCase().includes('cardio') || i.area?.toLowerCase().includes('heart') || i.area?.toLowerCase().includes('vascular')) || null,
            cognitive: data.find(i => i.area?.toLowerCase().includes('cognit') || i.area?.toLowerCase().includes('brain') || i.area?.toLowerCase().includes('neuro')) || null,
            cancer: data.find(i => i.area?.toLowerCase().includes('cancer') || i.area?.toLowerCase().includes('prevention')) || null,
            musculoskeletal: data.find(i => i.area?.toLowerCase().includes('musculo') || i.area?.toLowerCase().includes('skeletal') || i.area?.toLowerCase().includes('bone')) || null
          };
          
          console.log('Organized insights:', organizedInsights);
          
          // Check which insights were found and their areas for debugging
          let anyMatchFound = false;
          Object.entries(organizedInsights).forEach(([key, value]) => {
            console.log(`${key} insight found:`, !!value, value ? `area: "${value.area}"` : '');
            if (value) anyMatchFound = true;
          });
          
          console.log('Were any standard category insights found?', anyMatchFound);
          
          // Look for unique areas in the data
          const uniqueAreas = [...new Set(data.map(insight => insight.area))];
          console.log('Unique areas in data:', uniqueAreas);
          
          // Only use the received insights if we have any
          if (data.length > 0) {
            console.log('Setting insights state with received data');
            setInsights(organizedInsights);
          } else {
            console.log('No insights received, keeping default data');
          }
        } else {
          console.error('Failed to fetch insights, status:', response.status);
          try {
            const errorText = await response.text();
            console.error('Error response:', errorText);
          } catch (e) {
            console.error('Could not read error response');
          }
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        console.log('Using default insights data');
      }
    }

    fetchInsights();
  }, []);
  
  useEffect(() => {
    async function fetchPlans() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/plans`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data: UserPlan[] = await response.json();
          console.log('User Plans:', data);
          
          // Convert API data to treatment plans format
          const newPlans: TreatmentPlans = {};
          
          data.forEach((plan: UserPlan) => {
            const planKey = plan.plan_name.toLowerCase()
              .replace(/\s+&\s+/g, '_')
              .replace(/\s+/g, '_');
            
            // Process the markdown content
            const processedOutput = processMarkdown(plan.plan_output);
            // Remove title from content
            const contentWithoutTitle = removeTitleFromMarkdown(processedOutput, plan.plan_name);
            
            newPlans[planKey] = {
              title: plan.plan_name,
              objective: plan.plan_objective,
              recommendations: [contentWithoutTitle],
              lastUpdated: plan.updated_at,
              id: plan.plan_id
            };
          });

          setTreatmentPlans(newPlans);
          
          // Set the first plan as active if there are plans and no active tab
          if (Object.keys(newPlans).length > 0 && !activePlanTab) {
            setActivePlanTab(Object.keys(newPlans)[0]);
          }
        }
      } catch (error) {
        console.log('Error fetching plans, using default data');
      }
    }

    fetchPlans();
  }, [activePlanTab]);
  
  useEffect(() => {
    async function fetchActions() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/actions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data: Action[] = await response.json();
          
          // Get the plan names for each action
          const actionsWithPlanNames = data.map(action => {
            // Default plan name
            let planName = "General";
            
            // Try to match the user_plan_id with a plan
            Object.entries(treatmentPlans).forEach(([planType, plan]) => {
              if (plan.id && plan.id === action.user_plan_id) {
                planName = plan.title;
              }
            });
            
            return {
              ...action,
              plan_name: planName
            };
          });
          
          setActions(actionsWithPlanNames);
        }
      } catch (error) {
        console.log('Error fetching actions');
      }
    }

    fetchActions();
  }, [treatmentPlans]);
  
  const generatePDF = (plan: TreatmentPlan) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = 170;

    // Helper function to add new page
    const addNewPage = () => {
      doc.addPage();
      yPosition = 20;
    };

    // Helper function to add text with overflow handling
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont("helvetica", 'bold');
      else doc.setFont("helvetica", 'normal');

      // Split text into lines that fit within maxWidth
      const lines = doc.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
        addNewPage();
      }

      // Add the text
      doc.text(lines, margin, yPosition);
      yPosition += (lines.length * lineHeight) + 5;
    };

    // Add title
    addText(plan.title, 20, true);
    yPosition += 10;

    // Add objective
    addText('Objective', 14, true);
    addText(plan.objective, 12);
    yPosition += 10;

    // Add recommendations
    addText('Recommendations', 14, true);
    yPosition += 5;

    // Process each recommendation
    plan.recommendations.forEach((rec, index) => {
      // Strip markdown formatting if present
      let cleanRec = rec.replace(/<\/?[^>]+(>|$)/g, '');
      cleanRec = cleanRec.replace(/#{1,6}\s/g, ''); // Remove markdown headers
      cleanRec = cleanRec.replace(/\*\*/g, ''); // Remove bold markers
      cleanRec = cleanRec.replace(/\*/g, ''); // Remove italic markers
      
      // Add bullet point and recommendation
      const bulletPoint = `• ${cleanRec}`;
      addText(bulletPoint, 12);
    });

    // Add last updated date if available
    if (plan.lastUpdated) {
      yPosition += 10;
      addText(`Last updated: ${new Date(plan.lastUpdated).toLocaleDateString()}`, 10);
    }

    // Save the PDF
    doc.save(`${plan.title.toLowerCase().replace(/\s+/g, '-')}-plan.pdf`);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-accent bg-accent/10 border-accent/20';
    }
  };
  
  const getStatusIcon = (status: string, priority: string) => {
    // If completed, always show a check mark regardless of priority
    if (status.toLowerCase() === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    // Otherwise, show an icon based on priority
    switch (priority.toLowerCase()) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <ArrowUpRight className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-accent" />;
    }
  };
  
  const markActionComplete = async (actionId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/actions/${actionId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setActions(prev => prev.map(action => 
          action.id === actionId 
            ? { ...action, status: 'completed' } 
            : action
        ));
      }
    } catch (error) {
      console.log('Error updating action status');
    }
  };
  
  const getPlanTagColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'nutrition plan':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'exercise & movement plan':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'supplementation plan':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'medical interventions & advanced therapies':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'accountability & optimization plan':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };
  
  // Sort actions to show completed items at the bottom
  const sortActions = (actions: Action[]) => {
    return [...actions].sort((a, b) => {
      if (a.status.toLowerCase() === 'completed' && b.status.toLowerCase() !== 'completed') {
        return 1; // a comes after b
      }
      if (a.status.toLowerCase() !== 'completed' && b.status.toLowerCase() === 'completed') {
        return -1; // a comes before b
      }
      return 0; // keep original order
    });
  };

  // Get displayed actions based on showAllActions state and sort them
  const displayedActions = showAllActions 
    ? sortActions(actions)
    : sortActions(actions).slice(0, 5);
  
  if (isLoading) return <div>Loading stats...</div>;
  
  return (
    <>
      {/* Two Column Layout for Actions and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Actions Section */}
        {actions.length > 0 && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedActions.map((action) => {
                  const isCompleted = action.status.toLowerCase() === 'completed';
                  const actionIcon = getActionIcon(action.action);
                  
                  return (
                    <div 
                      key={action.id} 
                      className={`flex items-start justify-between p-4 border rounded-xl shadow-sm ${isCompleted ? 'opacity-70 bg-gray-50' : 'bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div>
                          <div className={`h-10 w-10 rounded-full ${actionIcon.bgClass} flex items-center justify-center ${actionIcon.textClass}`}>
                            {actionIcon.icon}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Text className={`text-sm font-semibold ${isCompleted ? 'text-gray-500 line-through' : ''}`}>
                              {action.action}
                            </Text>
                          </div>
                          <div className="flex items-center gap-3">
                            <Text size="xs" className={`text-muted-foreground ${isCompleted ? 'text-gray-400' : ''}`}>
                              Updated: {new Date(action.updated_at).toLocaleDateString()}
                            </Text>
                          </div>
                        </div>
                      </div>
                      {isCompleted ? (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled
                          className="h-8 w-8 rounded-full border-green-200 bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => markActionComplete(action.id)}
                          className="h-8 w-8 rounded-full hover:bg-green-50 hover:border-green-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
                
                {actions.length > 5 && (
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAllActions(!showAllActions)}
                      className="text-primary"
                    >
                      {showAllActions ? 'Show Less' : 'Show More'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Health Insights Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Key Insights</CardTitle>
            {allInsights.length === 0 && (
              <Text size="xs" className="text-muted-foreground">Using placeholder data - connect your health data for personalized insights</Text>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="space-y-4">
                <li className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Zap className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold">
                          {insights.metabolic ? insights.metabolic.area : defaultInsights.metabolic.area}
                        </Text>
                      </div>
                      <Text size="sm" className="text-muted-foreground">
                        {insights.metabolic ? stripAsterisks(insights.metabolic.insight_output) : defaultInsights.metabolic.insight_output}
                      </Text>
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Heart className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold">
                          {insights.cardiovascular ? insights.cardiovascular.area : defaultInsights.cardiovascular.area}
                        </Text>
                      </div>
                      <Text size="sm" className="text-muted-foreground">
                        {insights.cardiovascular ? stripAsterisks(insights.cardiovascular.insight_output) : defaultInsights.cardiovascular.insight_output}
                      </Text>
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Brain className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold">
                          {insights.cognitive ? insights.cognitive.area : defaultInsights.cognitive.area}
                        </Text>
                      </div>
                      <Text size="sm" className="text-muted-foreground">
                        {insights.cognitive ? stripAsterisks(insights.cognitive.insight_output) : defaultInsights.cognitive.insight_output}
                      </Text>
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Target className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold">
                          {insights.cancer ? insights.cancer.area : defaultInsights.cancer.area}
                        </Text>
                      </div>
                      <Text size="sm" className="text-muted-foreground">
                        {insights.cancer ? stripAsterisks(insights.cancer.insight_output) : defaultInsights.cancer.insight_output}
                      </Text>
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold">
                          {insights.musculoskeletal ? insights.musculoskeletal.area : defaultInsights.musculoskeletal.area}
                        </Text>
                      </div>
                      <Text size="sm" className="text-muted-foreground">
                        {insights.musculoskeletal ? stripAsterisks(insights.musculoskeletal.insight_output) : defaultInsights.musculoskeletal.insight_output}
                      </Text>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Display all insights from backend if we have any that don't fit standard categories */}
            {allInsights.length > 0 && (
              (() => {
                // Filter out insights that are already shown in the standard categories
                const additionalInsights = allInsights.filter(insight => {
                  const area = insight.area?.toLowerCase() || '';
                  return !(
                    area.includes('metabolic') || 
                    area.includes('cardio') || area.includes('heart') || area.includes('vascular') ||
                    area.includes('cognit') || area.includes('brain') || area.includes('neuro') ||
                    area.includes('cancer') || area.includes('prevention') ||
                    area.includes('musculo') || area.includes('skeletal') || area.includes('bone')
                  );
                });
                
                // Only show section if we have additional insights
                return additionalInsights.length > 0 ? (
                  <div className="mt-6">
                    <Heading size="sm" className="mb-2">Additional Insights</Heading>
                    <ul className="space-y-4">
                      {additionalInsights.map(insight => (
                        <li key={insight.id} className="flex items-start justify-between p-4 border rounded-xl shadow-sm bg-white">
                          <div className="flex items-start gap-3">
                            <div>
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                {getInsightIcon(insight.area)}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Text className="text-sm font-semibold">{insight.area}</Text>
                              </div>
                              <Text size="sm" className="text-muted-foreground">{stripAsterisks(insight.insight_output)}</Text>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })()
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Score Section */}
      <Card className="col-span-3 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Your Longevity Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div className="text-4xl font-bold">
              {stats.phenotypicAge !== '-' ? stats.phenotypicAge : '78'}
            </div>
            <div className="px-2 py-1 rounded-md bg-score-positive/10 text-score-positive text-xs font-medium">
              +3 pts this week
            </div>
          </div>
          
          <div className="w-full h-2 bg-score-background rounded-full mt-4 mb-2">
            <div className="h-2 bg-score-progress rounded-full" style={{ width: `${(parseInt(stats.phenotypicAge !== '-' ? stats.phenotypicAge : '78', 10) / 100) * 100}%` }} />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Health Focus Area Section */}
      <Card className="col-span-3 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Your Health Focus Areas</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-cardiovascular/10 text-health-cardiovascular border border-health-cardiovascular/20">
              ❤️ Cardiovascular Health
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-brain/10 text-health-brain border border-health-brain/20">
              🧠 Brain Health
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-metabolic/10 text-health-metabolic border border-health-metabolic/20">
              ⚡ Metabolic Health
            </div>
          </div>
          <Text size="xs" className="text-muted-foreground mt-4">
            Your score is based on your biometrics, habits, and adherence to recommendations.
          </Text>
        </CardContent>
      </Card>
      
      {/* Stat Cards - in a grid */}
      <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Phenotypic Age</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.phenotypicAge !== '-' ? stats.phenotypicAge : '38'}
            </div>
            <Text size="xs" className="text-muted-foreground mt-1">Biological age based on biomarkers</Text>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VO₂ Max</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.vo2Max !== '-' ? stats.vo2Max : '42.5'} <span className="text-sm font-normal">ml/kg/min</span>
            </div>
            <Text size="xs" className="text-muted-foreground mt-1">Cardiorespiratory fitness level</Text>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Body Composition</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Text size="xs">Body Fat</Text>
                <div className="text-lg font-bold">{stats.bodyFat !== '-' ? stats.bodyFat : '18.2'}%</div>
              </div>
              <div className="border-l pl-4">
                <Text size="xs">Muscle Mass</Text>
                <div className="text-lg font-bold">{stats.muscleMass !== '-' ? stats.muscleMass : '32.6'} kg</div>
              </div>
            </div>
            <Text size="xs" className="text-muted-foreground mt-1">Metabolic health indicators</Text>
          </CardContent>
        </Card>
      </div>
      
      {/* Treatment Plans Section */}
      {Object.keys(treatmentPlans).length > 0 && (
        <Card className="col-span-3 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Treatment & Optimization Plans</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Download All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activePlanTab || Object.keys(treatmentPlans)[0]} 
              onValueChange={setActivePlanTab}
              className="w-full"
            >
              <TabsList className="mb-10 bg-transparent flex flex-wrap gap-2">
                {Object.entries(treatmentPlans).map(([key, plan]) => {
                  // Get the color for the tab based on plan type
                  const getTabColor = (title: string) => {
                    const lowerName = title.toLowerCase();
                    if (lowerName.includes("nutrition")) {
                      return "bg-emerald-50 text-emerald-700 border-emerald-200";
                    } else if (lowerName.includes("exercise") || lowerName.includes("movement")) {
                      return "bg-blue-50 text-blue-700 border-blue-200";
                    } else if (lowerName.includes("supplement")) {
                      return "bg-purple-50 text-purple-700 border-purple-200";
                    } else if (lowerName.includes("medical") || lowerName.includes("intervention") || lowerName.includes("therapies")) {
                      return "bg-red-50 text-red-700 border-red-200";
                    } else if (lowerName.includes("account") || lowerName.includes("optimization")) {
                      return "bg-amber-50 text-amber-700 border-amber-200";
                    } else if (lowerName.includes("sleep")) {
                      return "bg-indigo-50 text-indigo-700 border-indigo-200";
                    } else if (lowerName.includes("emotional") || lowerName.includes("mental")) {
                      return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200";
                    } else if (lowerName.includes("screening") || lowerName.includes("diagnostic")) {
                      return "bg-cyan-50 text-cyan-700 border-cyan-200";
                    } else if (lowerName.includes("therapy")) {
                      return "bg-rose-50 text-rose-700 border-rose-200";
                    }
                    return "bg-gray-50 text-gray-700 border-gray-200";
                  };
                  
                  const tabColorClass = getTabColor(plan.title);
                  
                  // Simplify plan name for display
                  const getDisplayName = (title: string) => {
                    let displayName = title
                      .replace(' Plan', '')
                      .replace('Medical Interventions & Advanced Therapies', 'Medical')
                      .replace('Exercise & Movement', 'Exercise')
                      .replace('Accountability & Optimization', 'Accountability')
                      .replace('Screening & Diagnostic', 'Screening');
                    
                    // Limit length but keep it reasonable
                    return displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName;
                  };
                  
                  return (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full border ${tabColorClass}
                                 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm`}
                    >
                      <span className={`flex items-center justify-center h-5 w-5 rounded-full ${getPlanIcon(plan.title).bgClass} ${getPlanIcon(plan.title).textClass}`}>
                        {getPlanIcon(plan.title).icon}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {getDisplayName(plan.title)}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {Object.entries(treatmentPlans).map(([key, plan]) => {
                // Determine the appropriate icon based on plan name
                const planIcon = getPlanIcon(plan.title);
                
                return (
                  <TabsContent key={key} value={key} className="space-y-4">
                    <div className="border rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`h-9 w-9 rounded-full ${planIcon.bgClass} flex items-center justify-center ${planIcon.textClass}`}>
                          {planIcon.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">{plan.objective}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        <div className="space-y-4">
                          {plan.recommendations.map((rec, index) => (
                            <div key={index} className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown 
                                components={markdownComponents}
                                rehypePlugins={[rehypeRaw]}
                              >
                                {rec}
                              </ReactMarkdown>
                            </div>
                          ))}
                        </div>
                        
                        {plan.lastUpdated && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <Text size="xs" className="text-muted-foreground">
                              Last updated: {new Date(plan.lastUpdated).toLocaleDateString()}
                            </Text>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generatePDF(plan)}
                              className="h-8 px-3 text-xs"
                            >
                              Download PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Original Recommendations (Now Hidden) */}
      <div className="hidden">
        <div className="mb-6">
          <Text size="xs" className="text-muted-foreground mb-2">
            Updated today
          </Text>
          <div className="flex border-b">
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">
              All Levels
            </button>
            <button className="px-4 py-2 text-sm text-muted-foreground">
              1 Quick Wins
            </button>
            <button className="px-4 py-2 text-sm text-muted-foreground">
              2 Building Habits
            </button>
            <button className="px-4 py-2 text-sm text-muted-foreground">
              3 Lifestyle Changes
            </button>
          </div>
        </div>
        
        <div className="border rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <h3 className="text-lg font-semibold">Quick Wins</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Simple actions that take minimal time but offer significant benefits.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sleep Optimization</h4>
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Create a bedtime routine</p>
                    <p className="text-muted-foreground mt-1">Develop a relaxing pre-sleep routine to signal your body it's time to wind down.</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
                      Medium Impact
                    </span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                      15-30 minutes daily
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      Brain Health
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                      Hormonal Balance
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sleep Optimization</h4>
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Limit caffeine and alcohol</p>
                    <p className="text-muted-foreground mt-1">Reduce consumption of caffeine after noon and limit alcohol before bed.</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">
                      High Impact
                    </span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                      Daily habit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
