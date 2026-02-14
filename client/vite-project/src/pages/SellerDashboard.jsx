import React from "react";
import SellerAnalytics from "../components/SellerAnalytics";
import CreateProduct from "./CreateProduct";

export default function SellerDashboard() {
  return (
    <div className={`flex flex-col gap-10`}>
      <SellerAnalytics />
      <CreateProduct />
    </div>
  );
}
