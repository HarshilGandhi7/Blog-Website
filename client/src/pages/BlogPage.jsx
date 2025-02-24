import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { decode } from "he";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Comment from "@/components/Comment";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlogs from "@/components/RelatedBlogs";
import UserIcon from "@/assets/UserIcon.png";

const BlogPage = () => {
  const { blog, category } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, error, isLoading } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/get-blog/${blog}`,
    {
      method: "GET",
      credentials: "include",
    },
    [blog, category]
  );

  if (isLoading) return <Loading />;

  return (
    <div className="w-full bg-gray-100 py-10 px-4 md:px-6 lg:px-10">
      {data?.data && (
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10">
          {/* Blog Content (70%) */}
          <div className="w-full md:w-[70%] bg-white rounded-lg shadow-lg p-6">
            
            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {data.data.title}
            </h1>

            {/* Like & Comment Section (Moved Below Title) */}
            <div className="flex items-center gap-6 mt-4">
              <LikeCount blogid={data.data._id} className="action-button like-button" />
              <CommentCount key={refreshKey} blogid={data.data._id} className="action-button" />
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 border-b pb-4 mt-5">
              <Avatar className="w-12 h-12 md:w-14 md:h-14">
                <AvatarImage
                  src={data.data.author.avatar || UserIcon}
                  className="w-full h-full rounded-full border"
                />
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {data.data.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  Published {formatDistanceToNow(new Date(data.data.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            {data.data.featuredImage && (
              <div className="my-6">
                <img
                  src={data.data.featuredImage}
                  className="rounded-lg w-full max-h-[400px] md:max-h-[500px] object-cover shadow-md"
                  alt="Featured"
                />
              </div>
            )}

            {/* Blog Content */}
            <div
              className="max-w-full leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: decode(data.data.blogContent) }}
            ></div>

            {/* Comment Section */}
            <div className="border-t mt-5 pt-5">
              <Comment
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
                blogid={data.data._id}
              />
            </div>
          </div>

          {/* Related Blogs Sidebar (30%) */}
          <div className="w-full md:w-[30%] p-5 bg-white rounded-lg shadow-lg">
            <RelatedBlogs props={{ category, currentBlog: blog }} key={blog} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
