"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dbConnect = async () => {
    try {
        const { connections } = await (0, mongoose_1.connect)(`mongodb+srv://admin:${process.env.MONGODB_USER_PASSWORD}@maincluster.xiufldo.mongodb.net/?retryWrites=true&w=majority`);
        console.log(connections);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Mongoose connection Error:", error.message);
    }
};
exports.default = dbConnect;
