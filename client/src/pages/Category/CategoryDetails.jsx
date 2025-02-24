import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory } from "@/helper/routeName";
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
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showToast } from "@/helper/showToast";

const CategoryDetails = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // State variable to track changes

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category/all-category`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          setCategories(responseData.categoryData);
        } else {
          setError(responseData.message);
        }
      } catch (error) {
        showToast("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refresh]); 

  const handleDelete = async (categoryId,categoryName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/category/delete/${categoryId}/${categoryName}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        showToast("success", "Category deleted successfully");
        setRefresh(!refresh); 
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      showToast("Failed to delete category");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to={RouteAddCategory}>Add Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your Categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button asChild>
                          <Link to={`/category/update/${category._id}`}>
                            <FaEdit />
                          </Link>
                        </Button>
                        <Button  onClick={() => handleDelete(category._id, category.name)}>
                        <MdDelete />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">No Categories found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetails;