"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { reset } from "@/actions/reset";
import { FiLock } from "react-icons/fi";
import { Input as NextUIInput } from "@nextui-org/react";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
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
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-small font-bold text-center md:text-white">Vuelve a empezar</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (

                <FormItem>
                  <motion.div variants={item}>
                    <FormControl>
                      <div className="relative w-100">
                        <NextUIInput
                          {...field}
                          disabled={isPending}
                          label="Correo electrónico"
                          className={`max-w-100 ${form.formState.errors.email ? 'border-red-500' : 'flex w-100s flex-wrap md:flex-nowrap gap-1.5'}`}
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
          </div>


          {error ? (
            <div className="w-100 text-red-500 bg-red-100 p-2 rounded-md">
              <FormError message={error} />
            </div>
          ) : null}

          {success ? (
            <div className="w-100 text-green-500 bg-green-100 p-2 rounded-md">
              <FormSuccess message={success} />
            </div>
          ) : null}


          <motion.div variants={item}>
            <button
              disabled={isPending} type="submit"
              className="overflow-hidden w-100 p-2 h-12 bg-dark text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            >
              Restablecer contraseña
              <span
                className="absolute w-100 h-32 -top-8 -left-2 bg-[#1e3e50] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"
              ></span>
              <span
                className="absolute w-100 h-32 -top-8 -left-2 bg-primary-50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"
              ></span>
              <span
                className="absolute w-100 h-32 -top-8 -left-2 bg-[#557a8f] rounded-full transform scale-x-0 group-hover:scale-x-125 transition-transform group-hover:duration-1000 duration-500 origin-bottom"
              ></span>
              <span
                className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-30 z-10 text-center text-white"
              >Recuperar cuenta</span>

            </button>
          </motion.div>

        </form>
      </Form>
    </div>
  );
};
