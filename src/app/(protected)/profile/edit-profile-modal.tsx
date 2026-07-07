"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EditProfileForm from "./components/edit-profile-form";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ opened, onClose }: EditProfileModalProps) {
  useEffect(() => {
    if (!opened) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [opened, onClose]);

  return (
    <AnimatePresence>
      {opened && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-opacity-25 backdrop-brightness-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-[100] overflow-hidden bg-white
              sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:w-[95%] sm:max-w-2xl
              sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl
              sm:shadow-[0_30px_90px_rgba(0,0,0,0.18)]
            "
          >
            <div className="flex items-center justify-between border-b border-[#ECE9F6] px-6 py-5 sm:px-8">
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
                  Edit profile
                </h2>
                <p className="mt-0.5 text-[13.5px] text-[#64748B]">
                  Update your public profile.
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2.5 text-[#64748B] transition-colors hover:bg-violet-50 hover:text-violet-600"
              >
                <X size={20} />
              </button>
            </div>

            <EditProfileForm onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}