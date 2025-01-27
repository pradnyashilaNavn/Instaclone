import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {withCredentials:true});
      if(res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } 
  }

  const sidebarHandler = (textType) => {
    // alert(textType);
    if( textType === "Logout"){
      logoutHandler();
    }else if( textType === "Create") {
      setOpen(true);
    }else if( textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    }else if(textType === "Home") {
      navigate("/");
    }
  }
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className='w-6 h-6'>
          <AvatarImage src={user?.profilePicture} alt="@shadcn"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  return (
    <div className="flex flex-col items-center justify-between p-4 space-y-4 border-r border-gray-300 h-screen w-full">
      <div className="flex flex-col w-full">
        <h1 className="text-lg font-semibold mb-4">Logo Instagram</h1>
        <div className="flex flex-col gap-2 w-full">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 transition-all duration-300 w-full"
            >
              {item.icon}
              <span className="hidden md:inline">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
