import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { FaComment } from "react-icons/fa";

const CommentCount = ({ blogid, refreshKey, className }) => {
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/comment/comment-count/${blogid}`,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshKey]
  );

  return (
    <button 
      type="button"
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                  bg-gray-200 hover:bg-gray-300 transition-colors border border-gray-300
                  text-gray-700 font-semibold shadow-sm ${className}`}
    >
      <FaComment className="text-gray-600 text-lg flex-shrink-0" /> 
      <span className="text-gray-800">{loading ? "..." : data?.commentCount || 0}</span>
    </button>
  );
};

export default CommentCount;
