import React from "react";
import { Metadata } from "next";
import AddRoomForm from "@/components/Rooms/add-rooms/add-room";

export const metadata: Metadata = {
  title: "UniRoom"
};

const AddRoomPage = () => {
  return (
      <AddRoomForm />
  );
};

export default AddRoomPage;
