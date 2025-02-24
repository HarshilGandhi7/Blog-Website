import { useFetch } from "@/hooks/useFetch";
import React from "react";
import Loading from "./Loading";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import UserIcon from "../assets/UserIcon.png";
import moment from "moment";

const CommentList = ({ blogid }) => {
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/comment/get-comments/${blogid}`,
    { method: "GET", credentials: "include" }
  );

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        Failed to load comments. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto p-5">
      <h4 className="text-3xl font-bold text-gray-800 mb-5">
        {data && data.comments.length} {data && data.comments.length === 1 ? "Comment" : "Comments"}
      </h4>

      {/* Display Comments */}
      <div className="space-y-5">
        {data && data.comments.length > 0 ? (
          data.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Avatar className="w-14 h-14 mx-auto sm:mx-0">
                <AvatarImage src={comment?.author?.avatar || UserIcon} alt="Author's Avatar" className="rounded-full" />
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-lg text-gray-800">{comment?.author?.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    {moment(comment?.createdAt).fromNow()}
                  </p>
                </div>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">{comment?.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
