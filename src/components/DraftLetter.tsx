import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertTriangle } from "lucide-react";

interface LetterData {
  submissionId: number;
  type: string;
  note: string;
  file: string;
}

interface DraftLetterProps {
  letter: LetterData;
}

const DraftLetter = ({ letter }: DraftLetterProps) => {
  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Decision Letter Draft</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-warning bg-warning-light">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-warning-foreground">Human Review Required</AlertTitle>
          <AlertDescription className="text-warning-foreground">
            {letter.note}
          </AlertDescription>
        </Alert>
        
        <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-muted">
          <h4 className="font-semibold mb-2 text-foreground">Draft Decision:</h4>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {letter.file}
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Submission ID: {letter.submissionId}</p>
          <p>Decision Type: {letter.type.toUpperCase()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftLetter;