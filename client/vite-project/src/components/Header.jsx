import { useSelector,useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  RiShoppingCart2Line,
  RiAccountCircleLine,
  RiMenuLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

import { toggleMenu } from "../store/headerSlice";
import { logout } from "../store/authSlice";

export default function Header() {
  const show = useSelector((state)=>state.header.show)
  const items = useSelector((state) => state.cart.items)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="relative">
      <div
        className={`flex justify-between items-center h-20 px-5 
    bg-[#1e293b] text-white
    
    `}
      >
        <span
          className={`
        text-lg font-semibold whitespace-nowrap
        lg:text-xl lg:font-bold`}
        >
          SMV-ECOMERCE
        </span>
        {/* Pages from md screens to .... */}
        <div className={``}>
          <ul
            className={`hidden
        md:flex items-center gap-5
            
            `}
          >
            <li>
              <Link className={`text-lg font-medium`} to={`/`}>
                Home
              </Link>
            </li>
            <li>
              <Link className={`text-lg font-medium`} to={`/categories`}>
                Categories
              </Link>
            </li>
            <li>
              <Link className={`text-lg font-medium`} to={`/products`}>
                Products
              </Link>
            </li>
          </ul>
        </div>
        <div
          className={`flex items-center 
      gap-3
        lg:gap-6 `}
        >
          <Link to='/cart' className={`relative`}>
            <RiShoppingCart2Line
              color="rgba(255,255,255,1)"
              className="text-2xl"
            />
            <span className={`absolute bottom-5 left-1 font-semibold`}>
               {cartCount > 99 ? "+99" : cartCount}
            </span>
          </Link >
          {isAuthenticated ? (
            <>
              <span className={`text-sm hidden md:block`}>{user?.name}</span>
              <button onClick={handleLogout} title="Logout">
                <RiLogoutBoxLine
                  color="rgba(255,255,255,1)"
                  className="text-2xl"
                />
              </button>
            </>
          ) : (
            <Link to='/login'>
              <RiAccountCircleLine
                color="rgba(255,255,255,1)"
                className="text-2xl"
              />
            </Link>
          )}
          <button onClick={() => dispatch(toggleMenu())}>
            <RiMenuLine
              color="rgba(255,255,255,1)"
              className={`text-2xl md:hidden`}
            />
          </button>

          {show && (
            <div
              className="md:hidden fixed inset-0 bg-black/15 z-10"
              onClick={() => dispatch(toggleMenu())}
            />
          )}
        </div>
      </div>

      {/* pages for sm screens  */}

      <div
        className={`absolute left-0 z-30
       transition-all duration-200 ease-in-out
      
       ${show ? "translate-x-0" : "-translate-x-full"}
        
        `}
      >
        <ul
          className={`
                flex flex-col  gap-2
                bg-[#1e293b] h-lvh p-5 w-48 text-white
        md:hidden
            
            `}
        >
          <li>
            <a className={`text-lg font-medium`} href="">
              Home
            </a>
          </li>
          <li>
            <a className={`text-lg font-medium`} href="">
              Categories
            </a>
          </li>
          <li>
            <a className={`text-lg font-medium`} href="">
              Products
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
