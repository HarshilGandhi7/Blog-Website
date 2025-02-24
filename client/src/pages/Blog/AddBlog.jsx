import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/helper/showToast";
import slugify from "slugify";
import { useFetch } from "@/hooks/useFetch";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

const AddBlog = () => {
  const user = useSelector((state) => state.user);
  const { data: categoryData } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/category/all-category`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogContent: z
      .string()
      .min(3, "Blog Content must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      slug: "",
      blogContent: "",
    },
  });

  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [featureImagePreview, setFeatureImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const BlogName = form.watch("title");
    if (BlogName) {
      const slug = slugify(BlogName, { lower: true });
      form.setValue("slug", slug);
    }
  }, [form.watch("title")]);

  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeatureImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeatureImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data) {
    setIsLoading(true);
    const newValues = { ...data, author: user?.user._id };
    const formData = new FormData();
    if (featureImageFile) formData.append("file", featureImageFile);
    formData.append("data", JSON.stringify(newValues));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/blog/add`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        setIsLoading(false);
        return;
      }
      showToast("success", "Blog added successfully");
      form.reset();
      setFeatureImageFile(null);
      setFeatureImagePreview(null);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to add blog, please try again");
      setIsLoading(false);
    }
  }
  if(isLoading) return <Loading/>
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Title</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                        placeholder="Enter blog Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blog Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData?.categoryData?.length > 0 &&
                            categoryData.categoryData.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="pointer-events-none bg-gray-200"
                        placeholder="Slug Address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Feature Image Field */}
              <FormItem>
                <FormLabel className="text-gray-700">Feature Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeatureImageChange}
                  />
                </FormControl>
                {featureImagePreview && (
                  <img
                    src={featureImagePreview}
                    alt="Feature Preview"
                    className="mt-4 w-40 h-40 object-cover rounded-md shadow"
                  />
                )}
              </FormItem>

              {/* Blog Content Field */}
              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Content</FormLabel>
                    <FormControl>
                      <Editor
                        initialData={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-lg transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
