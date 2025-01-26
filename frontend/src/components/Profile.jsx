import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile } = useSelector(store => store.auth);
  const isLoggedInUserProfile = true;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;
  return (
    <div className='flex max-w-5xl justify-center mx-auto p-4'>
      <div className='flex flex-col gap-20 w-full'>
        {/* Profile Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-4'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          {/* Profile Details */}
          <section>
            <div className='flex flex-col gap-5'>
              {/* Username and Actions */}
              <div className='flex items-center flex-wrap gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='h-8'>Unfollow</Button>
                        <Button variant='secondary' className='h-8'>Message</Button>
                      </>
                    ) : (
                      <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                    )
                  )
                }
              </div>
              {/* Stats */}
              <div className='flex items-center gap-6'>
                <p><span className='font-semibold'>{userProfile?.posts.length || 0} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length || 0} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length || 0} </span>following</p>

              </div>
              {/* Bio */}
              <div className='flex flex-col gap-1'>
                <span>{userProfile?.bio || "Bio here..."}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign /> <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
                <span>👨‍🎓✍ Learn code with Pradnya MERN stack style 👩‍🎓</span>
                <span>🤝 DM for collaboration 🙌</span>                
              </div>
            </div>
          </section>
        </div>
        {/* Tabs Section */}
        <div className='border-t border-t-gray-200'>
           {/* Tabs */}
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`}onClick={() =>  handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`}onClick={() =>  handleTabChange('saved')}>SAVED</span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>

          </div>

          {/* Displayed Posts */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
            {
              displayedPost?.length ? (
                displayedPost.map((post) => (
                  <div key={post?._id} className='relative group'>
                    <img src={post.image} alt="post" className='w-full aspect-square object-cover'/>
                    <div className='absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm sm:text-base font-medium'>
                      <div className='flex items-start text-white space-x-4'>
                        <button className='flex items-center gap-2 p-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 p-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div> 
                ))
              ) : (
                <p className='text-center text-gray-500'>No posts available</p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
