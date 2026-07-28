"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";

import { useReports } from "@/src/hooks/use-reports";
import { useUpdateReportStatus } from "@/src/hooks/use-update-report-status";
import { Report, ReportStatus } from "@/src/types/report";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";

const statusTone: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  REVIEWED: "bg-blue-50 text-blue-700",
  DISMISSED: "bg-[#F1F0F5] text-[#64748B]",
  ACTION_TAKEN: "bg-emerald-50 text-emerald-700",
};

const statusFilters: { label: string; value?: ReportStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Dismissed", value: "DISMISSED" },
  { label: "Action taken", value: "ACTION_TAKEN" },
  { label: "All", value: undefined },
];

export default function ReportsQueue() {
  const [status, setStatus] = useState<ReportStatus | undefined>("PENDING");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useReports({ status, page, limit: 15 });
  const reports = data?.reports ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              status === filter.value
                ? "bg-violet-600 text-white"
                : "border border-[#E5E7EB] text-[#64748B] hover:border-violet-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-[13px] text-[#94A3B8]">Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">Nothing to review here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  const { mutate: updateStatus, isPending } = useUpdateReportStatus();

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#F1F0F5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              {report.targetType}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
              {report.targetId}
            </span>
          </div>
          <p className="mt-2.5 text-[13.5px] text-[#334155]">{report.reason}</p>
          <p className="mt-1.5 text-[12px] text-[#94A3B8]">
            Reported by {report.reporter?.name ?? "unknown"} ·{" "}
            {formatRelativeTime(report.createdAt)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${
            statusTone[report.status] ?? "bg-[#F1F0F5] text-[#64748B]"
          }`}
        >
          {report.status.replace("_", " ").toLowerCase()}
        </span>
      </div>

      {report.status === "PENDING" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F2F1F8] pt-4">
          <button
            onClick={() => updateStatus({ id: report.id, status: "ACTION_TAKEN" })}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Take action
          </button>
          <button
            onClick={() => updateStatus({ id: report.id, status: "REVIEWED" })}
            disabled={isPending}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-semibold text-[#334155] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Mark reviewed
          </button>
          <button
            onClick={() => updateStatus({ id: report.id, status: "DISMISSED" })}
            disabled={isPending}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-semibold text-[#64748B] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
