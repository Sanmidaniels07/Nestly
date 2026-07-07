"use client";

import {
  Smartphone,
  Shirt,
  Sofa,
  Laptop,
  Car,
  Apple,
  Baby,
  Gem,
} from "lucide-react";

import SectionHeader from "../components/section-header";
import CategoryCard from "../components/category-card";

const categories = [
  {
    title: "Electronics",
    total: 2480,
    icon: Smartphone,
  },
  {
    title: "Fashion",
    total: 1820,
    icon: Shirt,
  },
  {
    title: "Furniture",
    total: 540,
    icon: Sofa,
  },
  {
    title: "Computers",
    total: 690,
    icon: Laptop,
  },
  {
    title: "Vehicles",
    total: 360,
    icon: Car,
  },
  {
    title: "Groceries",
    total: 780,
    icon: Apple,
  },
  {
    title: "Baby Items",
    total: 245,
    icon: Baby,
  },
  {
    title: "Luxury",
    total: 132,
    icon: Gem,
  },
];

export default function CategoriesSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Browse Categories"
        subtitle="Marketplace"
       action={{
          label: "View all",
          href: "/marketplace/products",
        }}
      />

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            {...category}
          />
        ))}
      </div>
    </section>
  );
}