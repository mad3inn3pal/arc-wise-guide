import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileCheck, 
  Users, 
  FileText, 
  Clock, 
  Shield,
  BarChart3,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle,
  Building,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

const Product = () => {
  const features = [
    {
      category: "Document Ingestion",
      icon: <Upload className="h-6 w-6" />,
      items: [
        "OCR for scanned CC&Rs and architectural standards",
        "Intelligent constraint extraction with citations", 
        "Automatic deduplication and conflict detection",
        "Support for PDF, DOC, and image formats",
        "Confidence scoring for extracted rules"
      ]
    },
    {
      category: "Smart Submissions",
      icon: <FileCheck className="h-6 w-6" />,
      items: [
        "Dynamic forms by project type (fence, paint, roof, solar, EV)",
        "Real-time pre-check with instant PASS/FAIL/NEEDS-INFO",
        "Photo upload with metadata extraction",
        "Missing information alerts and suggestions",
        "Integration with popular file storage services"
      ]
    },
    {
      category: "Compliance Engine",
      icon: <Shield className="h-6 w-6" />,
      items: [
        "Clause-cited compliance checking",
        "No PASS without citation (system enforced)",
        "Confidence thresholds and quality gates",
        "Evidence-based decision rationales",
        "Deterministic + AI-assisted analysis"
      ]
    },
    {
      category: "Meeting & Governance",
      icon: <Users className="h-6 w-6" />,
      items: [
        "Jurisdiction-specific voting rule enforcement",
        "California email vote blocking with clear messaging",
        "Meeting notice and quorum tracking",
        "Vote audit trail and compliance reporting",
        "Async vote permissions by state statute"
      ]
    },
    {
      category: "Decision Packets",
      icon: <FileText className="h-6 w-6" />,
      items: [
        "One-click board-ready PDF generation",
        "Citation-backed decision summaries",
        "Draft letter templates (approval/conditional/denial)",
        "Human approval workflow integration",
        "Custom letterhead and branding options"
      ]
    },
    {
      category: "Analytics & Reporting",
      icon: <BarChart3 className="h-6 w-6" />,
      items: [
        "Cycle time reduction tracking (target: ≥40%)",
        "Communication overhead metrics (target: ≥50% reduction)",
        "SLA monitoring with escalation alerts",
        "Board performance analytics",
        "Compliance trend analysis"
      ]
    }
  ];

  const integrations = [
    { name: "Smartwebs", description: "Popular HOA management suite" },
    { name: "PayHOA", description: "Payment and communication platform" },
    { name: "Vantaca", description: "Community management software" },
    { name: "CINC", description: "Integrated community solutions" },
    { name: "DocuSign", description: "E-signature integration" },
    { name: "Dropbox Sign", description: "Document signing workflow" },
    { name: "Stripe", description: "Payment processing" },
    { name: "Twilio", description: "SMS and communication" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              The Complete ARC Copilot Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From CC&R ingestion to board-ready decisions. Everything you need to streamline 
              architectural review with built-in compliance guardrails.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="success" className="text-base px-4 py-2">
                40%+ Faster Decisions
              </Badge>
              <Badge variant="info" className="text-base px-4 py-2">
                50%+ Fewer Emails
              </Badge>
              <Badge variant="warning" className="text-base px-4 py-2">
                Human-in-the-Loop
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/demo">
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                <Link to="/how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Overview</h2>
            
            <Tabs defaultValue="ingestion" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
                <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
                <TabsTrigger value="packets">Packets</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {features.map((feature, index) => (
                <TabsContent key={index} value={feature.category.toLowerCase().replace(/[^a-z]/g, '')}>
                  <Card className="shadow-elevated">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-2xl">{feature.category}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {feature.items.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                              {feature.icon}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Screenshot/Demo Available
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes ARC Copilot Different</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle>Legally Cautious by Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every output labeled "Draft for Human Review." No PASS without citation. 
                    Jurisdiction-aware guardrails prevent illegal board actions.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-info-light rounded-2xl flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-info" />
                  </div>
                  <CardTitle>Integration-Light</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Works alongside existing HOA systems. No rip-and-replace required. 
                    Webhooks and exports maintain your current workflow.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-warning" />
                  </div>
                  <CardTitle>Auditable & Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete audit trail with source citations and confidence scoring. 
                    Full chain of custody for regulatory compliance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-lg text-muted-foreground mb-12">
              We don't replace your system — we accelerate it.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {integrations.map((integration, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-muted/50 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-info-light/50 rounded-lg p-6 border border-info/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-info-foreground mb-2">API-First Architecture</h3>
                  <p className="text-sm text-info-foreground">
                    Full REST API with webhooks, Zapier connectivity, and custom integration support. 
                    Enterprise SSO (SAML) available on Pro plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Enterprise Security & Compliance</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left space-y-4">
                <h3 className="text-xl font-semibold mb-4">Data Protection</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">End-to-end encryption (TLS + at-rest)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Field-level PII encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Row-level security (RLS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Automated data retention policies</span>
                  </div>
                </div>
              </div>

              <div className="text-left space-y-4">
                <h3 className="text-xl font-semibold mb-4">Compliance & Governance</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">SOC 2 Type II (in progress)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">GDPR & CCPA compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Append-only audit logging</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Opt-out of model training</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/security">
                  View Security Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto text-center shadow-elevated bg-gradient-primary">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your ARC Process?
              </h3>
              <p className="text-primary-foreground/80 mb-8">
                Join communities already reducing review cycles by 40%+ with ARC Copilot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
                  <Link to="/demo">
                    Book Your Demo
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

export default Product;