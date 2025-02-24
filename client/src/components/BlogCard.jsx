import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegCalendarAlt } from "react-icons/fa";
import UserIcon from "../assets/UserIcon.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helper/routeName";

const BlogCard = ({ props }) => {
  return (
    <Link
      to={RouteBlogDetails(props.category.name, props.slug)}
      className="block w-full"
    >
      <Card className="p-4 sm:p-5 bg-white shadow-md sm:shadow-lg rounded-lg transition hover:shadow-xl sm:hover:shadow-2xl w-full max-w-md mx-auto">
        <CardContent className="flex flex-col space-y-3 sm:space-y-4">
          {/* Author Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={props.author.avatar || UserIcon}
                alt="Author"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
              />
              <span className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">
                {props.author.name}
              </span>
            </div>
            {props.author.role === "admin" && (
              <Badge className="bg-violet-500 text-white px-2 py-1 rounded-md text-[10px] sm:text-xs md:text-sm">
                Admin
              </Badge>
            )}
          </div>

          {/* Blog Image */}
          {props.featuredImage && (
            <div className="w-full">
              <img
                src={props.featuredImage}
                alt="Featured"
                className="w-full object-cover rounded-lg shadow aspect-[16/9] sm:aspect-[4/3]"
              />
            </div>
          )}

          {/* Blog Info */}
          <div className="space-y-1 sm:space-y-2">
            <p className="flex items-center gap-2 text-gray-600 text-[10px] sm:text-xs md:text-sm">
              <FaRegCalendarAlt className="text-blue-500" />
              <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
            </p>
            <h2 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
              {props.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;