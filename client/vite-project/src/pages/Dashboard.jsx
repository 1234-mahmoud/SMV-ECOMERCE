import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/sidebarSlice";
import {
  RiArrowLeftCircleLine,
  RiLuggageCartFill,
  RiServiceFill,
  RiLogoutBoxRFill,
} from "react-icons/ri";
import Orders from "../components/Orders";
export default function Dashboard() {
const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);// it's current val = false


  return (
    <div
      className={` 
        grid h-lvh md:h-[calc(100lvh-80px)]
      transition-all duration-500 ease-in-out
      ${isOpen ? "grid-cols-[250px_1fr]" : "grid-cols-[80px_1fr]"}`}
    >
      <div
        className={`relative z-10 bg-[#1e293b]
        `}
      >
        <RiArrowLeftCircleLine
          color="rgba(255,255,255,1)"
          className={`
            
          text-4xl text-white absolute top-5
          cursor-pointer transition-all duration-500
          ${isOpen ? "right-5 rotate-0" : "right-1 rotate-180"}
        `}
          onClick={() => dispatch(toggleSidebar())}
        />

        <div className="flex flex-col gap-5 p-5 mt-20 text-white font-semibold">
          <Link
            to=""
            className={`
      flex items-center gap-3
      transition-colors duration-300
      hover:bg-white/10 rounded-md p-2
      ${!isOpen && "justify-center"}
    `}
          >
            <RiLuggageCartFill className="text-2xl shrink-0" />
            <span
              className={`
        transition-all duration-300 whitespace-nowrap overflow-hidden
        ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
      `}
            >
              My Orders
            </span>
          </Link>

          <Link
            to=""
            className={`
      flex items-center gap-3
      transition-colors duration-300
      hover:bg-white/10 rounded-md p-2
      ${!isOpen && "justify-center"}
    `}
          >
            <RiServiceFill className="text-2xl shrink-0" />
            <span
              className={`
        transition-all duration-300 whitespace-nowrap overflow-hidden
        ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
      `}
            >
              Wishlist
            </span>
          </Link>

          <Link
            to=""
            className={`
      flex items-center gap-3
      transition-colors duration-300
      hover:bg-white/10 rounded-md p-2
      ${!isOpen && "justify-center"}
    `}
          >
            <RiLogoutBoxRFill className="text-2xl shrink-0" />
            <span
              className={`
        transition-all duration-300 whitespace-nowrap overflow-hidden
        ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
      `}
            >
              Logout
            </span>
          </Link>
        </div>
      </div>
      <div className="p-6 bg-gray-50 w-full">
<Orders/>


</div>
    </div>
  );
}
