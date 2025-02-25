import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message:"Something is missing, please check!",
                success:false,                
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"Try diffrent email",
                success:false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username, email, password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created successfully.",
            success:true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(401).json({
                message:"Something is missing, please check!",
                success:false,
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Incorrest email or password",
                success:false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message:"Incorrect password",
                success:false,
            });
        };
        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY,{expiresIn:'1d'});
        //
        const populatedPosts = await Promise.all(user.posts.map(async (postId) => {
            const post = await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        }))
        
        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts,
        }
    
        return res.cookie('token', token, {httpOnly:true, sameSite:'strict', maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
        });
    }
    catch(error){
        console.log(error);       
    }
};
export const logout = async (_,res) => {
    try{
        return res.cookie("token", "", {maxAge:0}).json({ //server sets the token cookie with maxAge: 0, effectively deleting it.
            message:'Logged out successfully.',
            success:true
        });
    }catch(error){
        console.log(error);       
    }
};
export const getProfile = async(req,res) => {
    try{
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success:true,
        });
    }catch(error){
        console.log(error);       
    }   
};

export const editProfile = async (req, res) => {
    try{
        const userId =  req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file; //req.file.path;
        let cloudResponse;
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false,            
            });        
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message:"Profile updated successfully.",
            success:true,
            user
        });

    }catch(error){
        console.log(error);        
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status().json({
                message:"User not found",
            });
        };
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        });
    }catch(error){
        console.log(error); 
    }
};
export const followOrUnfollowUser = async (req, res) => {
    try{
        const followersId = req.id; // logged in user or my id
        const followingId = req.params.id; // user id to follow or unfollow

        if(followersId === followingId){
            return res.status(400).json({
                message:"You cannot follow yourself",
                success:false
            });
        }

        const user = await User.findById(followersId);
        const followingUser = await User.findById(followingId);
        //check if the user is already following the user
        const isFollowing = user.following.includes(followingId);
        if(isFollowing){
            // unfollow the user
            await Promise.all([
                User.updateOne({ _id: followersId}, {$pull:{following: followingId } }),
                User.updateOne({ _id: followingId}, {$pull:{followers: followersId } }),
            ])
            return res.status(200).json({message:"Unfollowed successfully", success:true});
        }else{
            // follow the user
            await Promise.all([
                User.updateOne({ _id: followersId}, {$push:{following: followingId } }),
                User.updateOne({ _id: followingId}, {$push:{followers: followersId } }),
            ])
            return res.status(200).json({message:"Followed successfully", success:true});           
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error occurred.",
            success: false
        });
    }
}