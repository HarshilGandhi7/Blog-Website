import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showToast } from "@/helper/showToast";
import { RouteBlogAdd, RouteBlogEdit } from "@/helper/routeName";
import { useFetch } from "@/hooks/useFetch";
import { useState } from "react";

const BlogDetails = () => {
  const [refresh, setRefresh] = useState(false);
  const {
    data: blogData,
    error,
    isLoading,
  } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/all-blog`,
    {
      method: "GET",
      credentials: "include",
    },
    [refresh]
  );

  const handleDelete = async (BlogId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/blog/delete/${BlogId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        showToast("success", "Blog deleted successfully");
        setRefresh(!refresh);
      } else {
        showToast("error", responseData.message);
      }
    } catch (error) {
      showToast("error", "Failed to delete Blog");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-6xl bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-300">
        <CardHeader className="flex justify-between items-center p-6 bg-gray-200 border-b">
          {}
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
          >
            <Link to={RouteBlogAdd}>+ Add Blog</Link>
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto p-4">
          <Table className="w-full border border-gray-300 rounded-md">
            <TableCaption className="text-gray-600 mt-2">
              A list of Blogs.
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-gray-300 text-gray-800 font-semibold">
                <TableHead className="px-4 py-3">Author</TableHead>
                <TableHead className="px-4 py-3">Category</TableHead>
                <TableHead className="px-4 py-3">Title</TableHead>
                <TableHead className="px-4 py-3">Slug</TableHead>
                <TableHead className="px-4 py-3">Date</TableHead>
                <TableHead className="px-4 py-3 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {blogData?.blog?.length > 0 ? (
                blogData.blog.map((blog) => (
                  <TableRow
                    key={blog._id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <TableCell className="px-4 py-3 text-gray-900">{blog.author?.name || "Unknown"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-800">{blog.category?.name || "Uncategorized"}</TableCell>
                    <TableCell className="px-4 py-3 font-medium">{blog.title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700">{blog.slug}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-3 flex justify-center gap-3">
                      <Link to={RouteBlogEdit(blog._id)} className="flex">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md flex items-center">
                          <FaEdit size={18} />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-md flex items-center"
                      >
                        <MdDelete size={20} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-600 font-medium">
                    No Blogs Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
