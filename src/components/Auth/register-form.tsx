"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
import { register } from "@/actions/register";
import { FiMail } from 'react-icons/fi';
import { FiLock } from "react-icons/fi";
import { FiUser } from "react-icons/fi";


export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  return (
    <motion.div className="flex flex-col items-center space-y-6" initial="hidden" animate="visible">
  
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <motion.div>
                    <FormLabel>Nombre</FormLabel>
                  </motion.div>
                  <motion.div>
                    
                      <FormControl>
                      <div className="relative w-full">
                        <Input {...field} disabled={isPending} placeholder="Juan Perez" type="text" className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        </div>
                      </FormControl>
                   
                  </motion.div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <motion.div>
                    <FormLabel>Correo electrónico</FormLabel>
                  </motion.div>
                  <motion.div>
                    <FormControl>
                      <div className="relative w-full">
                        <Input {...field} disabled={isPending} className="w-full h-10 rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                          placeholder="ejemplo@dominio.com" type="email" />
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
                  <motion.div>
                    <FormLabel>Contraseña</FormLabel>
                  </motion.div>
                  <motion.div>
                    <FormControl>
                      <div className="relative w-full">
                        <Input {...field} disabled={isPending} placeholder="********" className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white" type="password" />
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      </div>
                    </FormControl>
                  </motion.div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <motion.div>
            <Button disabled={isPending} type="submit" className="-mt-6 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90">
              Crear cuenta
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default RegisterForm;
