import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { User, Session } from '@supabase/supabase-js';
import { Building2, User as UserIcon, CreditCard, Check } from 'lucide-react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    submissions: 4,
    features: ['4 submissions per month', 'Basic compliance checking', 'Email support']
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    submissions: 60,
    features: ['60 submissions per month', 'AI-powered compliance', 'Priority support', 'Document templates'],
    popular: true
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$99',
    period: '/month',
    submissions: 240,
    features: ['240 submissions per month', 'OCR document processing', 'Meeting management', 'API access', 'Custom workflows']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$299',
    period: '/month',
    submissions: 600,
    features: ['600 submissions per month', 'All Growth features', 'SSO integration', 'White-label options', 'Dedicated support']
  }
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
  
  // Step 2: Contact Information
  const [contactName, setContactName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 3: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('free');

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
      // Use Supabase RPC function to create organization
      const { data: orgId, error } = await supabase.rpc('create_org_with_member', {
        org_name: orgName
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setOrgId(orgId);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { org_id: orgId }
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
      console.error('Organization creation error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create organization',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !address.trim() || !phone.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Update user profile with contact information
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          contact_name: contactName,
          address: address,
          phone: phone
        }
      });
      
      if (updateError) {
        throw new Error('Failed to save contact information');
      }
      
      toast({
        title: "Contact information saved",
        description: "Moving to plan selection...",
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

  const handlePlanSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Update plan selection (this would normally involve payment processing)
      const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
      
      toast({
        title: "Plan selected",
        description: `You've selected the ${selectedPlanData?.name} plan. Welcome to ARC Copilot!`,
      });
      
      // Update user metadata to mark onboarding as complete
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          selected_plan: selectedPlan,
          onboarding_completed: true
        }
      });
      
      if (updateError) {
        console.error('Failed to update plan selection:', updateError);
      }
      
      // Navigate to app dashboard
      navigate('/app');
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

  if (!user) {
    return <div>Loading...</div>;
  }

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to ARC Copilot</h1>
          <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of 3</span>
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
                <UserIcon className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleContactInfo}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Enter your full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading || !contactName.trim() || !address.trim() || !phone.trim()}>
                  {isLoading ? "Saving..." : "Continue"}
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Choose Your Plan</CardTitle>
                  <CardDescription>
                    Select the plan that best fits your needs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handlePlanSelection}>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="grid gap-4">
                    {PLANS.map((plan) => (
                      <div key={plan.id} className="relative">
                        <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        } ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}>
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={plan.id} className="font-semibold cursor-pointer">
                                {plan.name}
                              </Label>
                              {plan.popular && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-2xl font-bold">{plan.price}</span>
                              <span className="text-muted-foreground">{plan.period}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {plan.submissions} submissions per month
                            </p>
                            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-primary" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  You can change your plan anytime from your dashboard settings.
                </p>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;