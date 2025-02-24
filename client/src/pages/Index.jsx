import React from "react";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import BlogCard from "@/components/BlogCard";

const Index = () => {
  const { data: blogData, error, isLoading } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/all-blog`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData && blogData.blog.length > 0 ? (
          blogData.blog.map((blog) => (
            <div key={blog._id} className="flex justify-center">
              <BlogCard props={blog} />
            </div>
          ))
        ) : (
          <div className="col-span-full h-40 flex justify-center items-center text-gray-600 text-lg">
            Data Not Found
          </div>
        )}
      </div>
    </div>
  );
};


export default Index;