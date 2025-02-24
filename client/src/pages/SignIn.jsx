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
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignUp } from "@/helper/routeName";
import { showToast } from "@/helper/showToast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/slice";
import GoogleLogin from "@/components/GoogleLogin";
 
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        showToast('error', 'Enter Valid Credentials');
        return;
      }

      const responseData = await response.json();
      if(responseData.success !== true) {
        showToast('error', 'Enter Valid Credentials');
        return;
      }
      console.log(responseData.user);
      dispatch(setUser(responseData.user));
      navigate(RouteIndex); 
      showToast('success', 'Logged In successfully.');
    } catch (error) {
      showToast('error', 'Enter Valid Credentials.');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Log In To Your Account
        </h2>
        <div className="mb-10">
           <GoogleLogin/>
           <div className='border-2 my-5 flex justify-center items-center'> 
            <span className='absolute bg-white text-sm'>Or</span>
           </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md transition"
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Sign-Up Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to={RouteSignUp}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-600">Back to home page? </span>
          <Link
            to={RouteIndex}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;