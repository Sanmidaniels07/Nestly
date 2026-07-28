export type ReportTargetType = "POST" | "USER" | "PRODUCT" | "STORE";
export type ReportStatus = "PENDING" | "REVIEWED" | "DISMISSED" | "ACTION_TAKEN";

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  reporter?: { id: string; name: string; email: string };
}

export interface CreateReportPayload {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

export interface ReportListParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  targetType?: ReportTargetType;
}
