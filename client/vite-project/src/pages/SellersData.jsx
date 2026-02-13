import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../utils/axiosConfig";

export default function SellersData() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <span className="block mb-3 font-semibold">Sellers Data</span>

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
                </tr>
              </thead>
              <tbody>
                {sellers.length === 0 ? (
                  <tr className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                    <td colSpan={4} className="py-3 text-gray-500">No sellers found.</td>
                  </tr>
                ) : (
                  sellers.map((s) => (
                    <tr key={s._id} className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                      <td className="py-3">{s.name}</td>
                      <td className="py-3">{s.email}</td>
                      <td className="py-3">{s.productsCount ?? 0}</td>
                      <td className="py-3">—</td>
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
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Net Profit</span>
                    <span>—</span>
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
