import { useState } from "react";
import { useToast } from "@chakra-ui/react";

interface RoomData {
  titulo: string;
  descripcion: string;
  imagenBase64: string | undefined;
}

const useAddRoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const addRoom = async (data: RoomData) => {
    setIsLoading(true);
    const { titulo, descripcion, imagenBase64 } = data;

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, descripcion, imagenBase64 }),
      });

      if (response.ok) {
        toast({
          title: "Guardado!",
          description: "La habitación se publicó correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al publicar la habitación.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al  publicar la habitación.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { addRoom, isLoading };
};

export default useAddRoom;
