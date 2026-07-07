"use client";

import { Edit3, Settings, Share2 } from "lucide-react";
import Button from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";

export default function ProfileActions() {
  const [opened, setOpened] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="mt-8 flex flex-col gap-3 sm:flex-row"
    >
      <Button
        onClick={() => setOpened(true)}
        variant="tribely"
        className="h-11 rounded-xl px-6"
      >
        <Edit3 size={16} className="mr-2" />
        Edit profile
      </Button>

      <Button variant="outline" className="h-11 rounded-xl px-6">
        <Share2 size={16} className="mr-2" />
        Share profile
      </Button>

      <button
        className="
          flex h-11 w-11 items-center justify-center rounded-xl
          border border-[#E6E4F0] bg-white
          transition-colors hover:bg-[#F7F5FD]
        "
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>

      <EditProfileModal opened={opened} onClose={() => setOpened(false)} />
    </motion.div>
  );
}
