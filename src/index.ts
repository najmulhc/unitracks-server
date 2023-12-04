import app from "./app";
import dbConnect from "./dbconnect";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 6969;

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The app is running in the port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connection error: ", error.message);
  });
