import { useState, useEffect } from "react";
import ComplianceStatus from "@/components/ComplianceStatus";
import DraftLetter from "@/components/DraftLetter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Ruler, Hammer, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data that matches the fixtures structure
const mockSubmission = {
  id: 101,
  communityId: 1,
  projectType: "Fence",
  community: {
    name: "Mockingbird Hills HOA",
    state: "TX",
    timezone: "America/Chicago"
  },
  property: {
    lot: "23",
    address: "114 Mockingbird Ln"
  },
  fields: {
    heightFt: 7,
    material: "wood",
    style: "board-on-board"
  }
};

const mockChecklist = {
  submissionId: 101,
  results: [
    {
      constraintId: "c_fence_max_height",
      result: "fail" as const,
      rationale: "Proposed height 7 ft exceeds maximum 6 ft.",
      clause: { section: "§4.3(b)" },
      quote: "Maximum fence height in rear and side yards is six (6) feet.",
      confidence: 0.92
    },
    {
      constraintId: "c_fence_materials_allowed",
      result: "pass" as const,
      rationale: "Material 'wood' is allowed.",
      clause: { section: "§4.3(c)" },
      quote: "Permitted materials: wood..., wrought iron.",
      confidence: 0.90
    },
    {
      constraintId: "missing_neighbor_notice",
      result: "needs-info" as const,
      rationale: "Neighbor notice required for shared fences is missing for Lot 24.",
      clause: { section: "Appendix A" },
      quote: "Fence: ... neighbor notice for shared fences.",
      confidence: 0.78
    }
  ]
};

const mockLetter = {
  submissionId: 101,
  type: "conditional",
  note: "DRAFT FOR HUMAN REVIEW — NOT LEGAL ADVICE",
  file: "Draft: Reduce height to 6 ft (§4.3(b)); provide neighbor notice (Appendix A)."
};

const Demo = () => {
  const [checklist, setChecklist] = useState(null);
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API calls with mock data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if this would be a CA email vote (simulated)
        if (mockSubmission.community.state === "CA") {
          // Simulate the CA email vote error
          setError("Email votes blocked in CA; schedule a meeting.");
          toast({
            title: "Compliance Warning",
            description: "California jurisdiction requires in-person board meetings for this type of decision.",
            variant: "destructive",
          });
        }
        
        setChecklist(mockChecklist);
        setLetter(mockLetter);
      } catch (err) {
        setError("Failed to load compliance data");
        toast({
          title: "Error",
          description: "Failed to load compliance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading compliance assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-elevated">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">ARC Copilot</h1>
              <p className="text-primary-foreground/80">Architectural Review & Compliance Engine</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Submission Overview */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Hammer className="h-6 w-6 text-primary" />
              Submission #{mockSubmission.id} - {mockSubmission.projectType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{mockSubmission.community.name}</span>
                  <Badge variant="outline">{mockSubmission.community.state}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Lot {mockSubmission.property.lot} - {mockSubmission.property.address}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span>Height: {mockSubmission.fields.heightFt} ft</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Material: </span>
                  <span className="capitalize">{mockSubmission.fields.material}</span>
                  <span className="text-muted-foreground"> • Style: </span>
                  <span className="capitalize">{mockSubmission.fields.style}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CA Email Vote Warning */}
        {error && error.includes("CA") && (
          <Alert className="mb-8 border-warning bg-warning-light">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-warning-foreground">Jurisdiction Notice</AlertTitle>
            <AlertDescription className="text-warning-foreground">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compliance Checklist */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-primary rounded-full"></div>
              Compliance Assessment
            </h2>
            {checklist && <ComplianceStatus items={checklist.results} />}
          </div>

          {/* Draft Letter */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-primary rounded-full"></div>
              Generated Decision
            </h2>
            {letter && <DraftLetter letter={letter} />}
          </div>
        </div>

        {/* Footer Note */}
        <Card className="mt-8 border-info bg-info-light">
          <CardContent className="pt-6">
            <p className="text-sm text-info-foreground">
              <strong>Important:</strong> This is a demonstration of ARC Copilot's compliance assessment capabilities. 
              All decisions require human review and approval before being communicated to homeowners. 
              This system provides regulatory guidance but does not constitute legal advice.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Demo;