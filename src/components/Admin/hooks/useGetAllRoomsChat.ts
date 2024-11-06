// useGetAllRooms.ts
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Room {
  roomId: string;
  title: string;
}

const useGetAllRoomsChat = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://uniroom-backend-services.onrender.com/chats/${userToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "approved" }),
          }
        );

        if (!response.ok) throw new Error("Error al obtener los chats.");

        const data = await response.json();
        console.log("esta es la data de get chats",data);
        const chats = data.chats;

        const uniqueRoomsMap = new Map();
        chats.forEach((chat: any) => {
          const roomId = chat.roomId;
          const title = chat.roomDetails?.title || "Título no disponible";
          if (!uniqueRoomsMap.has(roomId)) {
            uniqueRoomsMap.set(roomId, { roomId, title });
          }
        });

        const roomsList = Array.from(uniqueRoomsMap.values());
        setRooms(roomsList);
      } catch (error: any) {
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

  return { rooms, loading, error };
};

export default useGetAllRoomsChat;
