"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var dbconnect_1 = __importDefault(require("./dbconnect"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var PORT = process.env.PORT || 6969;
(0, dbconnect_1.default)()
    .then(function () {
    app_1.default.listen(PORT, function () {
        console.log("The app is running in the port ".concat(PORT));
    });
})
    .catch(function (error) {
    console.log("Connection error: ", error.message);
});
