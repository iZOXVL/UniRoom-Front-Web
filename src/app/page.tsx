"use client";
import React, { useEffect } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function Home() {
  useEffect(() => {
    document.title = "UniRoom";
  }, []);

  return (
      <div className="flex items-center justify-center bg-transparent dark:bg-transparent flex-col">
        <DotLottiePlayer
          src="/lotties/home.lottie"
          autoplay
          style={{ height: '520px', width: '520px' }}
        >
        </DotLottiePlayer>
        <h1 className="text-3xl -mt-20 font-bold text-black dark:text-slate-200">
        ¡Bienvenid@ al dashboard de UniRoom!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
        Donde la gestión de alquileres se vuelve fácil y eficiente
        </p>
      </div>
  );
}
