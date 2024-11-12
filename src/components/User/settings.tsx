"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import React from "react";
import Image from "next/image";

const Settings = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role === UserRole.ARRENDADOR || user?.role === UserRole.ESTUDIANTE ? user.role : undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    }
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Ha ocurrido un error!"));
    });
  };

  return (
    <div className="mx-auto max-w-270 dark:bg-dark dark:text-white">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-black dark:text-white">
                Información de la cuenta
              </h3>
            </div>
            <div className="p-7">
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" disabled={isPending} className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="ejemplo@dominio.com"
                              type="email"
                              disabled={true}
                              className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rol</FormLabel>
                          <Select
                            disabled={true}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="dark:bg-gray-800 dark:text-white">
                                <SelectValue placeholder="Selecciona un rol" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={UserRole.ESTUDIANTE}>Estudiante</SelectItem>
                              <SelectItem value={UserRole.ARRENDADOR}>Arrendador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>

                    {user?.isOAuth === false && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="******"
                                  type="password"
                                  disabled={isPending}
                                  className="w-full rounded-[7px] border-[1.5px] bg-slate-50  border-gray-4 bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirma tu contraseña</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="******"
                                  type="password"
                                  disabled={isPending}
                                  className="dark:bg-gray-800 dark:text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {user?.isOAuth === false && (
                      <FormField
                        control={form.control}
                        name="isTwoFactorEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm dark:bg-gray-800 dark:border-strokedark">
                            <div className="space-y-0.5">
                              <FormLabel>Autenticación de dos factores</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                disabled={isPending}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

                    {user?.isOAuth === true && (
                      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded dark:bg-yellow-200 dark:border-yellow-600 dark:text-yellow-900">
                        No puedes editar algunos campos porque esta cuenta está gestionada por un proveedor externo (Google).
                      </div>
                    )}
                  </div>
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button disabled={isPending} type="submit" className="mt-5 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90">
                    Guardar cambios
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-black dark:text-white">Tu Foto</h3>
            </div>
            <div className="p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full">
                  <Image
                    src={user?.image || "https://avatar.iran.liara.run/public"}
                    width={55}
                    height={55}
                    alt="User"
                  />
                </div>
                <div>
                  <span className="mb-1.5 text-black dark:text-white">Editar foto</span>
                  <span className="flex gap-2.5">
                    <button className="text-sm hover:text-primary dark:hover:text-blue-400">Eliminar</button>
                    <button className="text-sm hover:text-primary dark:hover:text-blue-400">Actualizar</button>
                  </span>
                </div>
              </div>
              <div
                id="FileUpload"
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-stroke bg-white px-4 py-4 dark:bg-dark-3 dark:border-dark-3 sm:py-7.5"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 z-50 m-0 cursor-pointer p-0 opacity-0 outline-none bg-white dark:bg-dark-3 border-stroke dark:border-dark-3"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium text-black dark:text-white">Sube tu foto</span>
                  <span className="text-sm">PNG, JPG or GIF</span>
                  <span className="text-sm">Tamaño máximo 800x800px</span>
                </div>
              </div>
              <Button className="bg-primary w-full">Subir Imagen</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;