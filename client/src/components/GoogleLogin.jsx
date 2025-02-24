import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helper/firebase";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/helper/showToast";
import { RouteIndex } from "@/helper/routeName";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/slice";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const GoogleResponse = await signInWithPopup(auth, provider);
      const user = GoogleResponse.user;
      const bodyData = {
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bodyData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        showToast("error", "Error ");
        return;
      }

      const responseData = await response.json();
      if (responseData.success !== true) {
        showToast("error", "Error ");
        return;
      }
      
      dispatch(setUser(responseData.user));
      navigate(RouteIndex);
      showToast("success", "Logged In Successfully.");
    } catch (error) {
        console.error(error);
      showToast("error", "Enter Valid Credentials.");
    }
  };
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      <FcGoogle />
      Continue With Google
    </Button>
  );
};

export default GoogleLogin;
