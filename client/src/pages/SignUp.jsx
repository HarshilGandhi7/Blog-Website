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
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RouteSignIn } from "@/helper/routeName";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/helper/showToast";
import GoogleLogin from "@/components/GoogleLogin";

const SignUp = () => {
  const navigate = useNavigate();

  const formSchema = z
    .object({
      name: z.string().nonempty(),
      email: z.string().email(),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
      }),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        showToast("error", "Please enter Valid credentials");
        return;
      }

      navigate(RouteSignIn);
      showToast("success", "Account created successfully.");
    } catch (error) {
      showToast("error", "An error occurred. Please enter valid credentials");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>
        <div className="mb-10">
           <GoogleLogin/>
           <div className='border-2 my-5 flex justify-center items-center'> 
            <span className='absolute bg-white text-sm'>Or</span>
           </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      placeholder="Enter your name"
                      {...field}
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
                      className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      placeholder="Enter your email"
                      {...field}
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
                      className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="w-full border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md text-lg transition"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Sign-In Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to={RouteSignIn}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
