import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../utils/axiosConfig";
import { fetchCategories, updateCategory, deleteCategory } from "../store/categorySlice";

export default function Categories() {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError("Category name is required");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      await dispatch(updateCategory({ id: editingCategory._id, name: editName.trim() })).unwrap();
      setEditingCategory(null);
      setEditName("");
    } catch (error) {
      setEditError(error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
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

  return (
    <div className={`section-margin bg-gray-50 p-4 `}>
      <h1 className={`main-title font-bold my-5`}>Popular Categories</h1>
      
      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditSubmit}>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Category</h2>
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

      <div className={`flex justify-center items-center gap-5 flex-wrap`}>
        {loading ? (
          <span className={`text-lg font-semibold`}>Loading...</span>
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className={`bg-white rounded-md p-3 flex flex-col justify-center items-center gap-3 basis-80 h-75 
                shadow-gray-400 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer relative
                `}
            >
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(c);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(c);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              )}
              <Link to={`/products?category=${c._id}`} className="flex flex-col items-center">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
