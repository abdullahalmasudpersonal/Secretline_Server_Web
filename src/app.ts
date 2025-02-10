import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import path from 'path';
import fs from 'fs'
const app: Application = express();

const corsOptions = {
  origin: [
    'https://secretline.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
};

/// parsers
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/v1', router);

// app.get('/', (req: Request, res: Response) => {
//   res.send('Secretline Server In Progress!');
//   const filePath = path.join(__dirname, './assets', 'PasswordGeneratorSetup.exe'); // ফাইলের লোকেশন দিন
//   res.download(filePath, 'PasswordGeneratorSetup.exe', (err) => {
//     if (err) {
//       console.error('File download error:', err);
//       res.status(500).send('File download failed!');
//     }
//   });
//   // res.send('Secretline Server In Progress!');
// });

app.get('/', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, './assets', 'PasswordGeneratorSetup.exe'); // ফাইলের লোকেশন

  // চেক করা হচ্ছে ফাইল আছে কিনা
  if (fs.existsSync(filePath)) {
    res.download(filePath, "PasswordGeneratorSetup.exe", (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send("File download failed!");
      }
    });
  } else {
    res.status(404).send("File not found!");
  }

  // res.send(`
  //   <html>
  //     <head>
  //       <title>Secretline Server</title>
  //     </head>
  //     <body>
  //       <script>
  //         var link = document.createElement("a");
  //         link.href = "${filePath}";
  //         link.download = "PasswordGeneratorSetup.exe"; // ফাইল ডাউনলোড হবে
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       </script>
  //     </body>
  //   </html>
  // `);
});

// Static ফোল্ডার সেট করুন, যাতে ফাইল ডাইরেক্ট অ্যাক্সেস করা যায়
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
