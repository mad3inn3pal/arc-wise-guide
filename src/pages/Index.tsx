import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Shield, FileCheck, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ARC Copilot
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered architectural review and compliance engine for HOA communities. 
              Streamline decision-making with clause-cited assessments and automated compliance checking.
            </p>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Badge variant="info" className="text-base px-4 py-2">
                Professional Grade
              </Badge>
              <Badge variant="success" className="text-base px-4 py-2">
                Human-Verified
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                <Link to="/demo">
                  🚀 View Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
            
            {/* Quick Navigation Helper */}
            <div className="mt-8 p-4 bg-info-light rounded-lg border border-info/20">
              <p className="text-info-foreground text-sm">
                <strong>Quick Start:</strong> Click "View Live Demo" above or navigate to <code className="bg-info/20 px-2 py-1 rounded text-xs">/demo</code> to see the ARC compliance assessment in action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ARC Copilot?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reduce review time by 40%+ with AI-powered compliance checking and automated decision packets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Clause-Cited Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every decision backed by specific regulatory citations with confidence scores. 
                  No claim goes without proper documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-info-light rounded-2xl flex items-center justify-center mb-4">
                  <FileCheck className="h-8 w-8 text-info" />
                </div>
                <CardTitle>Automated Review Packets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate board-ready decision packets with detailed assessments, 
                  reducing back-and-forth emails by 50%+.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-warning" />
                </div>
                <CardTitle>Meeting-Aware Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enforces jurisdiction-specific voting rules and meeting requirements. 
                  Built-in guardrails for legal compliance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12">Key Benefits</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cycle Time Reduction</h4>
                    <p className="text-muted-foreground">
                      ≥40% faster ARC decisions vs. baseline through automated compliance checking
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reduced Communication Overhead</h4>
                    <p className="text-muted-foreground">
                      ≥50% fewer email exchanges per request with comprehensive first-pass assessments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Human-in-the-Loop Safety</h4>
                    <p className="text-muted-foreground">
                      No letter sent without human approval. All outputs clearly labeled as drafts
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Legally Cautious</h4>
                    <p className="text-muted-foreground">
                      Privacy-by-default, jurisdiction-aware guardrails, and confidence thresholds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Integration-Light</h4>
                    <p className="text-muted-foreground">
                      Works alongside existing HOA management systems without replacement
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Auditable & Transparent</h4>
                    <p className="text-muted-foreground">
                      Complete audit trail with source citations and confidence scoring
                    </p>
                  </div>
                </div>
              </div>
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
                Ready to Streamline Your ARC Process?
              </h3>
              <p className="text-primary-foreground/80 mb-8">
                See how ARC Copilot can transform your community's architectural review workflow.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Link to="/demo">
                  Explore Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
