import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

export default function Products() {
  const [searchParams] = useSearchParams();//used to deal with query in the url 
  const categoryId = searchParams.get("category");
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", price: "", image: null });

  const notCustomer = user?.role === "Seller" || user?.role === "seller" || user?.role === "Admin" || user?.role === "admin";

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
              h-90 relative
              `}
            key={p._id}
          >
            <Link to={`/products/${p._id}`} className="block cursor-pointer">
              <img
                src={p.images && p.images.length > 0 ? `http://localhost:3000${p.images[0]}` : "/fallback.jpg"}
                alt={p.title}
                className={`w-full h-49 shrink-0 object-contain rounded-md
                  transition-all ease-in-out duration-300
                  md:hover:scale-110
                  `}
              />
            </Link>
            <span className="text-lg font-semibold">{p.title}</span>
            <span className="text-md font-bold text-indigo-500">{p.price}$</span>
            {notCustomer ? (
              <div className="flex gap-2">
                <button
                  className="p-2 bg-green-500 rounded-md text-white font-semibold flex-1"
                  onClick={() => {
                    setEditingProduct(p._id);
                    setEditFormData({ title: p.title, price: p.price, image: null });
                  }}
                >
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 rounded-md text-white font-semibold flex-1"
                  onClick={() => dispatch(deleteProduct(p._id))}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                className="p-2 bg-blue-500 rounded-md text-white font-semibold"
                onClick={() => dispatch(addToCart(p))}
              >
                Add To Cart
              </button>
            )}
            {editingProduct === p._id && (
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-white/95 backdrop-blur-sm rounded-md p-4 flex flex-col gap-3 z-10 overflow-auto">
                <h3 className="font-bold text-lg text-center text-gray-700">Edit Product</h3>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.files[0] })}
                    className="border border-gray-300 p-2 rounded-md text-sm w-full"
                  />
                  {p.images && p.images.length > 0 && (
                    <img 
                      src={`http://localhost:3000${p.images[0]}`} 
                      alt="Current" 
                      className="w-full h-24 object-contain rounded-md mt-1"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
                  placeholder="Title"
                />
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
                  placeholder="Price"
                />
                <div className="flex gap-2 mt-auto">
                  <button
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm font-medium transition-colors flex-1"
                    onClick={() => {
                      const formData = new FormData();
                      formData.append('title', editFormData.title);
                      formData.append('price', editFormData.price);
                      if (editFormData.image) {
                        formData.append('image', editFormData.image);
                      }
                      dispatch(updateProduct({ productId: p._id, productData: formData }));
                      setEditingProduct(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="p-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white text-sm font-medium transition-colors flex-1"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
