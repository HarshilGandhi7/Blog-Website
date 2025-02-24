import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  RouteAddCategory,
  RouteBlog,
  RouteBlogAdd,
  RouteCategoryDetails,
  RouteEditCategory,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
  RouteSignUp,
  RouteBlogEdit,
  RouteBlogDetails,
  RouteBlogByCategory,
  RouteSearch,
  RouteCommentDetails,
  RouteUsers,
  RouteBlogUsers,
} from "./helper/routeName";
import Layout from "./Layouts/Layout";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import EditCategory from "./pages/Category/EditCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import AddBlog from "./pages/Blog/AddBlog";
import BlogDetails from "./pages/Blog/BlogDetails";
import EditBlogs from "./pages/Blog/EditBlogs";
import BlogPage from "./pages/BlogPage";
import CategoryBlog from "./pages/Blog/CategoryBlog";
import SearchResult from "./pages/SearchResult";
import CommentDetails from "./pages/CommentDetails";
import UserDetails from "./pages/UserDetails";
import AuthRouteProtection from "./components/AuthRouteProtection";
import AuthRouteProtectionAdmin from "./components/AuthRouteProtectionAdmin";
import UserBlogDetails from "./pages/Blog/UserBlogDetails";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />

            {/* Blog */}
            <Route path={RouteBlogDetails()} element={<BlogPage />} />
            <Route path={RouteBlogByCategory()} element={<CategoryBlog />} />
            <Route path={RouteSearch()} element={<SearchResult />} />

            {/* Login Route protection */}
            <Route element={<AuthRouteProtection />}>
              <Route path={RouteProfile} element={<Profile />} />
              <Route path={RouteBlogAdd} element={<AddBlog />} />
              <Route path={RouteBlogEdit()} element={<EditBlogs />} />
              <Route path={RouteBlogUsers} element={<UserBlogDetails />} />
            </Route>

            {/* Admin Route protection */}
            <Route element={<AuthRouteProtectionAdmin />}>
              <Route path={RouteCommentDetails} element={<CommentDetails />} />
              <Route path={RouteBlog} element={<BlogDetails />} /> 
              <Route path={RouteEditCategory()} element={<EditCategory />} />
              <Route path={RouteAddCategory} element={<AddCategory />} />
              <Route
                path={RouteCategoryDetails}
                element={<CategoryDetails />}
              />
              <Route path={RouteUsers} element={<UserDetails />} />
            </Route>
          </Route>

          <Route path={RouteSignIn} element={<SignIn />} />
          <Route path={RouteSignUp} element={<SignUp />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
