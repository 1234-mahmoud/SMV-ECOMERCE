import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct, deleteProduct, updateProductAdmin, deleteProductAdmin } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import api from "../utils/axiosConfig";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === "Seller";
  const sellerId = user?.id;

  // Category list for edit form
  const [categories, setCategories] = useState([]);

  // Edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    dispatch(fetchProducts(categoryId || null));
    fetchCategories();
  }, [dispatch, categoryId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  };

  // Check if a product belongs to the current seller
  const isOwnProduct = (product) => {
    return isSeller && product.sellerId === sellerId;
  };

  // Admin can edit/delete any product
  const isAdminUser = user?.role === "Admin";

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title || "");
    setEditDescription(product.description || "");
    setEditPrice(product.price?.toString() || "");
    setEditStock(product.stock?.toString() || "");
    setEditCategory(product.category?._id || product.category || "");
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim() || !editPrice || !editStock) {
      setEditError("All fields are required");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("description", editDescription.trim());
      formData.append("price", editPrice);
      formData.append("stock", editStock);
      if (editCategory) formData.append("category", editCategory);

      if (isAdminUser) {
        await dispatch(updateProductAdmin({ id: editingProduct._id, productData: formData })).unwrap();
      } else {
        await dispatch(updateProduct({ id: editingProduct._id, productData: formData })).unwrap();
      }
      setEditingProduct(null);
      // Refresh products
      dispatch(fetchProducts(categoryId || null));
    } catch (error) {
      setEditError(error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteConfirm(product);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await dispatch(deleteProduct(deleteConfirm._id)).unwrap();
      setDeleteConfirm(null);
    } catch (error) {
      setDeleteError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="section-margin bg-gray-50 p-4">
      <h1 className="main-title font-bold my-5">
        {categoryId ? "Products in this category" : "Featured Products"}
      </h1>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter product title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Price</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter stock quantity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            {deleteError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {deleteError}
              </div>
            )}
            <p className="mb-4">
              Are you sure you want to delete the product "{deleteConfirm.title}"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              
              {/* Show Edit/Delete buttons for sellers and admins, Add to Cart for regular users */}
              {(isSeller && isOwnProduct(p)) || isAdminUser ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="flex-1 p-2 bg-blue-500 rounded-md text-white font-semibold hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p)}
                    className="flex-1 p-2 bg-red-500 rounded-md text-white font-semibold hover:bg-red-600"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
