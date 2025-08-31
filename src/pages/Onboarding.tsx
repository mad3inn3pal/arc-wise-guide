import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { User, Session } from '@supabase/supabase-js';
import { Building2, MapPin, Users, Upload } from 'lucide-react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu'
];

interface OnboardingProps {}

const Onboarding: React.FC<OnboardingProps> = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Organization
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState<string | null>(null);
  
  // Step 2: Community
  const [communityName, setCommunityName] = useState('');
  const [state, setState] = useState('');
  const [timezone, setTimezone] = useState('');
  const [meetingMode, setMeetingMode] = useState('meeting');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Check if user already has an org
      if (session.user?.user_metadata?.org_id) {
        navigate('/app');
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (!session) {
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/onboarding/org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ name: orgName })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create organization');
      }
      
      const data = await response.json();
      setOrgId(data.org_id);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { org_id: data.org_id }
      });
      
      if (updateError) {
        console.error('Failed to update user metadata:', updateError);
      }
      
      toast({
        title: "Organization created",
        description: `Welcome to ${orgName}!`,
      });
      
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim() || !state || !timezone) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/onboarding/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'x-dev-org': orgId || ''
        },
        body: JSON.stringify({
          name: communityName,
          state,
          timezone,
          meeting_mode: meetingMode
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create community');
      }
      
      toast({
        title: "Community created",
        description: `${communityName} is ready to go!`,
      });
      
      setCurrentStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipInvites = () => {
    setCurrentStep(4);
  };

  const handleCompleteOnboarding = () => {
    toast({
      title: "Setup complete",
      description: "Welcome to ARC Copilot! You can start uploading documents and creating submissions.",
    });
    navigate('/app');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to ARC Copilot</h1>
          <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Create Your Organization</CardTitle>
                  <CardDescription>
                    What's the name of your organization or HOA?
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateOrganization}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    placeholder="e.g., Sunset Hills HOA"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !orgName.trim()}>
                  {isLoading ? "Creating..." : "Create Organization"}
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Add Your First Community</CardTitle>
                  <CardDescription>
                    Communities help organize submissions by location and governing rules
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateCommunity}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="communityName">Community Name</Label>
                  <Input
                    id="communityName"
                    placeholder="e.g., Phase 1, Main HOA"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={state} onValueChange={setState} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(st => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map(tz => (
                          <SelectItem key={tz} value={tz}>
                            {tz.split('/')[1].replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading || !communityName.trim() || !state || !timezone}>
                  {isLoading ? "Creating..." : "Create Community"}
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Invite Team Members (Optional)</CardTitle>
                  <CardDescription>
                    Add board members, property managers, or other stakeholders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <p>Team invitations will be available in the full version.</p>
                <p className="text-sm mt-2">You can add team members later from the settings.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSkipInvites} className="flex-1">
                  Skip for Now
                </Button>
                <Button onClick={handleSkipInvites} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>You're All Set!</CardTitle>
                  <CardDescription>
                    Your ARC Copilot workspace is ready. You can now upload governing documents and start processing submissions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload your governing documents (CC&Rs, bylaws, etc.)</li>
                  <li>• Create your first architectural submission</li>
                  <li>• Review automated compliance checks</li>
                </ul>
              </div>
              <Button onClick={handleCompleteOnboarding} className="w-full">
                Enter ARC Copilot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;