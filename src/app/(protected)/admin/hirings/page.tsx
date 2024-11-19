import React from "react";
import { Metadata } from "next";
import TableHirings from "@/components/Admin/list-hirings/list-hirings";


export const metadata: Metadata = {
  title: "UniRoom"
};

const ListHiringsPage = () => {
  return (
  <>
      <TableHirings />
  </>
  );
};

export default ListHiringsPage;
