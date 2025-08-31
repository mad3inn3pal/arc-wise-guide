import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

interface ChecklistItem {
  constraintId: string;
  result: "pass" | "fail" | "needs-info";
  rationale: string;
  clause: {
    section: string;
  };
  quote: string;
  confidence: number;
}

interface ComplianceStatusProps {
  items: ChecklistItem[];
}

const ComplianceStatus = ({ items }: ComplianceStatusProps) => {
  const getStatusIcon = (result: string) => {
    switch (result) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "needs-info":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (result: string) => {
    switch (result) {
      case "pass":
        return <Badge variant="success">APPROVED</Badge>;
      case "fail":
        return <Badge variant="destructive">REJECTED</Badge>;
      case "needs-info":
        return <Badge variant="warning">NEEDS INFO</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getStatusColor = (result: string) => {
    switch (result) {
      case "pass":
        return "border-l-success bg-success-light";
      case "fail":
        return "border-l-destructive bg-destructive-light";
      case "needs-info":
        return "border-l-warning bg-warning-light";
      default:
        return "border-l-muted bg-muted";
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index} className={`border-l-4 ${getStatusColor(item.result)} shadow-card`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.result)}
                <CardTitle className="text-lg font-semibold">
                  {item.clause.section}
                </CardTitle>
              </div>
              {getStatusBadge(item.result)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-card/50 p-3 rounded-md border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Regulatory Citation:</p>
              <p className="text-foreground italic">"{item.quote}"</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Assessment:</p>
              <p className="text-foreground">{item.rationale}</p>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Constraint ID: {item.constraintId}</span>
              <span>Confidence: {Math.round(item.confidence * 100)}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplianceStatus;