import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/sidebarSlice";
import { logout } from "../store/authSlice"; // عدّل المسار حسب مشروعك
import {
  RiArrowLeftCircleLine,
  RiLuggageCartFill,
  RiServiceFill,
  RiLogoutBoxRFill,
  RiGroup3Fill,
  RiProfileFill,
  RiAppsFill,
  RiProductHuntFill,
} from "react-icons/ri";

const links = [
  {
    to: "/orders",
    title: "Orders",
    icon: RiLuggageCartFill,
  },
  {
    to: "/users",
    title: "Users",
    icon: RiGroup3Fill,
  },
  {
    to: "/sellersdata",
    title: "Sellers",
    icon: RiProfileFill,
  },
  {
    to: "/categories",
    title: "Categories",
    icon: RiAppsFill,
  },
  {
    to: "/products",
    title: "Products",
    icon: RiProductHuntFill,
  },
];


export default function Dashboard({ comp }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  // 👇 وظيفة تسجيل الخروج
  const handleLogout = () => {
    dispatch(logout()); // Clear user Data
    navigate("/login"); // return to login page
  };

  return (
    <div
      className={`
        grid h-lvh md:h-[calc(100lvh-80px)]
        transition-all duration-500 ease-in-out
        ${isOpen ? "grid-cols-1 md:grid-cols-[250px_1fr]" : "grid-cols-[80px_1fr]"}
      `}
    >
      {/* Sidebar */}
      <div className="relative z-10 bg-[#1e293b]">
        {/* close/open button*/}
        <RiArrowLeftCircleLine
          color="rgba(255,255,255,1)"
          className={`
            text-4xl absolute top-5 cursor-pointer transition-all duration-500
            ${isOpen ? "right-5 rotate-0" : "right-1 rotate-180"}
          `}
          onClick={() => dispatch(toggleSidebar())}
        />

        {/* Links List*/}
        <div className="flex flex-col gap-5 p-5 mt-20 text-white font-semibold">
           {links.map((link, index) => {
    const Icon = link.icon;

    return (
      <Link
        key={index}
        to={link.to}
        className={`
          flex items-center gap-3 transition-colors duration-300
          hover:bg-white/10 rounded-md p-2 ${!isOpen && "justify-center"}
        `}
      >
        <Icon className="text-2xl shrink-0" />
        <span
          className={`
            transition-all duration-300 whitespace-nowrap overflow-hidden
            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
          `}
        >
          {link.title}
        </span>
      </Link>
    );
  })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 transition-colors duration-300
              hover:bg-white/10 rounded-md p-2 ${!isOpen && "justify-center"}
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
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`p-2 md:p-6 bg-gray-50 w-full
      md:container md:mx-auto
        ${isOpen ? "hidden md:block" : ""}
        `}
      >
        {comp}
      </div>
    </div>
  );
}
