import { connect } from "mongoose";

const dbConnect = async () => {
  try {
    await connect(
      `mongodb+srv://admin:${process.env.MONGODB_USER_PASSWORD}@maincluster.xiufldo.mongodb.net/?retryWrites=true&w=majority`,
    );

    console.log("MongoDB connected");
  } catch (error: any) {
    console.log("Mongoose connection Error:", error.message);
  }
};

export default dbConnect;
