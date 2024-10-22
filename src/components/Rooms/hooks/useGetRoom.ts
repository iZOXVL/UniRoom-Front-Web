import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Room {
  roomId: number;
  title: string;
  description: string;
  price: number;
  multimedia: string;
  requestCount: number;
  receiptCount: number;
}

const useGetRooms = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
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
            pageSize: 10, // Puedes ajustar el número de habitaciones por página
          }),
        });

        if (!response.ok) throw new Error("Error al obtener las habitaciones.");

        const data = await response.json();
        setHabitaciones(data.rooms || []); // Asegúrate de que la estructura del JSON sea correcta.
      } catch (error) {
        setError(error as Error);
        toast({
          title: "Error",
          description: "Hubo un problema al cargar las habitaciones.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userToken) {
      fetchRooms();
    }
  }, [userToken]);

  return { habitaciones, loading, error };
};

export default useGetRooms;
