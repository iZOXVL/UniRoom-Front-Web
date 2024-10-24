import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Room {
  roomId: string;
  multimedia: string;
  title: string;
  description: string;
}

const useGetRooms = (pageNumber: number, pageSize: number) => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalRooms, setTotalRooms] = useState(0); // Nuevo estado para el total de habitaciones
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
            pageNumber,
            pageSize,
          }),
        });

        if (!response.ok) throw new Error("Error al obtener las habitaciones.");

        const data = await response.json();
        setHabitaciones(data.rooms);
        setTotalRooms(data.totalRooms); // Guarda el total de habitaciones
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
  }, [userToken, toast, pageNumber, pageSize]);

  return { habitaciones, loading, error, totalRooms }; // Devolvemos el total de habitaciones
};


export default useGetRooms;
