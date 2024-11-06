"use client";
import React, { useEffect } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Charts from '@/components/Charts/charts';

export default function Home() {
  useEffect(() => {
    document.title = "UniRoom";
  }, []);

  return (
      <Charts />
  );
}
