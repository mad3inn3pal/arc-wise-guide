import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  Database, 
  FileText, 
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Server,
  Users,
  Clock,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  const securityFeatures = [
    {
      category: "What we do",
      icon: <Shield className="h-6 w-6" />,
      controls: [
        "Tenant Isolation: Row-level security (RLS) by organization/community",
        "Encryption: TLS in transit; encryption at rest; field-level encryption for PII",
        "Access: SSO/2FA for admins; least-privilege roles; full audit trail on state changes",
        "Files: Presigned uploads; antivirus scanning; no public buckets",
        "Privacy: Service provider/processor stance; data minimization; opt-out of model training"
      ]
    },
    {
      category: "What we don't claim",
      icon: <AlertTriangle className="h-6 w-6" />,
      controls: [
        "No SLA or uptime credits",
        "No \"certified compliance\" badges we haven't earned"
      ]
    }
  ];

  const regulatoryScope = [
    {
      title: "GDPR/EEA",
      description: "We do not currently target or onboard EU/EEA residents. If this changes, we will provide a DPA with GDPR addendum."
    },
    {
      title: "US State Privacy", 
      description: "We align to CPRA/Colorado/Virginia principles where applicable; thresholds may not apply to all customers. DPA available on request."
    },
    {
      title: "HIPAA/PHI",
      description: "Not for Protected Health Information. Accommodation requests should avoid diagnoses; only the minimum necessary info."
    }
  ];

  const independentAssurance = [
    {
      name: "SOC 2 Type II",
      status: "roadmap",
      description: "On the roadmap. Dates will be published after an audit engagement is executed."
    },
    {
      name: "Security Testing",
      status: "active",
      description: "Periodic third-party penetration tests; executive summaries available under NDA."
    }
  ];

  const truthfulBadges = [
    "RLS enforced by default",
    "Encryption at rest + in transit", 
    "Presigned uploads + antivirus scanning",
    "Audit trail on every action",
    "No model training on your data without opt-in"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Security & Privacy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Accurate, honest security practices without overstatement. 
              Built for accountability with transparent operations.
            </p>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {securityFeatures.map((section, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {section.icon}
                      </div>
                      <CardTitle className="text-lg">{section.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.controls.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Scope */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Regulatory Scope (Clear and Honest)</h2>
            
            <div className="space-y-6">
              {regulatoryScope.map((item, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Independent Assurance */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Independent Assurance (Roadmap)</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {independentAssurance.map((item, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge 
                        variant={item.status === 'active' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {item.status === 'active' ? 'Active' : 'Planned'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility & Accommodations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Accessibility & Accommodations</h2>
            
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Alert className="border-warning bg-warning-light">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="text-warning-foreground">Important Guidelines</AlertTitle>
                    <AlertDescription className="text-warning-foreground">
                      Upload only the minimum information needed to evaluate the request.
                      Do not upload medical diagnoses or treatment details. We do not process or store PHI.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6">
                    <p className="text-muted-foreground">
                      Neutral, HUD-aligned templates are provided; reviewers make the final decision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Truthful Security Badges */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Verified Security Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {truthfulBadges.map((badge, index) => (
                <Card key={index} className="shadow-card bg-gradient-card">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Resources */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Legal Resources</h2>
            <p className="text-muted-foreground mb-8">
              Access our complete legal documentation and policies.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/terms">Terms of Service</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dpa">Data Processing Agreement</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="/status" target="_blank" rel="noopener noreferrer">
                  Status Page
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-card bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  All security measures are implemented with commercially reasonable efforts. 
                  This page reflects our current practices and roadmap as of the last update.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;