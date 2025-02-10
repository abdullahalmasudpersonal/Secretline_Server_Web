import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';
import { User } from './app/modules/user/user.model';

let server: Server;
let io: SocketIOServer;

async function secretlineServer() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    server = new Server(app);

    io = new SocketIOServer(server, {
      cors: {
        origin: ['https://secretline.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
      // pingTimeout: 60000,
      transports: ['websocket'],
    });

    const users: { [key: string]: string } = {};

    io.on('connection', (socket) => {
      socket.on('userOnline', async (userId) => {
        users[userId] = socket.id;
        await User.findOneAndUpdate({ userId: userId }, { isOnline: true });
        io.emit('userOnlineStatus', { userId, isOnline: true });
      });
      console.log('A user connected:', socket.id);

      socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
      });

      // কলার থেকে কলের সিগনাল পেলে রিসিভারকে পাঠান
      socket.on('callUser', (data: { userToCall: string; signalData: any; from: string }) => {
        const receiverSocketId = users[data.userToCall];
        console.log(data?.userToCall, 'data');
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callUser', {
            signal: data.signalData,
            from: data.from,
          });
        }
      });

      // রিসিভার থেকে কল একসেপ্ট করার সিগনাল পেলে কলারকে পাঠান
      socket.on('acceptCall', (data: { signal: any; to: string }) => {
        console.log(data, 'acceptcall data');
        const receiverSocketId = users[data.to];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callAccepted', data.signal);
        }
      });

      socket.on('offer', async ({ target, offer }) => {
        const receiverSocketId = users[target];
        console.log(target, 'target');
        console.log(receiverSocketId, 'receiverSocketId');
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('offer', {
            sender: socket.id,
            userId: Object.keys(users).find((key) => users[key] === socket.id),
            offer,
          });
        } else {
          console.log('User not found or offline.');
        }
      });

      // Receiver sends an answer
      socket.on('answer', ({ target, answer }) => {
        const targetSocketId = target;
        console.log(users, 'users');
        console.log(targetSocketId, 'target');
        console.log(answer, 'answer');
        if (targetSocketId) {
          io.to(targetSocketId).emit('answer', { sender: socket.id, answer });
        }
      });

      // ICE Candidate ইভেন্ট
      socket.on('ice-candidate', ({ target, candidate }) => {
        const targetSocketId = target;
        if (targetSocketId) {
          io.to(targetSocketId).emit('ice-candidate', {
            sender: socket.id,
            candidate,
          });
        }
      });

      socket.on('userOffline', async (userId) => {
        await User.findOneAndUpdate({ userId: userId }, { isOnline: false });
      });
      socket.on('disconnect', async () => {
        for (let userId in users) {
          if (users[userId] === socket.id) {
            await User.findOneAndUpdate(
              { userId: userId },
              { isOnline: false },
            );
            delete users[userId];
            console.log('User disconnected:', userId);
            break;
          }
        }
        console.log('A user disconnected:', socket.id);
      });
    });

    server.listen(config.port, () => {
      console.log(`Secretline Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

secretlineServer();
