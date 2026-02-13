import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(categoryId || null));
  }, [dispatch, categoryId]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="section-margin bg-gray-50 p-4">
      <h1 className="main-title font-bold my-5">
        {categoryId ? "Products in this category" : "Featured Products"}
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
      <div className="flex justify-center items-center gap-5 flex-wrap">
        {products.map((p) => (
          <div
            className={`bg-white rounded-md p-3 flex flex-col gap-3 basis-75 shadow-gray-400 shadow-xl
              h-90
              `}
            key={p._id}
          >
            <img
              src={p.images && p.images.length > 0 ? `http://localhost:3000${p.images[0]}` : "/fallback.jpg"}
              alt={p.title}
              className={`w-full h-49 shrink-0 object-contain rounded-md
                transition-all ease-in-out duration-300
                md:hover:scale-110
                `}
            />
            <span className="text-lg font-semibold">{p.title}</span>
            <span className="text-md font-bold text-indigo-500">{p.price}$</span>
            <button
              className="p-2 bg-blue-500 rounded-md text-white font-semibold"
              onClick={() => dispatch(addToCart(p))}
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
