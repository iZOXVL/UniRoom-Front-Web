import React from "react";
import { Metadata } from "next";
import EditRoomForm from "@/components/Rooms/edit-room/edit-room";

export const metadata: Metadata = {
  title: "UniRoom",
};

const EditRoomPage = () => {
  return <EditRoomForm />;
};

export default EditRoomPage;
