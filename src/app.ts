import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';

const app: Application = express();

const corsOptions = {
  origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
  // methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
};

/// parsers
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Secretline Server In Progress!');
});

// not found
app.use(notFound);

export default app;
