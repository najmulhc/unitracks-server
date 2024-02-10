"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeNotifications = exports.getNotifications = exports.createNotification = void 0;
const student_model_1 = __importDefault(require("../models/student.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const createNotification = async ({ text, sessions, userId, }) => {
    const time = new Date().getTime();
    let usersFor = [];
    // getting students id from the session object.
    if (!userId && sessions) {
        let forStudents = await student_model_1.default.find({
            session: sessions,
        });
        for (let student of forStudents) {
            usersFor.push(student.userId);
        }
    }
    else if (!sessions && userId) {
        usersFor = [userId];
    }
    else {
        throw new ApiError_util_1.default(400, "The  notification has no visitor assigned. please set either the batch of the students or the user id of the particuler user.");
    }
    const createdNotification = await notification_model_1.default.create({
        setter: userId,
        title: text,
        usersFor: usersFor,
        time,
    });
    console.log(createdNotification);
    return createdNotification;
};
exports.createNotification = createNotification;
// get notifications (pagination requires )
const getNotifications = async (req, res) => {
    // the user will get their notification based on their id.
    const notifications = await notification_model_1.default.find({
        usersFor: req.user._id,
    });
    res.status(200).json(new ApiResponse_util_1.default(200, {
        notifications: notifications.sort((first, second) => second.time - first.time),
    }, "Got all the notifications of the users."));
};
exports.getNotifications = getNotifications;
// watch notification
const seeNotifications = async (req, res) => {
    const { _id } = req.user;
    const notifications = req.body.seenNotifications; // will return an array of _ids
    for (let notification of notifications) {
        await notification_model_1.default.findByIdAndUpdate(notification, {
            $push: {
                views: _id,
            },
        });
    }
    res.status(200).json(new ApiResponse_util_1.default(200, {
        success: true,
    }, "Successfully seen the notification"));
};
exports.seeNotifications = seeNotifications;
