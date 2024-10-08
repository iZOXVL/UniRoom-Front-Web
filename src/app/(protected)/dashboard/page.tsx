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
        style={{ 
          width: '80vw', // Toma el 80% del ancho de la ventana 
          maxWidth: '500px', // Máximo de 500px para pantallas más grandes
          height: 'auto',    // Ajusta la altura automáticamente
          maxHeight: '400px' // Máximo de 400px de altura
        }}
      >
      </DotLottiePlayer>
      <h1 className="text-3xl font-bold text-black dark:text-slate-200 text-center">
        ¡Bienvenid@ al dashboard de UniRoom!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 text-center">
        Donde la gestión de alquileres se vuelve fácil y eficiente
      </p>
    </div>
  );
}
