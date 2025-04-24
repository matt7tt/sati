"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  role: number;
}

interface IntakeForm {
  id: number;
  user_id: number;
  full_name: string;
  date_of_birth: string;
  gender_identity: string;
  phone_number: string;
  email_address: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  ethnicity: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  past_medical_conditions: string;
  family_medical_history: string;
  current_medications: string;
  past_medications: string;
  allergies: string;
  tetanus_up_to_date: boolean;
  tetanus_last_dose: string;
  flu: boolean;
  flu_last_dose: string;
  covid19: boolean;
  covid19_last_dose: string;
  immunization_others: string;
  dietary_pattern: string;
  food_sensitivities: string;
  alcohol_consumption: string;
  caffeine_consumption: string;
  hydration_habits: string;
  exercise_type: string;
  exercise_frequency: string;
  exercise_intensity: string;
  exercise_injuries: string;
  sleep_duration: string;
  sleep_quality: string;
  bedtime_waking_time: string;
  sleep_disorders: string;
  perceived_stress_level: string;
  main_stress_sources: string;
  coping_mechanisms: string;
  mental_health_history: string;
  support_system: string;
  social_interaction_level: string;
  relationship_satisfaction: number;
  occupation: string;
  work_environment_stress: string;
  work_life_balance: number;
  burnout: string;
  height: string;
  weight: string;
  bmi: number;
  body_fat_percentage: number;
  waist_circumference: string;
  hip_circumference: string;
  waist_to_hip_ratio: number;
  blood_pressure: string;
  resting_heart_rate: number;
  heart_rate_variability: string;
  vo2_max: number;
  total_cholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides: number;
  fasting_glucose: number;
  hba1c: number;
  crp: number;
  inflammatory_others: string;
  tsh: number;
  t4: number;
  testosterone: number;
  estrogen: number;
  cortisol: number;
  vitamin_d: number;
  vitamin_b12: number;
  iron_ferritin: number;
  vitamins_others: string;
  genetic_testing: boolean;
  genetic_findings: string;
  family_longevity: string;
  microbiome_test: boolean;
  microbiome_insights: string;
  sleep_tracker: boolean;
  average_nightly_sleep: number;
  sleep_quality_score: number;
  average_daily_steps: number;
  weekly_active_minutes: number;
  other_fitness_metrics: string;
  wearable_hrv: number;
  hrv_trends: string;
  cgm: boolean;
  cgm_details: string;
  primary_health_goals: string;
  biggest_health_concerns: string;
  aging_concerns: string;
  disease_prevention: string;
  cognitive_health: string;
  vitality_levels: string;
  areas_of_interest: string;
  additional_goals: string;
  preferred_insights_format: string;
  check_in_frequency: string;
  digital_monitoring: string;
  wearable_devices: string;
  wellness_apps: string;
  ai_coaching: string;
  feedback_style: string;
  privacy_data_sharing: string;
  created_date: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [intakeForm, setIntakeForm] = useState<IntakeForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            ...data,
            role: 1
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    async function fetchIntakeForm() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/intake-form`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

      if (response.ok) {
          const data = await response.json();
          setIntakeForm(data);
      }
    } catch (error) {
        console.error('Error fetching intake form:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
    fetchIntakeForm();
  }, []);

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile && (
            <>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                <div>
                  <Text className="text-sm text-muted-foreground">Username</Text>
                  <Text className="font-medium">{userProfile.username}</Text>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                <div>
                  <Text className="text-sm text-muted-foreground">Email</Text>
                  <Text className="font-medium">{userProfile.email}</Text>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <Text className="text-sm text-muted-foreground">Member Since</Text>
                  <Text className="font-medium">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </Text>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <div>
                  <Text className="text-sm text-muted-foreground">Account Type</Text>
                  <Text className="font-medium">
                    {userProfile.role === 1 ? 'User' : 'Administrator'}
                  </Text>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Health Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {intakeForm && (
            <>
              <div>
                <Heading size="sm" className="mb-2">Personal Information</Heading>
                <div className="space-y-2">
                  <Text><strong>Name:</strong> {intakeForm.full_name}</Text>
                  <Text><strong>Date of Birth:</strong> {new Date(intakeForm.date_of_birth).toLocaleDateString()}</Text>
                  <Text><strong>Gender Identity:</strong> {intakeForm.gender_identity}</Text>
                  <Text><strong>Ethnicity:</strong> {intakeForm.ethnicity}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Contact Information</Heading>
                <div className="space-y-2">
                  <Text><strong>Phone:</strong> {intakeForm.phone_number}</Text>
                  <Text><strong>Address:</strong> {intakeForm.address_line1}</Text>
                  {intakeForm.address_line2 && <Text>{intakeForm.address_line2}</Text>}
                  <Text>{`${intakeForm.city}, ${intakeForm.state} ${intakeForm.postal_code}`}</Text>
                  <Text>{intakeForm.country}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Emergency Contact</Heading>
                <div className="space-y-2">
                  <Text><strong>Name:</strong> {intakeForm.emergency_contact_name}</Text>
                  <Text><strong>Relationship:</strong> {intakeForm.emergency_contact_relationship}</Text>
                  <Text><strong>Phone:</strong> {intakeForm.emergency_contact_phone}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Medical History</Heading>
                <div className="space-y-2">
                  <Text><strong>Past Medical Conditions:</strong> {intakeForm.past_medical_conditions || 'None reported'}</Text>
                  <Text><strong>Family Medical History:</strong> {intakeForm.family_medical_history || 'None reported'}</Text>
                  <Text><strong>Current Medications:</strong> {intakeForm.current_medications || 'None'}</Text>
                  <Text><strong>Past Medications:</strong> {intakeForm.past_medications || 'None'}</Text>
                  <Text><strong>Allergies:</strong> {intakeForm.allergies || 'None reported'}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Immunizations</Heading>
                <div className="space-y-2">
                  <Text>
                    <strong>Tetanus:</strong> {intakeForm.tetanus_up_to_date ? 'Up to date' : 'Not up to date'}
                    {intakeForm.tetanus_last_dose && ` (Last dose: ${new Date(intakeForm.tetanus_last_dose).toLocaleDateString()})`}
                  </Text>
                  <Text>
                    <strong>Flu:</strong> {intakeForm.flu ? 'Vaccinated' : 'Not vaccinated'}
                    {intakeForm.flu_last_dose && ` (Last dose: ${new Date(intakeForm.flu_last_dose).toLocaleDateString()})`}
                  </Text>
                  <Text>
                    <strong>COVID-19:</strong> {intakeForm.covid19 ? 'Vaccinated' : 'Not vaccinated'}
                    {intakeForm.covid19_last_dose && ` (Last dose: ${new Date(intakeForm.covid19_last_dose).toLocaleDateString()})`}
                  </Text>
                  {intakeForm.immunization_others && (
                    <Text><strong>Other Immunizations:</strong> {intakeForm.immunization_others}</Text>
                  )}
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Lifestyle & Diet</Heading>
                <div className="space-y-2">
                  <Text><strong>Dietary Pattern:</strong> {intakeForm.dietary_pattern}</Text>
                  <Text><strong>Food Sensitivities:</strong> {intakeForm.food_sensitivities || 'None reported'}</Text>
                  <Text><strong>Alcohol Consumption:</strong> {intakeForm.alcohol_consumption}</Text>
                  <Text><strong>Caffeine Consumption:</strong> {intakeForm.caffeine_consumption}</Text>
                  <Text><strong>Hydration Habits:</strong> {intakeForm.hydration_habits}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Exercise & Physical Activity</Heading>
                <div className="space-y-2">
                  <Text><strong>Type:</strong> {intakeForm.exercise_type}</Text>
                  <Text><strong>Frequency:</strong> {intakeForm.exercise_frequency}</Text>
                  <Text><strong>Intensity:</strong> {intakeForm.exercise_intensity}</Text>
                  <Text><strong>Injuries:</strong> {intakeForm.exercise_injuries || 'None reported'}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Sleep & Rest</Heading>
                <div className="space-y-2">
                  <Text><strong>Duration:</strong> {intakeForm.sleep_duration}</Text>
                  <Text><strong>Quality:</strong> {intakeForm.sleep_quality}</Text>
                  <Text><strong>Schedule:</strong> {intakeForm.bedtime_waking_time}</Text>
                  <Text><strong>Sleep Disorders:</strong> {intakeForm.sleep_disorders || 'None reported'}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Mental Health & Stress</Heading>
                <div className="space-y-2">
                  <Text><strong>Stress Level:</strong> {intakeForm.perceived_stress_level}</Text>
                  <Text><strong>Main Sources:</strong> {intakeForm.main_stress_sources}</Text>
                  <Text><strong>Coping Mechanisms:</strong> {intakeForm.coping_mechanisms}</Text>
                  <Text><strong>Mental Health History:</strong> {intakeForm.mental_health_history}</Text>
                  <Text><strong>Support System:</strong> {intakeForm.support_system}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Work & Life Balance</Heading>
                <div className="space-y-2">
                  <Text><strong>Occupation:</strong> {intakeForm.occupation}</Text>
                  <Text><strong>Work Environment Stress:</strong> {intakeForm.work_environment_stress}</Text>
                  <Text><strong>Work-Life Balance:</strong> {intakeForm.work_life_balance}/10</Text>
                  <Text><strong>Burnout Level:</strong> {intakeForm.burnout}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Biometrics</Heading>
                <div className="space-y-2">
                  <Text><strong>Height:</strong> {intakeForm.height}</Text>
                  <Text><strong>Weight:</strong> {intakeForm.weight}</Text>
                  <Text><strong>BMI:</strong> {intakeForm.bmi.toFixed(1)}</Text>
                  <Text><strong>Body Fat:</strong> {intakeForm.body_fat_percentage}%</Text>
                  <Text><strong>Waist Circumference:</strong> {intakeForm.waist_circumference}</Text>
                  <Text><strong>Hip Circumference:</strong> {intakeForm.hip_circumference}</Text>
                  <Text><strong>Waist-to-Hip Ratio:</strong> {intakeForm.waist_to_hip_ratio.toFixed(2)}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Vital Signs</Heading>
                <div className="space-y-2">
                  <Text><strong>Blood Pressure:</strong> {intakeForm.blood_pressure}</Text>
                  <Text><strong>Resting Heart Rate:</strong> {intakeForm.resting_heart_rate} bpm</Text>
                  <Text><strong>Heart Rate Variability:</strong> {intakeForm.heart_rate_variability}</Text>
                  <Text><strong>VO₂ Max:</strong> {intakeForm.vo2_max} ml/kg/min</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Lab Results</Heading>
                <div className="space-y-2">
                  <Text><strong>Total Cholesterol:</strong> {intakeForm.total_cholesterol} mg/dL</Text>
                  <Text><strong>LDL:</strong> {intakeForm.ldl} mg/dL</Text>
                  <Text><strong>HDL:</strong> {intakeForm.hdl} mg/dL</Text>
                  <Text><strong>Triglycerides:</strong> {intakeForm.triglycerides} mg/dL</Text>
                  <Text><strong>Fasting Glucose:</strong> {intakeForm.fasting_glucose} mg/dL</Text>
                  <Text><strong>HbA1c:</strong> {intakeForm.hba1c}%</Text>
                  <Text><strong>CRP:</strong> {intakeForm.crp} mg/L</Text>
                  {intakeForm.inflammatory_others && (
                    <Text><strong>Other Inflammatory Markers:</strong> {intakeForm.inflammatory_others}</Text>
                  )}
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Hormones & Vitamins</Heading>
                <div className="space-y-2">
                  <Text><strong>TSH:</strong> {intakeForm.tsh} mIU/L</Text>
                  <Text><strong>T4:</strong> {intakeForm.t4} µg/dL</Text>
                  <Text><strong>Testosterone:</strong> {intakeForm.testosterone} ng/dL</Text>
                  <Text><strong>Estrogen:</strong> {intakeForm.estrogen} pg/mL</Text>
                  <Text><strong>Cortisol:</strong> {intakeForm.cortisol} µg/dL</Text>
                  <Text><strong>Vitamin D:</strong> {intakeForm.vitamin_d} ng/mL</Text>
                  <Text><strong>Vitamin B12:</strong> {intakeForm.vitamin_b12} pg/mL</Text>
                  <Text><strong>Iron/Ferritin:</strong> {intakeForm.iron_ferritin} ng/mL</Text>
                  {intakeForm.vitamins_others && (
                    <Text><strong>Other Vitamins/Minerals:</strong> {intakeForm.vitamins_others}</Text>
                  )}
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Advanced Testing</Heading>
                <div className="space-y-2">
                  <Text>
                    <strong>Genetic Testing:</strong> {intakeForm.genetic_testing ? 'Completed' : 'Not completed'}
                    {intakeForm.genetic_findings && ` - ${intakeForm.genetic_findings}`}
                  </Text>
                  <Text><strong>Family Longevity:</strong> {intakeForm.family_longevity}</Text>
                  <Text>
                    <strong>Microbiome Testing:</strong> {intakeForm.microbiome_test ? 'Completed' : 'Not completed'}
                    {intakeForm.microbiome_insights && ` - ${intakeForm.microbiome_insights}`}
                  </Text>
                </div>
              </div>

        <div>
                <Heading size="sm" className="mb-2">Health Tracking</Heading>
                <div className="space-y-2">
                  <Text>
                    <strong>Sleep Tracking:</strong> {intakeForm.sleep_tracker ? 'Enabled' : 'Not enabled'}
                    {intakeForm.sleep_tracker && (
                      <>
                        <br />
                        <Text className="ml-4">Average Sleep: {intakeForm.average_nightly_sleep} hours</Text>
                        <Text className="ml-4">Sleep Quality Score: {intakeForm.sleep_quality_score}/100</Text>
                      </>
                    )}
                  </Text>
                  <Text><strong>Average Daily Steps:</strong> {intakeForm.average_daily_steps}</Text>
                  <Text><strong>Weekly Active Minutes:</strong> {intakeForm.weekly_active_minutes}</Text>
                  {intakeForm.other_fitness_metrics && (
                    <Text><strong>Other Fitness Metrics:</strong> {intakeForm.other_fitness_metrics}</Text>
                  )}
                  <Text><strong>HRV:</strong> {intakeForm.wearable_hrv}</Text>
                  {intakeForm.hrv_trends && (
                    <Text><strong>HRV Trends:</strong> {intakeForm.hrv_trends}</Text>
                  )}
                  <Text>
                    <strong>Continuous Glucose Monitoring:</strong> {intakeForm.cgm ? 'Yes' : 'No'}
                    {intakeForm.cgm_details && ` - ${intakeForm.cgm_details}`}
                  </Text>
                </div>
        </div>

        <div>
                <Heading size="sm" className="mb-2">Health Goals & Preferences</Heading>
                <div className="space-y-2">
                  <Text><strong>Primary Health Goals:</strong> {intakeForm.primary_health_goals}</Text>
                  <Text><strong>Health Concerns:</strong> {intakeForm.biggest_health_concerns}</Text>
                  <Text><strong>Aging Concerns:</strong> {intakeForm.aging_concerns}</Text>
                  <Text><strong>Disease Prevention:</strong> {intakeForm.disease_prevention}</Text>
                  <Text><strong>Cognitive Health:</strong> {intakeForm.cognitive_health}</Text>
                  <Text><strong>Vitality Levels:</strong> {intakeForm.vitality_levels}</Text>
                  <Text><strong>Areas of Interest:</strong> {intakeForm.areas_of_interest}</Text>
                  {intakeForm.additional_goals && (
                    <Text><strong>Additional Goals:</strong> {intakeForm.additional_goals}</Text>
                  )}
                </div>
        </div>

        <div>
                <Heading size="sm" className="mb-2">Preferences</Heading>
                <div className="space-y-2">
                  <Text><strong>Preferred Insights Format:</strong> {intakeForm.preferred_insights_format}</Text>
                  <Text><strong>Check-in Frequency:</strong> {intakeForm.check_in_frequency}</Text>
                  <Text><strong>Digital Monitoring:</strong> {intakeForm.digital_monitoring}</Text>
                  <Text><strong>Wearable Devices:</strong> {intakeForm.wearable_devices}</Text>
                  <Text><strong>Wellness Apps:</strong> {intakeForm.wellness_apps}</Text>
                  <Text><strong>AI Coaching:</strong> {intakeForm.ai_coaching}</Text>
                  <Text><strong>Feedback Style:</strong> {intakeForm.feedback_style}</Text>
                  <Text><strong>Privacy Settings:</strong> {intakeForm.privacy_data_sharing}</Text>
                </div>
        </div>

              <div className="pt-4">
                <Button variant="outline">Update Health Profile</Button>
      </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

