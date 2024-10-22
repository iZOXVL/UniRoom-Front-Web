import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Room {
  roomId: string;
  multimedia: string;
  title: string;
  description: string;
}

const useGetRooms = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

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

        console.log("Data recibida:", data);

       
        setHabitaciones(data);

      } catch (error: any) {
        console.error(error);
        setError(error);
        toast({
          title: "Error",
          description: "Hubo un problema al obtener las habitaciones.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userToken, toast]);

  return { habitaciones, loading, error };
};

export default useGetRooms;
