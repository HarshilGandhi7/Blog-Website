import { useFetch } from "@/hooks/useFetch";
import React from "react";
import Loading from "./Loading";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helper/routeName";

// RelatedBlogs Component
const RelatedBlogs = ({ props }) => {
  const category = props.category;
  const currBlog = props.currentBlog;
  const { data, loading, error } = useFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/blog/relatedBlog/${category}/${currBlog}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (loading) return <Loading />;

  return (
    <div className="border-t pt-5">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Related Blogs</h2>
      <div className="space-y-4">
        {data && data.blog.length > 0 ? (
          data.blog.map((blog) => {
            return (
              <Link key={blog._id} to={RouteBlogDetails(category, blog.slug)}>
                <div className="flex items-center gap-4 border-b pb-3">
                  <img
                    className="w-[120px] h-[80px] object-cover rounded-lg shadow-md"
                    src={blog.featuredImage}
                    alt={blog.title}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 leading-tight hover:underline cursor-pointer">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-600">No related blogs found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedBlogs;