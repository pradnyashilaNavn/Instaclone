import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store=>store.auth); 
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value});
  }
  const signupHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try{
      setLoading(true);
      const res = await axios.post('https://instaclone-r9bs.onrender.com/api/v1/user/register', input, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      if(res.data.success){
        navigate("/login");
        toast.success(res.data.message);
      }
    }catch(error){
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(user){
      navigate("/");
    }
  }, [])


  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <form onSubmit={signupHandler} className="w-full sm:w-1/3 flex flex-col gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Header Section */}
            <div className="text-center mb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">LOGO</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-2">Welcome to Our Platform</h2>
                <p className="text-gray-600 mt-2 text-lg">Sign up and stay connected with your friends instantly!</p>
            </div>

            {/* Form Inputs */}
            <div>
                <Label className="text-lg font-medium text-gray-700">Username</Label>
                <Input type="text" name="username" value={input.username} onChange={changeEventHandler} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your username" />
            </div>

            <div>
                <Label className="text-lg font-medium text-gray-700">Email</Label>
                <Input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
            </div>

            <div>
                <Label className="text-lg font-medium text-gray-700">Password</Label>
                <Input type="password" name="password" value={input.password} onChange={changeEventHandler} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
            </div>
            {
              loading ? (
                <Button>
                  <Loader2 />Please wait...
                </Button>
              ) : (
                // Submit Button
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300">
                Signup
                </Button>
              )
            }
            <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
        </form>
    </div>

  );
};

export default Signup;
