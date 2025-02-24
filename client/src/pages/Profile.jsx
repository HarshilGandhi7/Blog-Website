import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Loading from "@/components/Loading";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/helper/showToast";
import { useDispatch, useSelector } from "react-redux";
import UserIcon from "../assets/UserIcon.png";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import { setUser } from "@/redux/user/slice";

const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().min(3, { message: "Bio must be at least 3 characters" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  if (!user || !user.user) {
    return <Loading />;
  }

  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/user/get-user/${user.user._id}`,
    {
      method: "get",
      credentials: "include",
    }
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.userData.name,
        email: userData.userData.email,
        bio: userData.userData.bio,
      });
    }
  }, [userData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(formDataInput) {
    try {
      const formData = new FormData();
      if (avatarFile) formData.append("file", avatarFile);
      formData.append("data", JSON.stringify(formDataInput));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/update-user/${userData.userData._id}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        }
      );
      const resData = await response.json();
      if (!response.ok) {
        return showToast("error", resData.message);
      }
      dispatch(setUser(resData.user));
      showToast("success", "Profile updated successfully");
    } catch (error) {
      console.error(error);
      showToast("error", "An error occurred while updating your profile");
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="max-w-screen-md mx-auto p-6 shadow-md">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar className="cursor-pointer rounded-full w-28 h-28 aspect-square overflow-hidden">
            {userData?.userData?.avatar || avatarPreview ? (
              <AvatarImage
                src={avatarPreview || userData?.userData?.avatar }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = UserIcon;
                }}
                className="w-28 h-28 object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="w-28 h-28 bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center justify-center rounded-full text-4xl">
                {user?.user?.name ? user.user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 w-28 h-28 opacity-0 cursor-pointer"
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6 w-full"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio Field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      as="textarea"
                      placeholder="Tell us about yourself"
                      {...field}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a new password (if changing)"
                      {...field}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-lg transition duration-200"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default Profile;