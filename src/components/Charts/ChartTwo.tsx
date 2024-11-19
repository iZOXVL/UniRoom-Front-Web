"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoProps {
  token: any;
}

const ChartTwo: React.FC<ChartTwoProps> = ({ token }) => {
  const [series, setSeries] = useState([
    { name: "Solicitudes recibidas", data: [] },
    { name: "Habitaciones reservadas", data: [] },
  ]);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        const response = await axios.post("https://uniroom-backend-services.onrender.com/web/dashboard/week-summary", { token });
        const { requests, reservations } = response.data.data;

        setSeries([
          { name: "Solicitudes recibidas", data: requests },
          { name: "Habitaciones en trato", data: reservations },
        ]);
      } catch (error) {
        console.error("Error al obtener el resumen semanal:", error);
      }
    };

    fetchWeeklySummary();
  }, [token]);

  return (
    <div className="col-span-12 rounded-2xl border border-stroke bg-white p-7.5 shadow-md dark:border-gray-dark dark:bg-gray-dark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Resumen semanal
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
