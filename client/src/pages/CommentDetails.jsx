import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { MdDelete } from "react-icons/md";
import { showToast } from "@/helper/showToast";

const CommentDetails = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/comment/get-all-comments`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          setComments(responseData.comments);
        } else {
          setError(responseData.message);
        }

      } catch (error) {
        showToast("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [refresh]);

    const handleDelete = async (commentid) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/comment/delete/${commentid}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          showToast("success", "comment deleted successfully");
          setRefresh(!refresh);
        } else {
          setError(responseData.message);
        }
      } catch (error) {
        showToast("Failed to delete comment");
      }
    };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of Comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Commented By</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>{comment?.blogid?.title}</TableCell>
                    <TableCell>{comment?.author?.name}</TableCell>
                    <TableCell>{comment?.comment}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDelete(comment._id)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">No Comments found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentDetails;
