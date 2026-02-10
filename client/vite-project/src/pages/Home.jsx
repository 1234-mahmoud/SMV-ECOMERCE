import React from 'react'
import Hero from "../components/Hero";
import Products from "./Products";
import Categories from "./Categories";
import Dashboard from './Dashboard';
import CreateProduct from './CreateProduct';
export default function Home() {
  return (
    <div>
       <Hero />
      <div className="container m-auto">
        <Categories/>
        <CreateProduct/>
        <Products />
      </div>
      {/* <Dashboard/> */}
    </div>
  )
}
