import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://locahost:5173',
        methods:['GET', 'POST']
    }
})

const userSocketMap = {}; // this will store the socket id of the user

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);   
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // (eventcall eventname - getOnlineUser - Broadcast online users) this will send the list of online users to all the clients
    socket.on('disconnect', ()=>{
        if(userId){
            console.log(`User disconnected: UserId = ${userId}, SocketId = ${socket.id}`);   
            delete userSocketMap[userId];         
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Update online users
    });
})
export {app, server, io};