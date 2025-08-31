import { useState } from "react";
import { Plus, Filter, Calendar, MoreHorizontal, ExternalLink, Mail, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import OnboardingChecklist from "./OnboardingChecklist";

interface Submission {
  id: string;
  submittedAt: string;
  community: {
    id: string;
    name: string;
    state: string;
  };
  property: {
    lot: string;
    address: string;
  };
  projectType: string;
  lastChecklist?: {
    result: "pass" | "fail" | "needs-info";
    rationale: string;
    clauseSection: string;
  };
  sla: {
    dueAt: string;
    status: "due-soon" | "overdue" | "ok";
    deltaHours: number;
  };
  flags: {
    accommodation: boolean;
    jurisdiction: "ok" | "ca_block";
  };
  ownerEmail: string;
}

interface SubmissionsQueueProps {
  submissions?: Submission[];
  isLoading?: boolean;
  hasData?: boolean;
}

const StatusBadge = ({ result }: { result: "pass" | "fail" | "needs-info" }) => {
  const variants = {
    pass: "bg-success/20 text-success border-success/20",
    fail: "bg-destructive/20 text-destructive border-destructive/20",
    "needs-info": "bg-warning/20 text-warning-foreground border-warning/20",
  };

  const labels = {
    pass: "Pass",
    fail: "Fail", 
    "needs-info": "Needs Info",
  };

  return (
    <Badge className={variants[result]}>
      {labels[result]}
    </Badge>
  );
};

const SLABadge = ({ sla }: { sla: Submission["sla"] }) => {
  const variants = {
    ok: "bg-muted text-muted-foreground border-muted",
    "due-soon": "bg-warning/20 text-warning-foreground border-warning/20",
    overdue: "bg-destructive/20 text-destructive border-destructive/20",
  };

  const getLabel = () => {
    if (sla.status === "overdue") {
      const days = Math.ceil(Math.abs(sla.deltaHours) / 24);
      return `Overdue by ${days}d`;
    }
    if (sla.status === "due-soon") {
      const hours = Math.abs(sla.deltaHours);
      if (hours < 24) return `Due in ${hours}h`;
      const days = Math.ceil(hours / 24);
      return `Due in ${days}d`;
    }
    return "On Track";
  };

  return (
    <Badge className={variants[sla.status]}>
      {getLabel()}
    </Badge>
  );
};

const SubmissionsQueue = ({ submissions = [], isLoading, hasData = true }: SubmissionsQueueProps) => {
  const [filters, setFilters] = useState({
    community: "",
    projectType: "",
    status: "",
    risk: "",
  });

  // Show onboarding if no data
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Get Started with ARC Copilot</h2>
        </div>
        <OnboardingChecklist />
      </div>
    );
  }

  return (
    <Card className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Submissions</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              30 days
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No submissions yet</h3>
            <p className="text-muted-foreground mb-6">Create your first submission to get started with architectural reviews.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Submission
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Checklist</TableHead>
                <TableHead>SLA Due</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">
                    {submission.id.slice(-8)}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.community.name}</div>
                      <div className="text-xs text-muted-foreground">{submission.community.state}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">Lot {submission.property.lot}</div>
                      <div className="text-xs text-muted-foreground">{submission.property.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.projectType}</Badge>
                  </TableCell>
                  <TableCell>
                    {submission.lastChecklist ? (
                      <div className="space-y-1">
                        <StatusBadge result={submission.lastChecklist.result} />
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {submission.lastChecklist.rationale}
                        </div>
                        {submission.lastChecklist.clauseSection && (
                          <div className="text-xs text-muted-foreground">
                            {submission.lastChecklist.clauseSection}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <SLABadge sla={submission.sla} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{submission.ownerEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.flags.accommodation && (
                        <Badge variant="outline" className="bg-info/20 text-info border-info/20">
                          ADA
                        </Badge>
                      )}
                      {submission.flags.jurisdiction === "ca_block" && (
                        <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          CA
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Review
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Build Packet
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Draft Letter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Request Info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsQueue;