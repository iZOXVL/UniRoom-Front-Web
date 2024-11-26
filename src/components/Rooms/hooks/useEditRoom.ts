import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface RoomData {
  titulo: string;
  id: any;
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

const useEditRoom = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken; 
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  
  const editRoom = async (data: RoomData): Promise<number | null> => {

    setIsLoading(true);
  
    try {
      const response = await fetch("https://uniroom.azurewebsites.net/api/Rooms/UpdateRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          id: data.id,
          title: data.titulo,
          description: data.descripcion,
          price: data.price,
          availability: true,
          minTime: data.minTime,
          maxTime: data.maxTime,
          maxPeople: data.maxPeople,
          allowPets: data.allowPets,
          sharedStatus: data.sharedStatus,
          status: "Publicada",
          locationUpdate: {
            address: data.address,
            latitude: data.lat,
            longitude: data.lng,
          },
          propertyFeaturesUpdate: {
            featureId: data.services,
          },
          rulesUpdate: {
            ruleId: data.rules,
          },
        }),
      });
  
      if (!response.ok) throw new Error("Error al editar la habitación.");
  
      const apiResponse = await response.json();
      
      if (apiResponse && apiResponse.tipoError === 1) {
        return apiResponse.tipoError; 
      } else {
        throw new Error("Error al editar la habitación.");
      }
      
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Hubo un problema al editar la habitación.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return { editRoom, isLoading };
};

export default useEditRoom;
