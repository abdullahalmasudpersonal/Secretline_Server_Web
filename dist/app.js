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
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Secretline Server In Progress!');
});
app.use(globalErrorhandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
