"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/middleware/globalErrorhandler"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        'https://secretline.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
};
/// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use('/api/v1', routes_1.default);
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
app.get('/', (req, res) => {
    const filePath = path_1.default.join(__dirname, './assets', 'PasswordGeneratorSetup.exe'); // ফাইলের লোকেশন
    // চেক করা হচ্ছে ফাইল আছে কিনা
    if (fs_1.default.existsSync(filePath)) {
        res.download(filePath, "PasswordGeneratorSetup.exe", (err) => {
            if (err) {
                console.error("File download error:", err);
                res.status(500).send("File download failed!");
            }
        });
    }
    else {
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
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'assets')));
app.use(globalErrorhandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
