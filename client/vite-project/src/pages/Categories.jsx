import React from "react";
import img from "../assets/img.jpg";
export default function Categories() {
  const catego_data = [
    {
      id: 1,
      img: "",
      name: "Electronics",
    },
    {
      id: 2,
      img: "",
      name: "Fashion",
    },
    {
      id: 3,
      img: "",
      name: "Home & Kitchen",
    },
    {
      id: 4,
      img: "",
      name: "Sports",
    },
  ];

  return (
    <div className={`section-margin bg-gray-50 p-4 `}>
      <h1 className={`main-title font-bold my-5`}>Popular Categories</h1>
      <div className={`flex justify-center items-center gap-5 flex-wrap`}>
        {catego_data.map((c) => (
          <div
            className={`bg-white rounded-md p-3 flex flex-col justify-center items-center gap-3 basis-75 
                shadow-gray-400 shadow-xl
                `}
            key={c.id}
          >
            <img
              src={img}
              alt="pic"
              className={`w-30 h-30 shrink-0 object-fit rounded-full`}
            />
            <span className={`text-lg font-semibold`}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
