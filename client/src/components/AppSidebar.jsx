import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteBlogUsers,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUsers,
} from "@/helper/routeName";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoHome } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaCommentDots } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import BlogDetails from "@/pages/Blog/BlogDetails";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";
import { TbLogs } from "react-icons/tb";

export function AppSidebar() {
  const user = useSelector((state) => state.user);
  const { data: categoryData } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/category/all-category`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return (
    <Sidebar className="fixed left-0 top-0 h-screen w-64 bg-white shadow-md flex flex-col">
      <SidebarHeader className="bg-white flex justify-center py-4 border-b"></SidebarHeader>
      {/* Sidebar Content (Menu Items) */}
      <SidebarContent className="bg-white px-2 py-4 mt-6">
        <SidebarGroup>

          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <Link to={RouteIndex}>
                <SidebarMenuButton>
                  <IoHome />
                  <span>Home</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Blog (only if user is logged in) */}
            {user?.isLoggedIn && (
              <SidebarMenuItem>
                <Link to={RouteBlogUsers}>
                  <SidebarMenuButton>
                    <GrBlog />
                    <span>Blogs</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}

            {/* Admin-only section  */}
            {user?.isLoggedIn && user?.user?.role === "admin" && (
              <>
                <SidebarMenuItem>
                  <Link to={RouteCategoryDetails}>
                    <SidebarMenuButton>
                      <BiCategory />
                      <span>Category</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link to={RouteCommentDetails}>
                    <SidebarMenuButton>
                      <FaCommentDots />
                      <span>Comments</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                <Link to={RouteBlog}>
                  <SidebarMenuButton>
                    <TbLogs  />
                    <span>All Blogs</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link to={RouteUsers}>
                    <SidebarMenuButton>
                      <FaRegUserCircle />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {categoryData?.categoryData?.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-semibold text-gray-800 px-4 py-2 border-b border-gray-300">
              Categories
            </SidebarGroupLabel>
            <SidebarMenu className="p-2">
              {categoryData.categoryData.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <Link to={RouteBlogByCategory(category.slug)}>
                    <SidebarMenuButton>
                      <FaRegCircleDot />
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
