import { Plus, Upload, Calendar, AlertTriangle, Shield, FileText, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import UsageMeter from "@/components/UsageMeter";

interface SidePanelsProps {
  usage?: {
    plan: string;
    included: number;
    used: number;
    overage: number;
    overageRate: number;
  };
  slaRisk?: {
    overdue: number;
    dueToday: number;
    dueSoon: number;
  };
  meetings?: Array<{
    id: string;
    title: string;
    time: string;
    quorum: boolean;
    itemsCount: number;
  }>;
  recentActivity?: Array<{
    id: string;
    time: string;
    actor: string;
    action: string;
    entity: string;
    entityId: string;
  }>;
  documentsNeedingOCR?: number;
  hasOCRFeature?: boolean;
}

const QuickActionsPanel = () => (
  <Card className="border">
    <CardHeader>
      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button className="w-full justify-start" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Submission
      </Button>
      <Button variant="outline" className="w-full justify-start" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      <Button variant="outline" className="w-full justify-start" size="sm">
        <FileText className="h-4 w-4 mr-2" />
        Bulk Import (CSV)
      </Button>
    </CardContent>
  </Card>
);

const TodaysMeetingsPanel = ({ meetings = [] }: Pick<SidePanelsProps, "meetings">) => (
  <Card className="border">
    <CardHeader>
      <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
    </CardHeader>
    <CardContent>
      {meetings.length === 0 ? (
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No meetings scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{meeting.title}</div>
                <div className="text-xs text-muted-foreground">{meeting.time}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={meeting.quorum ? "default" : "destructive"} className="text-xs">
                    {meeting.quorum ? "Quorum" : "No Quorum"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {meeting.itemsCount} items
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Start
              </Button>
            </div>
          ))}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs">
                <div className="font-medium text-warning-foreground">California Notice</div>
                <div className="text-muted-foreground mt-1">
                  Async voting blocked for CA communities. Use Meeting Mode.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const SLARiskPanel = ({ slaRisk }: Pick<SidePanelsProps, "slaRisk">) => {
  if (!slaRisk) return null;

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">SLA Risk</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div 
          className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg cursor-pointer hover:bg-destructive/20 transition-colors"
        >
          <div>
            <div className="font-medium text-sm text-destructive">Overdue</div>
            <div className="text-xs text-muted-foreground">Past SLA deadline</div>
          </div>
          <Badge className="bg-destructive text-destructive-foreground">
            {slaRisk.overdue}
          </Badge>
        </div>
        
        <div 
          className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg cursor-pointer hover:bg-warning/20 transition-colors"
        >
          <div>
            <div className="font-medium text-sm text-warning-foreground">Due Today</div>
            <div className="text-xs text-muted-foreground">Deadline today</div>
          </div>
          <Badge className="bg-warning text-warning-foreground">
            {slaRisk.dueToday}
          </Badge>
        </div>
        
        <div 
          className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg cursor-pointer hover:bg-info/20 transition-colors"
        >
          <div>
            <div className="font-medium text-sm text-info">Due Soon</div>
            <div className="text-xs text-muted-foreground">Within 72 hours</div>
          </div>
          <Badge className="bg-info text-info-foreground">
            {slaRisk.dueSoon}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivityPanel = ({ recentActivity = [] }: Pick<SidePanelsProps, "recentActivity">) => (
  <Card className="border">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      {recentActivity.length === 0 ? (
        <div className="text-center py-4">
          <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="text-xs space-y-1">
              <div className="text-muted-foreground">{activity.time}</div>
              <div>
                <span className="font-medium">{activity.actor}</span>{" "}
                <span>{activity.action}</span>{" "}
                <span className="font-medium">{activity.entity}#{activity.entityId.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const PlanUsagePanel = ({ usage }: Pick<SidePanelsProps, "usage">) => (
  <Card className="border">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Plan & Usage</CardTitle>
        <Link to="/pricing">
          <Button variant="ghost" size="sm" className="text-xs">
            Upgrade
          </Button>
        </Link>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {usage && <UsageMeter {...usage} />}
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Features Enabled</div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            <Crown className="h-3 w-3 mr-1" />
            OCR
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            AI Analysis
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Meetings
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DocumentsOCRPanel = ({ documentsNeedingOCR = 0, hasOCRFeature = true }: Pick<SidePanelsProps, "documentsNeedingOCR" | "hasOCRFeature">) => (
  <Card className="border">
    <CardHeader>
      <CardTitle className="text-sm font-medium">Documents Needing OCR</CardTitle>
    </CardHeader>
    <CardContent>
      {!hasOCRFeature ? (
        <div className="text-center py-4">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            OCR not available on current plan
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/pricing">Upgrade Plan</Link>
          </Button>
        </div>
      ) : documentsNeedingOCR === 0 ? (
        <div className="text-center py-4">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">All documents processed</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Queued for processing</span>
            <Badge variant="outline">{documentsNeedingOCR}</Badge>
          </div>
          <Progress value={75} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Processing time: ~2 minutes per document
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

const SidePanels = (props: SidePanelsProps) => {
  return (
    <div className="space-y-4">
      <QuickActionsPanel />
      <TodaysMeetingsPanel meetings={props.meetings} />
      <SLARiskPanel slaRisk={props.slaRisk} />
      <RecentActivityPanel recentActivity={props.recentActivity} />
      <PlanUsagePanel usage={props.usage} />
      <DocumentsOCRPanel 
        documentsNeedingOCR={props.documentsNeedingOCR} 
        hasOCRFeature={props.hasOCRFeature} 
      />
    </div>
  );
};

export default SidePanels;