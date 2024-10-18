import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface RoomData {
  titulo: string;
  descripcion: string;
  lat: number | undefined;
  lng: number | undefined;
  services: number[];
  rules: number[];
  price: number;
  minTime: number;
  maxTime: number;
  maxPeople: number;
  sharedStatus: boolean;
  allowPets: boolean;
  address: string;
}

const useAddRoom = (roomId?: any, images?: File[]) => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken; 
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const addRoom = async (data: RoomData) => {
    setIsLoading(true);

    try {
      const response = await fetch("https://uruniroom.azurewebsites.net/api/Rooms/AddRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          title: data.titulo,
          description: data.descripcion,
          price: data.price,
          availability: true,
          minTime: data.minTime,
          maxTime: data.maxTime,
          maxPeople: data.maxPeople,
          allowPets: data.allowPets,
          sharedStatus: data.sharedStatus,
          status: "available",
          location: {
            address: data.address,
            latitude: data.lat,
            longitude: data.lng,
          },
          propertyFeaturesAggregates: {
            featureId: data.services,
          },
          rulesAggregates: {
            ruleId: data.rules,
          },
        }),
      });

      if (!response.ok) throw new Error("Error al crear la habitación.");

      const room = await response.json();
      toast({
        title: "Guardado!",
        description: "La habitación se publicó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      return room.id; 
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al publicar la habitación.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (roomId: number, images: File[]) => {
    const formData = new FormData();
    
    
    formData.append("roomId", roomId.toString());

    images.forEach((image) => formData.append("images", image));
  
    try {
      const response = await fetch(`https://uruniroom.azurewebsites.net/api/Multimedia/AddMultimedia`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Error al subir imágenes.");
  
      toast({
        title: "Éxito!",
        description: "Las imágenes se subieron correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al subir las imágenes.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  

  return { addRoom, uploadImages, isLoading };
};

export default useAddRoom;
