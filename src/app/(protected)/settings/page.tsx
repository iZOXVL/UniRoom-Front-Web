import React from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Settings from "@/components/User/settings";

export const metadata: Metadata = {
  title: "UniRoom"
};

const SettingsPage = () => {
  return (
    <>
    <Breadcrumb pageName="Configuración" />
     <Settings />
     </>
  );
};

export default SettingsPage;
