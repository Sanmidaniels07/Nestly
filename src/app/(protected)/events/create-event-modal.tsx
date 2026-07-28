"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { useCreateEvent } from "@/src/hooks/use-create-event";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ open, onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const { mutate: createEvent, isPending } = useCreateEvent();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const canSubmit = title.trim().length > 0 && startAt.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createEvent(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        startAt: new Date(startAt).toISOString(),
        endAt: endAt ? new Date(endAt).toISOString() : undefined,
      },
      {
        onSuccess: (response) => {
          setTitle("");
          setDescription("");
          setLocation("");
          setStartAt("");
          setEndAt("");
          onClose();
          router.push(`/events/${response.data.id}`);
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[100] max-h-[85vh] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-[#ECE9F6] px-6 py-5">
              <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
                Create an event
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-violet-50 hover:text-violet-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Startup Meetup"
                maxLength={100}
              />

              <div>
                <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="What's this event about?"
                  className="w-full resize-none rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-violet-400 focus:bg-white"
                />
              </div>

              <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
                    Starts
                  </label>
                  <input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
                    Ends (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="w-full rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#ECE9F6] px-6 py-4">
              <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-xl px-5">
                Cancel
              </Button>
              <Button
                type="button"
                variant="tribely"
                loading={isPending}
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="h-10 rounded-xl px-6"
              >
                Create
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
