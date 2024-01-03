import mongoose, { ObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.util";
import Student from "../models/student.model";
import Notification from "../models/notification.model";
import { NotificationType, StudentType, UserRequest } from "../types";
import { Response } from "express";
import ApiResponse from "../utils/ApiResponse.util";

export interface NotificationCreateType {
  text: string;
  creator: ObjectId;
  sessions: ("2020" | "2019")[];
}

export const createNotification = async ({
  text,
  creator,
  sessions,
}: NotificationCreateType) => {
  const time: number = new Date().getTime();
  const sessionObject: any[] = sessions.map((session) => {
    return {
      session: session,
    };
  });

  // getting students id from the session object.
  let studentsfor = await Student.aggregate([
    {
      $match: {
        $or: sessionObject,
      },
    },
    { $group: { _id: null, ids: { $push: "$$ROOT._id" } } },
  ]);

  const createdNotification = await Notification.create({
    setter: creator,
    title: text,
    studentsFor: studentsfor[0].ids,
    time,
  });

  return createdNotification;
};

// get notifications (pagination requires )

export const getNotifications = async (req: UserRequest, res: Response) => {
  // assuming the data is taking by the student
  const { _id } = req.student as StudentType;
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
  const { _id } = req.student as StudentType;
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
