import { useState, useEffect } from "react";
import { Check, MapPin, FileText, Send, Users, Building, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ElementType;
  action?: string;
  actionVariant?: "default" | "outline" | "secondary";
}

const OnboardingChecklist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "community",
      title: "Create Community",
      description: "Set up your first community with state, timezone, and SLA requirements",
      completed: false,
      icon: MapPin,
      action: "Create Community",
      actionVariant: "default",
    },
    {
      id: "documents",
      title: "Upload Governing Documents",
      description: "Add your CC&Rs, architectural guidelines, and other governing documents",
      completed: false,
      icon: FileText,
      action: "Upload Documents",
      actionVariant: "outline",
    },
    {
      id: "submission",
      title: "Run First Submission",
      description: "Test the system with your first architectural review submission",
      completed: false,
      icon: Send,
      action: "New Submission",
      actionVariant: "outline",
    },
    {
      id: "review",
      title: "Review Checklist & Build Packet",
      description: "Review AI analysis and build your first compliance packet",
      completed: false,
      icon: Building,
      action: "View Dashboard",
      actionVariant: "outline",
    },
    {
      id: "letter",
      title: "Send Draft Letter",
      description: "Generate and review your first approval/denial letter",
      completed: false,
      icon: Upload,
      action: "Draft Letter",
      actionVariant: "outline",
    },
    {
      id: "invite",
      title: "Invite Board Members",
      description: "Send invitations to other board members to collaborate",
      completed: false,
      icon: Users,
      action: "Send Invites",
      actionVariant: "outline",
    },
  ]);

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  
  // Form states
  const [uploading, setUploading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  
  // Community form state
  const [communityForm, setCommunityForm] = useState({
    name: "",
    state: "",
    timezone: "",
    sla_days: 14
  });

  // User and org state
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState("free");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercent = (completedCount / totalCount) * 100;

  // Load user data and check completion status
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const orgId = session.user.user_metadata?.org_id;
          setOrgId(orgId);
          setUserPlan(session.user.user_metadata?.selected_plan || "free");

          if (orgId) {
            // Check communities
            const { data: communitiesData } = await supabase
              .from('community')
              .select('*')
              .eq('org_id', orgId);
            setCommunities(communitiesData || []);

            // Check submissions  
            const { data: submissionsData } = await supabase
              .from('submission')
              .select('*')
              .eq('org_id', orgId)
              .limit(1);
            setSubmissions(submissionsData || []);

            // Check documents
            const { data: documentsData } = await supabase
              .from('governing_document')
              .select('*')
              .eq('org_id', orgId)
              .limit(1);
            setDocuments(documentsData || []);

            // Update completion status
            setItems(prev => prev.map(item => ({
              ...item,
              completed: getCompletionStatus(item.id, communitiesData, submissionsData, documentsData)
            })));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const getCompletionStatus = (itemId: string, communities: any[], submissions: any[], documents: any[]) => {
    switch (itemId) {
      case "community":
        return communities && communities.length > 0;
      case "documents":
        return documents && documents.length > 0;
      case "submission":
        return submissions && submissions.length > 0;
      case "review":
        return false; // Requires manual completion
      case "letter":
        return false; // Requires manual completion
      case "invite":
        return false; // Requires manual completion
      default:
        return false;
    }
  };

  const handleItemAction = async (itemId: string) => {
    try {
      switch (itemId) {
        case "community":
          setCommunityModalOpen(true);
          break;
        case "documents":
          setUploadModalOpen(true);
          break;
        case "submission":
          if (communities.length === 0) {
            toast({
              title: "Create community first",
              description: "You need to create a community before submitting projects.",
              variant: "destructive",
            });
            return;
          }
          // Navigate to submission form for first community
          window.location.href = `/submit/${communities[0].id}`;
          break;
        case "review":
          if (submissions.length === 0) {
            toast({
              title: "Submit a project first",
              description: "You need to create a submission before reviewing checklists.",
              variant: "destructive",
            });
            return;
          }
          // Navigate to submission review
          window.location.href = `/app/submissions/${submissions[0].id}`;
          break;
        case "letter":
          if (submissions.length === 0) {
            toast({
              title: "Submit a project first", 
              description: "You need to create a submission before drafting letters.",
              variant: "destructive",
            });
            return;
          }
          // Navigate to letter drafting
          window.location.href = `/app/submissions/${submissions[0].id}?tab=letter`;
          break;
        case "invite":
          if (userPlan === "free") {
            setUpgradeModalOpen(true);
          } else {
            setInviteModalOpen(true);
          }
          break;
        default:
          console.log(`Action for ${itemId}`);
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCommunity = async () => {
    if (!communityForm.name || !communityForm.state || !communityForm.timezone) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setCreatingCommunity(true);
    try {
      const { data, error } = await supabase
        .from('community')
        .insert({
          name: communityForm.name,
          state: communityForm.state,
          timezone: communityForm.timezone,
          sla_days: communityForm.sla_days,
          org_id: orgId
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Community created!",
        description: `${communityForm.name} has been set up successfully.`,
      });

      setCommunities(prev => [...prev, data]);
      setCommunityModalOpen(false);
      setCommunityForm({ name: "", state: "", timezone: "", sla_days: 14 });
      
      // Update completion status
      setItems(prev => prev.map(item => 
        item.id === "community" ? { ...item, completed: true } : item
      ));
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast({
        title: "Error creating community",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingCommunity(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.type.includes("word")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate file hash (simplified for demo)
      const fileHash = await generateFileHash(file);
      
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data, error } = await supabase
        .from('governing_document')
        .insert({
          org_id: orgId,
          community_id: communities[0]?.id || null,
          file_url: publicUrl,
          file_hash: fileHash,
          is_scanned: false, // Simplified detection
          ocr_status: 'skipped'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Document uploaded!",
        description: `${file.name} has been processed successfully.`,
      });

      setDocuments(prev => [...prev, data]);
      setUploadModalOpen(false);
      
      // Update completion status
      setItems(prev => prev.map(item => 
        item.id === "documents" ? { ...item, completed: true } : item
      ));
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) {
      toast({
        title: "Enter email addresses",
        description: "Please enter at least one email address.",
        variant: "destructive",
      });
      return;
    }

    const emails = inviteEmails.split(',').map(email => email.trim()).filter(Boolean);
    
    // Check seat limits based on plan
    const seatLimits = { starter: 2, growth: 5, pro: Infinity };
    const currentLimit = seatLimits[userPlan as keyof typeof seatLimits] || 1;
    
    if (emails.length > currentLimit - 1) { // -1 for current user
      toast({
        title: "Seat limit exceeded",
        description: `Your ${userPlan} plan allows ${currentLimit} total seats.`,
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    try {
      // For now, just create pending org members (real invites would be sent via server)
      const invitePromises = emails.map(email => 
        supabase.from('org_member').insert({
          org_id: orgId,
          user_id: `pending-${email}`, // Placeholder for pending invites
          role: 'viewer'
        })
      );

      await Promise.all(invitePromises);

      toast({
        title: "Invites sent!",
        description: `Sent ${emails.length} invitation(s) successfully.`,
      });

      setInviteModalOpen(false);
      setInviteEmails("");
      
      // Update completion status
      setItems(prev => prev.map(item => 
        item.id === "invite" ? { ...item, completed: true } : item
      ));
    } catch (error: any) {
      console.error('Error sending invites:', error);
      toast({
        title: "Error sending invites",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const toggleItem = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Setup Checklist</CardTitle>
            <Badge variant="outline">
              {completedCount} of {totalCount} completed
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;
            
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start space-x-4 p-4 rounded-lg border transition-all",
                  item.completed 
                    ? "bg-success/5 border-success/20" 
                    : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all",
                    item.completed
                      ? "bg-success border-success text-success-foreground"
                      : "border-border bg-background hover:border-primary"
                  )}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-medium",
                    item.completed ? "text-success line-through" : "text-card-foreground"
                  )}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
                
                {item.action && !item.completed && (
                  <Button
                    variant={item.actionVariant}
                    size="sm"
                    onClick={() => handleItemAction(item.id)}
                    className="shrink-0"
                  >
                    {item.action}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <h4 className="font-medium text-card-foreground mb-1">Need Help Getting Started?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our team can help you set up your first community and import your governing documents.
              </p>
              <Button variant="outline" size="sm">
                Schedule Setup Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Community Modal */}
      <Dialog open={communityModalOpen} onOpenChange={setCommunityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Set up your first community with location and SLA requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="community-name">Community Name</Label>
              <Input
                id="community-name"
                value={communityForm.name}
                onChange={(e) => setCommunityForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Sunrise HOA"
              />
            </div>
            <div>
              <Label htmlFor="community-state">State</Label>
              <Input
                id="community-state"
                value={communityForm.state}
                onChange={(e) => setCommunityForm(prev => ({ ...prev, state: e.target.value }))}
                placeholder="TX"
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="community-timezone">Timezone</Label>
              <Input
                id="community-timezone"
                value={communityForm.timezone}
                onChange={(e) => setCommunityForm(prev => ({ ...prev, timezone: e.target.value }))}
                placeholder="America/Chicago"
              />
            </div>
            <div>
              <Label htmlFor="community-sla">SLA Days</Label>
              <Input
                id="community-sla"
                type="number"
                value={communityForm.sla_days}
                onChange={(e) => setCommunityForm(prev => ({ ...prev, sla_days: parseInt(e.target.value) || 14 }))}
                min="1"
                max="90"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommunityModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity} disabled={creatingCommunity}>
              {creatingCommunity ? "Creating..." : "Create Community"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Documents Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Governing Documents</DialogTitle>
            <DialogDescription>
              Upload your CC&Rs, architectural guidelines, and other governing documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-upload">Select Document</Label>
              <Input
                id="document-upload"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF and Word documents
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Members Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Board Members</DialogTitle>
            <DialogDescription>
              Send invitations to other board members to collaborate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-emails">Email Addresses</Label>
              <Textarea
                id="invite-emails"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="member1@example.com, member2@example.com"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate multiple emails with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={inviting}>
              {inviting ? "Sending..." : "Send Invites"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Invites on Starter</DialogTitle>
            <DialogDescription>
              Free includes 1 board seat. To invite additional board members, upgrade to Starter.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>
              Maybe Later
            </Button>
            <Button onClick={() => window.location.href = '/pricing?from=invites'}>
              See Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingChecklist;