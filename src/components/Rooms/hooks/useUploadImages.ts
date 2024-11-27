import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const useUploadMedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const uploadMedia = async (roomId: number, images: File[], videos: File[]) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("roomId", roomId.toString());

    images.forEach((image) => formData.append("ImageAggregates.Images", image));
    videos.forEach((video) => formData.append("VideoAggregates.Videos", video));

    try {
      const response = await fetch("https://uniroom.azurewebsites.net/api/Multimedia/AddMultimedia", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al subir multimedia.");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al subir la multimedia.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadMedia, isLoading };
};

export default useUploadMedia;
