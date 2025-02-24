import React from "react";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import {
  RouteBlogAdd,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
} from "@/helper/routeName";
import { useDispatch, useSelector } from "react-redux";
import { IoMenuOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserIcon from "@/assets/userIcon.png";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { removeUser } from "@/redux/user/slice";
import { showToast } from "@/helper/showToast";
import { useSidebar } from "./ui/sidebar";

const capitalizeName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleLogOut = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        showToast("error", "Error in Logging Out");
        return;
      }

      const responseData = await response.json();
      if (responseData.success !== true) {
        showToast("error", "Error in Logging Out");
        return;
      }
      dispatch(removeUser());
      navigate(RouteSignIn);
      showToast("success", "Logged Out successfully.");
    } catch (error) {
      showToast("error", "Error in Logging Out.");
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex justify-between items-center bg-white shadow-md px-5 border-b z-50">
      <button
        onClick={toggleSidebar}
        className="flex justify-center items-center text-2xl text-gray-700 md:hidden"
      >
        <IoMenuOutline />
      </button>
      <Link to={RouteIndex} className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          width={120}
          className="h-12 object-contain"
        />
      </Link>
      <div className="w-[500px]">
        <SearchBox />
      </div>
      <div className="flex items-center gap-4">
        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full">
            <Link
              to={RouteSignIn}
              className="rounded-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <FaSignInAlt /> Sign In
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                {user?.user?.avatar ? (
                  <AvatarImage
                    src={user.user.avatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = UserIcon;
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center justify-center">
                    {user?.user?.name
                      ? user.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col items-start p-2">
                <p className="font-semibold">
                  {capitalizeName(user?.user?.name)}
                </p>
                <p className="text-sm text-gray-500">{user?.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={RouteProfile}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
                >
                  <FaRegCircleUser /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={RouteBlogAdd}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 transition"
                >
                  <FaPlus /> Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 transition"
                >
                  <FaSignInAlt /> Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Topbar;
