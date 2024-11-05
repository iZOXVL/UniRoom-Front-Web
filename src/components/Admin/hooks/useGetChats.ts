// useGetChats.ts
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Chat {
  id: string;
  participantDetails: {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
  }[];
  roomDetails: {
    title: string;
    imageUrl: string;
    description: string;
    price: number;
    location: string;
  };
  roomId: string;
  status: string;
  createdAt: string;
}

const useGetChats = (roomIds?: string[], filterValue?: string) => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const userName = user?.name;
  const userId = user?.id;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://uniroom-backend-services.onrender.com/chats/${userToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "approved",
              roomId: roomIds?.join(","),
              filterValue,
            }),
          }
        );

        if (!response.ok) throw new Error("Error al obtener los chats.");

        const data = await response.json();

        setChats(data.chats);
      } catch (error: any) {
        setError(error);
        toast({
          title: "Error",
          description: "Hubo un problema al obtener los chats aprobados.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userToken, toast, roomIds, filterValue]);

  return { chats, loading, error, userToken, userName, userId };
};

export default useGetChats;
