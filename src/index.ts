import app from "./app";
import dbConnect from "./dbconnect";
// import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";
dotenv.config();


 
const PORT = process.env.PORT || 6969;
// app.use(cookieParser("shhh......."));

 
dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`The app is running in the port ${PORT}`);
  });
});
