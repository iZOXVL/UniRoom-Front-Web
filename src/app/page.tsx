"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { LoginForm } from "@/components/Auth/login-form"; 
import { RegisterForm } from "@/components/Auth/register-form"; 
import { ResetForm } from "@/components/Auth/reset-form"; 
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [formType, setFormType] = useState<'login' | 'register' | 'reset'>('login');

  return (
    <main className="flex flex-col md:flex-row h-screen">
      {/* Columna izquierda */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
      <img
  src="logos/logo_negro.png"
  alt="UniRoom Logo"
  className="w-full max-w-[250px] h-auto md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px]"
/>

        <div className="text-center">
        <h1 className={cn("text-sm sm:text-base md:text-lg lg:text-small font-semibold text-black drop-shadow-md text-center mt-2 mb-4")}>
            Gestiona tus propiedades fácilmente y conecta con estudiantes en un solo lugar
          </h1>
          <div className="flex justify-center items-center w-full">
            <DotLottiePlayer
              src="/lotties/login.lottie"
              loop
              autoplay
              style={{ height: '100%', maxWidth: '400px' }}
              className="hidden md:block mt-5 w-full h-auto max-w-xs md:max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-0.5 h-[60%] bg-[#2b5973] mx-5"></div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-8 p-8">
    
        <h1 className={cn("hidden md:block text-2xl font-semibold text-black drop-shadow-md text-center")}>
          {formType === 'login' ? "Inicio de sesión Jose Angel 🚪✨" : formType === 'register' ? "Únete a la comunidad de UniRoom 🤝🌟" : "Recupera tu contraseña y vuelve a empezar 🔑🔄"}
        </h1>
        
        {formType === 'login' && <LoginForm />}
        {formType === 'register' && <RegisterForm />}
        {formType === 'reset' && <ResetForm />}

        <motion.div>
          {formType === 'login' && (
            <>
              <Button variant="link" onClick={() => setFormType('register')} className="text-sm text-gray-500 hover:underline">
                ¿No tienes cuenta? Regístrate aquí.
              </Button>
              <Button variant="link" onClick={() => setFormType('reset')} className="text-sm text-gray-500 hover:underline">
                ¿Olvidaste tu contraseña? Restablecer aquí.
              </Button>
            </>
          )}
          {formType === 'register' && (
            <Button variant="link" onClick={() => setFormType('login')} className="text-sm text-gray-500 hover:underline">
              ¿Ya tienes cuenta? Inicia sesión aquí.
            </Button>
          )}
          {formType === 'reset' && (
            <Button variant="link" onClick={() => setFormType('login')} className="text-sm text-gray-500 hover:underline">
              Regresar al inicio de sesión.
            </Button>
          )}
        </motion.div>
      </div>
    </main>
  );
}
