declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export interface PlanConfig {
  plan: string;
  submissions_included: number;
  overage_rate: number;
}

export interface ChecklistItem {
  constraint_id: string | null;
  result: 'pass' | 'fail' | 'needs-info';
  rationale: string;
  clause_section: string | null;
  quote: string | null;
  confidence: number;
}

export interface UsageInfo {
  used: number;
  included: number;
  month: string;
}