import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { 
  LogOut, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Users,
  Settings
} from 'lucide-react';

interface UsageData {
  plan: string;
  included: number;
  used: number;
  month: string;
  overage_rate: number;
}

const App = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Check if user needs onboarding
      if (!session.user?.user_metadata?.org_id) {
        navigate('/app/onboarding');
        return;
      }
      
      // Fetch usage data
      await fetchUsage(session);
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (!session) {
          navigate('/login');
        } else if (session.user?.user_metadata?.org_id) {
          await fetchUsage(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUsage = async (session: Session) => {
    try {
      const response = await fetch('http://localhost:4000/api/billing/usage', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'x-dev-org': session.user?.user_metadata?.org_id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createNewSubmission = () => {
    navigate('/app/submissions/new');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const usagePercentage = usage ? (usage.used / usage.included) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/app" className="text-2xl font-bold text-primary">
                ARC Copilot
              </Link>
              
              {usage && (
                <div className="hidden md:flex items-center gap-3">
                  <Badge variant={usage.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
                    {usage.plan} Plan
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Usage:</span>
                    <span className={isNearLimit ? 'text-destructive font-medium' : ''}>
                      {usage.used}/{usage.included}
                    </span>
                  </div>
                  {isNearLimit && <AlertTriangle className="h-4 w-4 text-destructive" />}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Mobile usage meter */}
          {usage && (
            <div className="md:hidden mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Badge variant={usage.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
                  {usage.plan} Plan
                </Badge>
                <span className={isNearLimit ? 'text-destructive font-medium' : ''}>
                  {usage.used}/{usage.included} submissions
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Manage your architectural review process with AI-powered compliance checking.
            </p>
          </div>

          {/* Usage Alert */}
          {usage && isNearLimit && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Approaching Usage Limit
                </CardTitle>
                <CardDescription>
                  You've used {usage.used} of {usage.included} submissions this month. 
                  {usage.plan === 'free' && ' Consider upgrading to continue processing submissions.'}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={createNewSubmission}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  New Submission
                </CardTitle>
                <CardDescription>
                  Create a new architectural review submission
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Add governing documents and guidelines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  View Submissions
                </CardTitle>
                <CardDescription>
                  Review all past and current submissions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest submissions and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">No submissions yet</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first submission to get started with ARC Copilot
                    </p>
                  </div>
                  <Button variant="outline" onClick={createNewSubmission}>
                    Get Started
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          {usage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Plan & Usage</span>
                  <Badge variant={usage.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
                    {usage.plan}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Submissions this month ({usage.month})</span>
                    <span>{usage.used} / {usage.included}</span>
                  </div>
                  <Progress value={usagePercentage} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{usage.included - usage.used}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${usage.overage_rate}</div>
                    <div className="text-sm text-muted-foreground">Per overage</div>
                  </div>
                </div>
                
                {usage.plan === 'free' && (
                  <Button className="w-full mt-4">
                    Upgrade Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;