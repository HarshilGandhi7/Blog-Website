import { showToast } from "@/helper/showToast";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";

const LikeCount = ({ blogid }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const user = useSelector((state) => state.user);
  const {
    data: blogLikeCount,
    isLoading,
    error,
  } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/like/get-like/${blogid}/${
      user?.user._id
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  useEffect(() => {
    setLikeCount(blogLikeCount?.totalLikes);
    setUserLike(blogLikeCount?.userLike);
  }, [blogLikeCount]);

  const handleLike = async () => {
    try {
      if (!user.isLoggedIn) {
        return showToast("error", "Please login to like the blog");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/like/add-like/${blogid}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ userid: user.user._id, blogid }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        showToast("error", "Something went wrong. Please try again");
      }
      const responseData = await response.json();
      setLikeCount(responseData.totalLikes);
      setUserLike(!userLike);
    } catch (error) {
      showToast("error", "Something went wrong. Please try again");
    }
  };
  return (
    <button
      onClick={handleLike}
      type="button"
      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors 
                     px-4 py-2 rounded-lg text-gray-700 font-semibold shadow-sm border border-gray-300"
    >
      {userLike ? (
        <FcLike className="w-5 h-5" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}

      <span className="text-gray-800">{isLoading ? "..." : likeCount}</span>
    </button>
  );
};

export default LikeCount;
