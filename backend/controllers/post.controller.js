import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) return res.status(400).json({message:'Image required'});
        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'}).toFormat('jpeg', {quality:80}).toBuffer();

        const fileUri = `data:image/jpeg;base64, ${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
           caption,
           image:cloudResponse.secure_url,
           author:authorId 
        });
        // update user posts
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        // populate post with author details
        await post.populate({path:'author', select:'-password'});

        return res.status(201).json({
            message:"Post created successfully.",
            success:true,
            post
        });

    }catch(error){
       console.log(error);        
    }
}
export const getAllPosts = async (req, res) => {
    try{
        const post = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username, profilePicture'})
        .populate({path:'comments', sort:({createdAt:-1}), populate:{path:'author', select:'username, profilePicture'}});
        return res.status(200).json({
            message:"All posts",
            success:true,
            post
        });
    }catch(error){
       console.log(error);        
    }
};
export const getUserPosts = async (req, res) => {
    try{
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username, profilePicture'
        }).populate({
            path:'comments',
            sort:({createdAt:-1}),
            populate:{
                path:'author',
                select:'username, profilePicture'
            }
        });
        return res.status(200).json({
            message:"User posts",
            success:true,
            posts
        });
    }catch(error){
        console.log(error);
    }
}   
export const likePost = async (req, res) => {
    try{
        const authorId = req.id; //who is liking the post
        const postId = req.params.id; //post to like
        const post = await Post.findById(postId);  
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        await post.updateOne({ $addToSet: {likes:authorId}});
        await post.save();


        return res.status(200).json({message:'Post liked', success:true, post});

    }catch(error){
        console.log(error);        
    }

}
export const disLikePost = async (req, res) => {
    try{
        const authorId = req.id; //who is liking the post
        const postId = req.params.id; //post to like
        const post = await Post.findById(postId);  
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        await post.updateOne({ $pull: {likes:authorId}});
        await post.save();

        return res.status(200).json({message:'Post disliked', success:true, post});

    }catch(error){
        console.log(error);
        
    }
}
export const addComment = async (req, res) => {
    try{
        const authorId = req.id;
        const postId = req.params.id;
        const {content} = req.body;//comment content
        const post = await Post.findById(postId);
        if(!content) return res.status(400).json({message:'Comment content required', success:false});
        const comment = await Comment.create({
            content,
            author:authorId,
            post:postId
        }).populate({
            path:'author',
            select:'username, profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({message:'Comment added', success:true, comment});

    }catch(error){
        console.log(error);
    }
}
// get commments of a post
export const getCommentsOfPost = async (req, res) => {
    try{
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author', 'username, profilePicture');
        if(!comments) return res.status(404).json({message:'No comments found', success:false});
        return res.status(200).json({message:'Comments', success:true, comments});
    }catch(error){
        console.log(error);
    }
}
export const deletePost = async (req, res) => {
    try{
        const postId = req.params.id;
        const authorId = req.id; 
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        // check if the post belongs to the user
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized', success:false});
        // delete post
        await Post.findByIdAndDelete(postId);
        // delete post from user posts
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete comments of the post
        await Comment.deleteMany({post:postId});
        return res.status(200).json({message:'Post deleted', success:true});

    }catch(error){
        console.log(error);
    }
}
export const bookmarkPost = async (req, res) => {
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        // check if the post is already bookmarked
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            //already bookmarked -> remove bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({message:'Post removed from bookmarks', success:true});
        }else{
            //bookmark the post
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({message:'Post bookmarked', success:true});
        }

    }catch(error){
        console.log(error);
    }

}

