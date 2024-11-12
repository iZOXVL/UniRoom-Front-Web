"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardDataStats from "./CardDataStats";
import { RiSearchEyeLine } from "react-icons/ri";
import {
  BiMessageRoundedCheck,
  BiMessageRoundedError,
  BiMessageRoundedX,
} from "react-icons/bi";
import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@nextui-org/react";

const Charts: React.FC = () => {
  const user = useCurrentUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = user?.JwtToken;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://uniroom-backend-services.onrender.com/web/dashboard/stats",
          { token }
        );
        setStats(response.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Error al obtener las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* Skeletons for the cards */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-dark rounded-lg shadow-md"
            >
              <Skeleton className="h-20 w-full mb-4 rounded-md" />
              <Skeleton className="h-6 w-1/2 mb-2 rounded-md" />
              <Skeleton className="h-6 w-1/4 rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {/* Skeletons for the charts */}
          <div className="col-span-12  xl:col-span-8">
            <Skeleton className="h-96 bg-white dark:bg-gray-dark w-full rounded-md" />
          </div>
          <div className="col-span-12  xl:col-span-4">
            <Skeleton className="h-96 bg-white dark:bg-gray-dark w-full rounded-md" />
          </div>
        </div>
      </>
    );

  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {stats && (
          <>
            <CardDataStats
              title={stats.visitas.title}
              total={stats.visitas.total}
              rate={stats.visitas.rate}
              levelUp={stats.visitas.levelUp}
            >
              <RiSearchEyeLine className="fill-primary dark:fill-white text-8xl" />
            </CardDataStats>
            <CardDataStats
              title={stats.solicitudes.title}
              total={stats.solicitudes.total}
              rate={stats.solicitudes.rate}
              levelUp={stats.solicitudes.levelUp}
            >
              <BiMessageRoundedError className="fill-primary dark:fill-white text-8xl" />
            </CardDataStats>
            <CardDataStats
              title={stats.chats.title}
              total={stats.chats.total}
              rate={stats.chats.rate}
              levelUp={stats.chats.levelUp}
            >
              <BiMessageRoundedCheck className="fill-primary dark:fill-white text-8xl" />
            </CardDataStats>
            <CardDataStats
              title={stats.rechazados.title}
              total={stats.rechazados.total}
              rate={stats.rechazados.rate}
              levelUp={stats.rechazados.levelUp}
            >
              <BiMessageRoundedX className="fill-primary dark:fill-white text-8xl" />
            </CardDataStats>
          </>
        )}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne token={token} />
        <ChartTwo token={token} />
      </div>
    </>
  );
};

export default Charts;
