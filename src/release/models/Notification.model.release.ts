import mongoose from "mongoose";

interface NotificationType {
  text: string;
  setter: mongoose.Types.ObjectId;
  time: number; // unix time of the setting notifications
  course: mongoose.Types.ObjectId;
  seenBy: mongoose.Types.ObjectId[];
}

const NotificationReleaseSchema = new mongoose.Schema<NotificationType>({
  text: {
    type: String,
    required: true,
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentRelease",
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseRelease",
    required: true,
  },
  seenBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "StudentRelease",
    default: [],
  },
});

export default mongoose.model("NotificationRelease", NotificationReleaseSchema);
