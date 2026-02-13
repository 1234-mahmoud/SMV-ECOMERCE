import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/axiosConfig";

export default function Users() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div>
      <span className="block mb-3 font-semibold">Users Data</span>

     

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
                  <th className="py-3">Number of purchases</th>
                  <th className="py-3">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                    <td colSpan={4} className="py-3 text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                      <td className="py-3">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">{u.numberOfPurchases ?? 0}</td>
                      <td className="py-3">{u.totalPrice ?? 0}</td>
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
            <span className="text-xl font-bold">Users Data</span>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              users.map((u) => (
                <div key={u._id} className="border border-gray-200 rounded-md p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Name</span>
                    <span>{u.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Email</span>
                    <span>{u.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-b-gray-400">
                    <span className="font-semibold">Number of purchases</span>
                    <span>{u.numberOfPurchases ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Total Price</span>
                    <span>{u.totalPrice ?? 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
