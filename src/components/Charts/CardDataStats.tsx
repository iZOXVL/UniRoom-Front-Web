import React, { ReactNode } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  children,
}) => {
  return (
    <div className="rounded-2xl shadow-md border bg-white px-7.5 py-6 dark:border-dark-2 dark:bg-gray-dark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}/mes</span>
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            levelUp ? "text-green-500" : "text-red-500"
          }`}
        >
          {rate}

          {levelUp ? (
            <FaArrowTrendUp className="text-sm" />
          ) : (
            <FaArrowTrendDown className="text-sm" />
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
