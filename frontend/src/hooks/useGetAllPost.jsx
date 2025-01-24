import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });
        if(res.data.success){
          //console.log("Fetched posts:", res.data); // Debugging
          dispatch(setPosts(res.data.posts));
        } else {
          console.error("Failed to fetch posts:", res.data.message);
      }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    }
    fetchAllPost();
  }, []);
};
export default useGetAllPost;