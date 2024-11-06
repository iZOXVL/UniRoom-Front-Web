"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import CardDataStats from "./CardDataStats";
import { FaEye } from "react-icons/fa";
import { RiContractFill, RiSearchEyeLine } from "react-icons/ri";
import { BiMessageRoundedCheck, BiMessageRoundedError } from "react-icons/bi";


const Charts: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Vistas" total="293" rate="89.3%" levelUp>
          <RiSearchEyeLine className="fill-primary dark:fill-white text-8xl" />    
        </CardDataStats>
        <CardDataStats title="Solicitudes" total="45" rate="94.35%" levelUp>
           <BiMessageRoundedError   className="fill-primary dark:fill-white text-8xl" />  
        </CardDataStats>
        <CardDataStats title="Chats" total="16" rate="25.59%" levelUp>
        <BiMessageRoundedCheck  className="fill-primary dark:fill-white text-8xl" />  
        </CardDataStats>
        <CardDataStats title="Confirmaciones" total="3" rate="0.95%" levelDown>
           <RiContractFill  className="fill-primary dark:fill-white text-8xl" />  
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
      </div>
    </>
  );
};

export default Charts;
