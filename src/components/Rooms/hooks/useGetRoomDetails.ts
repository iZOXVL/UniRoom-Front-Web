import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

interface RoomDetails {
  roomId: number;
  landLord: string;
  price: number;
  availability: boolean;
  minTime: number;
  maxTime: number;
  title: string;
  description: string;
  maxPeople: number;
  allowPets: boolean;
  sharedStatus: boolean;
  averageRating: number;
  reviewCount: number;
  reviews: string;
  address: string;
  latitude: number;
  longitude: number;
  features: string;
  roomRules: string;
  multimedia: string;
  featuresDto: { featureId: number; features: string }[];
  roomRulesDto: { ruleId: number; rules: string }[];
  multimediaDto: {
    imageUrl: string[];
    videoUrl: string[];
  };
  landlordDto: {
    id: string;
    name: string;
    imageUrl: string;
    dateCreated: string;
  };
  reviewsDto: {
    tenantName: string;
    rating: number;
    comment: string;
    createDate: string;
  }[];
}

const useGetRoomDetails = (roomId: number | null) => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://uruniroom.azurewebsites.net/api/Rooms/GetRoomDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId }),
        });

        if (!response.ok) throw new Error("Error al obtener los detalles de la habitación.");

        const data = await response.json();
        setRoomDetails(data);
        console.log("Room details:", data); // Imprime los detalles en la consola para depuración
      } catch (error: any) {
        console.error(error);
        setError(error);
        toast({
          title: "Error",
          description: "Hubo un problema al obtener los detalles de la habitación.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, toast]);

  return { roomDetails, loading, error };
};

export default useGetRoomDetails;
