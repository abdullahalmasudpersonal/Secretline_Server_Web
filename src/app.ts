import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorhandler';

const app: Application = express();

const corsOptions = {
  origin: [
    'https://secretline.vercel.app',
    'http://localhost:4200',
    'http://localhost:49452',
    'http://localhost:5173',
  ],
  credentials: true,
};

/// parsers
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Secretline Server In Progress!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
