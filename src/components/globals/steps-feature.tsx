"use client";

import React, { useState } from "react";
import { Search, CreditCard, Bike, PackageCheck } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Find Products & Services",
    description:
      "Search and filter thousands of products and services to find exactly what your needs.",
    icon: Search,
    image: "/steps/1.png",
  },
  {
    id: 2,
    title: "Secure Checkout",
    description:
      "Complete your purchase safely with Xendit payment processing. We support all major payment methods with buyer protection.",
    icon: CreditCard,
    image: "/steps/2.png",
  },
  {
    id: 3,
    title: "Local Delivery Network",
    description:
      "We utilize our community of local motorcycle and bicycle couriers for fast, eco-friendly delivery.",
    icon: Bike,
    image: "/steps/3.png",
  },
  {
    id: 4,
    title: "Real-time Tracking",
    description:
      "Follow your order every step of the way with live updates. Get notifications from purchase to delivery at your doorstep.",
    icon: PackageCheck,
    image: "/steps/4.png",
  },
];

const StepsFeature = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="lg:py-20 py-10">
      <div className="lg:px-20 px-10">
        <h3 className="text-3xl md:text-4xl tracking-tight font-bold">
          From browsing to your doorstep - effortless online shopping
        </h3>
        <p className="mt-4 text-lg text-gray-600">
          Our seamless process makes buying what you love simple and secure
        </p>

        <div className="mt-12 md:mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left column */}
          <div className="w-full lg:w-[50%] flex flex-col">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex relative flex-col gap-7 mt-8 first:mt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.div
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeStep === step.id ? "bg-[#800020]/10" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveStep(step.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`size-14 md:size-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === step.id ? "bg-[#800020]/30" : "bg-gray-200"}`}
                  >
                    <step.icon
                      className={`size-6 md:size-10 transition-all duration-300 ${activeStep === step.id ? "text-[#800020]" : "text-gray-600"}`}
                    />
                  </div>
                  <div className="w-[80%]">
                    <h3
                      className={`text-xl md:text-2xl lg:text-3xl font-semibold transition-all duration-300 ${activeStep === step.id ? "text-[#800020]" : "text-gray-900"}`}
                    >
                      {step.title}
                    </h3>
                    <p className="font-medium mt-2 text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[50%] h-[50vh] md:h-[57vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                className="relative w-full h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={
                    steps.find((step) => step.id === activeStep)?.image || ""
                  }
                  alt={`Step ${activeStep}`}
                  fill
                  className="size-full object-cover rounded-xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsFeature;
