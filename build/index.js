"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var user_route_1 = __importDefault(require("./routes/user.route"));
var dotenv_1 = __importDefault(require("dotenv"));
var app = (0, express_1.default)();
var PORT = process.env.PORT || 6969;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)("shhh......."));
dotenv_1.default.config();
app.use("/user", user_route_1.default);
app.listen(PORT, function () {
    console.log("The app is running in the port ".concat(PORT));
});
