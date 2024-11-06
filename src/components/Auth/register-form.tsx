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
import { Input as NextUIInput } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      <h1 className="text-small font-bold text-center md:text-white">Crea una cuenta</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <motion.div>
                    <FormControl>
                      <div className="relative w-100">
                        <NextUIInput
                          {...field}
                          disabled={isPending}
                          label="Nombre"
                          className={`max-w-100 ${form.formState.errors.name ? 'border-red-500' : 'flex w-100s flex-wrap md:flex-nowrap gap-1.5'}`}
                          isInvalid={!!form.formState.errors.email}
                          type="text"
                        />
                      </div>
                    </FormControl>
                  </motion.div>
                  <FormMessage />
                </FormItem>

                // <FormItem>
                //   <motion.div>
                //     <FormLabel>Nombre</FormLabel>
                //   </motion.div>
                //   <motion.div>

                //       <FormControl>
                //       <div className="relative w-full">
                //         <Input {...field} disabled={isPending} placeholder="Juan Perez" type="text" className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                //         <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                //         </div>
                //       </FormControl>

                //   </motion.div>
                //   <FormMessage />
                // </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                <motion.div>
                  <FormControl>
                    <div className="relative w-100">
                      <NextUIInput
                        {...field}
                        disabled={isPending}
                        label="Correo electrónico"
                        className={`max-w-100 ${form.formState.errors.name ? 'border-red-500' : 'flex w-100s flex-wrap md:flex-nowrap gap-1.5'}`}
                        isInvalid={!!form.formState.errors.email}
                        type="email"
                      />
                    </div>
                  </FormControl>
                </motion.div>
                <FormMessage />
              </FormItem>


                // <FormItem>
                //   <motion.div>
                //     <FormLabel>Correo electrónico</FormLabel>
                //   </motion.div>
                //   <motion.div>
                //     <FormControl>
                //       <div className="relative w-full">
                //         <Input {...field} disabled={isPending} className="w-full h-10 rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                //           placeholder="ejemplo@dominio.com" type="email" />
                //         <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                //       </div>
                //     </FormControl>
                //   </motion.div>
                //   <FormMessage />
                // </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                      <motion.div>
                        <FormControl>
                          <div className="relative w-100">
                            <NextUIInput
                              {...field}
                              disabled={isPending}
                              className={`max-w-100 ${form.formState.errors.password ? 'border-red-500' : 'flex w-100 flex-wrap md:flex-nowrap gap-1.5'}`}
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
                //   <motion.div>
                //     <FormLabel>Contraseña</FormLabel>
                //   </motion.div>
                //   <motion.div>
                //     <FormControl>
                //       <div className="relative w-full">
                //         <Input {...field} disabled={isPending} placeholder="********" className="w-full rounded-[7px] border-[1.5px] bg-slate-50 border-gray-400 bg-transparent px-5.5 py-3 pl-11 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white" type="password" />
                //         <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                //       </div>
                //     </FormControl>
                //   </motion.div>
                //   <FormMessage />
                // </FormItem>
              )}
            />
          </div>


          {error  ? (
            <div className="w-100 text-red-500 bg-red-100 p-2 rounded-md">
              <FormError message={error} />
            </div>
          ) : null}

          {success ? (
            <div className="w-100 text-green-500 bg-green-100 p-2 rounded-md">
              <FormSuccess message={success} />
            </div>
          ) : null}


          <motion.div>
          <button
              disabled={isPending} type="submit"
              className="overflow-hidden w-100 p-2 h-12 bg-dark text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
            >
              Crear cuenta
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
                className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-36 z-10 text-center text-white"
              > Únetenos</span>

            </button>
          </motion.div>
        </form>
        <br />
      </Form>
    </motion.div>
  );
};

export default RegisterForm;
