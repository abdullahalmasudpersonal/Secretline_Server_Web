"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
let server;
let io;
function secretlineServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.databaseUrl);
            server = new http_1.Server(app_1.default);
            io = new socket_io_1.Server(server, {
                cors: {
                    origin: ['https://secretline.vercel.app', 'http://localhost:5173'],
                    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
                    credentials: true,
                },
                // pingTimeout: 60000,
                transports: ['websocket'],
            });
            const users = {};
            io.on('connection', (socket) => {
                socket.on('userOnline', (userId) => {
                    users[userId] = socket.id;
                });
                console.log('A user connected:', socket.id);
                socket.on('sendMessage', (message) => {
                    io.emit('receiveMessage', message);
                });
                socket.on('offer', ({ target, offer }) => {
                    const receiverSocketId = users[target];
                    console.log(target, 'target');
                    console.log(receiverSocketId, 'receiverSocketId');
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit('offer', {
                            sender: socket.id,
                            userId: Object.keys(users).find((key) => users[key] === socket.id),
                            offer,
                        });
                    }
                    else {
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
                // // ICE candidates
                // socket.on('sendIceCandidate', ({ candidate, to }) => {
                //   socket.to(to).emit('receiveIceCandidate', { candidate });
                // });
                socket.on('disconnect', () => {
                    for (let userId in users) {
                        if (users[userId] === socket.id) {
                            delete users[userId];
                            console.log('User disconnected:', userId);
                            break;
                        }
                    }
                    console.log('A user disconnected:', socket.id);
                });
            });
            server.listen(config_1.default.port, () => {
                console.log(`Secretline Server listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
secretlineServer();
