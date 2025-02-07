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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth);
  const {likeNotification} = useSelector(store=>store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://instaclone-r9bs.onrender.com/api/v1/user/logout", {withCredentials:true});
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
    }else if(textType === "Messages") {
      navigate("/chat");
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
              {
                item.text === "Notifications" && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size='icon' className='rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6'>{likeNotification.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {
                          likeNotification.length === 0 ? (<p>No new notification</p>) : (
                            likeNotification.map((notification) => {
                              return (
                                <div key={notification.userId} className="flex items-center gap-2 my-2">
                                  <Avatar>
                                    <AvatarImage src={notification.userDetails?.profilePicture}/>
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                </div>
                              )
                            })
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              }
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
