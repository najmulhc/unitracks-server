"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dbconnect_1 = __importDefault(require("./dbconnect"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env")
});
const PORT = process.env.PORT || 6969;
(0, dbconnect_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`The app is running in the port ${PORT}`);
    });
})
    .catch((error) => {
    console.log("Connection error: ", error.message);
});
