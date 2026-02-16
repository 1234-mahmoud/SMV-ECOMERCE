import React, { useEffect, useState } from "react";
import Analatics from "../components/Analatics";
import CreateCategory from "../components/CreateCategory";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, updateCategory, deleteCategory } from "../store/categorySlice";
import api from "../utils/axiosConfig";

export default function Admin() {
  const dispatch = useDispatch();
  const { list: categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);

  // Category edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Category delete state
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Seller edit state
  const [editingSeller, setEditingSeller] = useState(null);
  const [editSellerName, setEditSellerName] = useState("");
  const [editSellerEmail, setEditSellerEmail] = useState("");
  const [editSellerError, setEditSellerError] = useState("");
  const [editSellerLoading, setEditSellerLoading] = useState(false);

  // Seller delete state
  const [deleteSellerConfirm, setDeleteSellerConfirm] = useState(null);
  const [deleteSellerLoading, setDeleteSellerLoading] = useState(false);
  const [deleteSellerError, setDeleteSellerError] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    fetchSellers();
  }, [dispatch]);

  const fetchSellers = async () => {
    try {
      const res = await api.get("/admin/sellers");
      setSellers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSellers([]);
    } finally {
      setSellersLoading(false);
    }
  };

  // Category handlers
  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditImage(null);
    setEditError("");
  };

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError("Category name is required");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editImage) {
        formData.append("image", editImage);
      }
      
      await api.put(`/admin/categories/${editingCategory._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      dispatch(fetchCategories());
      setEditingCategory(null);
      setEditName("");
      setEditImage(null);
    } catch (error) {
      setEditError(error.response?.data?.error || error.message || "Failed to update category");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCategoryClick = (category) => {
    setDeleteConfirm(category);
    setDeleteError("");
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await dispatch(deleteCategory(deleteConfirm._id)).unwrap();
      setDeleteConfirm(null);
    } catch (error) {
      setDeleteError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Seller handlers
  const handleEditSellerClick = (seller) => {
    setEditingSeller(seller);
    setEditSellerName(seller.name);
    setEditSellerEmail(seller.email);
    setEditSellerError("");
  };

  const handleEditSellerSubmit = async (e) => {
    e.preventDefault();
    if (!editSellerName.trim() || !editSellerEmail.trim()) {
      setEditSellerError("Name and email are required");
      return;
    }

    setEditSellerLoading(true);
    setEditSellerError("");

    try {
      const res = await api.put(`/admin/sellers/${editingSeller._id}`, {
        name: editSellerName.trim(),
        email: editSellerEmail.trim(),
      });
      setSellers((prev) =>
        prev.map((s) =>
          s._id === editingSeller._id
            ? { ...s, name: editSellerName.trim(), email: editSellerEmail.trim() }
            : s
        )
      );
      setEditingSeller(null);
      setEditSellerName("");
      setEditSellerEmail("");
    } catch (err) {
      setEditSellerError(err.response?.data?.error || err.message || "Failed to update seller");
    } finally {
      setEditSellerLoading(false);
    }
  };

  const handleDeleteSellerClick = (seller) => {
    setDeleteSellerConfirm(seller);
    setDeleteSellerError("");
  };

  const handleDeleteSellerConfirm = async () => {
    if (!deleteSellerConfirm) return;

    setDeleteSellerLoading(true);
    setDeleteSellerError("");

    try {
      await api.delete(`/admin/sellers/${deleteSellerConfirm._id}`);
      setSellers((prev) => prev.filter((s) => s._id !== deleteSellerConfirm._id));
      setDeleteSellerConfirm(null);
    } catch (err) {
      setDeleteSellerError(err.response?.data?.error || err.message || "Failed to delete seller");
    } finally {
      setDeleteSellerLoading(false);
    }
  };

  return (
    <div className="flex gap-10 flex-col">


      <Analatics />
    
<div className="flex justify-center items-center flex-col gap-10">
      <CreateCategory />
  <div className={`flex  w-full items-center gap-10 flex-col xl:flex-row`}>
  {/* Categories Management */}
      <div className="bg-white w-full p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
        
        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Edit Category</h3>
              {editError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {editError}
                </div>
              )}
              <form onSubmit={handleEditCategorySubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Category Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-400 p-2 rounded-md"
                    placeholder="Enter category name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Category Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="w-full border border-gray-400 p-2 rounded-md"
                  />
                  {editingCategory?.image && (
                    <p className="text-sm text-gray-500 mt-1">Current image will be kept if no new image is selected</p>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
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

        {/* Delete Category Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Delete Category</h3>
              {deleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {deleteError}
                </div>
              )}
              <p className="mb-4">
                Are you sure you want to delete the category "{deleteConfirm.name}"?
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
                  onClick={handleDeleteCategoryConfirm}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List */}
        {categoriesLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={2} className="py-3 text-gray-500">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c._id} className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                      <td className="py-3 px-4">{c.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategoryClick(c)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryClick(c)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sellers Management */}
      <div className="bg-white w-full p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Manage Sellers</h2>

        {/* Edit Seller Modal */}
        {editingSeller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Edit Seller</h3>
              {editSellerError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {editSellerError}
                </div>
              )}
              <form onSubmit={handleEditSellerSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={editSellerName}
                    onChange={(e) => setEditSellerName(e.target.value)}
                    className="w-full border border-gray-400 p-2 rounded-md"
                    placeholder="Enter seller name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={editSellerEmail}
                    onChange={(e) => setEditSellerEmail(e.target.value)}
                    className="w-full border border-gray-400 p-2 rounded-md"
                    placeholder="Enter seller email"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingSeller(null)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSellerLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {editSellerLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Seller Modal */}
        {deleteSellerConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Delete Seller</h3>
              {deleteSellerError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {deleteSellerError}
                </div>
              )}
              <p className="mb-4">
                Are you sure you want to delete the seller "{deleteSellerConfirm.name}"?
                This will also delete all their products. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteSellerConfirm(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSellerConfirm}
                  disabled={deleteSellerLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                >
                  {deleteSellerLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sellers List */}
        {sellersLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Products</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={4} className="py-3 text-gray-500">No sellers found.</td>
                  </tr>
                ) : (
                  sellers.map((s) => (
                    <tr key={s._id} className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                      <td className="py-3 px-4">{s.name}</td>
                      <td className="py-3 px-4">{s.email}</td>
                      <td className="py-3 px-4">{s.productsCount ?? 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSellerClick(s)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSellerClick(s)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </div>
</div>
    
    </div>
  );
}
