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
  creator,
  sessions,
  userId,
}: NotificationCreateType) => {
  const time: number = new Date().getTime();

  let studentsfor = [];
  // getting students id from the session object.
  if (!userId && sessions) {
    const sessionObject: any[] = sessions.map((session) => {
      return {
        session: session,
      };
    });
    let forStudents = await Student.aggregate([
      {
        $match: {
          $or: sessionObject,
        },
      },
      { $group: { _id: null, ids: { $push: "$$ROOT._id" } } },
    ]);

    studentsfor = forStudents[0].ids;
  } else if (!sessions && userId) {
    studentsfor = [userId];
  } else {
    throw new ApiError(
      400,
      "The  notification has no visitor assigned. please set either the batch of the students or the user id of the particuler student.",
    );
  }
  const createdNotification = await Notification.create({
    setter: userId,
    title: text,
    studentsFor: [userId],
    time,
  });

  return createdNotification;
};

// get notifications (pagination requires )

export const getNotifications = async (req: UserRequest, res: Response) => {
  // assuming the data is taking by the user
  const { _id } = req.user;
  const foundNotifications: NotificationType[] = await Notification.find({
    studentsFor: _id,
  });

  let notifications: any[] = [];

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
      } else {
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
    .json(
      new ApiResponse(
        200,
        { notifications: notifications },
        "Got the notifications",
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
