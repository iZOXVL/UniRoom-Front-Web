"use client";
import { Poppins } from "next/font/google";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Social } from "@/components/Auth/social";
import { FiMail, FiLock } from "react-icons/fi";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "El correo ya está registrado con otro proveedor" : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const data = await login(values, callbackUrl);

      if (data?.error) {
        setError(data.error);
        if (data.error === "Código de verificación inválido") {
          form.setValue("code", ""); // Resetea el código de verificación
        }
      } else if (data?.success) {
        setSuccess(data.success);
        form.reset();
      } else if (data?.twoFactor) {
        setShowTwoFactor(true);
      }
    } catch (error) {
      setError("Ha ocurrido un error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="flex flex-col items-center space-y-6" initial="hidden" animate="visible">
      <h1 className="text-small font-bold text-center">Ingresa tus credenciales</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <motion.div variants={item}>
                      <FormLabel>Código de verificación</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isSubmitting} placeholder="123456" />
                      </FormControl>
                    </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <motion.div variants={item}>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              {...field}
                              disabled={isSubmitting}
                              className="w-full h-10 rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                              placeholder="ejemplo@dominio.com"
                              type="email"
                            />
                            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          </div>
                        </FormControl>
                      </motion.div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <motion.div variants={item}>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              {...field}
                              disabled={isSubmitting}
                              placeholder="********"
                              type="password"
                              className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          </div>
                        </FormControl>
                      </motion.div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <motion.div className="my-4" variants={item}>
            <Social />
          </motion.div>
          <motion.div variants={item}>
            <Button disabled={isSubmitting} type="submit" className="-mt-6 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90">
              {showTwoFactor ? "Autorizar" : "Entrar"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};