import mongoose, { Schema } from "mongoose";
import { NotificationType } from "../types";

const notificationSchema = new Schema<NotificationType>({
  title: {
    type: String,
    required: [true, "We need the title of the notification"],
    minlength: 15, 
    maxlength: 50
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  studentsFor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  time: {
    type: Number, // date getTime number
    required: true,
  },
});

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
