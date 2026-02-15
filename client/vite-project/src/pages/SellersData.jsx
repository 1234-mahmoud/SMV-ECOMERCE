import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/axiosConfig";

export default function SellersData() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  const [editingSeller, setEditingSeller] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get("/admin/sellers");
        setSellers(Array.isArray(res.data) ? res.data : []);
      } catch {
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const handleEditClick = (seller) => {
    setEditingSeller(seller);
    setEditName(seller.name);
    setEditEmail(seller.email);
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and email are required");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const res = await api.put(`/admin/sellers/${editingSeller._id}`, {
        name: editName.trim(),
        email: editEmail.trim(),
      });
      // Update local state
      setSellers((prev) =>
        prev.map((s) =>
          s._id === editingSeller._id
            ? { ...s, name: editName.trim(), email: editEmail.trim() }
            : s
        )
      );
      setEditingSeller(null);
      setEditName("");
      setEditEmail("");
    } catch (err) {
      setEditError(err.response?.data?.error || err.message || "Failed to update seller");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (seller) => {
    setDeleteConfirm(seller);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      await api.delete(`/admin/sellers/${deleteConfirm._id}`);
      setSellers((prev) => prev.filter((s) => s._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      setDeleteError(err.response?.data?.error || err.message || "Failed to delete seller");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <span className="block mb-3 font-semibold">Sellers Data</span>

      {/* Edit Modal */}
      {editingSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mb-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Seller</h2>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter seller name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
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
            <h2 className="text-xl font-bold mb-4">Delete Seller</h2>
            {deleteError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {deleteError}
              </div>
            )}
            <p className="mb-4">
              Are you sure you want to delete the seller "{deleteConfirm.name}"?
              This will also delete all their products. This action cannot be undone.
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

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* table */}
          <div className="w-full hidden md:block">
            <table className="w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Number of sellings</th>
                  <th className="py-3">Net Profit</th>
                  {isAdmin && <th className="py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sellers.length === 0 ? (
                  <tr className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                    <td colSpan={isAdmin ? 5 : 4} className="py-3 text-gray-500">No sellers found.</td>
                  </tr>
                ) : (
                  sellers.map((s) => (
                    <tr key={s._id} className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                      <td className="py-3">{s.name}</td>
                      <td className="py-3">{s.email}</td>
                      <td className="py-3">{s.productsCount ?? 0}</td>
                      <td className="py-3">—</td>
                      {isAdmin && (
                        <td className="py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditClick(s)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(s)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div
            className={`
              relative z-0 flex flex-col gap-3 shadow-2xl p-3 rounded-md overflow-x-hidden
              ${isOpen ? "w-0 opacity-0" : "w-full opacity-100"} 
              md:hidden`}
          >
            <span className="text-xl font-bold">Sellers Data</span>
            {sellers.length === 0 ? (
              <p className="text-gray-500">No sellers found.</p>
            ) : (
              sellers.map((s) => (
                <div key={s._id} className="border border-gray-200 rounded-md p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Name</span>
                    <span>{s.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Email</span>
                    <span>{s.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Number of sellings</span>
                    <span>{s.productsCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Net Profit</span>
                    <span>—</span>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold">Actions</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(s)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(s)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
