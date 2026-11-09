import Image from "next/image";

import { RETURN_REASON_LABEL, ReturnRequest } from "@/src/types/return-request";

/** What's wrong (Nestly's policy reason), the buyer's words and their photos. */
export default function ReturnEvidence({ request }: { request: Pick<ReturnRequest, "reasonType" | "reason" | "photos"> }) {
  return (
    <div className="mt-2 space-y-2">
      <p className="text-[13px] text-ink-2">
        {request.reasonType && (
          <span className="mr-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11.5px] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
            {RETURN_REASON_LABEL[request.reasonType]}
          </span>
        )}
        {request.reason}
      </p>
      {!!request.photos?.length && (
        <div className="flex flex-wrap gap-2">
          {request.photos.map((url, index) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-line"
              aria-label={`Photo ${index + 1} (opens full size)`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
