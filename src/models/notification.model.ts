import mongoose, { Schema } from "mongoose";
import { NotificationType } from "../types";

const notificationSchema = new Schema<NotificationType>({
  title: {
    type: String,
    required: [true, "We need the title of the notification"],
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  for: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
});

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
