import React from "react";
import { Metadata } from "next";
import Chat from "@/components/Admin/chat/chat";


export const metadata: Metadata = {
  title: "UniRoom"
};

const ListRequestsPage = () => {
  return (
  <>
      <Chat />
  </>
  );
};

export default ListRequestsPage;
