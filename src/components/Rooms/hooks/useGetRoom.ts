import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface GetRoomsParams {
  pageNumber: number;
  pageSize: number;
}

const useGetRooms = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getRooms = async (params: GetRoomsParams): Promise<any | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://uruniroom.azurewebsites.net/api/Rooms/GetRoomLandLord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          pageNumber: 1,
          pageSize: 10,
        }),
      });

      if (!response.ok) throw new Error("Error al obtener las habitaciones.");
      
      const data = await response.json();
      return data;

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Hubo un problema al obtener las habitaciones.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getRooms, isLoading };
};

export default useGetRooms;
