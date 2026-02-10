import { useSelector } from "react-redux";
export default function Orders() {

  const isOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div>
      <span className="block mb-3 font-semibold">My Orders</span>

      {/* table */}
      <div className="w-full hidden md:block">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr className="bg-[#f1f5f9]">
              <th className="py-3">Order ID</th>
              <th className="py-3">Date</th>
              <th className="py-3">Total</th>
              <th className="py-3">Status</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-center bg-white shadow-[0_0_25px_rgba(0,0,0,0.15)]">
              <td className="py-3">26373474627A</td>
              <td className="py-3">26-01-2026</td>
              <td className="py-3">3</td>
              <td className="py-3">
                <span className="bg-violet-200 rounded-lg px-5 py-1">
                  Pending
                </span>
              </td>
              <td className="py-3">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* table in the mobile screen and tablet only */}

      {/* Order Summary */}
      <div
        className={`
          relative z-0
        flex flex-col gap-3 shadow-2xl p-3 rounded-md overflow-x-hidden
          ${isOpen ? "w-0 opacity-0" : "w-full opacity-100"} 
          md:hidden`}
      >
        <span className={`text-xl font-bold`}>My Orders</span>
        <div
          className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
        >
          <span className={`font-semibold`}>Order ID</span>
          <span>26373474627A</span>
        </div>

        <div
          className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
        >
          <span className={`font-semibold`}>Date</span>
          <span>26-01-2026</span>
        </div>

        <div
          className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
        >
          <span className={`font-semibold`}>Total</span>
          <span>3</span>
        </div>

        <div
          className={`flex justify-between items-center py-2 border-b border-b-gray-400`}
        >
          <span className={`font-semibold`}>Status</span>
          <span className="bg-violet-200 rounded-lg px-5 py-1">Pending</span>
        </div>

        <div className={`flex justify-between items-center py-2`}>
          <span className={`font-semibold`}>Action</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
