import mongoose, { ObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.util";
import Student from "../models/student.model";
import Notification from "../models/notification.model";
import { NotificationType, StudentType, UserRequest } from "../types";
import { Response } from "express";
import ApiResponse from "../utils/ApiResponse.util";
import ApiError from "../utils/ApiError.util";

export interface NotificationCreateType {
  text: string;
  creator: ObjectId;
  sessions?: ("2020" | "2021")[];
  userId?: mongoose.Schema.Types.ObjectId;
}

export const createNotification = async ({
  text,

  sessions,
  userId,
}: NotificationCreateType) => {
  const time: number = new Date().getTime();

  let usersFor = [];
  // getting students id from the session object.
  if (!userId && sessions) {
    let forStudents = await Student.find({
      session: sessions,
    });
    for(let student of forStudents) {
      usersFor.push(student.userId)
    }
  
  } else if (!sessions && userId) {
    usersFor = [userId];
  } else {
    throw new ApiError(
      400,
      "The  notification has no visitor assigned. please set either the batch of the students or the user id of the particuler user.",
    );
  }
  const createdNotification = await Notification.create({
    setter: userId,
    title: text,
    usersFor: usersFor,
    time,
  });

  console.log(createdNotification)
  return createdNotification;
};

// get notifications (pagination requires )

export const getNotifications = async (req: UserRequest, res: Response) => {
  // the user will get their notification based on their id.
  const notifications = await Notification.find({
    usersFor: req.user._id,
  });
  res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications: notifications.sort(
          (first, second) => second.time - first.time,
        ),
      },
      "Got all the notifications of the users.",
    ),
  );
};

// watch notification
export const seeNotifications = async (req: UserRequest, res: Response) => {
  const { _id } = req.user;
  const notifications: string[] = req.body.seenNotifications; // will return an array of _ids
  for (let notification of notifications) {
    await Notification.findByIdAndUpdate(notification, {
      $push: {
        views: _id,
      },
    });
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        success: true,
      },
      "Successfully seen the notification",
    ),
  );
};
