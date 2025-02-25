import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try{
                const res = await axios.get("https://instaclone-r9bs.onrender.com/api/v1/user/suggested", {withCredentials:true});
                console.log("API Response:", res.data);
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            }catch(error){
                console.log('Error fetching suggested users:', error);
            }
        }
        fetchSuggestedUsers();
    }, []);
};
export default useGetSuggestedUsers;
