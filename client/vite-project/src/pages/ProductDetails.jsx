import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api, { baseURL } from "../utils/axiosConfig";
import { addToCart, increment, decrement } from "../store/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const productId = product ? (product.id || product._id) : id;
  const productIdStr = String(productId);
  const cartItem = cartItems.find((item) => String(item.id || item._id) === productIdStr);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;
  const isInCart = inCartQuantity > 0;
  const displayQuantity = isInCart ? inCartQuantity : quantity;
  const maxQuantity = product?.stock ?? 999;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleDecrement = () => {
    if (isInCart) {
      dispatch(decrement(productIdStr));
    } else {
      setQuantity((q) => Math.max(1, q - 1));
    }
  };

  const handleIncrement = () => {
    if (isInCart) {
      if (inCartQuantity < maxQuantity) dispatch(increment(productIdStr));
    } else {
      setQuantity((q) => Math.min(maxQuantity, q + 1));
    }
  };

  const handleAddToCart = () => {
    if (isInCart) {
      if (inCartQuantity < maxQuantity) dispatch(increment(productIdStr));
    } else {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (loading) return <div className="container mx-auto my-10">Loading...</div>;
  if (!product) return <div className="container mx-auto my-10">Product not found.</div>;

  const imageSrc = product.images && product.images.length > 0 ? `${baseURL}${product.images[0]}` : "/fallback.jpg";
  const categoryName = product.category?.name || "—";

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
          <img src={imageSrc} alt={product.title} className={`w-full h-full object-contain`} />
        </div>
        <div className={`data w-full md:flex-1/2 flex flex-col gap-4`}>
          <span className={`text-xl font-bold text-gray-700`}>
            {product.title}
          </span>
          <span className={`text-md font-semibold text-gray-500`}>
            By Store
          </span>
          <span className={`text-xl font-extrabold text-blue-500`}>
            {product.price}$
          </span>
          <p className={`text-md font-semibold text-gray-500`}>
            {product.description}
          </p>
          <span className={`text-md font-semibold text-gray-900`}>
            Stock:
            <span className={`text-md font-semibold text-green-600 mx-2`}>
              {product.stock} Available
            </span>{" "}
          </span>
          <span className={`text-md font-semibold text-gray-900`}>
            Category: {categoryName}
          </span>
          <div className={`flex items-center gap-3`}>
            <span className={`text-md font-semibold text-gray-900`}>
              Quantity:
            </span>
            <button
              type="button"
              className={`w-7 h-7 bg-red-500 text-white text-lg font-bold rounded-sm
          flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleDecrement}
              disabled={displayQuantity <= 1}
            >
              -
            </button>
            <span
              className={`w-13 h-9 border border-black rounded-sm
          flex justify-center items-center`}
            >
              {displayQuantity}
            </span>
            <button
              type="button"
              className={`w-7 h-7 font-bold bg-green-500 text-white text-lg rounded-sm
          flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleIncrement}
              disabled={displayQuantity >= maxQuantity}
            >
              +
            </button>
          </div>
         <div className={`flex items-center gap-4`}>
           <button
             type="button"
             className={`text-white text-lg font-semibold rounded-md bg-blue-500 w-3/5 p-2 disabled:opacity-50 disabled:cursor-not-allowed`}
             onClick={handleAddToCart}
             disabled={maxQuantity < 1}
           >
             {isInCart ? "Add more to cart" : "Add To Cart"}
           </button>
           <button type="button" className={`text-white text-lg font-semibold rounded-md bg-gray-500 w-[40%] p-2`}>Buy Now</button>
         </div>
        </div>
      </div>
    </div>
  );
}
