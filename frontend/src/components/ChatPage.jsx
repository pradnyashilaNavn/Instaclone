import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from '@/redux/authSlice';
import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import Messages from './Messages';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser} = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector(store => store.chat);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if(res.data.success){
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
  return () => {
  dispatch(setSelectedUser(null));
  }
  },[]);


  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      <section className='w-full md:w-1/4 my-8'>
      <h1 className='font-bold mb-4 px-3  text-xl'>{user?.username}</h1>
      <hr className='mb-4 border-gray-300'/>
      <div className='overflow-y-auto h-[80vh]'>
        {
          suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);

            return (
              <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer'>
                <Avatar>
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{suggestedUser?.username}</span>
                  <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'onlline' : 'offline'}</span>
                </div>
              </div>
            )
          })
        }
      </div>
      </section>
      {
      selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col min-h-screen">
          {/* Chat Header */}
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10 shadow-md">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{selectedUser?.username}</span>
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <div className="flex items-center p-4 border-t border-gray-300 bg-white sticky bottom-0">
            <Input 
              value={textMessage} 
              onChange={(e) => setTextMessage(e.target.value)} 
              type="text" 
              className="flex-1 mr-2 focus-visible:ring-transparent" 
              placeholder="Type a message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <MessageCircleCode className="w-32 h-32 my-4 text-gray-400" />
          <h1 className="font-medium text-lg">Your Messages</h1>
          <span className="text-gray-500">Send a message to start a chat.</span>
        </div>
      )}

    </div>
  )
}

export default ChatPage
