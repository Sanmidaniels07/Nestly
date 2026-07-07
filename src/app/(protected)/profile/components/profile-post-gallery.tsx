"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProfilePostGalleryProps {
  images: string[];
}

export default function ProfilePostGallery({ images }: ProfilePostGalleryProps) {
  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <motion.div whileHover={{ scale: 1.005 }} className="overflow-hidden rounded-xl">
        <Image
          src={images[0]}
          alt=""
          width={900}
          height={700}
          className="h-[360px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </motion.div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
        {images.map((image) => (
          <motion.div key={image} whileHover={{ scale: 1.02 }} className="overflow-hidden">
            <Image
              src={image}
              alt=""
              width={600}
              height={600}
              className="h-[260px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid gap-1.5 overflow-hidden rounded-xl">
        <motion.div whileHover={{ scale: 1.005 }} className="overflow-hidden">
          <Image
            src={images[0]}
            alt=""
            width={900}
            height={450}
            className="h-[210px] w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-1.5">
          {images.slice(1).map((image) => (
            <motion.div key={image} whileHover={{ scale: 1.02 }} className="overflow-hidden">
              <Image
                src={image}
                alt=""
                width={600}
                height={600}
                className="h-[150px] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
      {images.slice(0, 4).map((image, index) => (
        <motion.div key={image} whileHover={{ scale: 1.02 }} className="relative overflow-hidden">
          <Image
            src={image}
            alt=""
            width={600}
            height={600}
            className="h-[190px] w-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {index === 3 && images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <span className="font-[family-name:var(--font-mono)] text-[22px] font-semibold text-white">
                +{images.length - 4}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}