import { useState } from "react";
import { Check, MapPin, FileText, Send, Users, Building, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ElementType;
  action?: string;
  actionVariant?: "default" | "outline";
}

const OnboardingChecklist = () => {
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

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const handleItemAction = (itemId: string) => {
    // Handle different actions based on item
    switch (itemId) {
      case "community":
        // Navigate to community creation
        break;
      case "documents":
        // Open document upload modal
        break;
      case "submission":
        // Navigate to submission form
        break;
      default:
        console.log(`Action for ${itemId}`);
    }
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
    </div>
  );
};

export default OnboardingChecklist;