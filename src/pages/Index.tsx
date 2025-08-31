import ModernNavigation from "@/components/ModernNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Shield, FileCheck, Users, ArrowRight, CheckCircle, Star, Quote, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  console.log("Index component is rendering");
  
  return (
    <div className="min-h-screen bg-gradient-background">
      <ModernNavigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Shaping the future of
                  <span className="text-primary block">HOA compliance</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  AI-powered architectural review and compliance engine built to streamline your community investments—protect decisions, minimize disputes, focus on growing your property portfolio.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-base px-4 py-2 bg-primary/10 text-primary border-primary/20">
                  60-Day Pilot Available
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-muted/20 text-foreground">
                  No Long-term Contracts
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 shadow-glow hover:shadow-glow hover:scale-105 transition-all"
                 >
                   <Link to="/login">
                     Sign up
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Floating Card */}
            <div className="relative">
              <Card className="bg-gradient-card shadow-elevated hover:shadow-glow transition-all duration-500 border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-2">About ARC Copilot</h3>
                      <p className="text-muted-foreground">
                        Learn how ARC Copilot is shaping the future of architectural review compliance, one policy at a time.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-card-foreground">Clause-cited compliance checking</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-card-foreground">Automated decision packets</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-card-foreground">Meeting-aware governance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-card-foreground">40%+ faster review cycles</span>
                      </div>
                    </div>
                    
                    <Button asChild variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                      <Link to="/demo">
                        See Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Why Choose ARC Copilot?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Reduce review time by 40%+ with AI-powered compliance checking and automated decision packets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
              <CardContent className="p-8">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Clause-Cited Compliance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every decision backed by specific regulatory citations with confidence scores. 
                  No claim goes without proper documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
              <CardContent className="p-8">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Automated Review Packets</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate board-ready decision packets with detailed assessments, 
                  reducing back-and-forth emails by 50%+.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
              <CardContent className="p-8">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Meeting-Aware Governance</h3>
                <p className="text-muted-foreground leading-relaxed">
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

      {/* Trust Section */}
      <section className="py-20 bg-gradient-overlay">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-foreground">Built for Accountability</h2>
              <p className="text-xl text-muted-foreground">Without legalese</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-card-foreground">Human Oversight, Always</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every letter is a draft for human review. We don't provide legal advice.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-card-foreground">Data Portability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can request an export of your data (JSON/CSV + PDFs). No lock-in.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-elevated hover:shadow-glow transition-all duration-500 bg-gradient-card border-0 group">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-card-foreground">Transparent Operations</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We publish uptime and change logs. No credits, refunds, or SLAs.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <Card className="bg-muted/20 border border-white/10 shadow-card">
                <CardContent className="p-8">
                  <p className="text-center text-foreground leading-relaxed">
                    <strong>Note:</strong> ARC Copilot is decision support software. Outputs are drafts for human approval. No warranties or service credits are offered.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto text-center shadow-elevated bg-gradient-card border-0">
            <CardContent className="p-16">
              <h3 className="text-3xl font-bold text-card-foreground mb-6">
                Ready to Streamline Your ARC Process?
              </h3>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                See how ARC Copilot can transform your community's architectural review workflow with AI-powered compliance checking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 shadow-glow hover:shadow-glow hover:scale-105 transition-all"
                 >
                   <Link to="/login">
                     Sign up
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-primary/20 text-card-foreground hover:bg-primary/10"
                >
                  <Link to="/pricing">View Pricing</Link>
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

export default Index;
