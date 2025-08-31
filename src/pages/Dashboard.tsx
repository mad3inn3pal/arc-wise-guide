import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import AppHeader from "@/components/dashboard/AppHeader";
import KPIStrip from "@/components/dashboard/KPIStrip";
import SubmissionsQueue from "@/components/dashboard/SubmissionsQueue";
import SidePanels from "@/components/dashboard/SidePanels";

interface KPIData {
  medianCycleDays: number;
  p95CycleDays: number;
  requestsThisWeek: number;
  overdue: number;
  needsInfoRate: number;
  outcomes: {
    pass: number;
    fail: number;
    needsInfo: number;
  };
}

interface Submission {
  id: string;
  submittedAt: string;
  community: {
    id: string;
    name: string;
    state: string;
  };
  property: {
    lot: string;
    address: string;
  };
  projectType: string;
  lastChecklist?: {
    result: "pass" | "fail" | "needs-info";
    rationale: string;
    clauseSection: string;
  };
  sla: {
    dueAt: string;
    status: "due-soon" | "overdue" | "ok";
    deltaHours: number;
  };
  flags: {
    accommodation: boolean;
    jurisdiction: "ok" | "ca_block";
  };
  ownerEmail: string;
}

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (!session?.user && event !== 'INITIAL_SESSION') {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding before loading data
      const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;
      const hasOrgId = user.user_metadata?.org_id;
      
      if (!hasCompletedOnboarding || !hasOrgId) {
        // User hasn't completed onboarding, redirect them
        navigate("/app/onboarding");
        return;
      }
      
      loadDashboardData();
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      const orgId = user?.user_metadata?.org_id;
      
      if (!orgId) {
        console.error('No org_id found in user metadata');
        navigate("/app/onboarding");
        return;
      }

      // Check if org exists and get data
      const { data: orgData } = await supabase
        .from('org')
        .select('id')
        .eq('id', orgId)
        .single();

      if (!orgData) {
        console.error('Organization not found');
        navigate("/app/onboarding");
        return;
      }

      const { data: submissionsData } = await supabase
        .from('submission')
        .select('*')
        .eq('org_id', orgId)
        .limit(1);

      const { data: documentsData } = await supabase
        .from('governing_document')
        .select('*')
        .eq('org_id', orgId)
        .limit(1);

      // Show dashboard if they have submissions or documents
      const hasAnyData = (submissionsData && submissionsData.length > 0) || 
                        (documentsData && documentsData.length > 0);
      
      setHasData(hasAnyData);

      if (hasAnyData) {
        // Load mock data for demonstration
        setKpiData({
          medianCycleDays: 5.2,
          p95CycleDays: 14.0,
          requestsThisWeek: 23,
          overdue: 7,
          needsInfoRate: 0.31,
          outcomes: { pass: 12, fail: 5, needsInfo: 9 }
        });

        // Load sample submissions
        setSubmissions([
          {
            id: "sub_1234567890abcdef",
            submittedAt: "2024-12-30T10:30:00Z",
            community: { id: "comm_123", name: "Palmera Ridge", state: "TX" },
            property: { lot: "23", address: "114 Mockingbird Ln" },
            projectType: "Fence",
            lastChecklist: {
              result: "needs-info",
              rationale: "Fence height exceeds maximum allowed in CC&Rs section 4.3(b)",
              clauseSection: "§4.3(b)"
            },
            sla: { dueAt: "2024-01-05T17:00:00Z", status: "due-soon", deltaHours: -36 },
            flags: { accommodation: false, jurisdiction: "ok" },
            ownerEmail: "homeowner@example.com"
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const usage = {
    plan: user?.user_metadata?.selected_plan || 'free',
    included: user?.user_metadata?.selected_plan === 'free' ? 3 : 25,
    used: 0,
    overage: 0,
    overageRate: 5.0,
  };

  const slaRisk = {
    overdue: kpiData?.overdue || 0,
    dueToday: 2,
    dueSoon: 5,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user} 
        orgName={user?.user_metadata?.org_name || "Your Organization"} 
        usage={usage}
      />

      <div className="container mx-auto px-6 py-6">
        {hasData ? (
          <>
            {/* KPI Strip */}
            <KPIStrip data={kpiData} isLoading={false} />

            {/* Main Content Grid */}
            <div className="grid xl:grid-cols-3 lg:grid-cols-3 gap-6">
              {/* Left: Submissions Queue (2fr) */}
              <div className="xl:col-span-2 lg:col-span-2">
                <SubmissionsQueue 
                  submissions={submissions} 
                  isLoading={false}
                  hasData={hasData}
                />
              </div>

              {/* Right: Side Panels (1fr) */}
              <div className="xl:col-span-1 lg:col-span-1">
                <SidePanels 
                  usage={usage}
                  slaRisk={slaRisk}
                  meetings={[]}
                  recentActivity={[]}
                  documentsNeedingOCR={0}
                  hasOCRFeature={usage.plan !== 'free'}
                />
              </div>
            </div>
          </>
        ) : (
          /* Onboarding View */
          <div className="max-w-4xl mx-auto">
            <SubmissionsQueue hasData={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;