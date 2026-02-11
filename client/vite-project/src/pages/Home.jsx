import React from "react";
import Hero from "../components/Hero";
import Products from "./Products";
import Categories from "./Categories";
export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container m-auto">
        <Categories />
        <Products />
      </div>
    </div>
  );
}
