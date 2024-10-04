// app/layout.tsx
"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { motion } from "framer-motion";
import ChakraProviderWrapper from "@/ChakraProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 4000);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-[#D4D4D4]">
        <ChakraProviderWrapper>
          <DefaultLayout>
            {loading ? (
              <Loader />
            ) : (
              <motion.div
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
              >
                {children}
              </motion.div>
            )}
          </DefaultLayout>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
