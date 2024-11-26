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
import { Input as NextUIInput } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo ya está registrado con otro proveedor"
      : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    // Lógica de envío del formulario...
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-small font-bold text-center md:text-white">
        Accede a tu cuenta
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <motion.div variants={item}>
                      <FormLabel className="md:text-white">
                        Código de verificación
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="123456"
                        />
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
                        <FormControl>
                          <div className="relative w-full">
                            <NextUIInput
                              {...field}
                              disabled={isSubmitting}
                              label="Correo electrónico"
                              className={`w-full ${
                                form.formState.errors.email
                                  ? "border-red-500"
                                  : ""
                              }`}
                              isInvalid={!!form.formState.errors.email}
                              type="email"
                            />
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
                        <FormControl>
                          <div className="relative w-full">
                            <NextUIInput
                              {...field}
                              disabled={isSubmitting}
                              label="Contraseña"
                              type={isPasswordVisible ? "text" : "password"}
                              className={`w-full ${
                                form.formState.errors.password
                                  ? "border-red-500"
                                  : ""
                              }`}
                              isInvalid={!!form.formState.errors.password}
                              endContent={
                                <button
                                  className="focus:outline-none"
                                  type="button"
                                  onClick={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                  }
                                  aria-label="toggle password visibility"
                                >
                                  {isPasswordVisible ? (
                                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                  ) : (
                                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                  )}
                                </button>
                              }
                            />
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

          {(error || urlError) && (
            <div className="text-red-500 bg-red-100 p-2 rounded-md">
              <FormError message={error || urlError} />
            </div>
          )}

          {success && (
            <div className="text-green-500 bg-green-100 p-2 rounded-md">
              <FormSuccess message={success} />
            </div>
          )}

          <motion.div variants={item}>
            <button
              disabled={isSubmitting}
              type="submit"
              className="overflow-hidden w-full p-2 h-12 bg-dark text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            >
              {showTwoFactor ? "Autorizar" : "Entrar"}
              {/* Animaciones y estilos */}
              <span
                className="absolute w-full h-32 -top-8 -left-0 bg-[#1e3e50] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-bottom"
              ></span>
              <span
                className="absolute w-full h-32 -top-8 -left-0 bg-primary-50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-bottom"
              ></span>
              <span
                className="absolute w-full h-32 -top-8 -left-0 bg-[#557a8f] rounded-full transform scale-x-0 group-hover:scale-x-125 transition-transform duration-500 origin-bottom"
              ></span>
              <span
                className="group-hover:opacity-100 duration-1000 opacity-0 absolute top-2.5 left-1/2 transform -translate-x-1/2 text-center text-white"
              >
                {showTwoFactor ? "Autorizar" : "Entrar"}
              </span>
            </button>
          </motion.div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 md:text-white text-gray-500 font-semibold">
              o
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <motion.div className="my-4" variants={item}>
            <Social />
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginForm;
