import React from "react";
import { Metadata } from "next";
import ListRoom from "@/components/Rooms/list-rooms/list-rooms";

export const metadata: Metadata = {
  title: "UniRoom"
};

const ListRoomPage = () => {
  return (
      <ListRoom />
  );
};

export default ListRoomPage;
