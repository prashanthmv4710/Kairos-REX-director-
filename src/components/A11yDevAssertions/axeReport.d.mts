export interface AxeReportRule {
  id: string;
  help?: string;
  helpUrl?: string;
  fix?: string;
  elements?: string[];
}
export interface AxeReport {
  ruleCount?: number;
  generatedAt?: string;
  rules?: AxeReportRule[];
}
export declare function axeRulesToIssues(report: AxeReport | null | undefined): string[];
export declare function hasAxeIssues(report: AxeReport | null | undefined): boolean;
