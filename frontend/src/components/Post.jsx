import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {/* <Button variant='ghost' className='text-red-500 border border-red-500 hover:bg-red-50 py-2 px-4 rounded-lg transition duration-300 ease-in-out w-fit'>Unfollow</Button> */}
            <Button variant='ghost' className='text-red-500  hover:bg-red-50 py-2 px-4 rounded-lg transition duration-300 ease-in-out w-fit'>Unfollow</Button>
            <Button variant='ghost' className='cursor-pointer w-fit'>Add to favorites</Button>
            <Button variant='ghost' className='cursor-pointer w-fit'>Delete</Button>
          </DialogContent>
        </Dialog>
      </div>
      <img 
      className="rounded-sm my-2 w-full aspect-square object-cover"
      src="https://cdn.pixabay.com/photo/2022/10/18/17/00/night-7530755_640.jpg" alt="post_img" />
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
              <FaRegHeart size={'23px'} className="cursor-pointer hover:text-gray-600" />
              <MessageCircle onClick={()=> setOpen(true)} className="cursor-pointer hover:text-gray-600"/>
              <Send className="cursor-pointer hover:text-gray-600"/>
          </div>
          <Bookmark className="cursor-pointer hover:text-gray-600"/>
        </div>
        <span className="font-medium block mb-2">1k likes</span>
        <p>
          <span className="">username</span>caption
        </p>
        <span onClick={()=> setOpen(true)}>View all 10 comments</span>
        <CommentDialog open={open} setOpen={setOpen}/>
        <div className="flex items-center justify-center">
          <input 
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"/>
          {
            text && <span className="text-[#3BADF8]">Post</span>
          }
        </div>
    </div>
  );
};

export default Post;
