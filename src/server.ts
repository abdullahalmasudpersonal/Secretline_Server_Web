import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

let server: Server;

async function secretlineServer() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    server = new Server(app);

    server.listen(config.port, () => {
      console.log(`Secretline Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

secretlineServer();
