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
const createNotification = async ({ text, creator, sessions, userId, }) => {
    const time = new Date().getTime();
    let studentsfor = [];
    // getting students id from the session object.
    if (!userId && sessions) {
        const sessionObject = sessions.map((session) => {
            return {
                session: session,
            };
        });
        let forStudents = await student_model_1.default.aggregate([
            {
                $match: {
                    $or: sessionObject,
                },
            },
            { $group: { _id: null, ids: { $push: "$$ROOT._id" } } },
        ]);
        studentsfor = forStudents[0].ids;
    }
    else if (!sessions && userId) {
        studentsfor = [userId];
    }
    else {
        throw new ApiError_util_1.default(400, "The  notification has no visitor assigned. please set either the batch of the students or the user id of the particuler student.");
    }
    const createdNotification = await notification_model_1.default.create({
        setter: userId,
        title: text,
        studentsFor: [userId],
        time,
    });
    return createdNotification;
};
exports.createNotification = createNotification;
// get notifications (pagination requires )
const getNotifications = async (req, res) => {
    // assuming the data is taking by the user
    const { _id } = req.user;
    const foundNotifications = await notification_model_1.default.find({
        studentsFor: _id,
    });
    let notifications = [];
    // will return the last 10 notifications. O(n) complexity: n <= 10
    for (let not of foundNotifications.sort((a, b) => b.time - a.time)) {
        if (notifications.length <= 10) {
            if (not.views.includes(_id)) {
                notifications.push({
                    title: not.title,
                    time: not.time,
                    isSeen: true,
                    _id: not._id,
                });
            }
            else {
                notifications.push({
                    title: not.title,
                    time: not.time,
                    isSeen: false,
                    _id: not._id,
                });
            }
        }
    }
    res
        .status(200)
        .json(new ApiResponse_util_1.default(200, { notifications: notifications }, "Got the notifications"));
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
