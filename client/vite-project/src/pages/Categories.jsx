import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../utils/axiosConfig";
import { fetchCategories } from "../store/categorySlice";

export default function Categories() {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className={`section-margin bg-gray-50 p-4 `}>
      <h1 className={`main-title font-bold my-5`}>Popular Categories</h1>
      <div className={`flex justify-center items-center gap-5 flex-wrap`}>
        {loading ? (
          <span className={`text-lg font-semibold`}>Loading...</span>
        ) : (
          categories.map((c) => (
            <Link
              to={`/products?category=${c._id}`}
              className={`bg-white rounded-md p-3 flex flex-col justify-center items-center gap-3 basis-80 h-75 
                shadow-gray-400 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer
                `}
              key={c._id}
            >
              {c.image ? (
                <img
                  src={c.image.startsWith("http") ? c.image : `${baseURL}${c.image}`}
                  alt={c.name}
                  className={`w-60 h-60 shrink-0 object-contain rounded-full`}
                />
              ) : (
                <div className={`w-24 h-24 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm`} aria-hidden />
              )}
              <span className={`text-lg font-semibold`}>{c.name}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
