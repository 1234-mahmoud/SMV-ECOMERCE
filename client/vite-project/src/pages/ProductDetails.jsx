import React from "react";
import img from "../assets/img.jpg";
export default function ProductDetails() {
  return (
    <div className={`container mx-auto my-10`}>
      <div
        className={`product flex items-center gap-10 
        flex-col md:flex-row
   `}
      >
        <div
          className={`img w-full md:flex-1/2 relative h-100 overflow-hidden rounded-md shrink-0`}
        >
          <img src={img} alt="" className={`w-full h-full object-fit`} />
        </div>
        <div className={`data w-full md:flex-1/2 flex flex-col gap-4`}>
          <span className={`text-xl font-bold text-gray-700`}>
            Premium Wash Drawer
          </span>
          <span className={`text-md font-semibold text-gray-500`}>
            By Ali Store
          </span>
          <span className={`text-xl font-extrabold text-blue-500`}>
            100.50$
          </span>
          <p className={`text-md font-semibold text-gray-500`}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            pariatur neque vero totam harum perferendis?
          </p>
          <span className={`text-md font-semibold text-gray-900`}>
            Stock:
            <span className={`text-md font-semibold text-green-600 mx-2`}>
              25 Available
            </span>{" "}
          </span>
          <span className={`text-md font-semibold text-gray-900`}>
            Category: Electronics
          </span>
          <div className={`flex items-center gap-3`}>
            <span className={`text-md font-semibold text-gray-900`}>
              Quantity:
            </span>
            <button
              className={`w-7 h-7 bg-red-500 text-white text-lg font-bold rounded-sm
          flex justify-center items-center`}
            >
              -
            </button>
            <span
              className={`w-13 h-9 border border-black rounded-sm
          flex justify-center items-center`}
            >
              1
            </span>
            <button
              className={`w-7 h-7 font-bold bg-green-500 text-white text-lg rounded-sm
          flex justify-center items-center`}
            >
              +
            </button>
          </div>
         <div className={`flex items-center gap-4`}>
           <button className={`text-white text-lg font-semibold rounded-md bg-blue-500 w-3/5 p-2`}>Add To Cart</button>
           <button className={`text-white text-lg font-semibold rounded-md bg-gray-500 w-[40%] p-2`}>Buy Now</button>
         </div>
        </div>
      </div>
    </div>
  );
}
