"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/Auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { motion } from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token no reconocido!");
      setLoading(false); // Deja de cargar
      return;
    }

    newVerification(token)
      .then((data) => {
        setLoading(false); // Deja de cargar
        if (data.success) {
          setSuccess(data.success);
          setError(undefined); // Limpia el error
        } else {
          setError(data.error);
          setSuccess(undefined); // Limpia el éxito
        }
      })
      .catch(() => {
        setError("Ha ocurrido un error!");
        setSuccess(undefined); // Limpia el éxito
        setLoading(false); // Deja de cargar
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="Regresar"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center justify-center w-full">
        {loading && (
          <motion.div variants={item}>
            <BeatLoader />
            <p className="mt-2">Confirmando cuenta...</p>
          </motion.div>
        )}
        {success && (
          <motion.div variants={item} className="flex flex-col items-center">
            <DotLottiePlayer
              src="/lotties/verify.lottie"
              autoplay
              loop
              style={{ height: "120px", width: "120px" }}
            />
            <FormSuccess message={success} />
          </motion.div>
        )}
        {error && (
          <motion.div variants={item} className="flex flex-col items-center">
            <DotLottiePlayer
              src="/lotties/error.lottie"
              autoplay
              loop
              style={{ height: "120px", width: "120px" }}
            />
            <FormError message={error} />
          </motion.div>
        )}
      </div>
    </CardWrapper>
  );
};
