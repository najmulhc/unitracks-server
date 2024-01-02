import mongoose, { ObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.util";
import Student from "../models/student.model";
import Notification from "../models/notification.model";

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
  /*
    we will make a new notification here, the notification creator will take information such as the text (15 to 50 characters ), id of creator, session of students(in an array). we need to create a notification.
    */

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

  return  createdNotification;
};
