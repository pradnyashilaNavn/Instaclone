import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
    
  return (
    <div>
      { 
      //[1,2,3,4].map((item, index) => <Post key={index}/>)
      posts.map((post) => <Post key={post._id} post={post} />)

      //posts && posts.length > 0 ? (
      //  posts.map((post) => <Post key={post._id} post={post} />)
      //) : (
       // <p>No posts available.</p>
      //)
      }
    </div>
  );
};

export default Posts;
