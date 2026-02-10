import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../store/productSlice";

export default function CreateProduct() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.products);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!title || !description || !price || !stock) {
      alert("Please fill in all required fields");
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      alert("Price and stock must be positive numbers");
      return;
    }

    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    formData.append("category", category);
    if (image) formData.append("image", image);

    const result = await dispatch(createProduct(formData));

    if (createProduct.fulfilled.match(result)) {
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);
      setSuccessMessage("Product created successfully!");
    }
  };

  return (
    <div
      className={`bg-white shadow-gray-400 shadow-xl p-5 rounded-md
    flex flex-col gap-3
    `}
    >
      <h1 className={`main-title font-bold my-5`}>Add New Product</h1>
      
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
        <label htmlFor="" className={`font-semibold`}>Product Title</label>
        <input
          type="text"
          placeholder="Enter Product Title"
          value={title}
          className={`border border-gray-400 p-2 rounded-md indent-3`}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={`desc block_box flex flex-col gap-1`}>
        <label htmlFor="" className={`font-semibold`}>Product Description</label>
        <textarea
          placeholder="Product Description"
          className={`border border-gray-400 p-2 rounded-md indent-3`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={`price_stock  flex gap-5 flex-col md:flex-row md:gap-10`}>
        <div className="w-full block_box">
          <label htmlFor="" className={`font-semibold`}>Price</label>
          <input
            type="number"
            placeholder="0.00"
            className={`border border-gray-400 p-2 rounded-md indent-3 w-full`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="w-full block_box">
          <label htmlFor="" className={`font-semibold`}>Stock Quantity</label>
          <input
            type="number"
            placeholder="0"
            className={`border border-gray-400 p-2 rounded-md indent-3 w-full`}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>
      <div className={`cat block_box`}>
        <label htmlFor="" className={`font-semibold`}>Category</label>
        <select
          value={category}
          className={`border border-gray-400 p-2 rounded-md indent-3 w-full`}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="block_box">
        <label htmlFor="" className={`font-semibold`}>Product Images</label>
        <input
          type="file"
          className={`images border border-gray-400 p-5 rounded-md w-full h-40 border-dashed`}
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className={`p-2 rounded-md text-white font-semibold ${
          status === "loading" 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {status === "loading" ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
