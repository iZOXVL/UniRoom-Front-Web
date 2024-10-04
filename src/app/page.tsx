"use client";
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/Auth/login-button";
import Lottie from "lottie-react";
import {motion} from "framer-motion";

const font = Poppins({
 subsets: ["latin"],
 weight: ["600"]
});
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
    <div className="space-y-6">

      <h1 className={cn(
        "text-2xl font-semibold text-white drop-shadow-md text-center",
        font.className, 
      )}>
        Servicio de autenticacion
      </h1>
      <div className="text-center">
        <LoginButton mode="modal" asChild>
        <Button variant="secondary" size="xl">
          Acceder
        </Button>
        </LoginButton>
      </div>
    </div>

    </main>
  )
}