import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Chat {
  id: string;
  participantDetails: { name: string; imageUrl: string | null }[];
  roomDetails: { title: string; imageUrl: string; description: string; price: number; location: string };
  status: string;
  createdAt: string;
}

const useGetChats = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      try {
        const response = await fetch(`https://uniroom-backend-services.onrender.com/chats/${userToken}`);

        if (!response.ok) throw new Error("Error al obtener los chats.");

        const data = await response.json();

        // Filtrar chats aprobados
        const approvedChats = data.chats.filter((chat: Chat) => chat.status === "approved");
        setChats(approvedChats);
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
  }, [userToken, toast]);

  return { chats, loading, error };
};

export default useGetChats;
