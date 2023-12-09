import mongoose, { Schema } from "mongoose";
import { NotificationType } from "../types";

const notificationSchema = new Schema<NotificationType>({
  title: {
    type: String,
    required: [true, "We need the title of the notification"],
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  for: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
