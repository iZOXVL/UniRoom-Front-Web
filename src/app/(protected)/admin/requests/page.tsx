import React from "react";
import { Metadata } from "next";
import TableRequests from "@/components/Admin/list-requests/list-requests";

export const metadata: Metadata = {
  title: "UniRoom"
};

const ListRequestsPage = () => {
  return (
  <>
      <TableRequests />
  </>
  );
};

export default ListRequestsPage;
