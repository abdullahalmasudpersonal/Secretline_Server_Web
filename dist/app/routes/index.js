"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const chat_route_1 = require("../modules/chat/chat.route");
const message_route_1 = require("../modules/message/message.route");
const contact_route_1 = require("../modules/contact/contact.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoute,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoute,
    },
    {
        path: '/chat',
        route: chat_route_1.ChatRoute,
    },
    {
        path: '/message',
        route: message_route_1.MessageRoute,
    },
    {
        path: '/contact',
        route: contact_route_1.ContactRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
