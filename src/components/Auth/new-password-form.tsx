"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Input as NextUIInput } from "@nextui-org/react";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/Auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { motion } from "framer-motion";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });
  };

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };


  return (
    <CardWrapper
      headerLabel="Ingresa tu nueva contraseña"
      backButtonLabel="Regresar"
      backButtonHref="/"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">


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
                          disabled={isPending}
                          className={`max-w-full ${form.formState.errors.password ? 'border-red-500' : 'flex w-100 flex-wrap md:flex-nowrap gap-1.5'}`}
                          label="Contraseña"
                          type={isPasswordVisible ? "text" : "password"}
                          isInvalid={!!form.formState.errors.password}
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
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
                // <FormItem>
                //   <motion.div variants={item}>
                //   <FormLabel>Nueva contraseña</FormLabel>
                //   </motion.div>
                //   <motion.div variants={item}>
                //   <FormControl>
                //     <Input
                //       {...field}
                //       disabled={isPending}
                //       placeholder="******"
                //       type="password"
                //     />
                //   </FormControl>
                //   </motion.div>
                //   <FormMessage />
                // </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <motion.div variants={item}>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-primary"
            >
              Cambiar contraseña
            </Button>
          </motion.div>
        </form>
      </Form>
    </CardWrapper>
  );
};