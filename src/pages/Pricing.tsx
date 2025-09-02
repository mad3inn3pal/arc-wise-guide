import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useBilling } from "@/hooks/useBilling";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    plan: currentPlan, 
    isLoading, 
    previewPlanChange, 
    changePlan, 
    checkout,
    isChanging,
    isCheckingOut 
  } = useBilling();
  const [confirmDialog, setConfirmDialog] = useState<{
    plan: string;
    preview: any;
  } | null>(null);

  const from = searchParams.get('from');
  const returnTo = searchParams.get('returnTo');

  const handlePlanSelect = async (targetPlan: string) => {
    if (!currentPlan) return;
    
    if (currentPlan.plan === targetPlan) {
      toast({
        title: "Current Plan",
        description: "This is already your current plan",
      });
      return;
    }

    try {
      const preview = await previewPlanChange({ plan: targetPlan });
      if (!preview.allowed) {
        toast({
          title: "Cannot Change Plan",
          description: preview.reason,
          variant: "destructive",
        });
        return;
      }
      
      setConfirmDialog({ plan: targetPlan, preview });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to preview plan change",
        variant: "destructive",
      });
    }
  };

  const handleConfirmChange = async () => {
    if (!confirmDialog) return;
    
    try {
      if (confirmDialog.plan === 'free') {
        // Free plan - update directly in database
        const result = await changePlan({
          plan: confirmDialog.plan,
          returnTo: returnTo || undefined,
        });
        
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      } else {
        // Paid plan - redirect to Stripe checkout
        await checkout({
          plan: confirmDialog.plan,
          billing_cycle: 'monthly', // Default to monthly for now
          returnTo: returnTo || undefined,
        });
      }
      
      setConfirmDialog(null);
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  useEffect(() => {
    // Handle auto-opening invite modal after upgrade
    if (returnTo?.includes('open=invites') && currentPlan?.features.INVITES) {
      navigate('/app?open=invites', { replace: true });
    }
  }, [currentPlan, returnTo, navigate]);
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      submissions: "4 submissions/mo",
      overage: "No overage (hard stop)",
      features: [
        "1 community",
        "1 board seat",
        "30-day retention",
        "Basic rule checks",
        "Draft letters"
      ],
      limitations: [
        "No OCR",
        "No LLM analysis", 
        "No integrations",
        "No meeting mode"
      ],
      cta: "Get Started",
      popular: false,
      planFeatures: {
        ocr: false,
        llm: false,
        meeting: false,
        webhooks: false,
        sso: false
      }
    },
    {
      name: "Starter",
      price: "$149",
      period: "/ community / mo",
      submissions: "60 submissions/mo",
      overage: "$3.00 per extra submission",
      features: [
        "1 community",
        "2 board seats", 
        "Deterministic checks",
        "Lightweight AI classification",
        "Draft letters allowed",
        "Limited storage"
      ],
      limitations: [
        "No OCR on documents",
        "Limited storage",
        "No meeting mode"
      ],
      cta: "Start Pilot",
      popular: false,
      planFeatures: {
        ocr: false,
        llm: "light",
        meeting: false,
        webhooks: false,
        sso: false
      }
    },
    {
      name: "Growth", 
      price: "$399",
      period: "/ community / mo",
      submissions: "240 submissions/mo",
      overage: "$2.00 per extra submission",
      features: [
        "1 community",
        "5 board seats",
        "OCR on governing documents",
        "Meeting mode",
        "Decision packets (PDF)",
        "Webhooks",
        "Priority support"
      ],
      limitations: [],
      cta: "Start Pilot",
      popular: true,
      planFeatures: {
        ocr: true,
        llm: true,
        meeting: true,
        webhooks: true,
        sso: false
      }
    },
    {
      name: "Pro",
      price: "$799",
      period: "/ community / mo", 
      submissions: "600 submissions/mo",
      overage: "$1.25 per extra submission",
      features: [
        "1 community",
        "Unlimited board seats",
        "Full feature access",
        "Higher rate limits",
        "SSO (SAML)",
        "Custom overlays",
        "Advanced analytics",
        "Dedicated support"
      ],
      limitations: [],
      cta: "Start Pilot",
      popular: false,
      planFeatures: {
        ocr: true,
        llm: true,
        meeting: true,
        webhooks: true,
        sso: true
      }
    }
  ];

  const addOns = [
    {
      name: "E-signature",
      price: "$0.75",
      unit: "per envelope",
      description: "DocuSign/Dropbox Sign integration"
    },
    {
      name: "SMS Notifications",
      price: "$0.02", 
      unit: "per message",
      description: "Text alerts for board members"
    },
    {
      name: "Extra OCR/LLM Credits",
      price: "$99",
      unit: "per 1,000 pages",
      description: "For heavy scan communities"
    },
    {
      name: "White-label Domain",
      price: "$99",
      unit: "per month",
      description: "Custom subdomain + branding"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Priced like a co-pilot, not a full HOA suite. Start with a 60-day pilot and see results.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="success" className="text-base px-4 py-2">
                60-Day Pilot Available
              </Badge>
              <Badge variant="info" className="text-base px-4 py-2">
                Cancel Anytime
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-elevated' : 'shadow-card'} hover:shadow-elevated transition-smooth`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.submissions}</p>
                  <p className="text-xs text-muted-foreground">{plan.overage}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handlePlanSelect(plan.name.toLowerCase())}
                    className="w-full"
                    variant={
                      currentPlan?.plan === plan.name.toLowerCase() 
                        ? "secondary" 
                        : plan.popular 
                        ? "default" 
                        : "secondary"
                    }
                    disabled={isLoading || isChanging || isCheckingOut || (currentPlan?.plan === plan.name.toLowerCase())}
                  >
                    {isLoading || isChanging || isCheckingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : currentPlan?.plan === plan.name.toLowerCase() ? (
                      "Current Plan"
                    ) : currentPlan && currentPlan.plan > plan.name.toLowerCase() ? (
                      <>Downgrade to {plan.name}</>
                    ) : (
                      <>Upgrade to {plan.name}</>
                    )}
                    {currentPlan?.plan !== plan.name.toLowerCase() && !isLoading && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Plan Badge */}
          {currentPlan && (
            <div className="mt-8 text-center">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Current Plan: {currentPlan.plan.charAt(0).toUpperCase() + currentPlan.plan.slice(1)} · {currentPlan.seats.used}/{currentPlan.included} this month
              </Badge>
            </div>
          )}

          {/* Management Company Plan */}
          <div className="mt-12">
            <Card className="shadow-elevated bg-gradient-primary">
              <CardContent className="pt-8 pb-8">
                <div className="text-center text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-4">Management Company</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$2,499</span>
                    <span className="text-primary-foreground/80"> / month</span>
                  </div>
                  <p className="mb-6 text-primary-foreground/80">
                    Up to 25 communities • Pooled usage • Consolidated analytics • Sandbox & SLAs
                  </p>
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/demo">
                      Contact Sales
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Matrix */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
            <Card className="shadow-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold">Starter</th>
                      <th className="text-center p-4 font-semibold">Growth</th>
                      <th className="text-center p-4 font-semibold">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-medium">OCR on Documents</td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                    </tr>
                    <tr className="border-t bg-muted/20">
                      <td className="p-4 font-medium">LLM Analysis</td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-xs text-warning">Light</span></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 font-medium">Meeting Mode</td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                    </tr>
                    <tr className="border-t bg-muted/20">
                      <td className="p-4 font-medium">Webhooks</td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 font-medium">SSO (SAML)</td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><X className="h-4 w-4 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-4 w-4 text-success mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Optional Add-ons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {addOns.map((addon, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{addon.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">{addon.price}</span>
                        <span className="text-sm text-muted-foreground"> {addon.unit}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Guarantees</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold mb-2">60-Day Pilot</h3>
                <p className="text-sm text-muted-foreground">
                  If you don't hit ≥20% cycle-time reduction, next month free.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-info" />
                </div>
                <h3 className="font-semibold mb-2">Human Oversight</h3>
                <p className="text-sm text-muted-foreground">
                  No letter sent without human approval. Not legal advice.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Data Export</h3>
                <p className="text-sm text-muted-foreground">
                  Cancel anytime. Export available on request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Terms */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Service Terms (Summary)</h3>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong className="text-foreground">Non-binding SLOs only.</strong> We operate with commercially reasonable efforts and publish a public status page.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong className="text-foreground">No SLAs, penalties, or service credits</strong> are offered on any plan.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong className="text-foreground">Exports available on request.</strong> We retain audit logs per records policy; other data follows your retention settings.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong className="text-foreground">Pass-through fees</strong> (e-sign, SMS) are billed at cost + a small margin.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong className="text-foreground">The service provides draft outputs</strong> for human review; it does not provide legal advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto text-center shadow-elevated bg-gradient-primary">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Pilot?
              </h3>
              <p className="text-primary-foreground/80 mb-8">
                See measurable results in your first 30 days. No setup fees, no long-term contracts.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Link to="/demo">
                  Book Your Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch to {confirmDialog?.plan.charAt(0).toUpperCase()}{confirmDialog?.plan.slice(1)}?</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>This will change your plan to {confirmDialog?.plan} with:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{confirmDialog?.preview?.included} submissions/month included</li>
                <li>${confirmDialog?.preview?.overage_rate} per extra submission</li>
                <li>{confirmDialog?.preview?.seat_limit ? `${confirmDialog.preview.seat_limit} board seats` : 'Unlimited board seats'}</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                No legal advice. No SLA. You can cancel anytime.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmChange} disabled={isChanging || isCheckingOut}>
              {(isChanging || isCheckingOut) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirm Change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;