import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { showToast } from "@/helper/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { RouteSignIn } from "@/helper/routeName";
import { Link } from "react-router-dom";
import CommentList from "./CommentList";

const Comment = ({ blogid,refreshKey,setRefreshKey}) => {
  const user = useSelector((state) => state.user);

  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(data) {
    try {
      const newValues = {
        ...data,
        blogid: blogid,
        author: user.user._id,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comment/add-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newValues),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        return;
      }
      form.reset();
      showToast("success", responseData.message);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      showToast("error", "Not able to add the comment, please try again");
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold">
        <FaComments className="text-violet-500" /> Comment
      </h4>
      {user && user.isLoggedIn ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"
          >
            {/* Comment Field */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-gray-700">Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Type your Comment" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-lg transition"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button asChild>
          <Link to={RouteSignIn}>Sign In</Link>
        </Button>
      )}

      {/* Comment List with Refresh Mechanism */}
      <div className="border-t mt-5 pt-5">
        <CommentList key={refreshKey} blogid={blogid} />
      </div>
    </div>
  );
};

export default Comment;
