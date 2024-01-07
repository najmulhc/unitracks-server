import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  
});

const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default Admin;
