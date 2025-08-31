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
  Clock, 
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Server,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  const securityControls = [
    {
      category: "Authentication & Access",
      icon: <Key className="h-6 w-6" />,
      controls: [
        "Multi-factor authentication (MFA) required",
        "Single Sign-On (SSO) with SAML 2.0",
        "Role-based access control (RBAC)",
        "Session management with automatic timeout",
        "API key rotation and management"
      ]
    },
    {
      category: "Data Protection",
      icon: <Lock className="h-6 w-6" />,
      controls: [
        "End-to-end encryption (TLS 1.3)",
        "Encryption at rest (AES-256)",
        "Field-level encryption for PII",
        "Key management with HSM backing",
        "Secure key rotation policies"
      ]
    },
    {
      category: "Database Security",
      icon: <Database className="h-6 w-6" />,
      controls: [
        "Row-level security (RLS) policies",
        "Database connection encryption",
        "Automated backup encryption",
        "Query monitoring and anomaly detection",
        "Principle of least privilege"
      ]
    },
    {
      category: "Audit & Compliance",
      icon: <Eye className="h-6 w-6" />,
      controls: [
        "Comprehensive audit logging",
        "Tamper-evident audit trails",
        "Real-time security monitoring",
        "Compliance reporting automation",
        "Incident response procedures"
      ]
    },
    {
      category: "Infrastructure",
      icon: <Server className="h-6 w-6" />,
      controls: [
        "Cloud infrastructure hardening",
        "Network segmentation and firewalls",
        "DDoS protection and rate limiting",
        "Vulnerability scanning and patching",
        "Security incident response team"
      ]
    },
    {
      category: "Data Governance",
      icon: <FileText className="h-6 w-6" />,
      controls: [
        "Data retention policies",
        "Right to deletion (GDPR Article 17)",
        "Data portability and export",
        "Privacy by design principles",
        "Opt-out of AI model training"
      ]
    }
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      status: "In Progress",
      description: "Independent audit of security, availability, and confidentiality controls"
    },
    {
      name: "GDPR Compliant",
      status: "Certified",
      description: "Full compliance with European data protection regulations"
    },
    {
      name: "CCPA Compliant", 
      status: "Certified",
      description: "California Consumer Privacy Act compliance for US data subjects"
    },
    {
      name: "HIPAA Ready",
      status: "Available",
      description: "Healthcare data protection controls available for applicable use cases"
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
              Enterprise Security & Compliance
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Built with security and privacy by design. ARC Copilot meets enterprise-grade 
              security standards while maintaining ease of use.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="success" className="text-base px-4 py-2">
                SOC 2 Type II (In Progress)
              </Badge>
              <Badge variant="info" className="text-base px-4 py-2">
                GDPR Compliant
              </Badge>
              <Badge variant="warning" className="text-base px-4 py-2">
                Privacy by Design
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Security Architecture</h2>
            
            <Card className="shadow-elevated p-8 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-4">ARC Copilot Security Model</h3>
                <div className="bg-muted/30 rounded-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-sm font-medium">Client Apps</div>
                      <div className="text-xs text-muted-foreground">TLS 1.3</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-8 w-8 text-success" />
                      </div>
                      <div className="text-sm font-medium">API Gateway</div>
                      <div className="text-xs text-muted-foreground">Rate Limiting + Auth</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-info/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Database className="h-8 w-8 text-info" />
                      </div>
                      <div className="text-sm font-medium">Database</div>
                      <div className="text-xs text-muted-foreground">RLS + Encryption</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Eye className="h-8 w-8 text-warning" />
                      </div>
                      <div className="text-sm font-medium">Audit Logs</div>
                      <div className="text-xs text-muted-foreground">Tamper-Evident</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Alert className="border-success bg-success-light">
                <Shield className="h-5 w-5" />
                <AlertTitle className="text-success-foreground">Zero Trust Architecture</AlertTitle>
                <AlertDescription className="text-success-foreground">
                  Every request authenticated and authorized. Network segmentation with principle of least privilege.
                </AlertDescription>
              </Alert>

              <Alert className="border-info bg-info-light">
                <Lock className="h-5 w-5" />
                <AlertTitle className="text-info-foreground">End-to-End Encryption</AlertTitle>
                <AlertDescription className="text-info-foreground">
                  Data encrypted in transit (TLS 1.3) and at rest (AES-256). PII gets additional field-level encryption.
                </AlertDescription>
              </Alert>

              <Alert className="border-warning bg-warning-light">
                <Eye className="h-5 w-5" />
                <AlertTitle className="text-warning-foreground">Complete Audit Trail</AlertTitle>
                <AlertDescription className="text-warning-foreground">
                  Every action logged with cryptographic integrity. Tamper-evident trails for compliance.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Security Controls */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Security Controls</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityControls.map((control, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {control.icon}
                      </div>
                      <CardTitle className="text-lg">{control.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {control.controls.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
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

      {/* Certifications & Compliance */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Certifications & Compliance</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <Badge 
                        variant={cert.status === 'Certified' ? 'success' : cert.status === 'In Progress' ? 'warning' : 'info'}
                        className="text-xs"
                      >
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Processing & Privacy */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Data Processing & Privacy</h2>
            
            <div className="space-y-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    Data Processing Principles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Collection & Processing</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Data minimization - collect only what's necessary</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Purpose limitation - use data only for stated purposes</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Consent-based processing with clear opt-outs</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Storage & Retention</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Automatic retention policy enforcement</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Right to erasure (GDPR Article 17)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Data portability and export capabilities</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                    AI & Model Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-warning-light/50 rounded-lg p-4 border border-warning/20">
                    <h4 className="font-semibold text-warning-foreground mb-2">Opt-Out by Default</h4>
                    <p className="text-sm text-warning-foreground mb-4">
                      Customer data is never used for AI model training unless explicitly opted in. 
                      All AI processing is done on-demand with customer data isolated.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Data isolation for AI processing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">No model training on customer data</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Explicit consent required for any data sharing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Incident Response & Support</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    Response SLAs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-destructive">Critical Security Incident</span>
                        <Badge variant="destructive">&lt; 1 hour</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Data breach, system compromise, or unauthorized access</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-warning">High Priority Incident</span>
                        <Badge variant="warning">&lt; 4 hours</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Service disruption affecting multiple customers</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-info">Standard Support</span>
                        <Badge variant="info">&lt; 24 hours</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">General questions, feature requests, or minor issues</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Transparency Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      We publish quarterly transparency reports covering:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Security incidents and response times</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">System uptime and availability metrics</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Data protection compliance updates</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Third-party security assessments</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* DPA & Legal */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Legal & Compliance Documents</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Button variant="outline" asChild className="h-20">
                <Link to="/dpa" className="flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  Data Processing Agreement
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20">
                <Link to="/privacy" className="flex flex-col items-center justify-center">
                  <Shield className="h-6 w-6 mb-2" />
                  Privacy Policy
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20">
                <Link to="/terms" className="flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  Terms of Service
                </Link>
              </Button>
            </div>

            <div className="bg-info-light/50 rounded-lg p-6 border border-info/20">
              <h3 className="font-semibold text-info-foreground mb-2">Need Custom Security Requirements?</h3>
              <p className="text-sm text-info-foreground mb-4">
                Enterprise customers can request custom security assessments, penetration testing, 
                and specialized compliance certifications.
              </p>
              <Button asChild>
                <Link to="/contact">
                  Contact Security Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Security;