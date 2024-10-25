import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Chat {
  id: string;
  participantDetails: { name: string; imageUrl: string | null, email:string }[];
  participants: { name: string; imageUrl: string | null, email:string }[];
  roomDetails: { title: string; imageUrl: string; description: string; price: number; location: string };
  status: string;
  createdAt: string;
}

const useGetPendingRequests = () => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      try {
        const response = await fetch(`https://uniroom-backend-services.onrender.com/chats/${userToken}`);
        

        if (!response.ok) throw new Error("Error al obtener las solicitudes.");

        const data = await response.json();
        console.log("esta es la fokin data", data);

        // Filtrar solicitudes pendientes
        const pendingChats = data.chats.filter((chat: Chat) => chat.status === "pending");
        setChats(pendingChats);
      } catch (error: any) {
        setError(error);
        toast({
          title: "Error",
          description: "Hubo un problema al obtener las solicitudes.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userToken, toast]);

  return { chats, loading, error };
};

export default useGetPendingRequests;
