import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileCheck, 
  Users, 
  FileText, 
  Clock, 
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Ingest & Extract",
      icon: <Upload className="h-8 w-8" />,
      description: "Upload CC&Rs and architectural standards (PDF/Doc). Our system performs OCR, chunks content, and extracts constraints with citations.",
      features: [
        "Intelligent OCR for scanned documents",
        "Constraint extraction with confidence scores",
        "Section-level citation mapping",
        "Automatic deduplication"
      ]
    },
    {
      number: "02", 
      title: "Smart Submission",
      icon: <FileCheck className="h-8 w-8" />,
      description: "Dynamic forms adapt by project type (paint, fence, roof, solar, EV). Get instant pre-checks with live PASS/FAIL/NEEDS-INFO feedback.",
      features: [
        "Project-specific forms",
        "Real-time compliance checking",
        "Photo upload and analysis",
        "Missing information alerts"
      ]
    },
    {
      number: "03",
      title: "Compliance Checklist", 
      icon: <CheckCircle className="h-8 w-8" />,
      description: "Two-pane review interface shows evidence alongside rules. Every line includes result, rationale, and clause citation with confidence score.",
      features: [
        "Evidence-based decision making",
        "Clause-cited rationales", 
        "Confidence scoring",
        'No "PASS" without citation (enforced)'
      ]
    },
    {
      number: "04",
      title: "Meeting-Aware Governance",
      icon: <Users className="h-8 w-8" />,
      description: "Jurisdiction-specific voting rules enforced. California blocks email votes; async voting only where statutes allow.",
      features: [
        "State-specific rule enforcement",
        "Meeting notice requirements",
        "Quorum tracking",
        "Vote audit trail"
      ]
    },
    {
      number: "05",
      title: "Packets & Letters",
      icon: <FileText className="h-8 w-8" />,
      description: "One-click generates board-ready decision packets (PDF) with full citations. Draft letters always flagged for human review.",
      features: [
        "Automated packet generation",
        "Citation-backed decisions",
        "Draft letter templates",
        "Human approval workflow"
      ]
    },
    {
      number: "06",
      title: "Audit & Analytics",
      icon: <Clock className="h-8 w-8" />,
      description: "Track SLA timers, escalations, and performance metrics. Full audit trail with cycle-time charts and communication analytics.",
      features: [
        "Cycle time tracking",
        "SLA monitoring", 
        "Communication analytics",
        "Compliance reporting"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              How ARC Copilot Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From CC&R ingestion to board-ready decisions in minutes, not weeks. 
              Every step is transparent, auditable, and legally cautious.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="success" className="text-base px-4 py-2">
                Clause-Cited
              </Badge>
              <Badge variant="info" className="text-base px-4 py-2">
                Human Reviewed
              </Badge>
              <Badge variant="warning" className="text-base px-4 py-2">
                Audit Ready
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-primary">Step {step.number}</span>
                      <h2 className="text-2xl font-bold">{step.title}</h2>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual/Card */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <Card className="shadow-elevated p-6 bg-gradient-to-br from-background to-muted/50">
                    <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          {step.icon}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Interactive demo available
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Guardrails */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Built-in Guardrails</h2>
            
            <div className="space-y-6">
              <Alert className="border-warning bg-warning-light">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-warning-foreground">No PASS Without Citation</AlertTitle>
                <AlertDescription className="text-warning-foreground">
                  System rule: Any "pass" result without clause.section + quote is automatically downgraded to "needs-info". 
                  Every approval must be backed by specific regulatory text.
                </AlertDescription>
              </Alert>

              <Alert className="border-info bg-info-light">
                <Shield className="h-5 w-5" />
                <AlertTitle className="text-info-foreground">Draft for Human Review</AlertTitle>
                <AlertDescription className="text-info-foreground">
                  All generated letters and decisions are clearly labeled "Draft for Human Review — Not legal advice." 
                  No communication is sent without explicit human approval.
                </AlertDescription>
              </Alert>

              <Alert className="border-destructive bg-destructive-light">
                <Users className="h-5 w-5" />
                <AlertTitle className="text-destructive-foreground">Jurisdiction Enforcement</AlertTitle>
                <AlertDescription className="text-destructive-foreground">
                  California example: Email votes automatically blocked with clear message "Email votes blocked in CA; schedule a meeting." 
                  Meeting notice and quorum requirements enforced by state.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Live Example */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">See It In Action</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Watch a real fence submission go through the complete ARC review process.
            </p>
            
            <Card className="shadow-elevated bg-gradient-to-br from-background to-muted/20 p-8">
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <FileCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Demo</h3>
                  <p className="text-muted-foreground mb-4">
                    Sample fence submission with real CC&R analysis
                  </p>
                  <Button asChild size="lg">
                    <Link to="/demo">
                      Try Live Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Demo shows: Height violation (FAIL), Material approval (PASS), Missing neighbor notice (NEEDS-INFO)
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto text-center shadow-elevated bg-gradient-primary">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Ready to Start Your 60-Day Pilot?
              </h3>
              <p className="text-primary-foreground/80 mb-8">
                See how ARC Copilot can reduce your review cycles by 40%+ with built-in compliance guardrails.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
                  <Link to="/demo">
                    Book Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;