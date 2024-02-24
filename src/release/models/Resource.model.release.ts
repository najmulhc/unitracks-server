import mongoose from "mongoose";

interface ResourceType {
    name: string, 
    type: "textbook" | "slide" | "note" | "other", 
    href: string, 
    course: mongoose.Types.ObjectId,
}

const ResourceReleaseSchema = new mongoose.Schema<ResourceType>({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["textbook", "slide", "note", "other"],
    },
    href: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseRelease",
        required: true,
    },
});

export default mongoose.model("ResourceRelease", ResourceReleaseSchema);
