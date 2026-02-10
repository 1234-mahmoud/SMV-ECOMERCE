import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../store/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity }));
  };

  const displayTitle = product ? product.title : loading ? "Loading..." : "Product not found";
  const displayPrice = product ? `${product.price}$` : "";
  const displayDescription = product ? product.description : "";
  const displayStock = product ? product.stock : 0;
  const displayCategory = product ? product.category : "Unknown";
  const imageSrc =
    product && product.images && product.images.length > 0
      ? `http://localhost:3000${product.images[0]}`
      : "/fallback.jpg";

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
          <img src={imageSrc} alt={displayTitle} className={`w-full h-full object-contain`} />
        </div>
        <div className={`data w-full md:flex-1/2 flex flex-col gap-4`}>
          <span className={`text-xl font-bold text-gray-700`}>
            {displayTitle}
          </span>
          <span className={`text-md font-semibold text-gray-500`}>
            By Ali Store
          </span>
          <span className={`text-xl font-extrabold text-blue-500`}>
            {displayPrice}
          </span>
          <p className={`text-md font-semibold text-gray-500`}>
            {displayDescription}
          </p>
          <span className={`text-md font-semibold text-gray-900`}>
            Stock:
            <span className={`text-md font-semibold text-green-600 mx-2`}>
              {displayStock} Available
            </span>{" "}
          </span>
          <span className={`text-md font-semibold text-gray-900`}>
            Category: {displayCategory}
          </span>
          <div className={`flex items-center gap-3`}>
            <span className={`text-md font-semibold text-gray-900`}>
              Quantity:
            </span>
            <button
              className={`w-7 h-7 bg-red-500 text-white text-lg font-bold rounded-sm
          flex justify-center items-center`}
              onClick={handleDecrement}
            >
              -
            </button>
            <span
              className={`w-13 h-9 border border-black rounded-sm
          flex justify-center items-center`}
            >
              {quantity}
            </span>
            <button
              className={`w-7 h-7 font-bold bg-green-500 text-white text-lg rounded-sm
          flex justify-center items-center`}
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
         <div className={`flex items-center gap-4`}>
           <button
             className={`text-white text-lg font-semibold rounded-md bg-blue-500 w-3/5 p-2`}
             onClick={handleAddToCart}
             disabled={!product}
           >
             Add To Cart
           </button>
           <button className={`text-white text-lg font-semibold rounded-md bg-gray-500 w-[40%] p-2`}>Buy Now</button>
         </div>
        </div>
      </div>
      {error && (
        <div className={`mt-4 text-red-600 font-semibold`}>{error}</div>
      )}
    </div>
  );
}
