"use client";
import { useEffect, useState } from "react";
import { Room } from "@/types/Room";

export const useGetRooms = () => {
  const [habitaciones, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://uruniroom.azurewebsites.net/api/Rooms/GetRoomLandlord");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { habitaciones, loading, error };
};
