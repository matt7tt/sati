'use client';

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
  role: number;
}

interface IntakeForm {
  id: number;
  user_id: number;
  health_goals: string;
  medical_history: string;
  current_medications: string;
  allergies: string;
  sleep_patterns: string;
  stress_levels: string;
  exercise_frequency: string;
  diet_preferences: string;
  supplements: string;
  lifestyle_factors: string;
  ai_coaching: boolean;
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    async function fetchIntakeForm() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/intake`, {
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
                <Heading size="sm" className="mb-2">Health Goals</Heading>
                <Text>{intakeForm.health_goals}</Text>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Medical History</Heading>
                <Text>{intakeForm.medical_history}</Text>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Current Medications</Heading>
                <Text>{intakeForm.current_medications || 'None'}</Text>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Allergies & Sensitivities</Heading>
                <Text>{intakeForm.allergies || 'None reported'}</Text>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Lifestyle</Heading>
                <div className="space-y-2">
                  <Text><strong>Sleep Patterns:</strong> {intakeForm.sleep_patterns}</Text>
                  <Text><strong>Stress Levels:</strong> {intakeForm.stress_levels}</Text>
                  <Text><strong>Exercise Frequency:</strong> {intakeForm.exercise_frequency}</Text>
                  <Text><strong>Diet Preferences:</strong> {intakeForm.diet_preferences}</Text>
                </div>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Supplements</Heading>
                <Text>{intakeForm.supplements || 'None'}</Text>
              </div>

              <div>
                <Heading size="sm" className="mb-2">Preferences</Heading>
                <div className="space-y-2">
                  <Text><strong>AI Coaching:</strong> {intakeForm.ai_coaching ? 'Enabled' : 'Disabled'}</Text>
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