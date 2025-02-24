import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/helper/showToast";
import slugify from "slugify";
import { useParams } from "react-router-dom";

const EditCategory = () => {
  const {category_id}= useParams();
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const categoryName = form.watch("name");
  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true });
      form.setValue("slug", slug);
    }
  });

  async function onSubmit(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/category/update/${category_id}`,
        {
          method:"PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        return;
      }

      showToast("success", responseData.message);
      form.reset();
    } catch (error) {
      console.error(error);
      showToast("error", "Not able to update the category, please try again");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-gray-700">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                        placeholder="Enter name"
                        {...field}
                      />
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-gray-700">Slug</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                        placeholder="Slug Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-lg transition"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;