"use client";

import { useRouter } from "next/navigation";
import { Edit3, Settings, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { useProfile } from "@/src/hooks/use-profile";

interface Props {
  onEdit: () => void;
}

export default function ProfileActions({ onEdit }: Props) {
  const router = useRouter();
  const { data: profile } = useProfile();

  const handleShare = async () => {
    if (!profile) return;

    const url = `${window.location.origin}/users/${profile.username ?? profile.id}`;

    
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch {
      toast.error("Couldn't copy the profile link");
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: `${profile.name} on Nestly`, url });
      } catch (error) {
    
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24 }}
      className="mt-8 flex flex-col gap-3 sm:flex-row"
    >
      <Button
        onClick={onEdit}
        variant="tribely"
        className="h-11 rounded-xl px-6"
      >
        <Edit3 size={16} className="mr-2" />
        Edit profile
      </Button>

      <Button onClick={handleShare} variant="outline" className="h-11 rounded-xl px-6">
        <Share2 size={16} className="mr-2" />
        Share profile
      </Button>

      <button
        onClick={() => router.push("/settings")}
        className="
          flex h-11 w-11 items-center justify-center rounded-xl
          border border-[#E6E4F0] bg-white
          transition-colors hover:bg-[#F7F5FD]
        "
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </motion.div>
  );
}