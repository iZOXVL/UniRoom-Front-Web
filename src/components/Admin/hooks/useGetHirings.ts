import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Hiring {
  hiringId: number;
  roomId: number;
  tenantId: string;
  habitants: number;
  status: string;
  deposit: number;
  monthlyPrice: number;
  monthsCount: number;
  totalAmount: number;
  startDate: string; // Fecha en formato ISO
  endDate: string;   // Fecha en formato ISO
}

const useGetHirings = (pageNumber: number, pageSize: number) => {
  const user = useCurrentUser();
  const userToken = user?.JwtToken;
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalHirings, setTotalHirings] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchHirings = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://uruniroom.azurewebsites.net/api/Hirings/GetHiringsByLandlord",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: userToken,
              pageNumber,
              pageSize,
            }),
          }
        );

        if (!response.ok) throw new Error("Error al obtener los tratos.");

        const data = await response.json();
        setHirings(data.hirings);
        setTotalHirings(data.totalHirings);
      } catch (error: any) {
        console.error(error);
        setError(error);
        toast({
          title: "Error",
          description: "Hubo un problema al obtener los tratos.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHirings();
  }, [userToken, toast, pageNumber, pageSize]);

  return { hirings, loading, error, totalHirings };
};

export default useGetHirings;
