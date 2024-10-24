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

const useAddRoom = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken; 
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  
  const addRoom = async (data: RoomData): Promise<number | null> => {

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

      console.log("respuesta de la appi:",room);
      
      if (room && room.roomId) {
        return room.roomId; 
      } else {
        throw new Error("No se recibió roomId de la API.");
      }
      
    } catch (error) {
      console.error(error);

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
  
  

  return { addRoom, isLoading };
};

export default useAddRoom;
