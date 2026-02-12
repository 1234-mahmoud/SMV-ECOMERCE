import React, { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/axiosConfig";
import { addCategory } from "../store/categorySlice";

export default function CreateCategory() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!name || !name.trim()) {
      alert("Please enter a category name");
      return;
    }

    setSuccessMessage("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (image) formData.append("image", image);
      const res = await api.post("/createCategory", formData);
      const newCategory = res.data?.category;
      if (newCategory) dispatch(addCategory(newCategory));
      setName("");
      setImage(null);
      setSuccessMessage("Category created successfully!");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white shadow-gray-400 shadow-xl p-5 rounded-md
    flex flex-col gap-3 w-full lg:w-120
    `}
    >
      <h1 className={`main-title font-bold my-5`}>Add New Category</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}
      <div className={`title block_box flex flex-col gap-1`}>
        <label htmlFor="" className={`font-semibold`}>Category Title</label>
        <input
          type="text"
          placeholder="Enter Product Title"
          value={name}
          className={`border border-gray-400 p-2 rounded-md indent-3`}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
     
      <div className="block_box">
        <label htmlFor="" className={`font-semibold`}>Category Images</label>
        <input
          type="file"
          className={`images border border-gray-400 p-5 rounded-md w-full h-40 border-dashed`}
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`p-2 rounded-md text-white font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Saving..." : "Save Category"}
      </button>
    </div>
  );
}
