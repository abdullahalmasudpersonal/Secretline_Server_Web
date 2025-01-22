import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server as SocketIOServer } from 'socket.io';

let server: Server;
let io: SocketIOServer;

async function secretlineServer() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    server = new Server(app);

    io = new SocketIOServer(server, {
      cors: {
        origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
      pingTimeout: 60000,
      transports: ['websocket'],
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // চ্যাট মেসেজ গ্রহণ এবং ব্রডকাস্ট
      socket.on('sendMessage', (message) => {
        console.log(message, 'sendMessage');
        io.emit('receiveMessage', message); // সকল ক্লায়েন্টকে মেসেজ পাঠানো
      });

      socket.on('disconnect', () => {
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
