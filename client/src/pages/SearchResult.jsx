import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/search?q=${q}`,
    {
      method: "GET",
      credentials: "include",
    },
    [q]
  );

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Title */}
      <div className="flex justify-center items-center my-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
          <BiSearch className="text-3xl sm:text-4xl text-blue-600" />
          <span className="capitalize">Search Results for: {q}</span>
        </h1>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.blog.length > 0 ? (
          data.blog.map((blog) => <BlogCard key={blog._id} props={blog} />)
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg">
            No blogs found for "{q}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
