import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z.object({
  name: z.string()
  .min(2, { message: "¡El nombre debe tener al menos 2 caracteres!" })
  .max(50, { message: "El nombre no debe exceder los 50 caracteres!" })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: "El nombre solo puede contener letras, espacios y caracteres como guiones o apóstrofes.",
  })
  .optional(),

  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ARRENDADOR, UserRole.ESTUDIANTE]),

  email: z.string()
    .email({ message: "¡Correo electrónico requerido!" })
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: "Correo electrónico inválido. Asegúrate de que tenga la estructura correcta, como ejemplo@dominio.com." }
    )
    .optional(),

   password: z.string()
    .min(8, { message: "¡La contraseña debe tener al menos 8 caracteres!" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." }
    )
    .optional(),
    
    newPassword: z.string()
    .min(8, { message: "La nueva contraseña debe tener al menos 8 caracteres!" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "La nueva contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." }
    )
    .optional()
})

  // Refinamiento para asegurar que si se proporciona `password`, también se debe proporcionar `newPassword`
  .refine((data) => !(data.password && !data.newPassword), {
    message: "¡La nueva contraseña es requerida si quieres cambiar la contraseña!",
    path: ["newPassword"]
  })
  // Refinamiento para asegurar que si se proporciona `newPassword`, también se debe proporcionar `password`
  .refine((data) => !(data.newPassword && !data.password), {
    message: "¡La contraseña actual es requerida para cambiar la contraseña!",
    path: ["password"]
  });

export const NewPasswordSchema = z.object({
  password: z.string()
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres!" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." }
  ),
});

export const ResetSchema = z.object({
  email: z.string()
  .email({ message: "¡Correo electrónico requerido!" })
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: "Correo electrónico inválido. Asegúrate de que tenga la estructura correcta, como ejemplo@dominio.com." }
  ),
});

export const LoginSchema = z.object({
  email: z.string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: "Correo electrónico inválido. Asegúrate de que tenga la estructura correcta, como ejemplo@dominio.com." }
    )
    .email({ message: "¡Correo electrónico requerido!" }), 
  password: z.string().min(8, { message: "¡La contraseña debe tener al menos 8 caracteres!" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." }
  ),
  code: z.optional(z.string().length(6, { message: "El código debe tener 6 dígitos." }))
});

// export const LoginSchema = z.object({
//   email: z.string().email({
//     message: "Correo electrónico requerido!",
//   }),
//   password: z.string().min(1, {
//     message: "la contraseña es requerida!",
//   }),
//   code: z.optional(z.string()),
// });

export const RegisterSchema = z.object({
  email: z.string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: "Correo electrónico inválido. Asegúrate de que tenga la estructura correcta, como ejemplo@dominio.com." }
    )
    .email({ message: "¡Correo electrónico requerido!" }), 
  password: z.string().min(8, { message: "¡La contraseña debe tener al menos 8 caracteres!" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." }
  ),
  name: z.string()
    .min(2, { message: "¡El nombre debe tener al menos 2 caracteres!" })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres!" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message: "El nombre solo puede contener letras, espacios y caracteres como guiones o apóstrofes.", 
    }),
  role: z.enum(["ARRENDADOR", "ESTUDIANTE"]).optional(), 
});



// import * as z from "zod";
// import { UserRole } from "@prisma/client";

// export const SettingsSchema = z.object({
//   name: z.optional(z.string()),
//   isTwoFactorEnabled: z.optional(z.boolean()),
//   role: z.enum([UserRole.ARRENDADOR, UserRole.ESTUDIANTE]),
//   email: z.optional(z.string().email()),
//   password: z.optional(z.string().min(6)),
//   newPassword: z.optional(z.string().min(6)),
// })
//   .refine((data) => {
//     if (data.password && !data.newPassword) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "La nueva contraseña es requerida!",
//     path: ["newPassword"]
//   })
//   .refine((data) => {
//     if (data.newPassword && !data.password) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "La contraseña es requerida!",
//     path: ["password"]
//   })

// export const NewPasswordSchema = z.object({
//   password: z.string().min(6, {
//     message: "Minimo 6 caracteres requeridos!",
//   }),
// });

// export const ResetSchema = z.object({
//   email: z.string().email({
//     message: "Correo electrónico requerido!",
//   }),
// });

// export const LoginSchema = z.object({
//   email: z.string().email({
//     message: "Correo electrónico requerido!",
//   }),
//   password: z.string().min(1, {
//     message: "la contraseña es requerida!",
//   }),
//   code: z.optional(z.string()),
// });

// export const RegisterSchema = z.object({
//   email: z.string().email({
//     message: "Correo electrónico requerido!",
//   }),
//   password: z.string().min(6, {
//     message: "6 caracteres requeridos!",
//   }),
//   name: z.string().min(1, {
//     message: "El nombre es requerido!",
//   }),
//   role: z.enum(["ARRENDADOR", "ESTUDIANTE"]).optional(), 
// });